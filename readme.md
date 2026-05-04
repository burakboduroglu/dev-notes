<p align="center">
  <img src="assets/devnotes-logo.svg" alt="devnotes logo" width="180">
</p>

<p align="center">
  <strong>Kişisel Programlama Notları Kitaplığı</strong>
</p>

<h1 align="center">devnote</h1>

<p align="center">
  Kişisel programlama notları kitaplığı. Java, JavaScript, Python, SQL ve MongoDB notlarını tek yerde toplar; CLI, TUI ve web arayüzü ile hızlıca gezilir.
</p>

<p align="center">
  <a href="#genel-bakış">Genel Bakış</a>
  &nbsp;·&nbsp;
  <a href="#hızlı-görünüm">Hızlı Görünüm</a>
  &nbsp;·&nbsp;
  <a href="#kullanım">Kullanım</a>
  &nbsp;·&nbsp;
  <a href="#web-ui">Web UI</a>
  &nbsp;·&nbsp;
  <a href="#katkıda-bulunanlar">Katkıda Bulunanlar</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/devnotetr"><img src="https://img.shields.io/npm/v/devnotetr.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/devnotetr"><img src="https://img.shields.io/npm/dm/devnotetr.svg" alt="npm downloads"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/npm/l/devnotetr.svg" alt="license"></a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="node version">
</p>

---

## Genel Bakış

devnote, kişisel çalışma notlarını düzenli bir kitaplık halinde toplar. Her not Markdown formatındadır; terminalden ara, editörde aç ya da tarayıcıda oku.

İçerik, ağır bir uygulama katmanı yerine doğrudan dosya yapısı üzerinden yönetilir. Bu yüzden hızlıdır, taşınması kolaydır ve arşiv mantığıyla uzun süre kullanılabilir.

## Hızlı Görünüm

| Alan       | İçerik                                               |
| ---------- | ---------------------------------------------------- |
| Java       | Lombok, JPA / Hibernate, Spring Boot                 |
| JavaScript | Array metodları, closure, currying, async, regex     |
| Python     | Temel konular, ileri teknikler, veritabanı işlemleri |
| SQL        | Temel sorgular, ileri SQL, psql terminal kullanımı   |
| MongoDB    | Temel CRUD ve sorgulama                              |

## Neler Sunar?

| Deneyim  | Ne yapar                                            |
| -------- | --------------------------------------------------- |
| CLI      | Notları listeler, arar ve açar                      |
| TUI      | Kategori, not ve açma modunu etkileşimli seçtirir   |
| Web UI   | Kategori filtreleme ve anlık arama sağlar           |
| Markdown | İçerik sade, taşınabilir ve versiyonlanabilir kalır |

## Kullanım

Node.js kurulu olması yeterlidir; harici paket gerekmez.

### Komutlar

| Komut                                  | Açıklama                             |
| -------------------------------------- | ------------------------------------ |
| `devnote help`                         | Komutları göster                     |
| `devnote list`                         | Tüm notları listele                  |
| `devnote list --cat java`              | Java kategorisindeki notları göster  |
| `devnote list --cat py --search temel` | Python notları arasında "temel" ara  |
| `devnote search hibernate`             | Tüm notlarda "hibernate" araması yap |
| `devnote open 3`                       | 3 numaralı notu editörde aç          |
| `devnote open --tui`                   | İnteraktif TUI modunu başlat         |
| `devnote open --editor`                | Web arayüzünü tarayıcıda aç          |
| `devnote open --browser 6`             | 6 numaralı notu tarayıcıda aç        |

### TUI Tuş Kombinasyonları

`devnote open --tui` akışı üç adımdır:

1. Kategori seç.
2. Markdown notunu seç.
3. Açma modunu seç: Markdown önizle, editörde aç veya tarayıcıda aç.

| Tuş       | Eylem                 |
| --------- | --------------------- |
| ↑ / ↓     | Gezin                 |
| Enter     | Seçili adımı çalıştır |
| p         | Markdown önizle       |
| e         | Editörde aç           |
| b         | Tarayıcıda aç         |
| Backspace | Geri                  |
| q         | Çık                   |

## Web UI

`library/index.html` dosyası üzerinden çalışan basit bir arayüz vardır. Hedef, notu hızlıca bulup bağlamından kopmadan okumaktır.

- Kategori filtreleme
- Anlık arama
- Kart üzerinden not detayını görme

## Gereksinimler

- [Node.js](https://nodejs.org) 18 veya üzeri

## Kurulum

```bash
npm install -g devnotetr
devnote help
```

Paket sayfası: [npmjs.com/package/devnotetr](https://www.npmjs.com/package/devnotetr)

İstersen doğrudan depoyu klonlayıp yerelde de kullanabilirsin:

```bash
git clone https://github.com/burakboduroglu/dev-notes.git
cd dev-notes
node library/cli.js help
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
    readme.md           Kitaplık giriş noktası
```

## Katkıda Bulunanlar

Bu depo şu anda ağırlıklı olarak tek kişi tarafından sürdürülüyor; yine de katkı listesi zamanla büyüyebilir.

<p align="center">
  <a href="https://github.com/burakboduroglu/dev-notes/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=burakboduroglu/dev-notes" alt="contributors">
  </a>
</p>

Katkı geçmişini görmek için [GitHub contributors grafiğine](https://github.com/burakboduroglu/dev-notes/graphs/contributors) bakabilirsin.

## Lisans

MIT. Ayrıntılar için [LICENSE](LICENSE.md) dosyasına bakın.

---

<p align="center">Burak Boduroğlu</p>
