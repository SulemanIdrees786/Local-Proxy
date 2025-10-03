/*
proxy-helper.js
Helper utilities for advanced-stealth-proxy.js

Install notes:
  - Place this file next to your advanced-stealth-proxy.js and require it:
      const helper = require('./proxy-helper');

This module provides:
  - basic auth checking for proxy clients (supports Proxy-Authorization and Authorization)
  - TLS server option loader (reads cert/key, with helpful errors)
  - safe upstream request wrapper: sets timeouts, attaches agents, error handling
  - header sanitizers and small utilities (random IP, UA pool sample getter)
  - a small config object for toggling verbose logging and timeouts

The content here is intentionally conservative and focuses on security/stability.
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

// Default config you can override where you import this helper
const DEFAULT_CONFIG = {
  username: process.env.PROXY_USER || 'proxyuser',
  password: process.env.PROXY_PASS || 'proxypass',
  timeoutMs: 15000,                // upstream request timeout
  socketTimeoutMs: 30000,          // socket idle timeout
  maxSockets: 100,
  verboseLogging: false,           // set true to see more logs
  requireAuth: true,               // set false to disable auth (not recommended)
};

// Create keep-alive agents once and re-use
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: DEFAULT_CONFIG.maxSockets });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: DEFAULT_CONFIG.maxSockets });

function setConfig(overrides = {}) {
  Object.assign(DEFAULT_CONFIG, overrides);
  // update agents if maxSockets changed
  if (overrides.maxSockets) {
    httpAgent.maxSockets = DEFAULT_CONFIG.maxSockets;
    httpsAgent.maxSockets = DEFAULT_CONFIG.maxSockets;
  }
}

// Basic auth checker for Proxy-Authorization or Authorization header
// Returns { ok: boolean, user?: string, reason?: string }
function checkBasicAuth(req) {
  if (!DEFAULT_CONFIG.requireAuth) return { ok: true };

  const header = req.headers['proxy-authorization'] || req.headers['proxy-Authorization'] || req.headers['authorization'] || req.headers['Authorization'];
  if (!header) return { ok: false, reason: 'no auth header' };
  const parts = String(header).split(' ');
  if (parts.length !== 2 || !/^Basic$/i.test(parts[0])) return { ok: false, reason: 'invalid auth header' };
  let creds;
  try {
    creds = Buffer.from(parts[1], 'base64').toString('utf8');
  } catch (e) {
    return { ok: false, reason: 'malformed base64' };
  }
  const [user, pass] = creds.split(':');
  if (!user || !pass) return { ok: false, reason: 'invalid credentials format' };
  if (user === DEFAULT_CONFIG.username && pass === DEFAULT_CONFIG.password) {
    return { ok: true, user };
  }
  return { ok: false, reason: 'invalid credentials' };
}

// Load TLS options (cert + key) and optional ca bundle. Throws with helpful messages.
function loadTlsOptions({ keyPath, certPath, caPath } = {}) {
  if (!keyPath || !certPath) {
    throw new Error('TLS keyPath and certPath are required to create an HTTPS server');
  }
  const opts = {};
  try {
    opts.key = fs.readFileSync(path.resolve(keyPath));
  } catch (e) {
    throw new Error(`Failed to read TLS key at ${keyPath}: ${e.message}`);
  }
  try {
    opts.cert = fs.readFileSync(path.resolve(certPath));
  } catch (e) {
    throw new Error(`Failed to read TLS cert at ${certPath}: ${e.message}`);
  }
  if (caPath) {
    try { opts.ca = fs.readFileSync(path.resolve(caPath)); } catch (e) { throw new Error(`Failed to read TLS CA at ${caPath}: ${e.message}`); }
  }
  // Recommend secure defaults
  opts.honorCipherOrder = true;
  opts.rejectUnauthorized = false; // if you want to validate client certs set true and provide CA
  return opts;
}

// Sanitize hop-by-hop headers (request side)
function sanitizeRequestHeaders(headers = {}) {
  const out = { ...headers };
  const hopByHop = ['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers','transfer-encoding','upgrade','proxy-connection'];
  hopByHop.forEach(h => { delete out[h]; delete out[h.toLowerCase()]; delete out[h.toUpperCase()]; });
  // Ensure we have accept-encoding for compression
  if (!out['accept-encoding'] && !out['Accept-Encoding']) out['accept-encoding'] = 'gzip, deflate, br';
  return out;
}

// Remove dangerous response hop-by-hop headers
function sanitizeResponseHeaders(headers = {}) {
  const sanitized = { ...headers };
  const hopByHop = ['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers','transfer-encoding','upgrade'];
  hopByHop.forEach(h => delete sanitized[h]);
  return sanitized;
}

// Small helper to get a sample UA. Keep it small to avoid huge pools here.
function sampleUserAgent() {
  const pool = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/16.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

// Random local-ish IP for X-Forwarded-For style header (not real anonymity)
function randomPrivateIPv4() {
  // Choose from common private ranges
  const ranges = [
    [10, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1],
    [192,168, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1],
    [172, 16 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1],
  ];
  const pick = ranges[Math.floor(Math.random() * ranges.length)];
  return pick.join('.');
}

// Create and perform an upstream request safely and attach to the given client response
// This helper returns the upstream request instance and ensures timeouts and error handling.
function performUpstreamRequest({ isTls=false, host, port, path, method='GET', headers={}, clientRes=null, clientReq=null, timeoutMs=DEFAULT_CONFIG.timeoutMs }) {
  const lib = isTls ? https : http;
  const agent = isTls ? httpsAgent : httpAgent;

  const options = {
    hostname: host,
    port: port,
    path: path,
    method: method,
    headers,
    agent,
  };

  const upstream = lib.request(options, (upstreamRes) => {
    // sanitize headers and forward
    const outHeaders = sanitizeResponseHeaders(upstreamRes.headers);
    // add small proxy header if not leaking sensitive data
    if (!outHeaders['x-proxy-message']) outHeaders['x-proxy-message'] = 'proxy-helper';
    if (clientRes && !clientRes.headersSent) {
      try { clientRes.writeHead(upstreamRes.statusCode, outHeaders); } catch (e) { /* ignore */ }
    }
    upstreamRes.pipe(clientRes);
  });

  // Timeouts & socket handling
  upstream.setTimeout(timeoutMs, () => {
    if (DEFAULT_CONFIG.verboseLogging) console.warn('[proxy-helper] upstream timeout', host, path);
    upstream.destroy(new Error('Upstream timeout'));
  });

  upstream.on('error', (err) => {
    if (DEFAULT_CONFIG.verboseLogging) console.error('[proxy-helper] upstream error', err && err.message);
    if (clientRes && !clientRes.headersSent) {
      try { clientRes.writeHead(502, { 'Content-Type': 'text/plain' }); clientRes.end('Bad Gateway: ' + String(err && err.message)); } catch (e) {}
    }
  });

  // If the incoming client socket is closed, destroy upstream
  if (clientReq && clientReq.socket) {
    clientReq.socket.on('close', () => {
      upstream.destroy();
    });
  }

  return upstream;
}

// Helper to add safe headers before sending upstream
function buildUpstreamHeaders(clientHeaders = {}, hostname) {
  const headers = sanitizeRequestHeaders(clientHeaders);
  // For media/CDN we may want to preserve user agent — calling code can decide
  headers['user-agent'] = headers['user-agent'] || sampleUserAgent();
  // Use a randomized private IP for x-forwarded-for if not present
  if (!headers['x-forwarded-for']) headers['x-forwarded-for'] = randomPrivateIPv4();
  return headers;
}

// Small logging helper
function logRequestShort(reqLike, type='HTTP') {
  if (!DEFAULT_CONFIG.verboseLogging) return null;
  const id = crypto.randomBytes(4).toString('hex');
  console.log(`[proxy-helper] [${type}] ${id} ${reqLike.method || 'CONNECT'} ${reqLike.url || reqLike.path || '-'} Host:${reqLike.headers && (reqLike.headers.host || reqLike.headers.Host)}`);
  return id;
}

module.exports = {
  DEFAULT_CONFIG,
  setConfig,
  checkBasicAuth,
  loadTlsOptions,
  sanitizeRequestHeaders,
  sanitizeResponseHeaders,
  sampleUserAgent,
  randomPrivateIPv4,
  performUpstreamRequest,
  buildUpstreamHeaders,
  logRequestShort,
};


/*
Integration example (in your advanced-stealth-proxy.js):

const helper = require('./proxy-helper');
helper.setConfig({ username: 'you', password: 'secret', timeoutMs: 20000, verboseLogging: true });

// When handling an incoming req in createHttpServer
const auth = helper.checkBasicAuth(req);
if (!auth.ok) {
  res.writeHead(407, { 'Proxy-Authenticate': 'Basic realm="SecureProxy"' });
  return res.end('Proxy Authentication Required: ' + (auth.reason || '')); 
}

// Build headers and perform upstream request
const upstreamHeaders = helper.buildUpstreamHeaders(req.headers, targetHostname);
const upstream = helper.performUpstreamRequest({ isTls: isTls, host: targetHostname, port: targetPort, path: obfPath, method: req.method, headers: upstreamHeaders, clientRes: res, clientReq: req });
req.pipe(upstream);

// For HTTPS CONNECT handling keep the tunnel logic as you have but you may want to
// add auth check before opening the tunnel.

*/
