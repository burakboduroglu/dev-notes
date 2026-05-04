# Kitaplık

Bu klasör, depodaki tüm notların taranabilir giriş noktasıdır. İki arayüz sunar:

| Arayüz | Nasıl açılır |
|--------|-------------|
| **Web UI** | `library/index.html` dosyasını tarayıcıda aç |
| **CLI** | `node library/cli.js` — terminal'den eriş |

```bash
# Tüm notları listele
node library/cli.js

# Kategoriye göre filtrele
node library/cli.js list java

# Arama
node library/cli.js search hibernate

# Notu editörde aç
node library/cli.js open 3

# Yardım
node library/cli.js help
```

**Son içerik gözden geçirmesi:** Mayıs 2026

## 2026’ya kısa teknik özet

Notların çoğu sürümden bağımsız kavramlara odaklanır. Güncel pratik için tipik bir yığın (2026 ortası):

| Alan | Örnek güncel hat |
|------|------------------|
| Python | 3.13+ (3.14 sürüm çizgisinde) |
| Node.js | 22.x LTS veya 24+ |
| Java | 21 LTS (uzun vadeli), 25+ özellik sürümleri |
| Spring Boot | 3.4.x / 3.5+ (Jakarta EE 9+, Java 17+ baseline) |
| PostgreSQL | 17+ (terminal: `psql` notları geçerli) |
| MongoDB | 8.x |

## Raflar

### Java

| Başlık | Dosya |
|--------|--------|
| Bölüm özeti | [Java-Notes/readme.md](../Java-Notes/readme.md) |
| Lombok | [lombok.md](../Java-Notes/lombok.md) |
| JPA / Hibernate | [jpa_hibernate.md](../Java-Notes/jpa_hibernate.md) |
| Spring Boot anotasyonları | [spring_boot_framework.md](../Java-Notes/spring_boot_framework.md) |

### JavaScript

| Başlık | Dosya |
|--------|--------|
| Bölüm özeti | [Javascript-Notes/readme.md](../Javascript-Notes/readme.md) |
| Dizi metodları | [javascirpt_array_methods.md](../Javascript-Notes/javascirpt_array_methods.md) |
| Closure, currying, compose | [closures_currying_compose.md](../Javascript-Notes/closures_currying_compose.md) |
| async / Promise / Fetch | [async_js.md](../Javascript-Notes/async_js.md) |
| Regex (1) | [regex_part_1.md](../Javascript-Notes/regex_part_1.md) |

### Python

| Başlık | Dosya |
|--------|--------|
| Bölüm özeti | [Python-Notes/readme.md](../Python-Notes/readme.md) |
| Temel 1 – veri yapıları | [python_basic_1.md](../Python-Notes/python_basic_1.md) |
| Temel 2 – fonksiyon, döngü, koşul | [python_basic_2.md](../Python-Notes/python_basic_2.md) |
| Temel 3 – hata, dosya | [python_basic_3.md](../Python-Notes/python_basic_3.md) |
| İleri 1 – comprehension | [advanced_python_1.md](../Python-Notes/advanced_python_1.md) |
| İleri 2 – map, filter, reduce | [advanced_python_2.md](../Python-Notes/advanced_python_2.md) |
| Veritabanı işlemleri | [python_db_process.md](../Python-Notes/python_db_process.md) |

### SQL

| Başlık | Dosya |
|--------|--------|
| Bölüm özeti | [SQL-Notes/readme.md](../SQL-Notes/readme.md) |
| SQL temel 1 | [sql_basic_1.md](../SQL-Notes/sql_basic_1.md) |
| SQL temel 2 (WHERE) | [sql_basic_2.md](../SQL-Notes/sql_basic_2.md) |
| SQL ileri | [sql_advanced_1.md](../SQL-Notes/sql_advanced_1.md) |
| psql terminal | [psql_on_terminal.md](../SQL-Notes/psql_on_terminal.md) |

### MongoDB

| Başlık | Dosya |
|--------|--------|
| Bölüm özeti | [MongoDB-Notes/readme.md](../MongoDB-Notes/readme.md) |
| MongoDB temel 1 | [mongodb_basic_1.md](../MongoDB-Notes/mongodb_basic_1.md) |

---

[Depo köküne dön](../readme.md)
