const http = require('http');
const https = require('https');

const PORT = 3000;
const GEMINI_API_KEY = 'AIzaSyBvsfKBolx_PtXlXVw40cATuymhTu3LXyU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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

        // Convert OpenAI format to Gemini format
        const geminiRequest = {
          contents: requestData.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })).filter(msg => msg.role !== 'system'), // Gemini doesn't use system messages the same way
          generationConfig: {
            temperature: requestData.temperature || 0.7,
            maxOutputTokens: requestData.max_tokens || 2048,
            topP: requestData.top_p || 0.95
          }
        };

        const postData = JSON.stringify(geminiRequest);
        const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const proxyReq = https.request(url, options, (proxyRes) => {
          let data = '';

          proxyRes.on('data', chunk => {
            data += chunk;
          });

          proxyRes.on('end', () => {
            try {
              const geminiResponse = JSON.parse(data);
              
              // Convert Gemini response to OpenAI format
              const openAIResponse = {
                choices: [{
                  message: {
                    role: 'assistant',
                    content: geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
                  },
                  finish_reason: 'stop'
                }]
              };

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(openAIResponse));
            } catch (error) {
              console.error('Response conversion error:', error);
              res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
              res.end(data);
            }
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
  console.log(`📡 Forwarding requests to Google Gemini API`);
  console.log(`🔑 API Key configured`);
});
