// // // // const http = require('http');
// // // // const httpProxy = require('http-proxy');

// // // // // Create a proxy server instance
// // // // const proxy = httpProxy.createProxyServer({});

// // // // // Add request logging and header modification
// // // // proxy.on('proxyReq', function(proxyReq, req, res, options) {
// // // //     console.log('Proxying request:', req.method, req.url);
    
// // // //     // Modify headers to appear as different browser
// // // //     proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
// // // //     proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
    
// // // //     // Remove original host header to avoid issues
// // // //     proxyReq.removeHeader('X-Forwarded-For');
// // // //     proxyReq.removeHeader('X-Forwarded-Host');
// // // // });

// // // // // Handle proxy errors
// // // // proxy.on('error', function(err, req, res) {
// // // //     console.error('Proxy error:', err);
// // // //     res.writeHead(500, {
// // // //         'Content-Type': 'text/plain'
// // // //     });
// // // //     res.end('Something went wrong with the proxy.');
// // // // });

// // // // // Create the HTTP server
// // // // const server = http.createServer(function(req, res) {
// // // //     // Log the request
// // // //     console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
// // // //     // Proxy the request to the target
// // // //     try {
// // // //         proxy.web(req, res, {
// // // //             target: req.url.startsWith('https://') ? req.url : 'http://' + req.headers.host,
// // // //             changeOrigin: true,  // Changes the origin of the host header to the target URL
// // // //             secure: false,       // Ignore SSL certificate errors (useful for testing)
// // // //             prependPath: false,
// // // //             timeout: 30000       // 30 second timeout
// // // //         });
// // // //     } catch (error) {
// // // //         console.error('Error proxying request:', error);
// // // //         res.writeHead(500, { 'Content-Type': 'text/plain' });
// // // //         res.end('Proxy configuration error');
// // // //     }
// // // // });

// // // // // Start the server
// // // // const PORT = 8080;
// // // // const HOST = '127.0.0.1';

// // // // server.listen(PORT, HOST, () => {
// // // //     console.log(`Local proxy server running on http://${HOST}:${PORT}`);
// // // //     console.log('Configure your browser to use:');
// // // //     console.log(`HTTP Proxy: ${HOST}:${PORT}`);
// // // //     console.log('Press Ctrl+C to stop the server');
// // // // });

// // // // // Handle graceful shutdown
// // // // process.on('SIGINT', function() {
// // // //     console.log('\nShutting down proxy server...');
// // // //     server.close(() => {
// // // //         console.log('Proxy server stopped.');
// // // //         process.exit(0);
// // // //     });
// // // // });
// // // const http = require('http');
// // // const httpProxy = require('http-proxy');
// // // const crypto = require('crypto');
// // // // Create a proxy server instance
// // // const proxy = httpProxy.createProxyServer({});

// // // // Add request logging and header modification
// // // proxy.on('proxyReq', function(proxyReq, req, res, options) {
// // //     console.log('Proxying request:', req.method, req.url);
    
// // //     // Modify headers to appear as different browser
// // //     proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
// // //     proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
    
// // //     // Remove original host header to avoid issues
// // //     proxyReq.removeHeader('X-Forwarded-For');
// // //     proxyReq.removeHeader('X-Forwarded-Host');
// // // });

// // // // Handle proxy errors
// // // proxy.on('error', function(err, req, res) {
// // //     console.error('Proxy error:', err);
// // //     res.writeHead(500, {
// // //         'Content-Type': 'text/plain'
// // //     });
// // //     res.end('Something went wrong with the proxy.');
// // // });

// // // // Create the HTTP server
// // // const server = http.createServer(function(req, res) {
// // //     // Log the request with full URL (for HTTP)
// // //     const fullUrl = `http://${req.headers.host}${req.url}`;
// // //     console.log(`${new Date().toISOString()} - ${req.method} ${fullUrl}`);
    
// // //     // Proxy the request to the target
// // //     try {
// // //         proxy.web(req, res, {
// // //             target: 'http://' + req.headers.host,  // Use the host from the request
// // //             changeOrigin: true,  // Changes the origin of the host header to the target URL
// // //             secure: false,       // Ignore SSL certificate errors (useful for testing)
// // //             prependPath: false,
// // //             timeout: 30000       // 30 second timeout
// // //         });
// // //     } catch (error) {
// // //         console.error('Error proxying request:', error);
// // //         res.writeHead(500, { 'Content-Type': 'text/plain' });
// // //         res.end('Proxy configuration error');
// // //     }
// // // });
// // // server.on('connect', (req, clientSocket, head) => {
// // //     console.log(`${new Date().toISOString()} - HTTPS CONNECT to ${req.url}`);
// // //     const [host, port] = req.url.split(':');
// // //     const net = require('net');
// // //     const serverSocket = net.connect(port, host, () => {
// // //         clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
// // //         serverSocket.write(head);
// // //         serverSocket.pipe(clientSocket);
// // //         clientSocket.pipe(serverSocket);
// // //     });
// // //     serverSocket.on('error', (err) => {
// // //         clientSocket.end();
// // //     });
// // // });

// // // // Start the server on port 8080
// // // const PORT = 8080;
// // // const HOST = '127.0.0.1';

// // // server.listen(PORT, HOST, () => {
// // //     console.log(`Local proxy server running on http://${HOST}:${PORT}`);
// // //     console.log('Configure your browser to use:');
// // //     console.log(`HTTP Proxy: ${HOST}:${PORT}`);
// // //     console.log('Press Ctrl+C to stop the server');
// // // });

// // // // Handle graceful shutdown
// // // process.on('SIGINT', function() {
// // //     console.log('\nShutting down proxy server...');
// // //     server.close(() => {
// // //         console.log('Proxy server stopped.');
// // //         process.exit(0);
// // //     });
// // // });

// // // // Prevent other proxies from intercepting packets by disabling proxy headers
// // // proxy.on('proxyReq', function(proxyReq, req, res, options) {
// // //     // Remove headers commonly used by proxies
// // //     proxyReq.removeHeader('Via');
// // //     proxyReq.removeHeader('Forwarded');
// // //     proxyReq.removeHeader('X-Forwarded-For');
// // //     proxyReq.removeHeader('X-Forwarded-Host');
// // //     proxyReq.removeHeader('X-Forwarded-Proto');
// // // });


// // // // Utility to generate a random User-Agent
// // // function randomUserAgent() {
// // //     const agents = [
// // //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
// // //         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
// // //         'Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/89.0'
// // //     ];
// // //     return agents[Math.floor(Math.random() * agents.length)];
// // // }

// // // // Advanced header modification and obfuscation
// // // proxy.on('proxyReq', function(proxyReq, req, res, options) {
// // //     proxyReq.setHeader('User-Agent', randomUserAgent());
// // //     proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
// // //     proxyReq.setHeader('X-Proxy-Obfuscated', crypto.randomBytes(8).toString('hex'));

// // //     // Remove headers commonly used by proxies
// // //     proxyReq.removeHeader('Via');
// // //     proxyReq.removeHeader('Forwarded');
// // //     proxyReq.removeHeader('X-Forwarded-For');
// // //     proxyReq.removeHeader('X-Forwarded-Host');
// // //     proxyReq.removeHeader('X-Forwarded-Proto');
// // // });

// // // // HTTPS CONNECT tunneling support
// // // server.on('connect', (req, clientSocket, head) => {
// // //     const [host, port] = req.url.split(':');
// // //     const net = require('net');
// // //     const serverSocket = net.connect(port, host, () => {
// // //         clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
// // //         serverSocket.write(head);
// // //         serverSocket.pipe(clientSocket);
// // //         clientSocket.pipe(serverSocket);
// // //     });
// // //     serverSocket.on('error', (err) => {
// // //         clientSocket.end();
// // //     });
// // // });


// // const http = require('http');
// // const httpProxy = require('http-proxy');
// //  const crypto = require('crypto');

// // // Create a proxy server instance
// // const proxy = httpProxy.createProxyServer({});

// // // Add request logging and header modification for HTTP requests
// // proxy.on('proxyReq', function(proxyReq, req, res, options) {
// //     console.log('🔗 Proxying HTTP request to:', req.method, req.url);
// //     proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
// //     proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
// // });

// // // Handle proxy errors
// // proxy.on('error', function(err, req, res) {
// //     console.error('❌ Proxy error:', err.message);
// //     if (!res.headersSent) {
// //         res.writeHead(500, {
// //             'Content-Type': 'text/plain'
// //         });
// //     }
// //     res.end('Something went wrong with the proxy.');
// // });

// // // Create an HTTP server that supports both HTTP and HTTPS (via CONNECT)
// // const server = http.createServer(function(req, res) {
// //     // Log the request
// //     const host = req.headers.host || 'unknown-host';
// //     const fullUrl = host + req.url;
// //     const timestamp = new Date().toLocaleTimeString();
    
// //     console.log(`\n🌐 [${timestamp}] ${req.method} ${fullUrl}`);
// //     console.log(`   👤 User-Agent: ${req.headers['user-agent']?.split(' ')[0] || 'Unknown'}`);
// //     console.log(`   🏠 Host: ${host}`);

// //     // Proxy the request for HTTP
// //     try {
// //         proxy.web(req, res, {
// //             target: req.url.startsWith('https://') ? req.url : 'http://' + req.headers.host,
// //             changeOrigin: true,
// //             secure: false,
// //             prependPath: false,
// //             timeout: 30000
// //         });
// //     } catch (error) {
// //         console.error('💥 Error proxying request:', error);
// //         if (!res.headersSent) {
// //             res.writeHead(500, { 'Content-Type': 'text/plain' });
// //             res.end('Proxy configuration error');
// //         }
// //     }
// // });

// // // Handle the CONNECT method for HTTPS
// // server.on('connect', function(req, clientSocket, head) {
// //     const host = req.url.split(':')[0];
// //     const port = req.url.split(':')[1] || 443;
// //     const timestamp = new Date().toLocaleTimeString();

// //     console.log(`\n🔒 [${timestamp}] CONNECT ${req.url}`);
// //     console.log(`   👤 User-Agent: ${req.headers['user-agent']?.split(' ')[0] || 'Unknown'}`);
// //     console.log(`   🏠 Host: ${host}:${port}`);

// //     // Create a connection to the target server
// //     const serverSocket = require('net').connect(port, host, () => {
// //         clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
// //                           'Proxy-agent: Node.js-Proxy\r\n' +
// //                           '\r\n');
// //         serverSocket.write(head);
// //         serverSocket.pipe(clientSocket);
// //         clientSocket.pipe(serverSocket);
// //     });

// //     serverSocket.on('error', (err) => {
// //         console.error('❌ CONNECT error:', err.message);
// //         clientSocket.end();
// //     });

// //     clientSocket.on('error', (err) => {
// //         console.error('❌ Client socket error:', err.message);
// //         serverSocket.end();
// //     });

// // });

// // // Start the server
// // const PORT = 8080;
// // const HOST = '127.0.0.1';

// // server.listen(PORT, HOST, () => {
// //     console.log('🚀 Proxy Server Started!');
// //     console.log('📊 Monitoring all browser traffic...');
// //     console.log(`📍 Proxy Address: ${HOST}:${PORT}`);
// //     console.log('=' .repeat(50));
// //     console.log('📋 Websites you visit will appear below:');
// //     console.log('=' .repeat(50));
// // });

// // // Handle graceful shutdown
// // process.on('SIGINT', function() {
// //     console.log('\n🛑 Shutting down proxy server...');
// //     server.close(() => {
// //         console.log('✅ Proxy server stopped.');
// //         process.exit(0);
// //     });
// // });
// // // // Utility to generate a random User-Agent
// // function randomUserAgent() {
// //     const agents = [
// //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
// //         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
// //         'Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/89.0'
// //     ];
// //     return agents[Math.floor(Math.random() * agents.length)];
// // }

// // // // Advanced header modification and obfuscation
// // proxy.on('proxyReq', function(proxyReq, req, res, options) {
// //     proxyReq.setHeader('User-Agent', randomUserAgent());
// //     proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
// //     proxyReq.setHeader('X-Proxy-Obfuscated', crypto.randomBytes(8).toString('hex'));

// //     // Remove headers commonly used by proxies
// //     proxyReq.removeHeader('Via');
// //     proxyReq.removeHeader('Forwarded');
// //     proxyReq.removeHeader('X-Forwarded-For');
// //     proxyReq.removeHeader('X-Forwarded-Host');
// //     proxyReq.removeHeader('X-Forwarded-Proto');
// // });

// // // // HTTPS CONNECT tunneling support
// // // server.on('connect', (req, clientSocket, head) => {
// // //     const [host, port] = req.url.split(':');
// // //     const net = require('net');
// // //     const serverSocket = net.connect(port, host, () => {
// // //         clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
// // //         serverSocket.write(head);
// // //         serverSocket.pipe(clientSocket);
// // //         clientSocket.pipe(serverSocket);
// // //     });
// // //     serverSocket.on('error', (err) => {
// // //         clientSocket.end();
// // //     });
// // // });
// const http = require('http');
// const httpProxy = require('http-proxy');
// const net = require('net');
// const crypto = require('crypto');

// const proxy = httpProxy.createProxyServer({});

// // --- Utilities ---
// const userAgents = [
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/117.0.5938.62',
//     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_17_0) Safari/605.1.15',
//     'Mozilla/5.0 (X11; Linux x86_64) Firefox/120.0',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/118.0.2001.43'
// ];

// const accepts = [
//     'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//     'application/json, text/javascript, */*; q=0.01',
//     '*/*'
// ];

// const languages = ['en-US,en;q=0.9','en-GB,en;q=0.8','fr-FR,fr;q=0.7'];

// // --- Random utilities ---
// function randomChoice(arr){return arr[Math.floor(Math.random()*arr.length)];}
// function randomIP(){return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;}
// function randomSession(){return crypto.randomBytes(8).toString('hex');}
// function randomFingerprint(){return crypto.randomBytes(6).toString('hex');}
// function randomTLS(){return `TLSv1.3-Cipher-${Math.floor(Math.random()*1000)}`;}

// // --- Generate randomized headers per request ---
// function randomHeaders(){
//     return {
//         'User-Agent': randomChoice(userAgents),
//         'Accept': randomChoice(accepts),
//         'Accept-Language': randomChoice(languages),
//         'Cache-Control':'no-cache',
//         'Pragma':'no-cache',
//         'X-Random-Header': crypto.randomBytes(8).toString('hex'),
//         'X-Forwarded-For': randomIP(),
//         'Cookie': `SESSIONID=${randomSession()}`,
//         'X-Proxy-Fingerprint': randomFingerprint(),
//         'X-TLS-Fingerprint': randomTLS()
//     };
// }

// // --- HTTP Request Handling ---
// proxy.on('proxyReq', (proxyReq, req, res) => {
//     const headers = randomHeaders();
//     Object.keys(headers).forEach(h=>proxyReq.setHeader(h, headers[h]));
//     ['Via','Forwarded','X-Forwarded-Host','X-Forwarded-Proto'].forEach(h=>proxyReq.removeHeader(h));

//     // Random query string to obfuscate logs
//     if(!req.url.includes('?')){
//         proxyReq.path += `?_r=${crypto.randomBytes(4).toString('hex')}`;
//     } else {
//         proxyReq.path += `&_r=${crypto.randomBytes(4).toString('hex')}`;
//     }

//     // Random small delay
//     const delay=Math.floor(Math.random()*150);
//     if(delay>0) setTimeout(()=>{}, delay);

//     // Detailed console logs
//     console.log(`[HTTP] ${req.method} ${req.headers.host}${req.url}`);
//     console.log(`       UA: ${headers['User-Agent']}`);
//     console.log(`       X-Forwarded-For: ${headers['X-Forwarded-For']}`);
//     console.log(`       SessionID: ${headers['Cookie'].split('=')[1]}`);
//     console.log(`       TLS Fingerprint: ${headers['X-TLS-Fingerprint']}`);
//     console.log(`       Proxy Fingerprint: ${headers['X-Proxy-Fingerprint']}`);
// });

// // --- Proxy Error Handling ---
// proxy.on('error',(err,req,res)=>{
//     console.error('❌ Proxy error:',err.message);
//     if(!res.headersSent) res.writeHead(500,{'Content-Type':'text/plain'});
//     res.end('Proxy error occurred');
// });

// // --- HTTP Server ---
// const server = http.createServer((req,res)=>{
//     try{
//         proxy.web(req,res,{
//             target: req.url.startsWith('https://')? req.url:'http://'+req.headers.host,
//             changeOrigin:true,
//             secure:false,
//             prependPath:false,
//             timeout:30000
//         });
//     }catch(err){
//         console.error('💥 HTTP proxy error:',err);
//         if(!res.headersSent){
//             res.writeHead(500,{'Content-Type':'text/plain'});
//             res.end('Proxy configuration error');
//         }
//     }
// });

// // --- HTTPS CONNECT Tunnel with TLS Fingerprint Simulation ---
// server.on('connect',(req,clientSocket,head)=>{
//     const [host, port=443]=req.url.split(':');
//     const fingerprint=randomFingerprint();
//     const tls=randomTLS();
//     const session=randomSession();
//     const ua=randomChoice(userAgents);
//     const xff=randomIP();

//     console.log(`[HTTPS] CONNECT ${host}:${port}`);
//     console.log(`       UA: ${ua}`);
//     console.log(`       X-Forwarded-For: ${xff}`);
//     console.log(`       SessionID: ${session}`);
//     console.log(`       TLS Fingerprint: ${tls}`);
//     console.log(`       Proxy Fingerprint: ${fingerprint}`);

//     const serverSocket = net.connect(port,host,()=>{
//         clientSocket.write('HTTP/1.1 200 Connection Established\r\nProxy-agent: Node-Proxy-V5\r\n\r\n');
//         serverSocket.write(head);
//         serverSocket.pipe(clientSocket);
//         clientSocket.pipe(serverSocket);
//     });

//     serverSocket.on('error',err=>{
//         console.error('❌ CONNECT error:',err.message);
//         clientSocket.end();
//     });
//     clientSocket.on('error',err=>{
//         console.error('❌ Client socket error:',err.message);
//         serverSocket.end();
//     });
// });

// // --- Start Proxy ---
// const PORT=8080;
// const HOST='127.0.0.1';
// server.listen(PORT,HOST,()=>{
//     console.log(`🚀 Advanced Proxy v5 running at http://${HOST}:${PORT}`);
//     console.log('Monitoring traffic with TLS fingerprint simulation, sessions, randomized headers, fake IPs...');
// });

// // --- Graceful Shutdown ---
// process.on('SIGINT',()=>{
//     console.log('Shutting down proxy...');
//     server.close(()=>{console.log('✅ Proxy stopped'); process.exit(0)});
// });
// const http = require('http');
// const https = require('https');
// const net = require('net');
// const crypto = require('crypto');
// const url = require('url');
// const Proxy = require('http-mitm-proxy'); // optional for MITM TLS

// class AdvancedStealthProxy {
//     constructor() {
//         this.port = 8080;
//         this.host = '127.0.0.1';
//         this.obfuscationEnabled = true;
//         this.headerRotation = true;
//         this.packetFragmentation = false;
//         this.connectionPool = new Map();
//         this.useMitm = false; // switch to true for full MITM HTTPS interception
//         this.mitmProxy = this.useMitm ? Proxy() : null;
//     }
// // ...existing code...
// getRandomFunnyMessage() {
//     const messages = [
//         "Proxy says: I see what you did there",
//         "Proxy says: Shh… nobody’s watching you",
//         "Proxy says: One does not simply sniff this traffic",
//         "Proxy says: Access granted… maybe",
//         "Proxy says: Hello, human! I’m your friendly neighborhood proxy",
//         "Proxy says: Rotating headers like a DJ",
//         "Proxy says: Keep calm and browse on",
//         "Proxy says: Did you really think I’d let them see this?"
//     ];
//     return messages[Math.floor(Math.random() * messages.length)];
// }
// // ...existing code...
//     // Advanced User-Agent rotation
//     getRandomUserAgent() {
//         const agents = [
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0'
//         ];
//         return agents[Math.floor(Math.random() * agents.length)];
//     }

//     // Random IP for X-Forwarded-For
//     getRandomIP() {
//         return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
//     }

//     // Random query string obfuscation
//     obfuscateUrl(originalUrl) {
//         const randomStr = crypto.randomBytes(4).toString('hex');
//         return originalUrl.includes('?') ? `${originalUrl}&_r=${randomStr}` : `${originalUrl}?_r=${randomStr}`;
//     }

//     // Obfuscate headers
//     obfuscateHeaders(headers) {
//         const obfuscated = { ...headers };
//         ['via','x-forwarded-for','x-forwarded-host','x-forwarded-proto','forwarded'].forEach(h=>delete obfuscated[h]);
//         obfuscated['accept-encoding'] = 'gzip, deflate, br';
//         obfuscated['cache-control'] = 'no-cache';
//         obfuscated['upgrade-insecure-requests'] = '1';
//         obfuscated['user-agent'] = this.getRandomUserAgent();
//         obfuscated['x-forwarded-for'] = this.getRandomIP();
//         obfuscated['cookie'] = `SESSIONID=${crypto.randomBytes(8).toString('hex')}`;
//         return obfuscated;
//     }

//     // Log requests with fingerprints
//     logRequest(req, type='HTTP') {
//         const timestamp = new Date().toLocaleTimeString();
//         const requestId = crypto.randomBytes(4).toString('hex');
//         console.log(`\n🕵️‍♂️ [${timestamp}] ${type} Request #${requestId}`);
//         console.log(`   🔗 ${req.method} ${req.url.substring(0,50)}${req.url.length>50?'...':''}`);
//         console.log(`   👤 Agent: ${req.headers['user-agent'] || 'Unknown'}`);
//         console.log(`   🏠 Host: ${req.headers.host || 'Unknown'}`);
//         console.log(`   🆔 Request ID: ${requestId}`);
//         return requestId;
//     }

//     // HTTP server
//     createHttpServer() {
//         const server = http.createServer((req,res)=>{
//             const requestId = this.logRequest(req, 'HTTP');
//             this.connectionPool.set(requestId,{req,res,startTime:Date.now()});
//                 console.log(this.getRandomFunnyMessage());

//             const targetHost = req.headers.host || 'example.com';
//             const targetUrl = `http://${targetHost}`;
//             const parsedUrl = url.parse(targetUrl);

//             const options = {
//                 hostname: parsedUrl.hostname,
//                 port: parsedUrl.port || 80,
//                 path: this.obfuscateUrl(req.url),
//                 method: req.method,
//                 headers: this.obfuscateHeaders(req.headers)
//             };

//             const proxyReq = http.request(options, (proxyRes)=>{
//              res.writeHead(proxyRes.statusCode, {
//     ...this.obfuscateHeaders(proxyRes.headers),
//     'X-Proxy-Message': this.getRandomFunnyMessage().replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII
// });
//                 proxyRes.pipe(res);
//                 const duration = Date.now()-this.connectionPool.get(requestId).startTime;
//                 console.log(`   ✅ Response: ${proxyRes.statusCode} | Duration: ${duration}ms`);
//             });

//             proxyReq.on('error',(err)=>{
//                 console.error(`   ❌ Proxy Error: ${err.message}`);
//                 if(!res.headersSent) res.writeHead(500,{'Content-Type':'text/plain'}), res.end('Proxy error occurred');
//                 this.connectionPool.delete(requestId);
//             });

//             req.pipe(proxyReq);
//         });

//         // HTTPS CONNECT
//         server.on('connect',(req,clientSocket,head)=>{
//             const requestId = this.logRequest(req, 'HTTPS');
//             const [host, port] = req.url.split(':');
//             const targetPort = port || 443;

//             const serverSocket = net.connect(targetPort, host, ()=>{
//                 clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
//                 serverSocket.write(head);
//                 clientSocket.pipe(serverSocket);
//                 serverSocket.pipe(clientSocket);
//             });

//             serverSocket.on('error',(err)=>{
//                 console.error(`   ❌ HTTPS Error: ${err.message}`);
//                 clientSocket.end();
//                 this.connectionPool.delete(requestId);
//             });
//             clientSocket.on('error',(err)=>{
//                 console.error(`   ❌ Client Error: ${err.message}`);
//                 serverSocket.end();
//                 this.connectionPool.delete(requestId);
//             });
//         });

//         return server;
//     }

//     // Start the proxy
//     start() {
//         if(this.useMitm){
//             // this.mitmProxy.onRequest((ctx, callback)=>{
//             //     ctx.clientToProxyRequest.headers = this.obfuscateHeaders(ctx.clientToProxyRequest.headers);
//             //     this.logRequest(ctx.clientToProxyRequest, ctx.isSSL?'HTTPS MITM':'HTTP MITM');
//             //     callback();
//             // });
//             // this.mitmProxy.listen({port:this.port},()=>{
//             //     console.log(`🚀 MITM Proxy running at ${this.host}:${this.port}`);
//             // });
//               this.mitmProxy.onRequest((ctx, callback)=>{
//         // Obfuscate headers
//         ctx.clientToProxyRequest.headers = this.obfuscateHeaders(ctx.clientToProxyRequest.headers);

//         // Inject funny message into response headers
//         ctx.clientToProxyResponseHeader = ctx.clientToProxyResponseHeader || {};
//         ctx.clientToProxyResponseHeader['X-Proxy-Message'] = this.getRandomFunnyMessage();

//         // Log the request
//         this.logRequest(ctx.clientToProxyRequest, ctx.isSSL ? 'HTTPS MITM' : 'HTTP MITM');

//         callback();
//     });

//     this.mitmProxy.listen({port:this.port},()=>{
//         console.log(`🚀 MITM Proxy running at ${this.host}:${this.port}`);
//     });
//         } else {
//             const server = this.createHttpServer();
//             server.listen(this.port,this.host,()=>{
//                 console.log(`🚀 Advanced Stealth Proxy running at ${this.host}:${this.port}`);
//             });
//         }

//         // Graceful shutdown
//         process.on('SIGINT',()=>{
//             console.log('\n🛑 Shutting down proxy...');
//             this.connectionPool.forEach((conn,id)=>{ if(conn.res && !conn.res.headersSent) conn.res.end('Proxy shutting down'); });
//             process.exit(0);
//         });
//     }
    
// }

// // Start the advanced proxy
// const proxy = new AdvancedStealthProxy();
// proxy.start();

// module.exports = AdvancedStealthProxy;


// // advanced-stealth-proxy.js
// const http = require('http');
// const https = require('https');
// const net = require('net');
// const crypto = require('crypto');
// const url = require('url');
// const Proxy = require('http-mitm-proxy'); // optional for MITM TLS

// class AdvancedStealthProxy {
//   constructor() {
//     this.port = 8080;
//     this.host = '127.0.0.1';
//     this.obfuscationEnabled = true;
//     this.headerRotation = true;
//     this.packetFragmentation = false;
//     this.connectionPool = new Map();
//     this.useMitm = false; // set true only if you want full MITM (and install CA)
//     this.mitmProxy = this.useMitm ? Proxy() : null;

//     // add keep-alive agents for performance (paste inside constructor)
// this.httpAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });
// this.httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 100 });

// // optional list of hosts to bypass obfuscation (CDNs / streaming)
// this._mediaBypassHosts = [
//   /\.googlevideo\.com$/i,
//   /\.youtube\.com$/i,
//   /\.ytimg\.com$/i,
//   /\.doubleclick\.net$/i,
//   /\.akamaized\.net$/i
// ];

//   }

//   getRandomFunnyMessage() {
//     const messages = [
//       "Proxy says: I see what you did there",
//       "Proxy says: Shh… nobody’s watching you",
//       "Proxy says: One does not simply sniff this traffic",
//       "Proxy says: Access granted… maybe",
//       "Proxy says: Hello, human! I’m your friendly neighborhood proxy",
//       "Proxy says: Rotating headers like a DJ",
//       "Proxy says: Keep calm and browse on",
//       "Proxy says: Did you really think I’d let them see this?"
//     ];
//     return messages[Math.floor(Math.random() * messages.length)];
//   }

// // Replace your existing getRandomUserAgent() with the following block
// getRandomUserAgent() {
//   // Deterministic components for building a pool of 100 UAs
//   const windowsVersions = ['10.0', '10.0', '10.0', '6.1'];
//   const macVersions = ['10_15_7', '11_6_8', '12_6_3', '13_4_1'];
//   const linuxTokens = ['X11; Linux x86_64', 'X11; Ubuntu; Linux x86_64'];
//   const androidDevices = [
//     'Linux; Android 14; Pixel 8 Pro', 'Linux; Android 14; Pixel 8',
//     'Linux; Android 13; SM-G991B', 'Linux; Android 12; SM-A536B',
//     'Linux; Android 11; Redmi Note 10', 'Linux; Android 10; M2101K7AG'
//   ];
//   const iPhoneDevices = [
//     'iPhone; CPU iPhone OS 17_0 like Mac OS X',
//     'iPhone; CPU iPhone OS 16_4 like Mac OS X',
//     'iPhone; CPU iPhone OS 15_7 like Mac OS X'
//   ];

//   const chromeVersions = ['120.0.0.0', '119.0.6045.0', '118.0.5993.0', '117.0.5938.62', '116.0.5845.96'];
//   const firefoxVersions = ['121.0', '120.0', '119.0', '118.0'];
//   const edgeVersions = ['120.0.0.0', '119.0.0.0', '118.0.0.0'];
//   const safariVersions = ['605.1.15', '604.1', '604.5.6'];

//   const pool = [];

//   // 35 Chrome desktop variants (Windows/macOS/Linux)
//   for (let i = 0; pool.length < 35; i++) {
//     const os = (i % 3 === 0)
//       ? `Windows NT ${windowsVersions[i % windowsVersions.length]}`
//       : (i % 3 === 1)
//         ? `Macintosh; Intel Mac OS X ${macVersions[i % macVersions.length]}`
//         : linuxTokens[i % linuxTokens.length];
//     const ver = chromeVersions[i % chromeVersions.length];
//     pool.push(`Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver} Safari/537.36`);
//   }

//   // 20 Firefox desktop variants (Windows/macOS/Linux)
//   for (let i = 0; pool.length < 55; i++) {
//     const os = (i % 3 === 0)
//       ? `Windows NT ${windowsVersions[i % windowsVersions.length]}`
//       : (i % 3 === 1)
//         ? `Macintosh; Intel Mac OS X ${macVersions[i % macVersions.length]}`
//         : linuxTokens[i % linuxTokens.length];
//     const ver = firefoxVersions[i % firefoxVersions.length];
//     pool.push(`Mozilla/5.0 (${os}; rv:${ver}) Gecko/20100101 Firefox/${ver}`);
//   }

//   // 15 Edge desktop variants
//   for (let i = 0; pool.length < 70; i++) {
//     const os = `Windows NT ${windowsVersions[i % windowsVersions.length]}`;
//     const ver = edgeVersions[i % edgeVersions.length];
//     pool.push(`Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersions[i % chromeVersions.length]} Safari/537.36 Edg/${ver}`);
//   }

//   // 10 Safari (macOS) variants
//   for (let i = 0; pool.length < 80; i++) {
//     const mac = `Macintosh; Intel Mac OS X ${macVersions[i % macVersions.length]}`;
//     const sv = safariVersions[i % safariVersions.length];
//     pool.push(`Mozilla/5.0 (${mac}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${16 - (i % 4)}.0 Safari/${sv}`);
//   }

//   // 20 Mobile UAs (mix of Android and iPhone)
//   // Android Chrome mobile
//   for (let i = 0; pool.length < 95; i++) {
//     const device = androidDevices[i % androidDevices.length];
//     const ver = chromeVersions[i % chromeVersions.length];
//     pool.push(`Mozilla/5.0 (${device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver} Mobile Safari/537.36`);
//   }

//   // iPhone Safari UAs to finish up to 100
//   for (let i = 0; pool.length < 100; i++) {
//     const device = iPhoneDevices[i % iPhoneDevices.length];
//     const safariV = safariVersions[i % safariVersions.length];
//     pool.push(`Mozilla/5.0 (${device}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${15 - (i % 3)}.0 Mobile/15E148 Safari/${safariV}`);
//   }

//   // pool is deterministic and will contain exactly 100 entries
//   // Return a random one from the pool
//   return pool[Math.floor(Math.random() * pool.length)];
// }

// // Helper: deterministic list of safe test sites (non-harmful)
// getSafeTestSites() {
//   // These are well-known, benign sites you can use for connectivity checks.
//   return [
//     'https://example.com',
//     'https://example.org',
//     'https://www.wikipedia.org',
//     'https://www.mozilla.org',
//     'https://developer.mozilla.org',
//     'https://www.nodejs.org',
//     'https://www.github.com',
//     'https://stackoverflow.com',
//     'https://duckduckgo.com',
//     'https://www.google.com',
//     'https://www.bing.com',
//     'https://www.w3.org',
//     'https://www.npmjs.com',
//     'https://news.ycombinator.com',
//     'https://medium.com',
//     'https://www.reddit.com',
//     'https://www.cnn.com',
//     'https://www.bbc.com',
//     'https://www.nytimes.com',
//     'https://www.python.org'
//   ];
// }

// // Helper: pick a random safe test URL
// getRandomTestUrl() {
//   const sites = this.getSafeTestSites();
//   return sites[Math.floor(Math.random() * sites.length)];
// }
//  // inside AdvancedStealthProxy class
// selfCheck(timeoutMs = 8000) {
//   const testUrl = this.getRandomTestUrl();
//   try {
//     const u = new URL(testUrl);
//     const lib = u.protocol === 'https:' ? require('https') : require('http');
//     const options = {
//       hostname: u.hostname,
//       port: u.port || (u.protocol === 'https:' ? 443 : 80),
//       path: u.pathname + (u.search || ''),
//       method: 'GET',
//       headers: {
//         'User-Agent': this.getRandomUserAgent(),
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
//       },
//       timeout: timeoutMs
//     };

//     const req = lib.request(options, (res) => {
//       console.log(`\n[SelfCheck] ${testUrl} -> ${res.statusCode} ${res.statusMessage}`);
//       // optionally log a couple of headers that indicate interception
//       const interesting = ['via','x-cache','server','x-proxy'];
//       interesting.forEach(h => {
//         if (res.headers[h]) console.log(`  header ${h}: ${res.headers[h]}`);
//       });
//       res.on('data', () => {}); // consume so socket closes cleanly
//       res.on('end', () => {});
//     });

//     req.on('timeout', () => {
//       console.warn(`[SelfCheck] timed out after ${timeoutMs}ms: ${testUrl}`);
//       req.destroy();
//     });
//     req.on('error', (err) => {
//       console.error(`[SelfCheck] error fetching ${testUrl}: ${err.message}`);
//     });
//     req.end();
//   } catch (e) {
//     console.error('[SelfCheck] invalid URL or error:', e.message);
//   }
// }


//   getRandomIP() {
//     // avoid broadcast / reserved last octet 0/255
//     const octet = () => Math.max(1, Math.min(254, Math.floor(Math.random() * 255)));
//     return `${octet()}.${octet()}.${octet()}.${octet()}`;
//   }

//   // obfuscateUrl(originalPathOrUrl) {
//   //   // Accept either absolute URL or path
//   //   try {
//   //     if (/^https?:\/\//i.test(originalPathOrUrl)) {
//   //       const u = new url.URL(originalPathOrUrl);
//   //       u.searchParams.set('_r', crypto.randomBytes(4).toString('hex'));
//   //       return u.toString();
//   //     } else {
//   //       // relative path
//   //       const hasQuery = originalPathOrUrl.includes('?');
//   //       const suffix = `_r=${crypto.randomBytes(4).toString('hex')}`;
//   //       return hasQuery ? `${originalPathOrUrl}&${suffix}` : `${originalPathOrUrl}?${suffix}`;
//   //     }
//   //   } catch (e) {
//   //     // fallback: append param safely
//   //     return originalPathOrUrl + (originalPathOrUrl.includes('?') ? '&' : '?') + `_r=${crypto.randomBytes(4).toString('hex')}`;
//   //   }
//   // }

//   obfuscateUrl(originalPathOrUrl, hostname) {
//   // skip obfuscation for media / CDN hosts
//   try {
//     if (hostname) {
//       for (const re of this._mediaBypassHosts) {
//         if (re.test(hostname)) return originalPathOrUrl;
//       }
//     }

//     if (/^https?:\/\//i.test(originalPathOrUrl)) {
//       const u = new url.URL(originalPathOrUrl);
//       u.searchParams.set('_r', crypto.randomBytes(4).toString('hex'));
//       return u.toString();
//     } else {
//       const hasQuery = originalPathOrUrl.includes('?');
//       const suffix = `_r=${crypto.randomBytes(4).toString('hex')}`;
//       return hasQuery ? `${originalPathOrUrl}&${suffix}` : `${originalPathOrUrl}?${suffix}`;
//     }
//   } catch (e) {
//     return originalPathOrUrl + (originalPathOrUrl.includes('?') ? '&' : '?') + `_r=${crypto.randomBytes(4).toString('hex')}`;
//   }
// }


//   // Only modify request headers (not response headers).
//   // obfuscateRequestHeaders(headers) {
//   //   const hdrs = { ...headers };
//   //   // remove hop-by-hop / forwarding headers so backend sees "cleaner" request
//   //   ['via', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'forwarded', 'proxy-connection'].forEach(h => {
//   //     delete hdrs[h];
//   //     delete hdrs[h.toLowerCase()];
//   //     delete hdrs[h.toUpperCase()];
//   //   });

//   //   hdrs['accept-encoding'] = hdrs['accept-encoding'] || 'gzip, deflate, br';
//   //   hdrs['cache-control'] = hdrs['cache-control'] || 'no-cache';
//   //   // rotate UA
//   //   hdrs['user-agent'] = this.getRandomUserAgent();
//   //   // add a synthetic x-forwarded-for for "randomization" (but not required)
//   //   hdrs['x-forwarded-for'] = this.getRandomIP();
//   //   // Do NOT clobber cookie unless you really want to.
//   //   // hdrs['cookie'] = `SESSIONID=${crypto.randomBytes(8).toString('hex')}`;

//   //   return hdrs;
//   // }

//   obfuscateRequestHeaders(headers, hostname) {
//   const hdrs = { ...headers };

//   // remove hop-by-hop headers
//   ['via', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'forwarded', 'proxy-connection'].forEach(h => {
//     delete hdrs[h];
//     delete hdrs[h.toLowerCase()];
//     delete hdrs[h.toUpperCase()];
//   });

//   // Keep existing accept-encoding if present (helps compressed responses)
//   if (!hdrs['accept-encoding'] && !hdrs['Accept-Encoding']) {
//     hdrs['accept-encoding'] = 'gzip, deflate, br';
//   }

//   // Determine whether this host is a media/CDN
//   let isMedia = false;
//   if (hostname) {
//     for (const re of this._mediaBypassHosts) {
//       if (re.test(hostname)) { isMedia = true; break; }
//     }
//   }

//   // For non-media hosts we can rotate UA and add mild headers; for media preserve important headers
//   if (!isMedia) {
//     if (!hdrs['cache-control']) hdrs['cache-control'] = 'no-cache';
//     hdrs['user-agent'] = this.getRandomUserAgent();
//     hdrs['x-forwarded-for'] = this.getRandomIP();
//   } else {
//     // For media/CDN: preserve UA (if provided), do not force cache control or x-forwarded-for
//     hdrs['user-agent'] = hdrs['user-agent'] || hdrs['User-Agent'] || this.getRandomUserAgent();
//     delete hdrs['cache-control'];
//     delete hdrs['x-forwarded-for'];
//   }

//   // Do NOT strip Range and conditional headers — they are critical for streaming
//   // e.g. 'range', 'if-range', 'if-none-match', 'if-modified-since'

//   return hdrs;
// }


//   // Remove hop-by-hop headers from responses (per RFC2616/7230)
//   sanitizeResponseHeaders(headers) {
//     const sanitized = { ...headers };
//     const hopByHop = ['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers','transfer-encoding','upgrade'];
//     hopByHop.forEach(h => delete sanitized[h]);
//     // don't modify cookies or other important headers here
//     return sanitized;
//   }

//   logRequest(reqLike, type = 'HTTP') {
//     const timestamp = new Date().toLocaleTimeString();
//     const requestId = crypto.randomBytes(4).toString('hex');
//     const u = reqLike.url || reqLike.url === '' ? reqLike.url : (reqLike.path || '-');
//     console.log(`\n🕵️‍♂️ [${timestamp}] ${type} Request #${requestId}`);
//     console.log(`   🔗 ${reqLike.method || 'CONNECT'} ${String(u).substring(0, 120)}${String(u).length > 120 ? '...' : ''}`);
//     console.log(`   👤 Agent: ${reqLike.headers && (reqLike.headers['user-agent'] || reqLike.headers['User-Agent']) || 'Unknown'}`);
//     console.log(`   🏠 Host: ${reqLike.headers && (reqLike.headers.host || reqLike.headers.Host) || 'Unknown'}`);
//     return requestId;
//   }

//   createHttpServer() {
//     const server = http.createServer((req, res) => {
//       const requestId = this.logRequest(req, 'HTTP');
//       this.connectionPool.set(requestId, { req, res, startTime: Date.now() });
//       console.log('   ' + this.getRandomFunnyMessage());

//       // Determine hostname/port and path robustly
//       let targetHostname;
//       let targetPort;
//       let targetPath;

//       // If request comes in using absolute URL (happens in proxy mode), parse it
//       if (/^https?:\/\//i.test(req.url)) {
//         try {
//           const parsed = new url.URL(req.url);
//           targetHostname = parsed.hostname;
//           targetPort = parsed.port || (parsed.protocol === 'https:' ? 443 : 80);
//           targetPath = parsed.pathname + parsed.search;
//         } catch (e) {
//           targetHostname = req.headers.host && req.headers.host.split(':')[0];
//           targetPort = req.headers.host && req.headers.host.split(':')[1] || 80;
//           targetPath = req.url;
//         }
//       } else {
//         // normal: req.url is a path. Use Host header to get hostname.
//         const hostHeader = req.headers.host || 'example.com';
//         const [hostPart, portPart] = hostHeader.split(':');
//         targetHostname = hostPart;
//         targetPort = portPart || 80;
//         targetPath = req.url;
//       }

//       // Build options and obfuscate request headers only
//       // const options = {
//       //   hostname: targetHostname,
//       //   port: targetPort,
//       //   path: this.obfuscateUrl(targetPath),
//       //   method: req.method,
//       //   headers: this.obfuscateRequestHeaders(req.headers),
//       // };
      

//       // const proxyReq = http.request(options, (proxyRes) => {
//       //   // sanitize response headers and add a proxy header (but keep cookies)
//       //   const responseHeaders = this.sanitizeResponseHeaders(proxyRes.headers);
//       //   responseHeaders['X-Proxy-Message'] = this.getRandomFunnyMessage().replace(/[^\x20-\x7E]/g, '');
//       //   if (!res.headersSent) {
//       //     res.writeHead(proxyRes.statusCode, responseHeaders);
//       //   }
//       //   proxyRes.pipe(res);
//       //   const conn = this.connectionPool.get(requestId);
//       //   const duration = conn ? Date.now() - conn.startTime : -1;
//       //   console.log(`   ✅ Response: ${proxyRes.statusCode} | Duration: ${duration}ms`);
//       //   this.connectionPool.delete(requestId);
//       // });
//       // Determine request path and headers using hostname-aware helpers
// const obfPath = this.obfuscateUrl(targetPath, targetHostname);
// const obfHeaders = this.obfuscateRequestHeaders(req.headers || {}, targetHostname);

// // Choose agent & request function depending on port (443 -> https)
// const isTls = String(targetPort) === '443';
// const requestLib = isTls ? https : http;
// const agent = isTls ? this.httpsAgent : this.httpAgent;

// const options = {
//   hostname: targetHostname,
//   port: targetPort,
//   path: obfPath,
//   method: req.method,
//   headers: obfHeaders,
//   agent
// };

// // create proxy request using appropriate library
// const proxyReq = requestLib.request(options, (proxyRes) => {
//   // sanitize response headers and add a proxy header (but keep cookies)
//   const responseHeaders = this.sanitizeResponseHeaders(proxyRes.headers);
//   responseHeaders['X-Proxy-Message'] = this.getRandomFunnyMessage().replace(/[^\x20-\x7E]/g, '');
//   if (!res.headersSent) {
//     res.writeHead(proxyRes.statusCode, responseHeaders);
//   }

//   // Log streaming-related statuses for debugging
//   if (proxyRes.statusCode >= 400 || (proxyRes.statusCode !== 206 && ![200].includes(proxyRes.statusCode))) {
//     console.log(`   ⚠️ upstream status ${proxyRes.statusCode} ${proxyRes.statusMessage} for ${targetHostname}${targetPath}`);
//   }

//   proxyRes.pipe(res);
//   const conn = this.connectionPool.get(requestId);
//   const duration = conn ? Date.now() - conn.startTime : -1;
//   console.log(`   ✅ Response: ${proxyRes.statusCode} | Duration: ${duration}ms`);
//   this.connectionPool.delete(requestId);
// });


//       proxyReq.on('error', (err) => {
//         console.error(`   ❌ Proxy Error: ${err.message}`);
//         if (!res.headersSent) {
//           try {
//             res.writeHead(502, { 'Content-Type': 'text/plain' });
//             res.end('Proxy error occurred: ' + err.message);
//           } catch (e) {}
//         }
//         this.connectionPool.delete(requestId);
//       });

//       req.pipe(proxyReq);
//     });

//     // HTTPS CONNECT (tunnel) - respects true TLS
//     server.on('connect', (req, clientSocket, head) => {
//       const requestId = this.logRequest(req, 'HTTPS');
//       const [host, port] = req.url.split(':');
//       const targetPort = parseInt(port, 10) || 443;

//       const serverSocket = net.connect(targetPort, host, () => {
//         clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
//         // If 'head' contains data, forward it.
//         if (head && head.length) serverSocket.write(head);
//         clientSocket.pipe(serverSocket);
//         serverSocket.pipe(clientSocket);
//       });

//       serverSocket.on('error', (err) => {
//         console.error(`   ❌ HTTPS Error: ${err.message}`);
//         try { clientSocket.end(); } catch (e) {}
//         this.connectionPool.delete(requestId);
//       });

//       clientSocket.on('error', (err) => {
//         console.error(`   ❌ Client Error: ${err.message}`);
//         try { serverSocket.end(); } catch (e) {}
//         this.connectionPool.delete(requestId);
//       });
//     });

//     return server;
//   }

//   start() {
//     if (this.useMitm) {
//       // MITM mode — must have CA installed in client for TLS to work.
//       this.mitmProxy.onRequest((ctx, callback) => {
//         // obfuscate request headers (ctx.clientToProxyRequest.headers)
//         ctx.clientToProxyRequest.headers = this.obfuscateRequestHeaders(ctx.clientToProxyRequest.headers || {});
//         ctx.clientToProxyResponseHeader = ctx.clientToProxyResponseHeader || {};
//         ctx.clientToProxyResponseHeader['X-Proxy-Message'] = this.getRandomFunnyMessage();
//         this.logRequest(ctx.clientToProxyRequest, ctx.isSSL ? 'HTTPS MITM' : 'HTTP MITM');
//         return callback();
//       });

//       this.mitmProxy.listen({ port: this.port }, () => {
//         console.log(`🚀 MITM Proxy running at ${this.host}:${this.port}`);
//       });
//       // after server.listen(...)
// console.log('Proxy started — running initial self-check...');
// this.selfCheck(); // single immediate check

// // optional: periodic check every N ms (be conservative, e.g. every 5-10 minutes)
// this._selfCheckInterval = setInterval(() => this.selfCheck(), 1000 * 60 * 5);
//     } else {
//       const server = this.createHttpServer();
//       server.listen(this.port, this.host, () => {
//         console.log(`🚀 Advanced Stealth Proxy (tunnel mode) running at ${this.host}:${this.port}`);
//       });
//       // after server.listen(...)
// console.log('Proxy started — running initial self-check...');
// this.selfCheck(); // single immediate check

// // optional: periodic check every N ms (be conservative, e.g. every 5-10 minutes)
// this._selfCheckInterval = setInterval(() => this.selfCheck(), 1000 * 60 * 5);
//     }

//     process.on('SIGINT', () => {
//          clearInterval(this._selfCheckInterval);
//       console.log('\n🛑 Shutting down proxy...');
//       this.connectionPool.forEach((conn, id) => { try { if (conn.res && !conn.res.headersSent) conn.res.end('Proxy shutting down'); } catch (e) {} });
//       process.exit(0);
//     });
//   }
// }

// // Start
// const proxy = new AdvancedStealthProxy();
// proxy.start();

// module.exports = AdvancedStealthProxy;
// // advanced-stealth-proxy.js

