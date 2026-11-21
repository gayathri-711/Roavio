import './server/config/envLoader.js';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/apiRouter.js';
import { connectDB } from './server/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB connection (Atlas or local fallback)
connectDB().catch(e => console.warn(e));

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.join(__dirname, 'dist');
const LEGACY_DIR = path.join(__dirname, 'roavio', 'HTML Template');
const PUBLIC_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : LEGACY_DIR;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let reqPath = decodeURIComponent(parsedUrl.pathname);

    // API Routes Handler for Mobile Ticket Delivery & Notifications
    if (reqPath.startsWith('/api/')) {
      await handleApiRequest(req, res, reqPath, parsedUrl.searchParams);
      return;
    }

    let filePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

    // Security boundary check
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // SPA fallback: if file not found, serve index.html for React Router
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      const spaIndex = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(spaIndex)) {
        filePath = spaIndex;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    if (req.method === 'HEAD') {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes'
      });
      res.end();
      return;
    }

    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✈️ ROAVIO – Discover India. Plan Your Journey. Travel Freely.`);
  console.log(`Modern India Travel Discovery, Planning & Booking Platform`);
  console.log(`======================================================`);
  console.log(`> Public Portal:   http://localhost:${PORT}/`);
  console.log(`> Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`Serving from:      ${PUBLIC_DIR}\n`);
});
