# AGENTS.md

> Bu repoda çalışan AI ajanları (Claude Code, Copilot, Cursor vb.) için rehber.
> Herhangi bir değişiklik yapmadan önce bu dosyayı oku.

---

## Project Summary

**dev-notes** is a personal programming notes library written in Markdown.
Notes are organized by language/topic and accessible via a zero-dependency Node.js CLI and a browser-based Web UI.

- **No build step.** No package manager. Node.js 18+ is the only requirement.
- **Content is king.** The value of this repo is in the `.md` files, not the tooling.
- **CLI entry point:** `library/cli.js`
- **Web UI entry point:** `library/index.html`

---

## Repository Structure

```
dev-notes/
├── Java-Notes/          # Lombok, JPA/Hibernate, Spring Boot
├── Javascript-Notes/    # Array methods, closures, async, regex
├── Python-Notes/        # Basics, advanced topics, DB operations
├── SQL-Notes/           # Basic queries, advanced SQL, psql terminal
├── MongoDB-Notes/       # Basic CRUD and querying
├── library/
│   ├── cli.js           # CLI tool (Node.js, no dependencies)
│   └── index.html       # Web UI (vanilla HTML/JS/CSS)
├── assets/              # Static assets (logo, images)
├── CONTRIBUTING.md
├── LICENSE.md
└── readme.md
```

---

## Adding or Editing Notes

### Naming Convention

| Rule                                         | Example                                  |
| -------------------------------------------- | ---------------------------------------- |
| Lowercase, words separated by `_`            | `python_basic_1.md`                      |
| Suffix with `_1`, `_2` for multi-part series | `sql_advanced_1.md`, `sql_advanced_2.md` |
| Place in the correct category folder         | `Python-Notes/advanced_python_3.md`      |

### Not Dosyası Şablonu

Her yeni not bu yapıyı takip etmelidir:

```markdown
# Konu Başlığı

> Bu notun tek cümlelik Türkçe özeti.

---

## Bölüm 1

İçerik buraya...

## Bölüm 2

İçerik buraya...

---

**Kaynaklar**

- Kaynak veya dokümantasyon linki (varsa)
```

### Not İçeriği Kuralları

- **Dil: Tüm notlar Türkçe yazılmalıdır.** İngilizce kaynaklardan alınan notlara Türkçe açıklama ve özet eklenmelidir. Teknik terimler (variable, function, query vb.) orijinal haliyle kullanılabilir; ancak açıklamalar mutlaka Türkçe olmalıdır.
- **Çeviri notu:** Mevcut İngilizce notlar güncellenirken önce Türkçe karşılık yazılır, ardından teknik içerik korunur.
- **Kod blokları:** Her zaman dil tanımlayıcısı belirt (` ```java `, ` ```python `, vb.).
- **Dış görsel yok:** Not dosyalarına harici resim ekleme. Gerekirse `assets/` altından göreli yol kullan.
- **Odaklı tut:** Dosya başına bir kavram veya birbiriyle ilişkili dar bir konu grubu.
- **Frontmatter yok (YAML/TOML):** CLI yalnızca düz Markdown ayrıştırır.

---

## Working with the CLI (`library/cli.js`)

### What the CLI does

- Reads all `.md` files from the category folders.
- Provides list, search, open (editor / TUI / browser), and help commands.
- Parses file paths to derive category and note name — **folder and file naming directly affects CLI output.**

### Rules when modifying `cli.js`

- Do **not** introduce npm dependencies. Use only Node.js built-in modules.
- Do **not** change the command interface (flags, subcommands) without updating `readme.md`.
- Keep the TUI key bindings consistent with the table in `readme.md`.
- Test every modified command manually before committing:

```bash
node library/cli.js list
node library/cli.js search <keyword>
node library/cli.js open --tui
```

---

## Working with the Web UI (`library/index.html`)

- Single-file, vanilla HTML/CSS/JS. Do **not** split into separate files.
- Do **not** add external CDN dependencies.
- Category filtering and instant search must remain functional after any change.
- Test in a browser by starting the HTTP server:

```bash
node library/cli.js open --editor
```

---

## What Agents Should NOT Do

- Do **not** rename existing category folders (`Java-Notes`, `Python-Notes`, etc.) — the CLI resolves categories from folder names.
- Do **not** add a `package.json` or any dependency management file.
- Do **not** modify `LICENSE.md`.
- Do **not** add auto-generated files or compiled output to the repo.
- Do **not** edit `CONTRIBUTING.md` unless explicitly asked.
- Do **not** create notes outside the established category folders without confirming with the user.

---

## Commit Message Convention

```
<type>(<scope>): <short description>

Types  : add | update | fix | remove | refactor
Scopes : java | javascript | python | sql | mongodb | cli | web-ui | docs
```

**Examples:**

```
add(python): advanced decorators note
fix(cli): search flag not filtering by category
update(docs): add new CLI command to readme
```

---

## Quick Checklist Before Committing

- [ ] Note file follows the naming convention (`lowercase_with_underscores.md`)
- [ ] Note is placed in the correct category folder
- [ ] Code blocks have language identifiers
- [ ] CLI still runs without errors (`node library/cli.js list`)
- [ ] Commit message follows the convention above
- [ ] `readme.md` updated if CLI commands or project structure changed
