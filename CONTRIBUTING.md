# Katkı Yönergeleri

devnotes projesine katkı yapmakla ilgilendiğiniz için teşekkür ederiz!

## Nasıl Katkıda Bulunabilirsiniz?

### Yeni Notlar Eklemek

1. Uygun kategoriye gidin (Java-Notes, JavaScript-Notes, Python-Notes, SQL-Notes, MongoDB-Notes)
2. Yeni bir `.md` dosyası oluşturun
3. Not içeriğinizi Markdown formatında yazın
4. Dosyayı kategori klasörüne kaydedin
5. [library/README.md](library/README.md) dosyasındaki ilgili tabloyu güncelleyin

### Mevcut Notları İyileştirmek

- Yazım/gramer hataları düzeltin
- Açıklıkları artırın
- Kod örneklerini güncelleyin
- Eksik açıklamalar ekleyin

### Hata Bildir

Hata bulduğunuz zaman:

1. GitHub'da bir "Issue" açın
2. Hatanın açık bir açıklamasını verin
3. İlgili not dosyasını referans gösterin
4. Mümkünse düzeltme önerisi yapın

## Not Yazma Rehberi

Yeni bir not yazarken şunlara dikkat edin:

### Başlık ve Yapı

- Açık ve özlü başlık kullanın
- İçeriği mantıklı bölümlere ayırın
- Başlıklar için `##`, `###` kullanın

### İçerik

- **Test edin** - Tüm kod örneklerinin doğru çalıştığından emin olun
- **Açık olun** - Karmaşık kavramları örneklerle açıklayın
- **Güncel olun** - Yazılım sürümleriyle güncel bilgi verin
- **Orijinal olun** - Kendi kelimelerinizle yazın

### Kod Örnekleri

```markdown
### Örnek Başlığı

Kısa açıklama:

\`\`\`java
// Kod örneği
public class Hello {
public static void main(String[] args) {
System.out.println("Merhaba!");
}
}
\`\`\`

Açıklama metni...
```

### Linkler ve Referanslar

- Diğer notlara link verin: `[JPA Hibernate](../Java-Notes/jpa_hibernate.md)`
- Dış kaynakları ekleyin: `[Resmi Dokümantasyon](https://example.com)`

## Katkı Süreci

1. **Fork** - Depoyu forklayın
2. **Branch** - Değişiklikleriniz için bir dal oluşturun:
   ```bash
   git checkout -b ozellik/yeni-python-notu
   ```
3. **Commit** - Değişiklikleri commit edin:
   ```bash
   git commit -m "Python: Yeni temel not eklendi"
   ```
4. **Push** - Dalınızı pushlayin:
   ```bash
   git push origin ozellik/yeni-python-notu
   ```
5. **Pull Request** - GitHub'da pull request açın ve açık bir açıklama verin

## Dosya Adlandırması

- Dosya adları küçük harf ve alt tire kullanın: `advanced_python_1.md`
- Kategori klasörü adlarını değiştirmeyin
- Benzer konular için sıra numarası ekleyin: `python_basic_1.md`, `python_basic_2.md`

## Lisans

Bu projeye katkıda bulunarak, katkılarınızın MIT lisansı altında yayımlanacağını kabul etmektedir.

## Sorular ve İlke

- Katkı hakkında sorularınız varsa, bir Issue açın
- **Önemli:** Bu repo kesinlikle programlama notları içindir
  - Reklam yayınlamayın
  - Başka konular için gönderilen issue'ler kapatılacak ve kullanıcı spam olarak bildirilecektir

## İyileştirme İçin Fikirler

- Yeni programlama dillerine dair notlar
- Mevcut notlara daha fazla örnek
- İnteraktif quiz'ler veya alıştırmalar
- Video/kaynak bağlantıları
- CLI aracında iyileştirmeler

Tekrardan, katkılarınız için teşekkür ederiz! 🚀
