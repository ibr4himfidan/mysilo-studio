# Taşıma, ürün modelleri ve animasyon performansı

14 Eylül 2026 · Yerel Mysilo uygulaması

## Taşıma

3B sahneden, 2B plandan veya sağdaki bileşen listesinden nesne seçilir. Sağdaki **Taşı** veya üstteki taşıma aracı etkinleştirilir; yeni konuma tıklanır. X/Z alanları ve **Uygula** aynı yer değiştirme kurallarını kullanır.

- **Seçili / bağlı grup:** bağımsız ekipman tek başına taşınır. Aynı yerleşim grubundaki silolar, çatı merkezlerine bağlı yürüme yolları ve bunlara bağlı elevatörler aynı ötelemeyle hareket eder. Bağlı bir yolun seçilmesi de bu grubun taşınmasını sağlar.
- **Tüm tesis:** seçilen nesne referans alınarak tüm nesneler aynı x/z farkıyla ötelenir. Arsa, rıhtım ve gemi yerinde kalır.
- Önizleme tüm hareket eden tabanları gösterir. Sınır, temel payı, çakışma ve servis bağlantısı koşulları birlikte denetlenir. Liman yükleyici tabanı rıhtımın dışına çıkarılamaz. Hatalı bir öneri kaydı değiştirmez.
- Kurulum sırasında yer değiştirme kilitlidir. Tamamlandıktan sonra taşıma yeni bir montaj işi başlatmaz. Kimlikler ve bağlantılar korunur; geri alma/yineleme kullanılabilir.

## Referans alınan ürünler

Kart görselleri üreticinin yerel olarak saklanan orijinal dosyalarıdır. Sahnedeki modeller görsel referanslara göre üretilen parametrik geometrilerdir; üretici CAD/SKU dosyası değildir.

| Ürün | Modellenen ayrıntılar | Kaynak |
|---|---|---|
| S temizleyici | Uzun elek gövdesi, bakım pencereleri, emiş başlığı, üst giriş ve titreşim tahriki | [Mysilo S](https://www.mysilo.com/tr/category/158/s-model) |
| E kurutucu | Modüler kolon, üçgen hava kanalları, iki dış fan grubu, brülörler, platformlar, kafesli merdiven ve dolum çatısı | [Mysilo E](https://www.mysilo.com/tr/category/143/e-model) |
| S alım bunkeri | Üst ızgara, modüler saclar, aşağı daralan kare hazne ve çıkış ağzı | [Mysilo S bunker](https://www.mysilo.com/tr/category/382/S-Model) |
| Destek kulesi | Dört kolon, çaprazlar, kat platformları, korkuluklar, merdiven kolları ve üst çatı | [Mysilo kule](https://www.mysilo.com/tr/category/73/Kule) |
| 7 alım binası | Yüksek makine bölümü, alçak alım holü, kolonlar ve düşey oluklu cephe | [Mysilo 7](https://www.mysilo.com/tr/category/384/7-Model) |

Bunker sahnede zeminin altına yerleşir; yalnız ızgarası ve üst çevresi yüzeye çıkar. Kütüphanedeki bağımsız 3B görünüm haznenin tamamını incelemeye izin verir. Başlangıç ölçüleri ön yerleşim içindir; üretici kapasitesi, eğim veya sac kalınlığı hesabı yerine geçmez. Önceden kaydedilmiş ölçüler korunur.

## Durum simgeleri

Sıradaki ve duraklatılmış iş sarı saat, devam eden iş sarı dönen simge, tamamlanmış iş yeşil tik gösterir. Simge hem başlık hem erişilebilir açıklama taşır. Sistem hareket azaltma tercihi varsa simgenin dönmesi kapatılır.

## Performans çalışması

Ölçüm senaryosu: 140 × 140 m parselde 3 × 3 dizili, 11 m çaplı ve 12 m gövdeli dokuz silo. Aynı geometri ve kurulum süreleriyle yerel Node üzerinde sahne oluşturma/güncelleme ölçüldü. Her örnekte 300 güncelleme ve dünya matrisi yenilemesi çalıştırıldı. Bu bir tarayıcı FPS veya ekran kartı ölçümü değildir.

| Kurulum durumu | Önce ayrı görünür mesh | Sonra | Önce CPU güncelleme | Sonra |
|---|---:|---:|---:|---:|
| %45 | 3.242 | 503 | 2,70 ms | 0,14 ms |
| %75 | 4.952 | 551 | 2,61 ms | 0,14 ms |
| Tamamlandı | 6.228 | 405 | 2,73 ms | 0,14 ms |

Tamamlanmış sahnede ayrı görünür mesh sayısı yaklaşık %93,5 azaldı. Ölçümde raporlanan geometri miktarı değişmedi. İlk sahne hazırlığı bu örnekte 173 ms’den 218 ms’ye çıktı: tek seferlik birleştirme maliyeti karşılığında her karedeki iş azaltıldı. Sayılar makine ve çalışma koşullarına bağlıdır; 60 FPS garantisi değildir.

Uygulanan değişiklikler:

1. Aynı malzemeye sahip sabit yüzeyler ortak geometride birleştirildi. Mevcut instanced çizimler korunur. Hareketli halka, ızgara paneli ve montaj birimi kendi grubunda kalır. Three.js’in birleştirme yardımcısı uyumlu geometrileri tek buffer içinde toplar. [BufferGeometryUtils](https://threejs.org/docs/pages/module-BufferGeometryUtils.html)
2. Nesne seçimi ayrı bir seçim çerçevesini günceller; bütün 3B tesis yeniden oluşturulmaz.
3. Arayüz ilerleme güncellemesi saniyede 10’dan 4’e indirildi. 3B zaman ekran çizim döngüsünde ara değerlerle ilerler; hız ve duraklatma korunur.
4. Sabit kalmış kurulum evrelerinin parçaları tekrar tekrar güncellenmez. Ekipman montajı küçük parça gruplarıyla gösterilir; artık kullanılmayan gizli kaynak modeller sahnede tutulmaz.

Doğrulamalar geometri sınırlarını, üçgen miktarını, seçim kimliğini, kurulum sonu konumlarını, bağlı grup taşımayı, hatalı taşımanın reddini ve simge geçişlerini kapsar. Tekrar ölçmek için `scripts/profile-scene.ts` kullanılır. Gerçek FPS; tarayıcı, ekran çözünürlüğü, donanım ve tesis büyüklüğüne bağlıdır.
