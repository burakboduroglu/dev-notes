#!/usr/bin/env node
/**
 * devnotes CLI v2
 *
 * Komutlar:
 *   list [--cat <cat>] [--search <q>]   Notları listele / filtrele
 *   open <id>                           Notu varsayılan editörde aç
 *   open --tui                          Interaktif TUI (ok tuşu + Enter)
 *   open --editor                       Kitaplık UI'ını tarayıcıda aç
 *   open --browser <id>                 Tek notu tarayıcıda render et
 *   search <q>                          Kısayol: list --search <q>
 *   help                                Yardım
 *
 * Flag'ler (list komutu):
 *   --cat    java | js | py | sql | mongo
 *   --search Başlık/açıklama arama
 */
"use strict";

const path     = require("path");
const fs       = require("fs");
const os       = require("os");
const { execSync } = require("child_process");
const readline = require("readline");

// ─────────────────────────────────────────────────────────────────────────────
// ANSI renk yardımcıları
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  reverse: "\x1b[7m",
  cyan:    "\x1b[36m",
  yellow:  "\x1b[33m",
  green:   "\x1b[32m",
  blue:    "\x1b[34m",
  magenta: "\x1b[35m",
  red:     "\x1b[31m",
  white:   "\x1b[37m",
  bgBlue:  "\x1b[44m",
  bgCyan:  "\x1b[46m",
};
const c  = (col, s) => `${C[col] || ""}${s}${C.reset}`;
const cb = (col, s) => `${C.bold}${C[col] || ""}${s}${C.reset}`;

// ─────────────────────────────────────────────────────────────────────────────
// Katalog
// ─────────────────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, "..");

const NOTES = [
  { id:  1, cat: "java",  title: "Lombok",               desc: "Lombok anotasyonları ve örnekleri",           file: "Java-Notes/lombok.md" },
  { id:  2, cat: "java",  title: "JPA / Hibernate",      desc: "Hibernate anotasyonları ve ORM örnekleri",    file: "Java-Notes/jpa_hibernate.md" },
  { id:  3, cat: "java",  title: "Spring Boot",          desc: "Spring Boot anotasyonları ve uygulamalar",    file: "Java-Notes/spring_boot_framework.md" },
  { id:  4, cat: "js",    title: "Dizi Metodları",       desc: "map, filter, reduce ve diğer dizi metodları", file: "Javascript-Notes/javascirpt_array_methods.md" },
  { id:  5, cat: "js",    title: "Closure/Curry/Compose",desc: "Fonksiyonel JS kavramları",                   file: "Javascript-Notes/closures_currying_compose.md" },
  { id:  6, cat: "js",    title: "Async JS",             desc: "Fetch API, Promise, async/await",             file: "Javascript-Notes/async_js.md" },
  { id:  7, cat: "js",    title: "Regex (1)",            desc: "Düzenli ifadeler — temel kalıplar",           file: "Javascript-Notes/regex_part_1.md" },
  { id:  8, cat: "py",    title: "Python Temel 1",       desc: "Veri yapıları: list, dict, tuple, set",       file: "Python-Notes/python_basic_1.md" },
  { id:  9, cat: "py",    title: "Python Temel 2",       desc: "Fonksiyonlar, döngüler, koşullar",            file: "Python-Notes/python_basic_2.md" },
  { id: 10, cat: "py",    title: "Python Temel 3",       desc: "Hata yönetimi, dosya işlemleri",              file: "Python-Notes/python_basic_3.md" },
  { id: 11, cat: "py",    title: "Python İleri 1",       desc: "List / dict / set comprehension",             file: "Python-Notes/advanced_python_1.md" },
  { id: 12, cat: "py",    title: "Python İleri 2",       desc: "map, filter, reduce, lambda",                 file: "Python-Notes/advanced_python_2.md" },
  { id: 13, cat: "py",    title: "Python Veritabanı",    desc: "psycopg2, SQLite, veritabanı işlemleri",      file: "Python-Notes/python_db_process.md" },
  { id: 14, cat: "sql",   title: "SQL Temel 1",          desc: "SELECT, INSERT, UPDATE, DELETE",              file: "SQL-Notes/sql_basic_1.md" },
  { id: 15, cat: "sql",   title: "SQL Temel 2",          desc: "WHERE, AND, OR, LIKE, IN, BETWEEN",           file: "SQL-Notes/sql_basic_2.md" },
  { id: 16, cat: "sql",   title: "SQL İleri",            desc: "JOIN, GROUP BY, HAVING, subquery",            file: "SQL-Notes/sql_advanced_1.md" },
  { id: 17, cat: "sql",   title: "psql Terminal",        desc: "PostgreSQL komut satırı kullanımı",           file: "SQL-Notes/psql_on_terminal.md" },
  { id: 18, cat: "mongo", title: "MongoDB Temel 1",      desc: "CRUD işlemleri, sorgular, operatörler",       file: "MongoDB-Notes/mongodb_basic_1.md" },
];

const CAT_COLOR = { java: "yellow", js: "cyan", py: "blue", sql: "magenta", mongo: "green" };
const CAT_LABEL = { java: "Java      ", js: "JavaScript", py: "Python    ", sql: "SQL       ", mongo: "MongoDB   " };
const VALID_CATS = Object.keys(CAT_COLOR);

// ─────────────────────────────────────────────────────────────────────────────
// Flag parser  (--key value  veya  --flag)
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const flags  = {};
  const pos    = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key  = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) { flags[key] = next; i++; }
      else                                { flags[key] = true; }
    } else {
      pos.push(a);
    }
  }
  return { flags, pos };
}

// ─────────────────────────────────────────────────────────────────────────────
// Yazdırma yardımcıları
// ─────────────────────────────────────────────────────────────────────────────
function printNote(n, highlight) {
  const col   = CAT_COLOR[n.cat] || "white";
  const label = c(col, CAT_LABEL[n.cat]);
  const id    = c("dim", `[${String(n.id).padStart(2, "0")}]`);
  const title = highlight
    ? cb("white", n.title)
    : cb("white", n.title);
  console.log(`  ${id} ${label}  ${title}`);
  console.log(`       ${c("dim", n.desc)}`);
  console.log(`       ${c("dim", n.file)}`);
}

function printSectionHeader(text) {
  console.log();
  const line = `── ${text} `;
  process.stdout.write(c("cyan", line));
  console.log(c("dim", "─".repeat(Math.max(0, 52 - line.length))));
}

function printHelp() {
  const B = (s) => cb("cyan", s);
  const D = (s) => c("dim", s);
  console.log(`
${cb("white", "devnotes")} ${D("v2")} — kişisel not kitaplığı CLI
${D("─".repeat(48))}

${cb("white", "KOMUTLAR")}

  ${B("list")} ${D("[--cat <cat>] [--search <q>]")}
      Notları listele. Kategori ve/veya arama ile filtrele.

  ${B("open")} ${D("<id>")}
      Notu varsayılan editörde aç.

  ${B("open --tui")}
      Interaktif TUI: ok tuşlarıyla gezin, Enter ile aç,
      / ile ara, q ile çık.

  ${B("open --editor")}
      Kitaplık web UI'ını (index.html) tarayıcıda aç.

  ${B("open --browser")} ${D("<id>")}
      Seçilen notu tarayıcıda render edilmiş Markdown olarak aç.

  ${B("search")} ${D("<sorgu>")}
      Kısayol: list --search <sorgu>

  ${B("help")}
      Bu yardım ekranı.

${cb("white", "FLAG'LER")}

  ${B("--cat")}    ${D("java | js | py | sql | mongo")}
  ${B("--search")} ${D("Başlık veya açıklamada arama")}

${cb("white", "ÖRNEKLER")}

  ${D("node library/cli.js")}
  ${D("node library/cli.js list --cat java")}
  ${D("node library/cli.js list --cat py --search temel")}
  ${D("node library/cli.js search hibernate")}
  ${D("node library/cli.js open 3")}
  ${D("node library/cli.js open --tui")}
  ${D("node library/cli.js open --editor")}
  ${D("node library/cli.js open --browser 6")}
`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sistem açma yardımcıları
// ─────────────────────────────────────────────────────────────────────────────

/** Yerel dosya yolu açar (editör, dosya gezgini vb.) */
function openWithOS(absPath) {
  try {
    if (process.platform === "win32")       execSync(`start "" "${absPath}"`);
    else if (process.platform === "darwin") execSync(`open "${absPath}"`);
    else                                    execSync(`xdg-open "${absPath}"`);
  } catch {
    console.log(c("yellow", `  Yol: ${absPath}`));
  }
}

/** HTTP/HTTPS URL'yi varsayılan tarayıcıda açar */
function openUrl(url) {
  try {
    if (process.platform === "win32") {
      // Windows: start komutu URL için tırnaksız çalışır
      execSync(`start ${url}`);
    } else if (process.platform === "darwin") {
      execSync(`open "${url}"`);
    } else {
      execSync(`xdg-open "${url}"`);
    }
  } catch {
    console.log(c("yellow", `  URL: ${url}`));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CMD: list
// ─────────────────────────────────────────────────────────────────────────────
function cmdList(flags) {
  const catFilter    = flags.cat    ? String(flags.cat).toLowerCase()    : null;
  const searchFilter = flags.search ? String(flags.search).toLowerCase() : null;

  if (catFilter && !VALID_CATS.includes(catFilter)) {
    console.error(c("red", `  Geçersiz kategori: "${catFilter}"`));
    console.error(c("dim", `  Geçerli: ${VALID_CATS.join(", ")}`));
    process.exit(1);
  }

  let results = NOTES;
  if (catFilter)    results = results.filter(n => n.cat === catFilter);
  if (searchFilter) results = results.filter(n =>
    n.title.toLowerCase().includes(searchFilter) ||
    n.desc.toLowerCase().includes(searchFilter)  ||
    n.file.toLowerCase().includes(searchFilter)
  );

  console.log();
  console.log(cb("white", "  devnotes kitaplığı"));
  if (catFilter || searchFilter) {
    const parts = [];
    if (catFilter)    parts.push(`kategori: ${catFilter}`);
    if (searchFilter) parts.push(`arama: "${searchFilter}"`);
    console.log(c("dim", `  Filtre — ${parts.join("  ·  ")}`));
  }
  console.log(c("dim", "  " + "─".repeat(40)));

  if (results.length === 0) {
    console.log(c("yellow", "\n  Sonuç bulunamadı.\n"));
    return;
  }

  const sections = [...new Set(results.map(n => n.cat))];
  sections.forEach(cat => {
    printSectionHeader(CAT_LABEL[cat].trim());
    results.filter(n => n.cat === cat).forEach(n => printNote(n));
  });

  console.log();
  console.log(c("dim", `  ${results.length} not  ·  açmak için: open <id>  ·  TUI için: open --tui`));
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// CMD: open (varsayılan editör)
// ─────────────────────────────────────────────────────────────────────────────
function cmdOpenId(idArg) {
  const id   = parseInt(idArg, 10);
  const note = NOTES.find(n => n.id === id);
  if (!note) {
    console.error(c("red", `  Not bulunamadı: id=${idArg}`));
    process.exit(1);
  }
  const abs = path.join(ROOT, note.file);
  console.log(c("dim", `  Açılıyor: ${note.title}`));
  openWithOS(abs);
  console.log(c("green", `  ✓ ${note.file}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP server (open --editor ve open --browser için ortak)
// ─────────────────────────────────────────────────────────────────────────────
const http = require("http");
const url  = require("url");

/** Dosya uzantısına göre Content-Type döner */
function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return { ".html":"text/html;charset=utf-8", ".md":"text/plain;charset=utf-8",
           ".css":"text/css", ".js":"application/javascript",
           ".png":"image/png", ".jpg":"image/jpeg", ".svg":"image/svg+xml" }[ext]
         || "application/octet-stream";
}

/**
 * ROOT dizinini serve eden minimal HTTP server başlatır.
 * startPath: tarayıcıda açılacak ilk URL path'i (örn. "/library/index.html")
 * Sunucu Ctrl+C ile kapatılana kadar çalışır.
 */
function startServer(startPath, port) {
  port = port || 7700;

  const server = http.createServer((req, res) => {
    // Sadece GET
    if (req.method !== "GET") { res.writeHead(405); res.end(); return; }

    let reqPath = url.parse(req.url).pathname;
    // Kök isteği → kitaplık ana sayfası
    if (reqPath === "/") reqPath = "/library/index.html";

    // Markdown dosyaları için render sayfasına yönlendir
    if (reqPath.endsWith(".md")) {
      // ?raw=1 ile ham içerik, aksi halde render sayfası
      const qs = url.parse(req.url).query || "";
      if (!qs.includes("raw=1")) {
        // Hangi nota karşılık geliyor?
        const relFile = reqPath.replace(/^\//, "");
        const note    = NOTES.find(n => n.file === relFile);
        if (note) {
          res.writeHead(302, { Location: `/library/note.html?id=${note.id}` });
          res.end();
          return;
        }
      }
    }

    // note.html → dinamik render
    if (reqPath === "/library/note.html") {
      const qs    = url.parse(req.url).query || "";
      const idStr = (qs.match(/id=(\d+)/) || [])[1];
      const note  = NOTES.find(n => n.id === parseInt(idStr, 10));
      if (!note) { res.writeHead(404); res.end("Not bulunamadı"); return; }
      const mdPath = path.join(ROOT, note.file);
      if (!fs.existsSync(mdPath)) { res.writeHead(404); res.end("Dosya yok"); return; }
      const mdContent = fs.readFileSync(mdPath, "utf8");
      const html      = buildNoteHtml(note, mdContent);
      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.end(html);
      return;
    }

    // Statik dosya
    const absPath = path.join(ROOT, reqPath.replace(/^\//, ""));
    if (!fs.existsSync(absPath) || fs.statSync(absPath).isDirectory()) {
      res.writeHead(404);
      res.end(`404 — ${reqPath}`);
      return;
    }
    res.writeHead(200, { "Content-Type": mimeType(absPath) });
    res.end(fs.readFileSync(absPath));
  });

  server.listen(port, "127.0.0.1", () => {
    const targetUrl = `http://localhost:${port}${startPath}`;
    console.log(c("green",  `  ✓ Server başladı → ${targetUrl}`));
    console.log(c("dim",    `  Durdurmak için Ctrl+C`));
    openUrl(targetUrl);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(c("yellow", `  Port ${port} meşgul, ${port + 1} deneniyor…`));
      startServer(startPath, port + 1);
    } else {
      console.error(c("red", `  Server hatası: ${err.message}`));
      process.exit(1);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CMD: open --editor  (kitaplık index.html'i local server üzerinden aç)
// ─────────────────────────────────────────────────────────────────────────────
function cmdOpenEditor() {
  const htmlPath = path.join(__dirname, "index.html");
  if (!fs.existsSync(htmlPath)) {
    console.error(c("red", "  library/index.html bulunamadı."));
    process.exit(1);
  }
  console.log(c("dim", "  HTTP server başlatılıyor…"));
  startServer("/library/index.html");
}

// ─────────────────────────────────────────────────────────────────────────────
// CMD: open --browser <id>  (tek notu geçici HTML olarak render et)
// ─────────────────────────────────────────────────────────────────────────────
function mdToHtml(md) {
  // \r\n → \n normalize et (Windows dosyaları için kritik)
  md = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // ── 1. Fenced kod bloklarını önce çıkar, placeholder koy ──────────────────
  // Sonraki adımlarda içleri bozulmasın diye
  const codeBlocks = [];
  md = md.replace(/^```(\w*)\n([\s\S]*?)^```/gm, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const langClass = lang ? ` class="language-${lang}"` : ' class="language-plaintext"';
    codeBlocks.push(`<pre><code${langClass}>${escaped}</code></pre>`);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  // ── 2. Satır bazlı dönüşümler ─────────────────────────────────────────────
  const lines  = md.split("\n");
  const out    = [];
  let inUl     = false;
  let inOl     = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Placeholder — dokunma
    if (/^\x00CODE\d+\x00$/.test(line.trim())) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (inOl) { out.push("</ol>"); inOl = false; }
      out.push(line.trim());
      continue;
    }

    // Yatay çizgi
    if (/^---+$/.test(line.trim())) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (inOl) { out.push("</ol>"); inOl = false; }
      out.push("<hr>");
      continue;
    }

    // Başlıklar
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (inOl) { out.push("</ol>"); inOl = false; }
      const lvl = hMatch[1].length;
      out.push(`<h${lvl}>${inlineFormat(hMatch[2])}</h${lvl}>`);
      continue;
    }

    // Sırasız liste
    const ulMatch = line.match(/^[\*\-]\s+(.+)$/);
    if (ulMatch) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Numaralı liste
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s*(.*)$/);
    if (bqMatch) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (inOl) { out.push("</ol>"); inOl = false; }
      out.push(`<blockquote>${inlineFormat(bqMatch[1])}</blockquote>`);
      continue;
    }

    // Liste kapama
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }

    // Boş satır
    if (line.trim() === "") {
      out.push("");
      continue;
    }

    // Normal paragraf satırı
    out.push(`<p>${inlineFormat(line)}</p>`);
  }

  if (inUl) out.push("</ul>");
  if (inOl) out.push("</ol>");

  // ── 3. Placeholder'ları geri koy ──────────────────────────────────────────
  let html = out.join("\n");
  html = html.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeBlocks[parseInt(i)]);

  return html;
}

/** Satır içi Markdown formatlaması (bold, italic, inline code, link) */
function inlineFormat(text) {
  return text
    // Inline kod — önce işle, içeriği korumak için
    .replace(/`([^`]+)`/g, (_, code) => {
      const esc = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      return `<code>${esc}</code>`;
    })
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Link
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
}

function buildNoteHtml(note, mdContent) {
  const body     = mdToHtml(mdContent);
  const catColor = { java:"#f89820", js:"#c9b800", py:"#6baed6", sql:"#74b0d4", mongo:"#6fcf60" };
  const tagColor = catColor[note.cat] || "#aaa";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${note.title} — devnotes</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230f1117'/%3E%3Crect x='6' y='8' width='14' height='2' rx='1' fill='%236c8ef5'/%3E%3Crect x='6' y='13' width='20' height='2' rx='1' fill='%234a5568'/%3E%3Crect x='6' y='18' width='16' height='2' rx='1' fill='%234a5568'/%3E%3Ccircle cx='26' cy='24' r='5' fill='%236c8ef5'/%3E%3Ccircle cx='26' cy='24' r='2.5' fill='%230f1117'/%3E%3C/svg%3E" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<style>
  :root{--bg:#0f1117;--surface:#1a1d27;--border:#2e3250;--text:#e2e8f0;--muted:#8892b0;--code:#161b22;--accent:#6c8ef5;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);padding:2rem 1rem;line-height:1.75}
  .wrap{max-width:860px;margin:0 auto}
  nav{display:flex;align-items:center;gap:.75rem;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border)}
  nav a{color:var(--accent);text-decoration:none;font-size:.85rem}
  nav a:hover{text-decoration:underline}
  .tag{font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:4px;text-transform:uppercase;background:${tagColor}22;color:${tagColor};letter-spacing:.5px}
  h1{font-size:1.7rem;margin-bottom:.3rem;line-height:1.2}
  h2{font-size:1.2rem;margin:2.25rem 0 .6rem;color:var(--accent);padding-bottom:.3rem;border-bottom:1px solid var(--border)}
  h3{font-size:1.05rem;margin:1.75rem 0 .4rem;color:#a5b4fc}
  h4,h5,h6{margin:1.25rem 0 .3rem;color:var(--muted)}
  p{margin:.6rem 0;color:var(--text)}
  li{color:var(--text);margin:.3rem 0}
  ul,ol{padding-left:1.6rem;margin:.5rem 0}
  a{color:var(--accent)}
  hr{border:none;border-top:1px solid var(--border);margin:1.75rem 0}
  pre{background:var(--code)!important;border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.4rem;overflow-x:auto;margin:1.1rem 0;font-size:.84rem;line-height:1.6}
  pre code{background:transparent!important;padding:0!important;font-family:'Cascadia Code','Fira Code','Consolas',monospace;font-size:.84rem}
  :not(pre)>code{background:var(--code);color:#e6edf3;padding:.18rem .45rem;border-radius:5px;font-size:.82rem;font-family:'Cascadia Code','Fira Code',monospace;border:1px solid var(--border)}
  strong{color:#fff;font-weight:600}
  em{color:#c9d1d9}
  .meta{font-size:.8rem;color:var(--muted);margin-top:.3rem}
  table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.88rem}
  th{background:var(--surface);color:var(--accent);padding:.5rem .75rem;text-align:left;border:1px solid var(--border)}
  td{padding:.45rem .75rem;border:1px solid var(--border);color:var(--text)}
  tr:nth-child(even) td{background:#ffffff08}
  blockquote{border-left:3px solid var(--accent);padding:.5rem 1rem;margin:1rem 0;color:var(--muted);background:var(--surface);border-radius:0 6px 6px 0}
</style>
</head>
<body>
<div class="wrap">
  <nav>
    <a href="/library/index.html">← Kitaplık</a>
    <span class="tag">${note.cat}</span>
  </nav>
  <h1>${note.title}</h1>
  <p class="meta">${note.desc} &nbsp;·&nbsp; <code>${note.file}</code></p>
  <hr>
  ${body}
</div>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  });
</script>
</body>
</html>`;
}

function cmdOpenBrowser(idArg) {
  const id   = parseInt(idArg, 10);
  const note = NOTES.find(n => n.id === id);
  if (!note) {
    console.error(c("red", `  Not bulunamadı: id=${idArg}`));
    process.exit(1);
  }

  const mdPath = path.join(ROOT, note.file);
  if (!fs.existsSync(mdPath)) {
    console.error(c("red", `  Dosya bulunamadı: ${mdPath}`));
    process.exit(1);
  }

  console.log(c("dim", `  HTTP server başlatılıyor: ${note.title}`));
  startServer(`/library/note.html?id=${note.id}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CMD: open --tui  — 3 ekranlı interaktif TUI
//   Ekran 1: Splash + dil seçimi
//   Ekran 2: Seçilen dilin not listesi
//   Ekran 3: Seçilen notun detayı
// ─────────────────────────────────────────────────────────────────────────────
function cmdTUI() {
  if (!process.stdout.isTTY) {
    console.error(c("red", "  TUI için interaktif terminal gerekli."));
    process.exit(1);
  }

  // ── Sabitler ──────────────────────────────────────────────────────────────
  const CATS = [
    { key: "java",  label: "Java",       icon: "☕", color: "yellow",  desc: "Spring Boot · JPA · Lombok" },
    { key: "js",    label: "JavaScript", icon: "⚡", color: "cyan",    desc: "Async · Closure · Regex · Array" },
    { key: "py",    label: "Python",     icon: "🐍", color: "blue",    desc: "Temel · İleri · Veritabanı" },
    { key: "sql",   label: "SQL",        icon: "🗄", color: "magenta", desc: "Temel · İleri · psql Terminal" },
    { key: "mongo", label: "MongoDB",    icon: "🍃", color: "green",   desc: "CRUD · Sorgular · Operatörler" },
  ];

  const ASCII = [
    "  ██████╗ ███████╗██╗   ██╗    ███╗   ██╗ ██████╗ ████████╗███████╗███████╗",
    "  ██╔══██╗██╔════╝██║   ██║    ████╗  ██║██╔═══██╗╚══██╔══╝██╔════╝██╔════╝",
    "  ██║  ██║█████╗  ██║   ██║    ██╔██╗ ██║██║   ██║   ██║   █████╗  ███████╗",
    "  ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██║╚██╗██║██║   ██║   ██║   ██╔══╝  ╚════██║",
    "  ██████╔╝███████╗ ╚████╔╝     ██║ ╚████║╚██████╔╝   ██║   ███████╗███████║",
    "  ╚═════╝ ╚══════╝  ╚═══╝      ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝",
  ];

  // ── State ─────────────────────────────────────────────────────────────────
  // screen: "lang" | "notes" | "detail"
  let screen     = "lang";
  let langCursor = 0;
  let noteCursor = 0;
  let activeCat  = null;   // seçilen kategori key'i
  let activeNote = null;   // seçilen note objesi

  const W = () => process.stdout.columns || 80;

  // ── readline / raw mode ───────────────────────────────────────────────────
  const rl = readline.createInterface({ input: process.stdin });
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.setRawMode) process.stdin.setRawMode(true);

  function cleanup(msg) {
    if (process.stdin.setRawMode) process.stdin.setRawMode(false);
    rl.close();
    process.stdout.write("\x1b[2J\x1b[H");
    if (msg) process.stdout.write(msg + "\n\n");
  }

  // ── Ortak header ──────────────────────────────────────────────────────────
  function drawHeader() {
    process.stdout.write("\x1b[2J\x1b[H");
    const w = W();
    // ASCII art — sığmıyorsa kısa başlık
    if (w >= 76) {
      ASCII.forEach((line, i) => {
        const colored = i < 2 ? cb("cyan", line) : i < 4 ? c("blue", line) : c("magenta", line);
        process.stdout.write(colored + "\n");
      });
    } else {
      const short = "  DEV-NOTES";
      process.stdout.write("\n" + cb("cyan", short) + "\n");
    }
    process.stdout.write(c("dim", "  kişisel programlama notları kitaplığı") + "\n");
    process.stdout.write(c("dim", "  " + "─".repeat(Math.min(w - 2, 72))) + "\n");
  }

  // ── EKRAN 1: Dil seçimi ───────────────────────────────────────────────────
  function drawLang() {
    drawHeader();
    const w = W();
    process.stdout.write("\n");
    process.stdout.write(cb("white", "  Bir dil / teknoloji seçin:\n"));
    process.stdout.write(c("dim",    "  ↑↓ gezin  Enter seç  q çık\n\n"));

    CATS.forEach((cat, i) => {
      const selected = i === langCursor;
      const col      = cat.color;
      const icon     = cat.icon;
      const count    = NOTES.filter(n => n.cat === cat.key).length;

      if (selected) {
        // Seçili satır — vurgulu kutu
        const label = ` ${icon}  ${cat.label.padEnd(12)}`;
        const meta  = `${count} not  ·  ${cat.desc}`;
        const line  = `  ▶  ${label}  ${meta}`;
        process.stdout.write(
          "\x1b[7m" + cb(col, `  ▶  ${icon}  `) +
          cb("white", cat.label.padEnd(12)) +
          c("dim", `  ${count} not  ·  ${cat.desc}`) +
          "  \x1b[27m\n"
        );
      } else {
        process.stdout.write(
          c("dim", "     ") +
          c(col, `${icon}  `) +
          cb("white", cat.label.padEnd(12)) +
          c("dim", `  ${count} not  ·  ${cat.desc}`) +
          "\n"
        );
      }
    });

    process.stdout.write("\n");
    process.stdout.write(c("dim", "  " + "─".repeat(Math.min(w - 2, 72))) + "\n");
    process.stdout.write(c("dim", "  open --editor → web UI  ·  open --browser <id> → tarayıcı render\n"));
  }

  // ── EKRAN 2: Not listesi ──────────────────────────────────────────────────
  function drawNotes() {
    drawHeader();
    const cat   = CATS.find(c => c.key === activeCat);
    const notes = NOTES.filter(n => n.cat === activeCat);
    const w     = W();

    process.stdout.write("\n");
    process.stdout.write(
      c(cat.color, `  ${cat.icon}  `) +
      cb("white", cat.label) +
      c("dim", `  —  ${notes.length} not`) +
      "\n"
    );
    process.stdout.write(c("dim", "  ↑↓ gezin  Enter detay  Backspace geri  q çık\n\n"));

    notes.forEach((note, i) => {
      const selected = i === noteCursor;
      const idStr    = String(note.id).padStart(2, "0");

      if (selected) {
        process.stdout.write(
          "\x1b[7m" +
          c("dim",   `  ▶  [${idStr}]  `) +
          cb("white", note.title.padEnd(32)) +
          c("dim",   note.desc) +
          "  \x1b[27m\n"
        );
      } else {
        process.stdout.write(
          c("dim",   `     [${idStr}]  `) +
          cb("white", note.title.padEnd(32)) +
          c("dim",   note.desc) +
          "\n"
        );
      }
    });

    process.stdout.write("\n");
    process.stdout.write(c("dim", "  " + "─".repeat(Math.min(w - 2, 72))) + "\n");
  }

  // ── EKRAN 3: Not detayı ───────────────────────────────────────────────────
  function drawDetail() {
    drawHeader();
    const note = activeNote;
    const cat  = CATS.find(c => c.key === note.cat);
    const w    = W();

    process.stdout.write("\n");
    // Başlık kutusu
    const titleLine = `  ${cat.icon}  ${note.title}`;
    process.stdout.write(cb(cat.color, titleLine) + "\n");
    process.stdout.write(c("dim", `  ${note.desc}`) + "\n");
    process.stdout.write(c("dim", "  " + "─".repeat(Math.min(w - 2, 72))) + "\n\n");

    // Dosya bilgisi
    process.stdout.write(c("dim",   "  Dosya   ") + c("cyan",  note.file) + "\n");
    process.stdout.write(c("dim",   "  ID      ") + c("white", String(note.id)) + "\n");
    process.stdout.write(c("dim",   "  Kategori") + c(cat.color, `  ${cat.icon}  ${cat.label}`) + "\n");

    // Dosya var mı?
    const absPath = path.join(ROOT, note.file);
    const exists  = fs.existsSync(absPath);
    if (exists) {
      const stat    = fs.statSync(absPath);
      const sizeKb  = (stat.size / 1024).toFixed(1);
      const mtime   = stat.mtime.toLocaleDateString("tr-TR");
      process.stdout.write(c("dim",   "  Boyut   ") + c("white", `${sizeKb} KB`) + "\n");
      process.stdout.write(c("dim",   "  Güncell.") + c("white", mtime) + "\n");
    }

    process.stdout.write("\n");
    process.stdout.write(c("dim", "  " + "─".repeat(Math.min(w - 2, 72))) + "\n");
    process.stdout.write(c("dim", "  ") + cb("white", "e") + c("dim", " editörde aç  ") +
                         cb("white", "b") + c("dim", " tarayıcıda aç  ") +
                         cb("white", "Backspace") + c("dim", " geri  ") +
                         cb("white", "q") + c("dim", " çık") + "\n");
  }

  // ── İlk çizim ─────────────────────────────────────────────────────────────
  drawLang();

  // ── Klavye olayları ───────────────────────────────────────────────────────
  process.stdin.on("keypress", (str, key) => {
    const isUp   = key.name === "up"   || (key.ctrl && key.name === "p");
    const isDown = key.name === "down" || (key.ctrl && key.name === "n");
    const isEnter = key.name === "return";
    const isBack  = key.name === "backspace" || key.name === "escape";
    const isQuit  = str === "q" || str === "Q" || (key.ctrl && key.name === "c");

    if (isQuit) {
      cleanup(c("dim", "  devnotes kapatıldı."));
      process.exit(0);
    }

    // ── Dil seçim ekranı ──
    if (screen === "lang") {
      if (isUp)    langCursor = (langCursor - 1 + CATS.length) % CATS.length;
      if (isDown)  langCursor = (langCursor + 1) % CATS.length;
      if (isEnter) {
        activeCat  = CATS[langCursor].key;
        noteCursor = 0;
        screen     = "notes";
        drawNotes();
        return;
      }
      drawLang();
      return;
    }

    // ── Not listesi ekranı ──
    if (screen === "notes") {
      const notes = NOTES.filter(n => n.cat === activeCat);
      if (isUp)   noteCursor = (noteCursor - 1 + notes.length) % notes.length;
      if (isDown) noteCursor = (noteCursor + 1) % notes.length;
      if (isBack) {
        screen = "lang";
        drawLang();
        return;
      }
      if (isEnter) {
        activeNote = notes[noteCursor];
        screen     = "detail";
        drawDetail();
        return;
      }
      drawNotes();
      return;
    }

    // ── Detay ekranı ──
    if (screen === "detail") {
      if (isBack) {
        screen = "notes";
        drawNotes();
        return;
      }
      if (str === "e" || str === "E") {
        cleanup(c("green", `  ✓ Açılıyor: ${activeNote.title}`));
        cmdOpenId(String(activeNote.id));
        return;
      }
      if (str === "b" || str === "B") {
        cleanup(c("green", `  ✓ Tarayıcıda açılıyor: ${activeNote.title}`));
        cmdOpenBrowser(String(activeNote.id));
        return;
      }
      if (isUp) {
        const notes = NOTES.filter(n => n.cat === activeCat);
        const idx   = notes.findIndex(n => n.id === activeNote.id);
        activeNote  = notes[(idx - 1 + notes.length) % notes.length];
        drawDetail();
        return;
      }
      if (isDown) {
        const notes = NOTES.filter(n => n.cat === activeCat);
        const idx   = notes.findIndex(n => n.id === activeNote.id);
        activeNote  = notes[(idx + 1) % notes.length];
        drawDetail();
        return;
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Giriş noktası
// ─────────────────────────────────────────────────────────────────────────────
const rawArgs      = process.argv.slice(2);
const { flags, pos } = parseArgs(rawArgs);
const cmd          = (pos[0] || "list").toLowerCase();

// --help / -h her yerde çalışsın
if (flags.help || flags.h) { printHelp(); process.exit(0); }

switch (cmd) {
  case "list":
    cmdList(flags);
    break;

  case "search":
    if (!pos[1] && !flags.search) {
      console.error(c("red", "  Kullanım: search <sorgu>"));
      process.exit(1);
    }
    cmdList({ ...flags, search: pos[1] || flags.search });
    break;

  case "open": {
    if (flags.tui)     { cmdTUI();                    break; }
    if (flags.editor)  { cmdOpenEditor();             break; }
    if (flags.browser) { cmdOpenBrowser(String(flags.browser)); break; }
    // open <id>
    const idArg = pos[1];
    if (!idArg) {
      console.error(c("red", "  Kullanım: open <id>  veya  open --tui  veya  open --editor"));
      process.exit(1);
    }
    cmdOpenId(idArg);
    break;
  }

  case "help":
  case "--help":
  case "-h":
    printHelp();
    break;

  default:
    console.error(c("red", `  Bilinmeyen komut: "${cmd}"`));
    printHelp();
    process.exit(1);
}
