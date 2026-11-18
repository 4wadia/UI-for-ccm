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
  const mode = url.searchParams.get('mode') === 'code' ? 'code' : 'preview';
  const dartFiles = [
    'pubspec.yaml',
    ...collectDartFiles(path.join(ROOT, 'lib')).map((f) => `lib/${f}`),
  ];
  const requestedFile = url.searchParams.get('file');
  const activeFile =
    requestedFile && dartFiles.includes(requestedFile)
      ? requestedFile
      : 'lib/main.dart';
  const activePath = path.join(ROOT, activeFile);
  const content = fs.existsSync(activePath)
    ? fs.readFileSync(activePath, 'utf8')
    : '';

  const linksHtml = dartFiles
    .map((file) => {
      const active = file === activeFile;
      return `<a href="/?mode=code&file=${encodeURIComponent(file)}" class="file-link ${active ? 'active' : ''}">${escapeHtml(file)}</a>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Onyx Cards — Dart / Flutter Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=IBM+Plex+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      --s: 1;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #000000;
      color: #f8f7f4;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background 0.25s ease, color 0.25s ease;
    }
    body.light {
      background: #f8f7f4;
      color: #111113;
    }
    .font-editorial { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .tabular { font-variant-numeric: tabular-nums; }

    /* Top Bar */
    .topbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 24px;
      border-bottom: 1px solid rgba(248, 247, 244, 0.1);
    }
    body.light .topbar { border-bottom-color: rgba(17, 17, 19, 0.1); }
    .brand {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .mode-switch {
      display: inline-flex;
      background: #1c1c1f;
      padding: 4px;
      border-radius: 999px;
      gap: 4px;
    }
    body.light .mode-switch { background: #ffffff; border: 1px solid rgba(17,17,19,0.1); }
    .mode-tab {
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(248,247,244,0.65);
    }
    body.light .mode-tab { color: rgba(17,17,19,0.65); }
    .mode-tab.active { background: #f8f7f4; color: #111113; }
    body.light .mode-tab.active { background: #111113; color: #f8f7f4; }
    .note {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: rgba(248,247,244,0.55);
      letter-spacing: 0.06em;
    }
    body.light .note { color: rgba(17,17,19,0.58); }

    /* Code Explorer */
    .code-wrap {
      max-width: 1120px;
      width: 100%;
      margin: 24px auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 16px;
    }
    @media (max-width: 768px) { .code-wrap { grid-template-columns: 1fr; } }
    .panel { background: #1c1c1f; border-radius: 12px; padding: 14px; }
    .panel-title {
      font-family: 'IBM Plex Mono', monospace;
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
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .file-link:hover { background: rgba(255, 255, 255, 0.06); color: #f8f7f4; }
    .file-link.active { background: #f8f7f4; color: #111113; font-weight: 600; }
    pre {
      overflow-x: auto;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      line-height: 1.55;
      color: #f8f7f4;
      max-height: 75vh;
    }

    /* 6.9" Samsung Galaxy S26 Ultra Frame (19.5:9 · 412x892 logical dp) */
    .stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px 12px;
    }
    .phone-shell {
      height: min(calc(100vh - 84px), 892px);
      min-height: 520px;
      aspect-ratio: 412 / 892;
      width: auto;
      max-width: calc(100vw - 24px);
      border-radius: calc(28px * var(--s));
      padding: calc(7px * var(--s));
      background: linear-gradient(145deg, #27272c, #141418);
      border: 1.5px solid rgba(214, 210, 200, 0.28);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: background 0.25s ease, border-color 0.25s ease;
    }
    body.light .phone-shell {
      background: linear-gradient(145deg, #323238, #1c1c20);
      border-color: rgba(120, 116, 108, 0.45);
    }
    @media (max-width: 520px) {
      .topbar { padding: 10px 14px; }
      .note { display: none; }
      .stage { padding: 0; }
      .phone-shell {
        aspect-ratio: auto;
        width: 100vw;
        max-width: 100vw;
        height: calc(100vh - 54px);
        border-radius: 0;
        padding: 0;
        border: none;
      }
      .phone-screen { border-radius: 0 !important; border: none !important; }
    }
    .phone-screen {
      position: relative;
      flex: 1;
      border-radius: calc(22px * var(--s));
      background: #000000;
      color: #f8f7f4;
      border: 1px solid rgba(248,247,244,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: background 0.25s ease, color 0.25s ease;
    }
    body.light .phone-screen {
      background: #f8f7f4;
      color: #111113;
      border-color: rgba(17,17,19,0.1);
    }
    .status-bar {
      height: calc(36px * var(--s));
      padding: calc(4px * var(--s)) calc(20px * var(--s)) 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(10px * var(--s));
      letter-spacing: 0.1em;
      color: rgba(248,247,244,0.65);
      flex-shrink: 0;
    }
    body.light .status-bar { color: rgba(17,17,19,0.65); }
    .camera-punch {
      width: calc(11px * var(--s));
      height: calc(11px * var(--s));
      border-radius: 999px;
      background: radial-gradient(circle at 38% 38%, #262e42 0%, #09090b 65%);
      border: 1px solid rgba(255,255,255,0.14);
      flex-shrink: 0;
    }
    body.light .camera-punch {
      border-color: rgba(0,0,0,0.22);
    }
    .screen-scroll {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: calc(18px * var(--s)) calc(22px * var(--s)) calc(84px * var(--s));
      scrollbar-width: none;
    }
    .screen-scroll.no-nav {
      padding-bottom: calc(22px * var(--s));
    }
    .screen-scroll::-webkit-scrollbar { display: none; }

    /* Views cross-fade/slide */
    .view { display: none; }
    .view.active {
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;
      animation: view-enter 0.28s var(--ease) forwards;
    }
    @keyframes view-enter {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header row & self-expanding controls */
    .user-row {
      position: relative;
      height: calc(46px * var(--s));
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: calc(16px * var(--s));
    }
    .user-left {
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      gap: calc(12px * var(--s));
      transition: all 0.3s var(--ease);
      transform-origin: left center;
    }
    .user-left.hidden {
      opacity: 0;
      transform: translateX(-8px) scale(0.95);
      pointer-events: none;
    }
    .avatar {
      width: calc(44px * var(--s));
      height: calc(44px * var(--s));
      border-radius: 999px;
      border: 1px solid #d4af37;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(12.5px * var(--s));
      letter-spacing: 0.08em;
      flex-shrink: 0;
    }
    body.light .avatar { border-color: #9a7b1c; }

    .controls {
      position: relative;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      gap: calc(6px * var(--s));
      transition: gap 0.3s var(--ease);
    }
    .controls.searching { gap: 0; }

    /* Self-expanding Search Pill */
    .search-pill {
      height: calc(44px * var(--s));
      width: calc(44px * var(--s));
      max-width: 100%;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: transparent;
      border: 1px solid transparent;
      transition: width 0.32s var(--ease), background 0.25s ease, border-color 0.25s ease, padding 0.32s var(--ease), gap 0.32s var(--ease);
      flex-shrink: 0;
    }
    .search-pill.open {
      width: 100%;
      background: #1c1c1f;
      border-color: rgba(248,247,244,0.14);
      padding: 0 calc(12px * var(--s));
      gap: calc(8px * var(--s));
      justify-content: flex-start;
    }
    body.light .search-pill.open {
      background: #ffffff;
      border-color: rgba(17,17,19,0.15);
    }
    .search-trigger {
      width: calc(44px * var(--s));
      height: calc(44px * var(--s));
      border-radius: 999px;
      border: none;
      background: transparent;
      color: inherit;
      opacity: 0.78;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: width 0.3s var(--ease), color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
    }
    .search-trigger:hover { opacity: 1; background: rgba(255,255,255,0.08); }
    body.light .search-trigger:hover { background: rgba(0,0,0,0.06); }
    .search-pill.open .search-trigger {
      width: calc(22px * var(--s));
      color: #d4af37;
      opacity: 1;
      background: transparent;
    }
    body.light .search-pill.open .search-trigger { color: #9a7b1c; }

    .search-input {
      flex: 1;
      width: 0;
      min-width: 0;
      border: none;
      background: transparent;
      color: inherit;
      font-size: calc(13px * var(--s));
      outline: none;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s var(--ease);
    }
    .search-pill.open .search-input {
      opacity: 1;
      pointer-events: auto;
    }
    .search-close {
      width: 0;
      height: 0;
      border-radius: 999px;
      border: none;
      background: rgba(255,255,255,0.08);
      color: inherit;
      opacity: 0;
      transform: scale(0.5);
      pointer-events: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      transition: all 0.25s var(--ease);
    }
    body.light .search-close { background: rgba(0,0,0,0.06); }
    .search-pill.open .search-close {
      width: calc(26px * var(--s));
      height: calc(26px * var(--s));
      opacity: 0.75;
      transform: scale(1);
      pointer-events: auto;
    }

    /* Collapse helpers for Theme & Bell when Search opens */
    .collapsible-ctrl {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      max-width: calc(110px * var(--s));
      opacity: 1;
      transform: scale(1);
      transition: max-width 0.3s var(--ease), opacity 0.25s var(--ease), transform 0.3s var(--ease);
    }
    .collapsible-ctrl.hidden {
      max-width: 0;
      opacity: 0;
      transform: scale(0.7);
      overflow: hidden;
      pointer-events: none;
    }

    /* Self-expanding Theme Button + Ripple + Rotating Sun/Moon */
    .theme-ripple {
      position: absolute;
      inset: 0;
      border-radius: 999px;
      border: 1px solid rgba(212,175,55,0.65);
      background: rgba(212,175,55,0.16);
      pointer-events: none;
      opacity: 0;
    }
    body.light .theme-ripple {
      border-color: rgba(154,123,28,0.65);
      background: rgba(154,123,28,0.16);
    }
    .theme-ripple.animate {
      animation: expand-ripple 0.52s var(--ease) forwards;
    }
    @keyframes expand-ripple {
      0% { transform: scale(0.75); opacity: 0.7; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    .theme-btn {
      position: relative;
      z-index: 1;
      height: calc(44px * var(--s));
      width: calc(44px * var(--s));
      border-radius: 999px;
      border: none;
      background: transparent;
      color: inherit;
      opacity: 0.78;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      overflow: hidden;
      transition: width 0.32s var(--ease), padding 0.32s var(--ease), gap 0.32s var(--ease), background 0.25s ease, color 0.25s ease, opacity 0.2s ease;
    }
    .theme-btn:hover { opacity: 1; background: rgba(255,255,255,0.08); }
    body.light .theme-btn:hover { background: rgba(0,0,0,0.06); }
    .theme-btn.expanded {
      width: calc(104px * var(--s));
      padding: 0 calc(14px * var(--s));
      gap: calc(6px * var(--s));
      opacity: 1;
      background: #1c1c1f;
      color: #d4af37;
    }
    body.light .theme-btn.expanded { background: #ffffff; color: #9a7b1c; }

    .sun-moon-wrap {
      position: relative;
      width: calc(20px * var(--s));
      height: calc(20px * var(--s));
      flex-shrink: 0;
    }
    .sun-icon, .moon-icon {
      position: absolute;
      inset: 0;
      transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
    }
    /* Dark mode shows Moon; Light mode shows Sun */
    .sun-icon { opacity: 0; transform: rotate(90deg) scale(0.5); }
    .moon-icon { opacity: 1; transform: rotate(0deg) scale(1); }
    body.light .sun-icon { opacity: 1; transform: rotate(0deg) scale(1); }
    body.light .moon-icon { opacity: 0; transform: rotate(-90deg) scale(0.5); }

    .theme-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(11px * var(--s));
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-width 0.3s var(--ease), opacity 0.25s var(--ease);
    }
    .theme-btn.expanded .theme-label {
      max-width: calc(48px * var(--s));
      opacity: 1;
    }

    .bell-btn {
      width: calc(44px * var(--s));
      height: calc(44px * var(--s));
      border-radius: 999px;
      border: none;
      background: transparent;
      color: inherit;
      opacity: 0.72;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    }
    .bell-btn:hover { opacity: 1; background: rgba(255,255,255,0.08); }
    body.light .bell-btn:hover { background: rgba(0,0,0,0.06); }
    .bell-btn.open { opacity: 1; color: #d4af37; background: rgba(255,255,255,0.1); }
    body.light .bell-btn.open { color: #9a7b1c; background: rgba(0,0,0,0.06); }

    .bell-popover {
      position: absolute;
      right: calc(16px * var(--s));
      top: calc(56px * var(--s));
      width: calc(248px * var(--s));
      padding: calc(14px * var(--s));
      border-radius: calc(16px * var(--s));
      background: #1c1c1f;
      border: 1px solid rgba(248,247,244,0.14);
      z-index: 40;
      opacity: 0;
      transform: translateY(-6px) scale(0.96);
      pointer-events: none;
      transition: all 0.22s var(--ease);
    }
    body.light .bell-popover { background: #ffffff; border-color: rgba(17,17,19,0.14); }
    .bell-popover.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .icon-svg { width: calc(22px * var(--s)); height: calc(22px * var(--s)); display: block; }

    /* Stat block (~40% of Home screen height) */
    .spend-block {
      min-height: calc(300px * var(--s));
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      padding: calc(24px * var(--s)) 0 calc(20px * var(--s));
      margin-bottom: calc(22px * var(--s));
    }
    .spend-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: calc(8px * var(--s));
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(12px * var(--s));
      text-transform: uppercase;
      letter-spacing: 0.14em;
      opacity: 0.58;
    }
    .spend-value {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: calc(74px * var(--s));
      line-height: 1;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-top: calc(16px * var(--s));
    }
    .progress-track {
      height: calc(6px * var(--s));
      width: 100%;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-top: calc(32px * var(--s));
    }
    body.light .progress-track { background: rgba(0,0,0,0.1); }
    .progress-fill { height: 100%; background: #d4af37; transition: width 0.35s var(--ease); }
    body.light .progress-fill { background: #9a7b1c; }
    .limit-row {
      display: flex;
      justify-content: space-between;
      margin-top: calc(12px * var(--s));
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(11px * var(--s));
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    /* Cards & Boxes */
    .box {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #1c1c1f;
      border-radius: calc(14px * var(--s));
      padding: calc(18px * var(--s)) calc(18px * var(--s));
      transition: background 0.25s ease;
    }
    body.light .box { background: #ffffff; }
    .box-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: calc(10px * var(--s));
    }
    #view-home .box .text-btn { font-size: calc(11.5px * var(--s)); }
    #view-home .box .tx-row { padding: calc(12px * var(--s)) 0; }
    #view-home .box .tx-sub { font-size: calc(11px * var(--s)); margin-top: calc(3px * var(--s)); }
    .text-btn {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.58;
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(10px * var(--s));
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: color 0.2s ease, opacity 0.2s ease;
    }
    .text-btn:hover { opacity: 1; color: #d4af37; }
    body.light .text-btn:hover { color: #9a7b1c; }

    .tx-row {
      width: 100%;
      background: none;
      border: none;
      color: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: calc(13px * var(--s)) 0;
      text-align: left;
      cursor: pointer;
    }
    .tx-sub {
      font-family: 'IBM Plex Mono', monospace;
      font-size: calc(9.5px * var(--s));
      opacity: 0.5;
      margin-top: calc(2px * var(--s));
      display: block;
    }

    /* Animated View All Accordion + Staggered Rows */
    .extra-wrap {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition: grid-template-rows 0.34s var(--ease), opacity 0.3s var(--ease);
    }
    .extra-wrap.open {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .extra-inner { overflow: hidden; }
    .extra-row {
      opacity: 0;
      transform: translateY(-6px);
      transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
    }
    .extra-wrap.open .extra-row {
      opacity: 1;
      transform: translateY(0);
    }

    /* Physical card */
    .phys-card {
      width: 100%;
      aspect-ratio: 1.56 / 1;
      border-radius: calc(14px * var(--s));
      padding: calc(20px * var(--s));
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: transform 0.18s var(--ease);
    }
    .phys-card:hover { transform: translateY(-2px); }

    /* Floating pill nav */
    .floating-nav-wrap {
      position: absolute;
      bottom: calc(14px * var(--s));
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      pointer-events: none;
      z-index: 30;
    }
    .floating-nav {
      pointer-events: auto;
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: calc(216px * var(--s));
      padding: calc(4px * var(--s));
      border-radius: 999px;
      background: #1c1c1f;
      transition: background 0.25s ease;
    }
    body.light .floating-nav { background: #ffffff; }
    .nav-pill {
      position: absolute;
      top: calc(4px * var(--s));
      bottom: calc(4px * var(--s));
      left: calc(4px * var(--s));
      width: calc(50% - calc(4px * var(--s)));
      border-radius: 999px;
      background: #f8f7f4;
      transition: transform 0.32s var(--ease), background 0.25s ease;
    }
    body.light .nav-pill { background: #111113; }
    .floating-nav.cards .nav-pill { transform: translateX(100%); }
    .nav-btn {
      position: relative;
      z-index: 1;
      border: none;
      background: none;
      padding: calc(9px * var(--s)) calc(16px * var(--s));
      font-size: calc(12.5px * var(--s));
      font-weight: 600;
      cursor: pointer;
      color: rgba(248,247,244,0.65);
      transition: color 0.2s ease;
    }
    body.light .nav-btn { color: rgba(17,17,19,0.65); }
    .nav-btn.active { color: #111113; }
    body.light .nav-btn.active { color: #f8f7f4; }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 60;
    }
    .modal-backdrop.open { display: flex; }
    .modal-box {
      width: 100%;
      max-width: 390px;
      background: #1c1c1f;
      color: #f8f7f4;
      border: 1px solid rgba(248,247,244,0.14);
      border-radius: 20px;
      padding: 20px;
    }
    body.light .modal-box {
      background: #f8f7f4;
      color: #111113;
      border-color: rgba(17,17,19,0.15);
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: calc(8px * var(--s)); }
    .stat-box {
      background: #1c1c1f;
      border-radius: calc(14px * var(--s));
      padding: calc(18px * var(--s));
      transition: background 0.25s ease;
    }
    body.light .stat-box { background: #ffffff; }
    .field-label {
      display: block;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.6;
      margin-bottom: 6px;
    }
    .field-input {
      width: 100%;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 12px;
      background: #000000;
      color: #f8f7f4;
      border: 1px solid rgba(248,247,244,0.14);
      outline: none;
    }
    body.light .field-input {
      background: #ffffff;
      color: #111113;
      border-color: rgba(17,17,19,0.15);
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:14px;">
      <span class="brand">Onyx Cards</span>
      <span class="note">6.9″ Galaxy S26 Ultra · Dart / Flutter preview</span>
    </div>
    <div class="mode-switch">
      <a href="/?mode=preview" class="mode-tab ${mode === 'preview' ? 'active' : ''}">UI Preview</a>
      <a href="/?mode=code&file=${encodeURIComponent(activeFile)}" class="mode-tab ${mode === 'code' ? 'active' : ''}">Dart Source (${dartFiles.length})</a>
    </div>
  </div>

  ${
    mode === 'code'
      ? `<div class="code-wrap">
           <aside class="panel">
             <div class="panel-title">Dart / Flutter Files</div>
             ${linksHtml}
           </aside>
           <main class="panel">
             <div class="panel-title">${escapeHtml(activeFile)}</div>
             <pre><code>${escapeHtml(content)}</code></pre>
           </main>
         </div>`
      : `<div class="stage">
           <div class="phone-shell">
             <div id="phone-screen" class="phone-screen">
               <div class="status-bar">
                 <span>9:41</span>
                 <div class="camera-punch" aria-hidden="true"></div>
                 <span>5G</span>
               </div>
               <div id="screen" class="screen-scroll">
                 <!-- Persistent Home View (keeps animations intact!) -->
                 <div id="view-home" class="view active">
                   <div class="user-row">
                     <div id="user-left" class="user-left">
                       <div class="avatar">AS</div>
                       <span style="font-size:calc(16.5px * var(--s));font-weight:500;">Arjun Sharma</span>
                     </div>
                     <div id="controls" class="controls">
                       <div id="search-pill" class="search-pill">
                         <button id="search-btn" class="search-trigger" aria-label="Open search">
                           <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                         </button>
                         <input id="search-input" class="search-input" placeholder="Search merchant, bank..." />
                         <button id="search-close" class="search-close" aria-label="Close search">
                           <svg style="width:calc(14px * var(--s));height:calc(14px * var(--s));" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
                         </button>
                       </div>
                       <div id="theme-ctrl" class="collapsible-ctrl">
                         <span id="theme-ripple" class="theme-ripple"></span>
                         <button id="theme-btn" class="theme-btn" aria-label="Toggle theme">
                           <span class="sun-moon-wrap">
                             <svg class="sun-icon icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
                             <svg class="moon-icon icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
                           </span>
                           <span id="theme-label" class="theme-label">Dark</span>
                         </button>
                       </div>
                       <div id="bell-ctrl" class="collapsible-ctrl">
                         <button id="bell-btn" class="bell-btn" aria-label="Alerts">
                           <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                         </button>
                       </div>
                     </div>
                   </div>

                   <div id="bell-popover" class="bell-popover">
                     <div style="display:flex;justify-content:space-between;padding-bottom:8px;margin-bottom:10px;border-bottom:1px solid rgba(128,128,128,0.2);">
                       <span class="font-mono" style="font-size:calc(10px * var(--s));letter-spacing:0.12em;">PORTFOLIO ALERTS</span>
                       <span class="font-mono" style="font-size:calc(10px * var(--s));color:#d4af37;">Verified</span>
                     </div>
                     <div style="font-size:calc(11px * var(--s));font-weight:500;">RBI Tokenization Active</div>
                     <div id="bell-cards-count" style="font-size:calc(10px * var(--s));opacity:0.6;margin-top:3px;">Credentials verified across 5 Indian banks.</div>
                   </div>

                   <div class="spend-block">
                     <div class="spend-label">
                       <span>Total Month Spend</span>
                       <button id="home-vis-btn" style="background:none;border:none;color:inherit;cursor:pointer;display:flex;align-items:center;" aria-label="Toggle visibility">
                         <svg style="width:calc(17px * var(--s));height:calc(17px * var(--s));" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                       </button>
                     </div>
                     <div id="home-spend-val" class="spend-value tabular"></div>
                     <div class="progress-track"><div id="home-progress-fill" class="progress-fill"></div></div>
                     <div class="limit-row">
                       <span style="opacity:0.55;">Limit Used</span>
                       <span id="home-limit-text" class="tabular"></span>
                     </div>
                   </div>

                   <div class="box">
                     <div class="box-head">
                       <h3 style="font-size:calc(16px * var(--s));font-weight:600;">Recent Activity</h3>
                       <button id="toggle-home-tx" class="text-btn">View all</button>
                     </div>
                     <div id="home-tx-initial"></div>
                     <div id="home-tx-extra-wrap" class="extra-wrap">
                       <div id="home-tx-extra" class="extra-inner"></div>
                     </div>
                   </div>
                 </div>

                 <!-- Cards View -->
                 <div id="view-cards" class="view"></div>

                 <!-- Manage Card View -->
                 <div id="view-manage" class="view"></div>
               </div>

               <div id="floating-nav-wrap" class="floating-nav-wrap">
                 <div id="floating-nav" class="floating-nav">
                   <div class="nav-pill"></div>
                   <button id="tab-home" class="nav-btn active">Home</button>
                   <button id="tab-cards" class="nav-btn">Cards</button>
                 </div>
               </div>
             </div>
           </div>
         </div>
         <div id="modal-root" class="modal-backdrop"></div>`
  }

  <script>
  (function() {
    if (${JSON.stringify(mode)} !== 'preview') return;

    const phoneScreen = document.getElementById('phone-screen');
    const updateDynamicScale = () => {
      if (!phoneScreen) return;
      const w = phoneScreen.clientWidth || window.innerWidth;
      const clamped = Math.min(448, Math.max(280, w));
      const factor = clamped / 390;
      document.documentElement.style.setProperty('--s', factor.toFixed(4));
    };
    updateDynamicScale();
    if (typeof ResizeObserver !== 'undefined' && phoneScreen) {
      new ResizeObserver(updateDynamicScale).observe(phoneScreen);
    } else {
      window.addEventListener('resize', updateDynamicScale);
    }

    const VARIANTS = {
      'HDFC Bank': [
        { name: 'Regalia Gold', brand: 'visa', bg: '#e5d2ad', light: true, accent: '#8a6814' },
        { name: 'Infinia Metal', brand: 'visa', bg: '#15161a', light: false, accent: '#d4af37' },
        { name: 'Millennia', brand: 'mastercard', bg: '#1e355e', light: false },
        { name: 'Diners Club Black', brand: 'diners', bg: '#121316', light: false, accent: '#d4af37' },
        { name: 'Tata Neu Infinity', brand: 'rupay', bg: '#3c1942', light: false, accent: '#e2b874' }
      ],
      'ICICI Bank': [
        { name: 'Amazon Pay', brand: 'visa', bg: '#1f2126', light: false, accent: '#f59e0b' },
        { name: 'Sapphiro', brand: 'mastercard', bg: '#15345c', light: false },
        { name: 'Emeralde Private', brand: 'mastercard', bg: '#14332a', light: false, accent: '#d4af37' },
        { name: 'Coral', brand: 'rupay', bg: '#8a2b2b', light: false }
      ],
      'SBI Card': [
        { name: 'ELITE', brand: 'visa', bg: '#173b70', light: false },
        { name: 'Cashback', brand: 'visa', bg: '#223466', light: false },
        { name: 'AURUM', brand: 'visa', bg: '#261a14', light: false, accent: '#d4af37' }
      ],
      'Axis Bank': [
        { name: 'Atlas', brand: 'visa', bg: '#5e1633', light: false },
        { name: 'Magnus', brand: 'visa', bg: '#381426', light: false, accent: '#d4af37' },
        { name: 'ACE', brand: 'visa', bg: '#1a1d24', light: false }
      ],
      'Kotak Mahindra Bank': [
        { name: 'White Reserve', brand: 'visa', bg: '#f2f2f5', light: true },
        { name: 'Zen Signature', brand: 'visa', bg: '#1c2333', light: false }
      ]
    };

    const state = {
      dark: true,
      tab: 'home',
      selectedCard: null,
      balanceVisible: true,
      showSearch: false,
      searchQuery: '',
      bellOpen: false,
      showAllHome: false,
      showAllManage: false,
      cards: [
        { id: 'c1', bank: 'HDFC Bank', variant: 'Regalia Gold', holder: 'ARJUN SHARMA', last4: '8824', balance: 68450, limit: 400000, brand: 'visa' },
        { id: 'c2', bank: 'ICICI Bank', variant: 'Amazon Pay', holder: 'ARJUN SHARMA', last4: '3192', balance: 38200, limit: 250000, brand: 'rupay' },
        { id: 'c3', bank: 'SBI Card', variant: 'ELITE', holder: 'ARJUN SHARMA', last4: '6048', balance: 42900, limit: 300000, brand: 'mastercard' },
        { id: 'c4', bank: 'Axis Bank', variant: 'Atlas', holder: 'ARJUN SHARMA', last4: '1928', balance: 24150, limit: 350000, brand: 'visa' },
        { id: 'c5', bank: 'Kotak Mahindra Bank', variant: 'White Reserve', holder: 'ARJUN SHARMA', last4: '5521', balance: 11500, limit: 200000, brand: 'rupay' }
      ],
      txs: [
        { id: 't1', title: 'Samuel Lunar', bank: 'HDFC Bank', date: '04.36 PM', amount: 366.5, type: 'expense' },
        { id: 't2', title: 'Anita Wills', bank: 'ICICI Bank', date: '02.20 PM', amount: 551.5, type: 'expense' },
        { id: 't3', title: 'James Mikel', bank: 'Axis Bank', date: '04.36 PM', amount: 31.5, type: 'expense' },
        { id: 't4', title: 'James Mikel', bank: 'HDFC Bank', date: '04.36 PM', amount: 31.5, type: 'expense' },
        { id: 't5', title: 'Apollo Pharmacy Bandra', bank: 'SBI Card', date: 'Oct 19, 2026', amount: 620, type: 'expense' },
        { id: 't6', title: 'Amazon India Prime Shopping', bank: 'ICICI Bank', date: 'Oct 18, 2026', amount: 2499, type: 'expense' },
        { id: 't7', title: 'Uber Premier BKC to Airport', bank: 'Axis Bank', date: 'Oct 17, 2026', amount: 485, type: 'expense' },
        { id: 't8', title: 'BookMyShow PVR IMAX', bank: 'SBI Card', date: 'Oct 16, 2026', amount: 960, type: 'expense' },
        { id: 't9', title: 'Starbucks Reserve Bandra', bank: 'HDFC Bank', date: 'Oct 15, 2026', amount: 720, type: 'expense' },
        { id: 't10', title: 'Cashback Credit / Salary Advance', bank: 'HDFC Bank', date: 'Oct 14, 2026', amount: 25000, type: 'income' }
      ]
    };

    const formatINR = (n, compact) => {
      if (compact) {
        if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\\.00$/, '') + ' Cr';
        if (n >= 100000) return '₹' + (n / 100000).toFixed(2).replace(/\\.00$/, '') + ' L';
      }
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
    };

    const getColor = (card) => {
      const list = VARIANTS[card.bank] || [];
      return list.find((v) => v.name === card.variant) || list[0] || { bg: '#15161a', light: false };
    };

    const brandHtml = (brand) => {
      if (brand === 'rupay') return '<span style="font-size:calc(16px * var(--s));font-weight:700;">RuPay</span>';
      if (brand === 'mastercard') return '<span style="display:inline-flex;"><span style="width:calc(18px * var(--s));height:calc(18px * var(--s));border-radius:99px;background:#eb001b;"></span><span style="width:calc(18px * var(--s));height:calc(18px * var(--s));border-radius:99px;background:#f79e1b;margin-left:calc(-7px * var(--s));"></span></span>';
      if (brand === 'amex') return '<span style="font-size:calc(13.5px * var(--s));font-weight:700;letter-spacing:0.08em;">AMEX</span>';
      if (brand === 'diners') return '<span style="font-size:calc(13.5px * var(--s));font-weight:700;letter-spacing:0.1em;">DINERS</span>';
      return '<span style="font-size:calc(18px * var(--s));font-weight:800;font-style:italic;">VISA</span>';
    };

    const cardMarkup = (card) => {
      const c = getColor(card);
      const ink = c.light ? '#111113' : '#f8f7f4';
      return '<div class="phys-card" data-card-id="' + card.id + '" style="background:' + c.bg + ';color:' + ink + ';">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;">'
        + '<div style="display:flex;align-items:center;gap:calc(8px * var(--s));font-weight:600;">'
        + '<span class="font-editorial" style="font-style:italic;font-size:calc(22px * var(--s));font-weight:700;' + (c.accent ? 'color:' + c.accent : '') + '">O</span>'
        + '<span style="font-size:calc(17px * var(--s));">' + card.bank + '</span></div>'
        + '<span class="font-mono" style="font-size:calc(11px * var(--s));text-transform:uppercase;letter-spacing:0.12em;opacity:0.78;">' + card.variant + '</span>'
        + '</div>'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-end;">'
        + '<div><div style="font-size:calc(14px * var(--s));font-weight:500;">' + card.holder + '</div>'
        + '<div class="font-mono" style="font-size:calc(13px * var(--s));letter-spacing:0.14em;opacity:0.8;margin-top:calc(3px * var(--s));">•••• ' + card.last4 + '</div></div>'
        + brandHtml(card.brand)
        + '</div></div>';
    };

    const renderHomeData = () => {
      const totalSpend = state.cards.reduce((s, c) => s + c.balance, 0);
      const totalLimit = state.cards.reduce((s, c) => s + c.limit, 0);
      const pct = totalLimit ? Math.min(100, Math.round((totalSpend / totalLimit) * 100)) : 0;

      document.getElementById('bell-cards-count').textContent = 'Credentials verified across ' + state.cards.length + ' Indian banks.';
      document.getElementById('home-spend-val').textContent = state.balanceVisible ? formatINR(totalSpend) : '••••••••';
      document.getElementById('home-progress-fill').style.width = pct + '%';
      document.getElementById('home-limit-text').textContent = pct + '% of ' + (state.balanceVisible ? formatINR(totalLimit, true) : '••••');

      const q = state.searchQuery.toLowerCase();
      const filtered = state.txs.filter((t) => !q || t.title.toLowerCase().includes(q) || t.bank.toLowerCase().includes(q));
      const initial = filtered.slice(0, 5);
      const extra = filtered.slice(5);

      const rowHtml = (t, isExtra, idx) => '<button class="tx-row ' + (isExtra ? 'extra-row' : '') + '" style="' + (isExtra ? 'transition-delay:' + (state.showAllHome ? idx * 35 : 0) + 'ms;' : '') + '">'
        + '<div><span style="font-size:calc(15px * var(--s));font-weight:500;">' + t.title + '</span><span class="tx-sub">' + t.bank + ' · ' + t.date + '</span></div>'
        + '<span class="tabular" style="font-size:calc(15px * var(--s));font-weight:600;">' + (t.type === 'income' ? '+' : '-') + (state.balanceVisible ? formatINR(t.amount) : '••••') + '</span>'
        + '</button>';

      document.getElementById('home-tx-initial').innerHTML = filtered.length
        ? initial.map((t) => rowHtml(t, false, 0)).join('')
        : '<div style="padding:20px 0;text-align:center;opacity:0.5;font-size:calc(12px * var(--s));">No matching transactions found.</div>';

      document.getElementById('home-tx-extra').innerHTML = extra.map((t, i) => rowHtml(t, true, i)).join('');
      const toggleBtn = document.getElementById('toggle-home-tx');
      toggleBtn.style.display = extra.length ? 'inline-block' : 'none';
      toggleBtn.textContent = state.showAllHome ? 'Less' : 'View all';
      document.getElementById('home-tx-extra-wrap').classList.toggle('open', state.showAllHome);
    };

    const renderCardsView = () => {
      const view = document.getElementById('view-cards');
      view.innerHTML = ''
        + '<div style="display:flex;justify-content:space-between;align-items:center;padding:calc(12px * var(--s)) 0 calc(6px * var(--s));margin-bottom:calc(28px * var(--s));">'
        + '<div><div class="font-mono" style="font-size:calc(11px * var(--s));opacity:0.55;letter-spacing:0.14em;margin-bottom:calc(4px * var(--s));">' + state.cards.length + ' ACTIVE CARDS</div><h2 class="font-editorial" style="font-size:calc(36px * var(--s));line-height:1.05;font-weight:600;">Your Cards</h2></div>'
        + '<button id="add-card-btn" style="border:none;border-radius:999px;padding:calc(12px * var(--s)) calc(18px * var(--s));font-size:calc(13.5px * var(--s));font-weight:600;cursor:pointer;background:' + (state.dark ? '#d4af37;color:#111113;' : '#111113;color:#f8f7f4;') + '">+ Add Card</button>'
        + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:calc(20px * var(--s));">'
        + state.cards.map(cardMarkup).join('')
        + '</div>';
      view.querySelectorAll('.phys-card').forEach((el) => {
        el.onclick = () => {
          state.selectedCard = state.cards.find((c) => c.id === el.dataset.cardId) || null;
          state.showAllManage = false;
          renderManageView();
          syncShell();
        };
      });
      document.getElementById('add-card-btn').onclick = openIssueModal;
    };

    const renderManageView = () => {
      const view = document.getElementById('view-manage');
      const card = state.selectedCard;
      if (!card) { view.innerHTML = ''; return; }
      const avail = Math.max(0, card.limit - card.balance);
      const cb = Math.round(card.balance * 0.025);
      const initial = state.txs.slice(0, 4);
      const extra = state.txs.slice(4);

      view.innerHTML = ''
        + '<div style="position:relative;display:flex;align-items:center;justify-content:center;min-height:calc(44px * var(--s));margin-bottom:calc(16px * var(--s));">'
        + '<button id="back-btn" style="position:absolute;left:0;width:calc(44px * var(--s));height:calc(44px * var(--s));border-radius:999px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:calc(22px * var(--s));background:' + (state.dark ? 'rgba(255,255,255,0.04)' : '#ffffff') + ';color:inherit;">‹</button>'
        + '<h2 class="font-editorial" style="font-size:calc(26px * var(--s));font-weight:600;">Manage Card</h2></div>'
        + cardMarkup(card)
        + '<div class="grid-2" style="margin-top:calc(16px * var(--s));gap:calc(14px * var(--s));">'
        + '<div class="stat-box" style="padding:calc(18px * var(--s));"><div style="display:flex;justify-content:space-between;align-items:center;min-height:calc(24px * var(--s));"><span class="font-mono" style="font-size:calc(10.5px * var(--s));opacity:0.55;">AVAILABLE</span><button id="manage-vis-btn" style="background:none;border:none;color:inherit;opacity:0.6;cursor:pointer;font-size:calc(15px * var(--s));">' + (state.balanceVisible ? '👁' : '✕') + '</button></div><div class="tabular" style="font-size:calc(20px * var(--s));font-weight:700;margin-top:calc(8px * var(--s));">' + (state.balanceVisible ? formatINR(avail) : '••••••••') + '</div><div class="font-mono tabular" style="font-size:calc(10.5px * var(--s));opacity:0.55;margin-top:calc(4px * var(--s));">of ' + (state.balanceVisible ? formatINR(card.limit, true) : '••••') + '</div></div>'
        + '<div class="stat-box" style="padding:calc(18px * var(--s));"><div style="display:flex;justify-content:space-between;align-items:center;min-height:calc(24px * var(--s));"><span class="font-mono" style="font-size:calc(10.5px * var(--s));opacity:0.55;">PAYMENT DUE</span><span class="font-mono" style="font-size:calc(10.5px * var(--s));font-weight:600;color:' + (state.dark ? '#d4af37' : '#9a7b1c') + ';">1 Oct</span></div><div class="tabular" style="font-size:calc(20px * var(--s));font-weight:700;margin-top:calc(8px * var(--s));">' + formatINR(card.balance) + '</div></div>'
        + '</div>'
        + '<div class="grid-2" style="margin-top:calc(14px * var(--s));gap:calc(14px * var(--s));">'
        + '<div class="stat-box" style="padding:calc(18px * var(--s));"><div class="font-mono" style="font-size:calc(10.5px * var(--s));opacity:0.55;">STATEMENT CASHBACK</div><div class="tabular" style="font-size:calc(20px * var(--s));font-weight:700;margin-top:calc(8px * var(--s));">' + formatINR(cb) + '</div></div>'
        + '<div class="stat-box" style="padding:calc(18px * var(--s));"><div class="font-mono" style="font-size:calc(10.5px * var(--s));opacity:0.55;">TOTAL CASHBACK</div><div class="tabular" style="font-size:calc(20px * var(--s));font-weight:700;margin-top:calc(8px * var(--s));">' + formatINR(Math.round(cb * 8.4)) + '</div></div>'
        + '</div>'
        + '<div class="stat-box" style="flex:1;display:flex;flex-direction:column;margin-top:calc(14px * var(--s));padding:calc(18px * var(--s));"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:calc(8px * var(--s));"><span style="font-size:calc(15.5px * var(--s));font-weight:600;">Recent Transactions</span><button id="toggle-manage-tx" class="text-btn" style="font-size:calc(11.5px * var(--s));">' + (state.showAllManage ? 'Show Less' : 'View All') + '</button></div>'
        + initial.map((t) => '<div class="tx-row" style="padding:calc(11px * var(--s)) 0;"><div><div style="font-size:calc(14.5px * var(--s));font-weight:500;">' + t.title + '</div><span class="tx-sub" style="font-size:calc(11px * var(--s));">' + t.date + '</span></div><span class="tabular" style="font-size:calc(14.5px * var(--s));font-weight:600;">' + (t.type === 'income' ? '+' : '-') + formatINR(t.amount) + '</span></div>').join('')
        + '<div id="manage-tx-extra-wrap" class="extra-wrap' + (state.showAllManage ? ' open' : '') + '"><div class="extra-inner">'
        + extra.map((t, i) => '<div class="tx-row extra-row" style="padding:calc(11px * var(--s)) 0;transition-delay:' + (i * 35) + 'ms;"><div><div style="font-size:calc(14.5px * var(--s));font-weight:500;">' + t.title + '</div><span class="tx-sub" style="font-size:calc(11px * var(--s));">' + t.date + '</span></div><span class="tabular" style="font-size:calc(14.5px * var(--s));font-weight:600;">' + (t.type === 'income' ? '+' : '-') + formatINR(t.amount) + '</span></div>').join('')
        + '</div></div></div>';

      document.getElementById('back-btn').onclick = () => { state.selectedCard = null; syncShell(); };
      document.getElementById('manage-vis-btn').onclick = () => { state.balanceVisible = !state.balanceVisible; renderManageView(); renderHomeData(); };
      document.getElementById('toggle-manage-tx').onclick = () => {
        state.showAllManage = !state.showAllManage;
        document.getElementById('manage-tx-extra-wrap').classList.toggle('open', state.showAllManage);
        document.getElementById('toggle-manage-tx').textContent = state.showAllManage ? 'Show Less' : 'View All';
      };
    };

    const syncShell = () => {
      document.body.classList.toggle('light', !state.dark);
      const navWrap = document.getElementById('floating-nav-wrap');
      const nav = document.getElementById('floating-nav');
      const screenEl = document.getElementById('screen');
      navWrap.style.display = state.selectedCard ? 'none' : 'flex';
      if (screenEl) screenEl.classList.toggle('no-nav', Boolean(state.selectedCard));
      nav.classList.toggle('cards', state.tab === 'cards');
      document.getElementById('tab-home').classList.toggle('active', state.tab === 'home');
      document.getElementById('tab-cards').classList.toggle('active', state.tab === 'cards');

      document.getElementById('view-home').classList.toggle('active', !state.selectedCard && state.tab === 'home');
      document.getElementById('view-cards').classList.toggle('active', !state.selectedCard && state.tab === 'cards');
      document.getElementById('view-manage').classList.toggle('active', Boolean(state.selectedCard));
    };

    /* Wire persistent Home Header Animations */
    const userLeft = document.getElementById('user-left');
    const controls = document.getElementById('controls');
    const searchPill = document.getElementById('search-pill');
    const searchInput = document.getElementById('search-input');
    const themeCtrl = document.getElementById('theme-ctrl');
    const bellCtrl = document.getElementById('bell-ctrl');
    const themeBtn = document.getElementById('theme-btn');
    const themeLabel = document.getElementById('theme-label');
    const themeRipple = document.getElementById('theme-ripple');
    const bellBtn = document.getElementById('bell-btn');
    const bellPopover = document.getElementById('bell-popover');
    let themeTimer = null;

    const setSearchOpen = (open) => {
      state.showSearch = open;
      if (open) { state.bellOpen = false; bellBtn.classList.remove('open'); bellPopover.classList.remove('open'); }
      userLeft.classList.toggle('hidden', open);
      controls.classList.toggle('searching', open);
      searchPill.classList.toggle('open', open);
      themeCtrl.classList.toggle('hidden', open);
      bellCtrl.classList.toggle('hidden', open);
      if (open) {
        setTimeout(() => searchInput.focus(), 200);
      } else {
        state.searchQuery = '';
        searchInput.value = '';
        renderHomeData();
      }
    };

    document.getElementById('search-btn').onclick = () => setSearchOpen(true);
    document.getElementById('search-close').onclick = () => setSearchOpen(false);
    searchInput.oninput = (e) => { state.searchQuery = e.target.value; renderHomeData(); };

    themeBtn.onclick = () => {
      state.dark = !state.dark;
      syncShell();
      if (state.tab === 'cards') renderCardsView();
      if (state.selectedCard) renderManageView();

      themeLabel.textContent = state.dark ? 'Dark' : 'Light';
      themeBtn.classList.add('expanded');
      themeRipple.classList.remove('animate');
      void themeRipple.offsetWidth;
      themeRipple.classList.add('animate');
      clearTimeout(themeTimer);
      themeTimer = setTimeout(() => {
        themeBtn.classList.remove('expanded');
      }, 1300);
    };

    bellBtn.onclick = () => {
      state.bellOpen = !state.bellOpen;
      bellBtn.classList.toggle('open', state.bellOpen);
      bellPopover.classList.toggle('open', state.bellOpen);
    };

    document.getElementById('home-vis-btn').onclick = () => {
      state.balanceVisible = !state.balanceVisible;
      renderHomeData();
    };

    document.getElementById('toggle-home-tx').onclick = () => {
      state.showAllHome = !state.showAllHome;
      document.getElementById('home-tx-extra-wrap').classList.toggle('open', state.showAllHome);
      document.getElementById('toggle-home-tx').textContent = state.showAllHome ? 'Less' : 'View all';
      document.querySelectorAll('#home-tx-extra .extra-row').forEach((row, idx) => {
        row.style.transitionDelay = state.showAllHome ? (idx * 35) + 'ms' : '0ms';
      });
    };

    const openIssueModal = () => {
      const root = document.getElementById('modal-root');
      let bank = 'HDFC Bank';
      let variant = VARIANTS[bank][0].name;
      const paintModal = () => {
        const vObj = VARIANTS[bank].find((x) => x.name === variant) || VARIANTS[bank][0];
        root.className = 'modal-backdrop open';
        root.innerHTML = '<div class="modal-box">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div><div class="font-mono" style="font-size:9px;color:#d4af37;">NEW PORTFOLIO INSTRUMENT</div><h3 class="font-editorial" style="font-size:22px;">Issue Card</h3></div><button id="m-close" style="background:none;border:none;color:inherit;font-size:18px;cursor:pointer;">✕</button></div>'
          + '<div style="border-radius:10px;padding:14px;height:105px;display:flex;flex-direction:column;justify-content:space-between;margin-bottom:14px;background:' + vObj.bg + ';color:' + (vObj.light ? '#111113' : '#f8f7f4') + ';">'
          + '<div style="display:flex;justify-content:space-between;"><strong style="font-size:12px;">' + bank + '</strong><span class="font-mono" style="font-size:9px;opacity:0.75;">' + vObj.name + '</span></div>'
          + '<div style="display:flex;justify-content:space-between;align-items:flex-end;"><span class="font-mono" style="font-size:10px;">•••• 8824</span><span class="font-mono" style="font-size:10px;font-weight:700;">' + vObj.brand.toUpperCase() + '</span></div>'
          + '</div>'
          + '<div class="grid-2" style="margin-bottom:14px;">'
          + '<div><label class="field-label">Issuing Bank</label><select id="m-bank" class="field-input">' + Object.keys(VARIANTS).map((b) => '<option value="' + b + '"' + (b === bank ? ' selected' : '') + '>' + b + '</option>').join('') + '</select></div>'
          + '<div><label class="field-label">Card Variant</label><select id="m-var" class="field-input">' + VARIANTS[bank].map((v) => '<option value="' + v.name + '"' + (v.name === variant ? ' selected' : '') + '>' + v.name + '</option>').join('') + '</select></div>'
          + '</div>'
          + '<button id="m-submit" style="width:100%;border:none;border-radius:999px;padding:12px;font-size:12px;font-weight:600;cursor:pointer;background:' + (state.dark ? '#d4af37;color:#111113;' : '#111113;color:#f8f7f4;') + '">+ Issue Card</button>'
          + '</div>';
        document.getElementById('m-close').onclick = () => { root.className = 'modal-backdrop'; };
        document.getElementById('m-bank').onchange = (e) => { bank = e.target.value; variant = VARIANTS[bank][0].name; paintModal(); };
        document.getElementById('m-var').onchange = (e) => { variant = e.target.value; paintModal(); };
        document.getElementById('m-submit').onclick = () => {
          const vObj = VARIANTS[bank].find((x) => x.name === variant) || VARIANTS[bank][0];
          state.cards.unshift({ id: 'c' + Date.now(), bank, variant: vObj.name, holder: 'ARJUN SHARMA', last4: String(Math.floor(1000 + Math.random() * 9000)), balance: 0, limit: 300000, brand: vObj.brand });
          root.className = 'modal-backdrop';
          renderCardsView();
          renderHomeData();
        };
      };
      paintModal();
    };

    document.getElementById('tab-home').onclick = () => {
      state.selectedCard = null;
      state.tab = 'home';
      renderHomeData();
      syncShell();
    };
    document.getElementById('tab-cards').onclick = () => {
      state.selectedCard = null;
      state.tab = 'cards';
      renderCardsView();
      syncShell();
    };

    renderHomeData();
    renderCardsView();
    syncShell();
  })();
  </script>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Onyx Cards preview listening on http://0.0.0.0:${PORT}`);
});
