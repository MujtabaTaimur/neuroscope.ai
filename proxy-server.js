const http = require('http');
const https = require('https');

const PORT = 3000;
const AIML_API_KEY = 'bf621b3a94994da6a1740b143df279f4';
const AIML_API_URL = 'https://api.aimlapi.com/v1/chat/completions';

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);

        const postData = JSON.stringify(requestData);

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AIML_API_KEY}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const proxyReq = https.request(AIML_API_URL, options, (proxyRes) => {
          let data = '';

          proxyRes.on('data', chunk => {
            data += chunk;
          });

          proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(data);
          });
        });

        proxyReq.on('error', (error) => {
          console.error('Proxy request error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Proxy error', details: error.message }));
        });

        proxyReq.write(postData);
        proxyReq.end();

      } catch (error) {
        console.error('Parse error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 NeuroScope Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding requests to AIML API`);
  console.log(`🔑 API Key configured`);
});
