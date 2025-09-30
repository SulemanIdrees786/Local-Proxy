# Local-Proxy
A configurable Node.js forward/tunnel proxy with user-agent rotation, header obfuscation, media bypass, keep-alive connection pooling, optional MITM mode, and built-in connectivity self-checks — designed for robust, stealthy testing and benign traffic inspection.

# Proxy — README

## Description

This proxy is a lightweight development/testing forward and tunnel proxy that helps with:

* Rotating realistic User-Agent strings to test server behavior across different clients.
* Obfuscating request URLs and headers to reduce fingerprinting and mimic diverse client traffic.
* Preserving streaming-related headers (e.g. `Range`) for media/CDN hosts so video/audio requests still work.
* Supporting HTTP `CONNECT` tunneling for end-to-end TLS (the proxy does not decrypt TLS when used as a tunnel).
* Offering an optional MITM mode (only for controlled environments) that can decrypt HTTPS traffic for debugging if you install the proxy's CA.

## Why use this proxy?

Use this proxy when you need a simple, configurable tool to:

* Test how servers behave with different User-Agent values and varied headers.
* Simulate requests from multiple clients or IPs (adds randomized `X-Forwarded-For` entries) without changing client devices.
* Debug request/response flows while preserving streaming behavior for media.
* Run controlled TLS inspection (MITM) for debugging when you *own* the environment and have installed the CA.

It is intended for development, QA, and debugging — not for evading access controls or performing unauthorized interception.

## How it affects packet readers / network capture tools

* **When used as a plain HTTP proxy (requests sent via proxy HTTP):** packet readers on the network between client and proxy will see normal HTTP requests that the proxy forwards (with modified headers and possibly an added `_r` query parameter). The proxy rotates User-Agent, adds or removes headers, and can inject an `X-Proxy-Message` response header. These modifications are visible in cleartext to any network observer between the client and the proxy.

* **When using HTTPS with `CONNECT` (tunneling):** the proxy opens a TCP tunnel and forwards encrypted TLS traffic without decrypting it. Packet readers on the path will only see encrypted TLS payloads (they cannot inspect HTTP headers or body). The proxy will not change the encrypted payload in this mode.

* **When MITM mode is enabled:** the proxy actively terminates TLS and re-encrypts traffic to the client using a locally generated certificate. This allows the proxy (and someone with access to the proxy host) to inspect HTTP headers and body content. Packet readers will see decrypted content between client and proxy only if the client's trust store has the proxy's CA installed — otherwise the client will reject the connection.

* **Header & fingerprint effects:** rotating User-Agent and randomized `X-Forwarded-For` change the observable HTTP fingerprints of requests. Simple packet readers logging HTTP headers will record these altered headers; deeper network analyzers capturing TLS traffic without the CA cannot see those header changes.

## Installation

```bash
# clone the repo
git clone https://github.com/yourname/my-local-proxy.git
cd my-local-proxy

# install dependencies
npm install
```

## Usage

```bash
# start the proxy
node proxy.js

# or use npm script (if added in package.json)
npm run start
```

## Development

```bash
# run with auto-restart (if nodemon installed)
npx nodemon proxy.js
```

## Debugging

```bash
# run with debugger
node --inspect proxy.js
```

## Test proxy

```bash
curl -x http://127.0.0.1:8080 https://example.com/
```

## Notes

* Main entry file: `proxy.js`
* Dependencies are managed via `package.json`
* Do not enable MITM mode on networks you do not control. Use responsibly and ethically.
