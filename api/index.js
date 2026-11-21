import { handleApiRequest } from '../server/apiRouter.js';

export default async function handler(req, res) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const parsedUrl = new URL(req.url, `${proto}://${host}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    await handleApiRequest(req, res, pathname, parsedUrl.searchParams);
  } catch (err) {
    console.error('API Error in Vercel handler:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
    }
  }
}
