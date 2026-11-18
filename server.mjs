import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 3000);

function collectDartFiles(dir, base = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectDartFiles(full, base));
    } else if (entry.name.endsWith('.dart')) {
      results.push(path.relative(base, full).replace(/\\/g, '/'));
    }
  }
  return results.sort();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const dartFiles = ['pubspec.yaml', ...collectDartFiles(path.join(ROOT, 'lib')).map((f) => `lib/${f}`)];
  const requestedFile = url.searchParams.get('file');
  const activeFile = requestedFile && dartFiles.includes(requestedFile) ? requestedFile : 'lib/main.dart';
  const activePath = path.join(ROOT, activeFile);
  const content = fs.existsSync(activePath) ? fs.readFileSync(activePath, 'utf8') : '';

  const linksHtml = dartFiles
    .map((file) => {
      const active = file === activeFile;
      return `<a href="/?file=${encodeURIComponent(file)}" class="file-link ${active ? 'active' : ''}">${escapeHtml(file)}</a>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Onyx Cards — Dart / Flutter</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #000000;
      color: #f8f7f4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      padding: 24px;
    }
    .container { max-width: 1120px; margin: 0 auto; }
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(248, 247, 244, 0.12);
      margin-bottom: 20px;
    }
    h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
    .tag {
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #d4af37;
    }
    .cmd {
      background: #1c1c1f;
      padding: 10px 14px;
      border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 12px;
      color: #f8f7f4;
    }
    .grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 16px;
    }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
    .panel {
      background: #1c1c1f;
      border-radius: 12px;
      padding: 14px;
    }
    .panel-title {
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(248, 247, 244, 0.55);
      margin-bottom: 10px;
    }
    .file-link {
      display: block;
      padding: 8px 10px;
      border-radius: 8px;
      color: rgba(248, 247, 244, 0.78);
      text-decoration: none;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .file-link:hover { background: rgba(255, 255, 255, 0.06); color: #f8f7f4; }
    .file-link.active { background: #f8f7f4; color: #111113; font-weight: 600; }
    pre {
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 12px;
      line-height: 1.55;
      color: #f8f7f4;
      max-height: 75vh;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <div class="tag">Dart / Flutter Codebase</div>
        <h1>Onyx Cards</h1>
      </div>
      <div class="cmd">flutter pub get && flutter run</div>
    </header>
    <div class="grid">
      <aside class="panel">
        <div class="panel-title">Project Files (${dartFiles.length})</div>
        ${linksHtml}
      </aside>
      <main class="panel">
        <div class="panel-title">${escapeHtml(activeFile)}</div>
        <pre><code>${escapeHtml(content)}</code></pre>
      </main>
    </div>
  </div>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Onyx Cards Dart project viewer listening on http://0.0.0.0:${PORT}`);
});
