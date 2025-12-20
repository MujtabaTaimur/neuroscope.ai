const http = require('http');
const https = require('https');
const crypto = require('crypto');

const PORT = 3000;

// Optional (only required for /api/chat)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Username/password auth
const NS_AUTH_SECRET = process.env.NS_AUTH_SECRET;
const NS_ADMIN_USERNAME = process.env.NS_ADMIN_USERNAME;
const NS_ADMIN_PASSWORD = process.env.NS_ADMIN_PASSWORD;

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = s + '='.repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}

function signJwt(payload, secret, expiresInSeconds = 60 * 60 * 24) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const h = base64UrlEncode(JSON.stringify(header));
  const p = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${h}.${p}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest();
  return `${data}.${base64UrlEncode(sig)}`;
}

function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [h, p, s] = parts;
  const data = `${h}.${p}`;
  const expected = crypto.createHmac('sha256', secret).update(data).digest();
  const got = base64UrlDecode(s);

  if (got.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(got, expected)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(p).toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function isAuthConfigured() {
  return Boolean(NS_AUTH_SECRET && NS_ADMIN_USERNAME && NS_ADMIN_PASSWORD);
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function getBearerToken(req) {
  const h = req.headers.authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/login') {
    if (!isAuthConfigured()) {
      return sendJson(res, 501, {
        error: 'Auth is not configured on the server. Set NS_AUTH_SECRET, NS_ADMIN_USERNAME, NS_ADMIN_PASSWORD.'
      });
    }

    readJsonBody(req)
      .then((data) => {
        const username = String(data.username || '').trim();
        const password = String(data.password || '');

        if (!username || !password) {
          return sendJson(res, 400, { error: 'Username and password are required.' });
        }

        const okUser = username === NS_ADMIN_USERNAME;
        const given = Buffer.from(password);
        const expected = Buffer.from(NS_ADMIN_PASSWORD);
        const okPass = given.length === expected.length && crypto.timingSafeEqual(given, expected);

        if (!okUser || !okPass) {
          return sendJson(res, 401, { error: 'Invalid credentials.' });
        }

        const user = { username, role: 'admin' };
        const token = signJwt({ sub: username, role: 'admin' }, NS_AUTH_SECRET, 60 * 60 * 24);
        return sendJson(res, 200, { token, user });
      })
      .catch(() => sendJson(res, 400, { error: 'Invalid JSON' }));

    return;
  }

  if (req.method === 'GET' && req.url === '/api/me') {
    if (!isAuthConfigured()) {
      return sendJson(res, 501, {
        error: 'Auth is not configured on the server. Set NS_AUTH_SECRET, NS_ADMIN_USERNAME, NS_ADMIN_PASSWORD.'
      });
    }

    const token = getBearerToken(req);
    const payload = token ? verifyJwt(token, NS_AUTH_SECRET) : null;
    if (!payload) {
      return sendJson(res, 401, { error: 'Unauthorized' });
    }

    return sendJson(res, 200, { user: { username: payload.sub, role: payload.role || '' } });
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    if (!GEMINI_API_KEY) {
      return sendJson(res, 501, { error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        console.log('Received request:', JSON.stringify(requestData, null, 2));

        // Convert OpenAI format to Gemini format
        // Combine system message with first user message
        const systemMsg = requestData.messages.find(m => m.role === 'system');
        const userMessages = requestData.messages.filter(m => m.role !== 'system');
        
        const contents = userMessages.map((msg, idx) => {
          let text = msg.content;
          // Prepend system message to first user message
          if (idx === 0 && systemMsg && msg.role === 'user') {
            text = `${systemMsg.content}\n\nUser: ${text}`;
          }
          return {
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text }]
          };
        });

        const geminiRequest = {
          contents,
          generationConfig: {
            temperature: requestData.temperature || 0.7,
            maxOutputTokens: requestData.max_tokens || 2048,
            topP: requestData.top_p || 0.95
          }
        };

        console.log('Sending to Gemini:', JSON.stringify(geminiRequest, null, 2));
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
            console.log('Gemini response:', data);
            try {
              const geminiResponse = JSON.parse(data);
              console.log('Parsed Gemini response:', JSON.stringify(geminiResponse, null, 2));
              
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

              console.log('Sending OpenAI format:', JSON.stringify(openAIResponse, null, 2));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(openAIResponse));
            } catch (error) {
              console.error('Response conversion error:', error);
              console.error('Raw data:', data);
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
  console.log(`NeuroScope Server running on http://localhost:${PORT}`);
  if (GEMINI_API_KEY) {
    console.log('Chat proxy: enabled');
  } else {
    console.log('Chat proxy: disabled (set GEMINI_API_KEY to enable)');
  }

  if (isAuthConfigured()) {
    console.log('Auth: enabled');
  } else {
    console.log('Auth: disabled (set NS_AUTH_SECRET, NS_ADMIN_USERNAME, NS_ADMIN_PASSWORD to enable)');
  }
});
