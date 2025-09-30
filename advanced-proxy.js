const http = require('http');
const httpProxy = require('http-proxy');

class WindowsProxy {
    constructor(port = 8080, host = '127.0.0.1') {
        this.port = port;
        this.host = host;
        this.proxy = httpProxy.createProxyServer({});
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Modify outgoing requests
        this.proxy.on('proxyReq', (proxyReq, req, res, options) => {
            this.modifyHeaders(proxyReq, req);
            this.logRequest(req);
        });

        // Handle errors
        this.proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err.message);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
            }
            res.end(`Proxy Error: ${err.message}`);
        });

        // Log response
        this.proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`Response: ${proxyRes.statusCode} for ${req.url}`);
        });
    }

    modifyHeaders(proxyReq, req) {
        // Common Windows browser user agents
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59'
        ];
        
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        proxyReq.setHeader('User-Agent', randomUserAgent);
        
        // Add other headers to appear more like a regular browser
        proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.5');
        proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
        proxyReq.setHeader('DNT', '1');
        proxyReq.setHeader('Connection', 'keep-alive');
        proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
    }

    logRequest(req) {
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] ${req.method} ${req.url}`);
        console.log(`   From: ${req.socket.remoteAddress}`);
        console.log(`   Headers: ${JSON.stringify(req.headers, null, 2)}`);
    }

    start() {
        const server = http.createServer((req, res) => {
            // Add CORS headers for browser compatibility
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            this.proxy.web(req, res, {
                target: this.getTargetUrl(req),
                changeOrigin: true,
                secure: false,
                timeout: 30000
            });
        });

        server.listen(this.port, this.host, () => {
            console.log(`🚀 Windows Local Proxy Server running on http://${this.host}:${this.port}`);
            console.log('📋 Configure your system/browser to use:');
            console.log(`   Address: ${this.host}`);
            console.log(`   Port: ${this.port}`);
            console.log('⏹️  Press Ctrl+C to stop the server\n');
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down proxy server...');
            server.close(() => {
                console.log('✅ Proxy server stopped.');
                process.exit(0);
            });
        });
    }

    getTargetUrl(req) {
        if (req.url.startsWith('https://')) {
            return req.url;
        } else if (req.headers.host) {
            return `http://${req.headers.host}`;
        } else {
            return 'http://example.com'; // Fallback
        }
    }
}

// Start the proxy
const proxy = new WindowsProxy(8080, '127.0.0.1');
proxy.start();