<p align="center">
  <img src="assets/devnotes-logo.svg" alt="devnotes logo" width="180">
</p>

<p align="center">
  <strong>devnotes</strong>
</p>

<h1 align="center">Kişisel Programlama Notları Kitaplığı</h1>

<p align="center">
  Java, JavaScript, Python, SQL ve MongoDB notları tek yerde. Markdown odaklı, hızlı aranabilir, CLI ve web arayüzü ile gezilebilir.
</p>

<p align="center">
  <strong>Sıfır bağımlılık</strong>
  &nbsp;·&nbsp;
  <strong>İnteraktif TUI</strong>
  &nbsp;·&nbsp;
  <strong>Tarayıcı tabanlı okuyucu</strong>
</p>

---

## Genel Bakış

devnotes, kişisel çalışma notlarını düzenli bir kitaplık halinde toplar. Her not Markdown formatındadır; istersen terminalden ara, istersen tarayıcıdan oku, istersen editörde aç.

## Hızlı Bakış

| Alan       | İçerik                                               |
| ---------- | ---------------------------------------------------- |
| Java       | Lombok, JPA / Hibernate, Spring Boot                 |
| JavaScript | Array metodları, closure, currying, async, regex     |
| Python     | Temel konular, ileri teknikler, veritabanı işlemleri |
| SQL        | Temel sorgular, ileri SQL, psql terminal kullanımı   |
| MongoDB    | Temel CRUD ve sorgulama                              |

## Kullanım

Node.js kurulu olması yeterlidir; harici paket gerekmez.

### Tüm notları listele

```bash
node library/cli.js
```

### Kategoriye göre filtrele

```bash
node library/cli.js list --cat java
node library/cli.js list --cat py --search temel
```

### Arama yap

```bash
node library/cli.js search hibernate
```

### Notu editörde aç

```bash
node library/cli.js open 3
```

### İnteraktif TUI

```bash
node library/cli.js open --tui
```

TUI içinde:

| Tuş       | Eylem         |
| --------- | ------------- |
| ↑ / ↓     | Gezin         |
| Enter     | Seç / aç      |
| e         | Editörde aç   |
| b         | Tarayıcıda aç |
| Backspace | Geri          |
| q         | Çık           |

### Web arayüzünü aç

```bash
node library/cli.js open --editor
```

Bu komut yerel bir HTTP sunucusu başlatır ve kitaplık arayüzünü varsayılan tarayıcıda açar.

### Tek notu tarayıcıda aç

```bash
node library/cli.js open --browser 6
```

Seçilen notu renklendirilmiş Markdown olarak tarayıcıda gösterir.

## Web UI

`library/index.html` dosyası üzerinden çalışan basit bir arayüz vardır.

- Kategori filtreleme
- Anlık arama
- Kart üzerinden not detayını görme

## Gereksinimler

- [Node.js](https://nodejs.org) 18 veya üzeri

## Kurulum

```bash
git clone https://github.com/burakboduroglu/programming_notes.git
cd programming_notes
node library/cli.js
```

## Proje Yapısı

```text
dev-notes/
  Java-Notes/
    lombok.md
    jpa_hibernate.md
    spring_boot_framework.md
  Javascript-Notes/
    javascirpt_array_methods.md
    closures_currying_compose.md
    async_js.md
    regex_part_1.md
  Python-Notes/
    python_basic_1.md  …  python_basic_3.md
    advanced_python_1.md  advanced_python_2.md
    python_db_process.md
  SQL-Notes/
    sql_basic_1.md  sql_basic_2.md
    sql_advanced_1.md
    psql_on_terminal.md
  MongoDB-Notes/
    mongodb_basic_1.md
  library/
    index.html          Web UI
    cli.js              CLI aracı
    README.md           Kitaplık giriş noktası
```

## Lisans

MIT. Ayrıntılar için [LICENSE](LICENSE.md) dosyasına bakın.

---

<p align="center">Burak Boduroğlu</p>
