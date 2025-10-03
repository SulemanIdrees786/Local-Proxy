


// advanced-stealth-proxy.patched.js
// This is your original advanced-stealth-proxy.js with non-destructive additions:
// - integrates proxy-helper (as optional) without removing any original logic
// - adds basic-auth check (configurable) before handling requests and CONNECT
// - adds upstream request timeouts and socket idle timeouts
// - supports optional TLS server via env USE_TLS (load certs with PROXY_TLS_KEY/PROXY_TLS_CERT)
// All original code blocks are kept; new code is added and marked with comments starting with "// <<< ADD".

const fs = require('fs');
const http = require('http');
const https = require('https');
const net = require('net');
const crypto = require('crypto');
const url = require('url');
const Proxy = require('http-mitm-proxy'); // optional for MITM TLS

// <<< ADD: optionally load helper utilities if present
let helper = null;
try {
  helper = require('./Proxy-helper');
  // configure helper from env if available
  helper.setConfig({
    username: process.env.PROXY_USER || helper.DEFAULT_CONFIG.username,
    password: process.env.PROXY_PASS || helper.DEFAULT_CONFIG.password,
    timeoutMs: process.env.UPSTREAM_TIMEOUT ? parseInt(process.env.UPSTREAM_TIMEOUT, 10) : helper.DEFAULT_CONFIG.timeoutMs,
    socketTimeoutMs: process.env.SOCKET_TIMEOUT ? parseInt(process.env.SOCKET_TIMEOUT, 10) : helper.DEFAULT_CONFIG.socketTimeoutMs,
    maxSockets: process.env.MAX_SOCKETS ? parseInt(process.env.MAX_SOCKETS, 10) : helper.DEFAULT_CONFIG.maxSockets,
    verboseLogging: !!process.env.VERBOSE_LOG,
    requireAuth: process.env.REQUIRE_AUTH !== '0'
  });
  console.log('[proxy] proxy-helper loaded.');
} catch (e) {
  console.log('[proxy] proxy-helper not found or failed to load — running without helper enhancements.');
}
// <<< END ADD

class AdvancedStealthProxy {
  constructor() {
    this.port = 8080;
    this.host = '127.0.0.1';
    this.obfuscationEnabled = true;
    this.headerRotation = true;
    this.packetFragmentation = false;
    this.connectionPool = new Map();
    this.useMitm = false; // set true only if you want full MITM (and install CA)
    this.mitmProxy = this.useMitm ? Proxy() : null;

    // add keep-alive agents for performance (paste inside constructor)
this.httpAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });
this.httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 100 });

// optional list of hosts to bypass obfuscation (CDNs / streaming)
this._mediaBypassHosts = [
  /\.googlevideo\.com$/i,
  /\.youtube\.com$/i,
  /\.ytimg\.com$/i,
  /\.doubleclick\.net$/i,
  /\.akamaized\.net$/i
];

  }

  getRandomFunnyMessage() {
    const messages = [
      "Proxy says: I see what you did there",
      "Proxy says: Shh… nobody’s watching you",
      "Proxy says: One does not simply sniff this traffic",
      "Proxy says: Access granted… maybe",
      "Proxy says: Hello, human! I’m your friendly neighborhood proxy",
      "Proxy says: Rotating headers like a DJ",
      "Proxy says: Keep calm and browse on",
      "Proxy says: Did you really think I’d let them see this?"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

// Replace your existing getRandomUserAgent() with the following block
getRandomUserAgent() {
  // Deterministic components for building a pool of 100 UAs
  const windowsVersions = ['10.0', '10.0', '10.0', '6.1'];
  const macVersions = ['10_15_7', '11_6_8', '12_6_3', '13_4_1'];
  const linuxTokens = ['X11; Linux x86_64', 'X11; Ubuntu; Linux x86_64'];
  const androidDevices = [
    'Linux; Android 14; Pixel 8 Pro', 'Linux; Android 14; Pixel 8',
    'Linux; Android 13; SM-G991B', 'Linux; Android 12; SM-A536B',
    'Linux; Android 11; Redmi Note 10', 'Linux; Android 10; M2101K7AG'
  ];
  const iPhoneDevices = [
    'iPhone; CPU iPhone OS 17_0 like Mac OS X',
    'iPhone; CPU iPhone OS 16_4 like Mac OS X',
    'iPhone; CPU iPhone OS 15_7 like Mac OS X'
  ];

  const chromeVersions = ['120.0.0.0', '119.0.6045.0', '118.0.5993.0', '117.0.5938.62', '116.0.5845.96'];
  const firefoxVersions = ['121.0', '120.0', '119.0', '118.0'];
  const edgeVersions = ['120.0.0.0', '119.0.0.0', '118.0.0.0'];
  const safariVersions = ['605.1.15', '604.1', '604.5.6'];

  const pool = [];

  // 35 Chrome desktop variants (Windows/macOS/Linux)
  for (let i = 0; pool.length < 35; i++) {
    const os = (i % 3 === 0)
      ? `Windows NT ${windowsVersions[i % windowsVersions.length]}`
      : (i % 3 === 1)
        ? `Macintosh; Intel Mac OS X ${macVersions[i % macVersions.length]}`
        : linuxTokens[i % linuxTokens.length];
    const ver = chromeVersions[i % chromeVersions.length];
    pool.push(`Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver} Safari/537.36`);
  }

  // 20 Firefox desktop variants (Windows/macOS/Linux)
  for (let i = 0; pool.length < 55; i++) {
    const os = (i % 3 === 0)
      ? `Windows NT ${windowsVersions[i % windowsVersions.length]}`
      : (i % 3 === 1)
        ? `Macintosh; Intel Mac OS X ${macVersions[i % macVersions.length]}`
        : linuxTokens[i % linuxTokens.length];
    const ver = firefoxVersions[i % firefoxVersions.length];
    pool.push(`Mozilla/5.0 (${os}; rv:${ver}) Gecko/20100101 Firefox/${ver}`);
  }

  // 15 Edge desktop variants
  for (let i = 0; pool.length < 70; i++) {
    const os = `Windows NT ${windowsVersions[i % windowsVersions.length]}`;
    const ver = edgeVersions[i % edgeVersions.length];
    pool.push(`Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersions[i % chromeVersions.length]} Safari/537.36 Edg/${ver}`);
  }

  // 10 Safari (macOS) variants
  for (let i = 0; pool.length < 80; i++) {
    const mac = `Macintosh; Intel Mac OS X ${macVersions[i % macVersions.length]}`;
    const sv = safariVersions[i % safariVersions.length];
    pool.push(`Mozilla/5.0 (${mac}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${16 - (i % 4)}.0 Safari/${sv}`);
  }

  // 20 Mobile UAs (mix of Android and iPhone)
  // Android Chrome mobile
  for (let i = 0; pool.length < 95; i++) {
    const device = androidDevices[i % androidDevices.length];
    const ver = chromeVersions[i % chromeVersions.length];
    pool.push(`Mozilla/5.0 (${device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver} Mobile Safari/537.36`);
  }

  // iPhone Safari UAs to finish up to 100
  for (let i = 0; pool.length < 100; i++) {
    const device = iPhoneDevices[i % iPhoneDevices.length];
    const safariV = safariVersions[i % safariVersions.length];
    pool.push(`Mozilla/5.0 (${device}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${15 - (i % 3)}.0 Mobile/15E148 Safari/${safariV}`);
  }

  // pool is deterministic and will contain exactly 100 entries
  // Return a random one from the pool
  return pool[Math.floor(Math.random() * pool.length)];
}

// Helper: deterministic list of safe test sites (non-harmful)
getSafeTestSites() {
  // These are well-known, benign sites you can use for connectivity checks.
  return [
    'https://example.com',
    'https://example.org',
    'https://www.wikipedia.org',
    'https://www.mozilla.org',
    'https://developer.mozilla.org',
    'https://www.nodejs.org',
    'https://www.github.com',
    'https://stackoverflow.com',
    'https://duckduckgo.com',
    'https://www.google.com',
    'https://www.bing.com',
    'https://www.w3.org',
    'https://www.npmjs.com',
    'https://news.ycombinator.com',
    'https://medium.com',
    'https://www.reddit.com',
    'https://www.cnn.com',
    'https://www.bbc.com',
    'https://www.nytimes.com',
    'https://www.python.org'
  ];
}

// Helper: pick a random safe test URL
getRandomTestUrl() {
  const sites = this.getSafeTestSites();
  return sites[Math.floor(Math.random() * sites.length)];
}
 // inside AdvancedStealthProxy class
selfCheck(timeoutMs = 8000) {
  const testUrl = this.getRandomTestUrl();
  try {
    const u = new URL(testUrl);
    const lib = u.protocol === 'https:' ? require('https') : require('http');
    const options = {
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + (u.search || ''),
      method: 'GET',
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: timeoutMs
    };

    const req = lib.request(options, (res) => {
      console.log(`\n[SelfCheck] ${testUrl} -> ${res.statusCode} ${res.statusMessage}`);
      // optionally log a couple of headers that indicate interception
      const interesting = ['via','x-cache','server','x-proxy'];
      interesting.forEach(h => {
        if (res.headers[h]) console.log(`  header ${h}: ${res.headers[h]}`);
      });
      res.on('data', () => {}); // consume so socket closes cleanly
      res.on('end', () => {});
    });

    req.on('timeout', () => {
      console.warn(`[SelfCheck] timed out after ${timeoutMs}ms: ${testUrl}`);
      req.destroy();
    });
    req.on('error', (err) => {
      console.error(`[SelfCheck] error fetching ${testUrl}: ${err.message}`);
    });
    req.end();
  } catch (e) {
    console.error('[SelfCheck] invalid URL or error:', e.message);
  }
}


  getRandomIP() {
    // avoid broadcast / reserved last octet 0/255
    const octet = () => Math.max(1, Math.min(254, Math.floor(Math.random() * 255)));
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
  }

  

  obfuscateUrl(originalPathOrUrl, hostname) {
  // skip obfuscation for media / CDN hosts
  try {
    if (hostname) {
      for (const re of this._mediaBypassHosts) {
        if (re.test(hostname)) return originalPathOrUrl;
      }
    }

    if (/^https?:\/\//i.test(originalPathOrUrl)) {
      const u = new url.URL(originalPathOrUrl);
      u.searchParams.set('_r', crypto.randomBytes(4).toString('hex'));
      return u.toString();
    } else {
      const hasQuery = originalPathOrUrl.includes('?');
      const suffix = `_r=${crypto.randomBytes(4).toString('hex')}`;
      return hasQuery ? `${originalPathOrUrl}&${suffix}` : `${originalPathOrUrl}?${suffix}`;
    }
  } catch (e) {
    return originalPathOrUrl + (originalPathOrUrl.includes('?') ? '&' : '?') + `_r=${crypto.randomBytes(4).toString('hex')}`;
  }
}


  obfuscateRequestHeaders(headers, hostname) {
  const hdrs = { ...headers };

  // remove hop-by-hop headers
  ['via', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'forwarded', 'proxy-connection'].forEach(h => {
    delete hdrs[h];
    delete hdrs[h.toLowerCase()];
    delete hdrs[h.toUpperCase()];
  });

  // Keep existing accept-encoding if present (helps compressed responses)
  if (!hdrs['accept-encoding'] && !hdrs['Accept-Encoding']) {
    hdrs['accept-encoding'] = 'gzip, deflate, br';
  }

  // Determine whether this host is a media/CDN
  let isMedia = false;
  if (hostname) {
    for (const re of this._mediaBypassHosts) {
      if (re.test(hostname)) { isMedia = true; break; }
    }
  }

  // For non-media hosts we can rotate UA and add mild headers; for media preserve important headers
  if (!isMedia) {
    if (!hdrs['cache-control']) hdrs['cache-control'] = 'no-cache';
    hdrs['user-agent'] = this.getRandomUserAgent();
    hdrs['x-forwarded-for'] = this.getRandomIP();
  } else {
    // For media/CDN: preserve UA (if provided), do not force cache control or x-forwarded-for
    hdrs['user-agent'] = hdrs['user-agent'] || hdrs['User-Agent'] || this.getRandomUserAgent();
    delete hdrs['cache-control'];
    delete hdrs['x-forwarded-for'];
  }

  // Do NOT strip Range and conditional headers — they are critical for streaming
  // e.g. 'range', 'if-range', 'if-none-match', 'if-modified-since'

  return hdrs;
}


  // Remove hop-by-hop headers from responses (per RFC2616/7230)
  sanitizeResponseHeaders(headers) {
    const sanitized = { ...headers };
    const hopByHop = ['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers','transfer-encoding','upgrade'];
    hopByHop.forEach(h => delete sanitized[h]);
    // don't modify cookies or other important headers here
    return sanitized;
  }

  logRequest(reqLike, type = 'HTTP') {
    const timestamp = new Date().toLocaleTimeString();
    const requestId = crypto.randomBytes(4).toString('hex');
    const u = reqLike.url || reqLike.url === '' ? reqLike.url : (reqLike.path || '-');
    console.log(`\n🕵️‍♂️ [${timestamp}] ${type} Request #${requestId}`);
    console.log(`   🔗 ${reqLike.method || 'CONNECT'} ${String(u).substring(0, 120)}${String(u).length > 120 ? '...' : ''}`);
    console.log(`   👤 Agent: ${reqLike.headers && (reqLike.headers['user-agent'] || reqLike.headers['User-Agent']) || 'Unknown'}`);
    console.log(`   🏠 Host: ${reqLike.headers && (reqLike.headers.host || reqLike.headers.Host) || 'Unknown'}`);
    return requestId;
  }

  createHttpServer() {
    const server = http.createServer((req, res) => {
      const requestId = this.logRequest(req, 'HTTP');
      this.connectionPool.set(requestId, { req, res, startTime: Date.now() });
      console.log('   ' + this.getRandomFunnyMessage());

      // <<< ADD: Basic auth check (if helper loaded and configured)
      if (helper) {
        const auth = helper.checkBasicAuth(req);
        if (!auth.ok) {
          if (!res.headersSent) {
            res.writeHead(407, { 'Proxy-Authenticate': 'Basic realm="SecureProxy"' });
            res.end('Proxy Authentication Required: ' + (auth.reason || ''));
          }
          this.connectionPool.delete(requestId);
          return;
        }
      }
      // <<< END ADD

      // Determine hostname/port and path robustly
      let targetHostname;
      let targetPort;
      let targetPath;

      // If request comes in using absolute URL (happens in proxy mode), parse it
      if (/^https?:\/\//i.test(req.url)) {
        try {
          const parsed = new url.URL(req.url);
          targetHostname = parsed.hostname;
          targetPort = parsed.port || (parsed.protocol === 'https:' ? 443 : 80);
          targetPath = parsed.pathname + parsed.search;
        } catch (e) {
          targetHostname = req.headers.host && req.headers.host.split(':')[0];
          targetPort = req.headers.host && req.headers.host.split(':')[1] || 80;
          targetPath = req.url;
        }
      } else {
        // normal: req.url is a path. Use Host header to get hostname.
        const hostHeader = req.headers.host || 'example.com';
        const [hostPart, portPart] = hostHeader.split(':');
        targetHostname = hostPart;
        targetPort = portPart || 80;
        targetPath = req.url;
      }

    
const obfPath = this.obfuscateUrl(targetPath, targetHostname);
const obfHeaders = this.obfuscateRequestHeaders(req.headers || {}, targetHostname);

// Choose agent & request function depending on port (443 -> https)
const isTls = String(targetPort) === '443';
const requestLib = isTls ? https : http;
const agent = isTls ? this.httpsAgent : this.httpAgent;

const options = {
  hostname: targetHostname,
  port: targetPort,
  path: obfPath,
  method: req.method,
  headers: obfHeaders,
  agent
};

// create proxy request using appropriate library
const proxyReq = requestLib.request(options, (proxyRes) => {
  // sanitize response headers and add a proxy header (but keep cookies)
  const responseHeaders = this.sanitizeResponseHeaders(proxyRes.headers);
  responseHeaders['X-Proxy-Message'] = this.getRandomFunnyMessage().replace(/[^\x20-\x7E]/g, '');
  if (!res.headersSent) {
    res.writeHead(proxyRes.statusCode, responseHeaders);
  }

  // Log streaming-related statuses for debugging
  if (proxyRes.statusCode >= 400 || (proxyRes.statusCode !== 206 && ![200].includes(proxyRes.statusCode))) {
    console.log(`   ⚠️ upstream status ${proxyRes.statusCode} ${proxyRes.statusMessage} for ${targetHostname}${targetPath}`);
  }

  proxyRes.pipe(res);
  const conn = this.connectionPool.get(requestId);
  const duration = conn ? Date.now() - conn.startTime : -1;
  console.log(`   ✅ Response: ${proxyRes.statusCode} | Duration: ${duration}ms`);
  this.connectionPool.delete(requestId);
});


      proxyReq.on('error', (err) => {
        console.error(`   ❌ Proxy Error: ${err.message}`);
        if (!res.headersSent) {
          try {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Proxy error occurred: ' + err.message);
          } catch (e) {}
        }
        this.connectionPool.delete(requestId);
      });

      // <<< ADD: set upstream timeout and link client socket close to upstream abort
      try {
        if (helper) {
          proxyReq.setTimeout(helper.DEFAULT_CONFIG.timeoutMs || 15000, () => {
            console.warn('[proxy] upstream request timed out for', targetHostname);
            proxyReq.abort();
          });
        } else {
          proxyReq.setTimeout(15000, () => { proxyReq.abort(); });
        }
      } catch (e) {}

      if (req.socket) {
        req.socket.on('close', () => {
          try { proxyReq.destroy(); } catch (e) {}
        });
      }
      // <<< END ADD

      req.pipe(proxyReq);
    });

    // HTTPS CONNECT (tunnel) - respects true TLS
    server.on('connect', (req, clientSocket, head) => {
      const requestId = this.logRequest(req, 'HTTPS');

    // <<< ADD: auth for CONNECT if helper available
     if (helper) {
        const auth = helper.checkBasicAuth(req);
        if (!auth.ok) {
          try {
            clientSocket.write('HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm="SecureProxy"\r\n\r\n');
          } catch (e) {}
          clientSocket.end();
          return this.connectionPool.delete(requestId);
        }
      }
      // <<< END ADD

      const [host, port] = req.url.split(':');
      const targetPort = parseInt(port, 10) || 443;

      const serverSocket = net.connect(targetPort, host, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        // If 'head' contains data, forward it.
        if (head && head.length) serverSocket.write(head);
        clientSocket.pipe(serverSocket);
        serverSocket.pipe(clientSocket);
      });

      // <<< ADD: socket idle timeouts if helper configured
      try {
        const sockTimeout = (helper && helper.DEFAULT_CONFIG && helper.DEFAULT_CONFIG.socketTimeoutMs) ? helper.DEFAULT_CONFIG.socketTimeoutMs : 30000;
        serverSocket.setTimeout(sockTimeout, () => serverSocket.destroy());
        clientSocket.setTimeout(sockTimeout, () => clientSocket.destroy());
      } catch (e) {}
      // <<< END ADD

      serverSocket.on('error', (err) => {
        console.error(`   ❌ HTTPS Error: ${err.message}`);
        try { clientSocket.end(); } catch (e) {}
        this.connectionPool.delete(requestId);
      });

      clientSocket.on('error', (err) => {
        console.error(`   ❌ Client Error: ${err.message}`);
        try { serverSocket.end(); } catch (e) {}
        this.connectionPool.delete(requestId);
      });
    });

    return server;
  }

  start() {
    if (this.useMitm) {
      // MITM mode — must have CA installed in client for TLS to work.
      this.mitmProxy.onRequest((ctx, callback) => {
        // obfuscate request headers (ctx.clientToProxyRequest.headers)
        ctx.clientToProxyRequest.headers = this.obfuscateRequestHeaders(ctx.clientToProxyRequest.headers || {});
        ctx.clientToProxyResponseHeader = ctx.clientToProxyResponseHeader || {};
        ctx.clientToProxyResponseHeader['X-Proxy-Message'] = this.getRandomFunnyMessage();
        this.logRequest(ctx.clientToProxyRequest, ctx.isSSL ? 'HTTPS MITM' : 'HTTP MITM');
        return callback();
      });

      this.mitmProxy.listen({ port: this.port }, () => {
        console.log(`🚀 MITM Proxy running at ${this.host}:${this.port}`);
      });
      // after server.listen(...)
console.log('Proxy started — running initial self-check...');
this.selfCheck(); // single immediate check

// optional: periodic check every N ms (be conservative, e.g. every 5-10 minutes)
this._selfCheckInterval = setInterval(() => this.selfCheck(), 1000 * 60 * 5);
    } else {
      // <<< ADD: Optional TLS server support — only enabled when USE_TLS=1
      if (process.env.USE_TLS === '1' && helper) {
        try {
          const keyPath = process.env.PROXY_TLS_KEY || process.env.TLS_KEY || null;
          const certPath = process.env.PROXY_TLS_CERT || process.env.TLS_CERT || null;
          if (!keyPath || !certPath) throw new Error('TLS key/cert not provided');
          const tlsOpts = helper.loadTlsOptions({ keyPath, certPath, caPath: process.env.PROXY_TLS_CA || null });
          const httpsServer = https.createServer(tlsOpts, (req, res) => this.createHttpServer().emit('request', req, res));
          httpsServer.on('connect', (req, clientSocket, head) => this.createHttpServer().emit('connect', req, clientSocket, head));
          httpsServer.listen(this.port, this.host, () => console.log(`🚀 Advanced Stealth Proxy (HTTPS) running at ${this.host}:${this.port}`));
          console.log('Proxy started — running initial self-check...');
          this.selfCheck();
          this._selfCheckInterval = setInterval(() => this.selfCheck(), 1000 * 60 * 5);
          return; // TLS server started, skip regular server start below
        } catch (e) {
          console.error('[proxy] TLS startup failed:', e.message);
          console.error('[proxy] Continuing to start non-TLS server.');
        }
      }
      // <<< END ADD

      const server = this.createHttpServer();
      server.listen(this.port, this.host, () => {
        console.log(`🚀 Advanced Stealth Proxy (tunnel mode) running at ${this.host}:${this.port}`);
      });
      // after server.listen(...)
console.log('Proxy started — running initial self-check...');
this.selfCheck(); // single immediate check

// optional: periodic check every N ms (be conservative, e.g. every 5-10 minutes)
this._selfCheckInterval = setInterval(() => this.selfCheck(), 1000 * 60 * 5);
    }

    process.on('SIGINT', () => {
         clearInterval(this._selfCheckInterval);
      console.log('\n🛑 Shutting down proxy...');
      this.connectionPool.forEach((conn, id) => { try { if (conn.res && !conn.res.headersSent) conn.res.end('Proxy shutting down'); } catch (e) {} });
      process.exit(0);
    });
  }
}

// Start
const proxy = new AdvancedStealthProxy();
proxy.start();

module.exports = AdvancedStealthProxy;
// advanced-stealth-proxy.patched.js
