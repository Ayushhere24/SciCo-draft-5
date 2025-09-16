// Simple static file server for the built site
// Serves files from ./dist with SPA fallback to index.html
const http = require('http');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5173;
const distDir = path.join(__dirname, 'dist');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  let filePath = path.join(distDir, decodeURIComponent(urlPath));

  // If path ends with '/', look for index.html in that directory
  if (urlPath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Fallback to SPA index.html
    const indexPath = path.join(distDir, 'index.html');
    fs.stat(indexPath, (e2, st2) => {
      if (!e2 && st2.isFile()) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview server running at http://127.0.0.1:${port}`);
});

