# Kullanım ve model kapsamı

Next.js, React, TypeScript ve Three.js uygulaması. Yeni proje, ürün ve arsa seçiminden başlayıp kullanıcı kontrollü 2B / 3B yerleşime ilerler.

## Çalıştırma

Node.js 24+ gerekir. Adres **http://127.0.0.1:5188/**. Port doluysa hata verir; başka servisi durdurmaz veya başka porta geçmez. Bu komut yerel geliştirme içindir. Canlı kurulum için [Sunucu rehberi](SUNUCU-KURULUMU.md).

```sh
npm install
npm run db:init
npm run dev
```

Bu bilgisayardaki paketli Node ile:

```sh
env PATH=/Users/l./.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run dev
```

İlk yönetici hesabının giriş bilgileri `data/ilk-giris.txt` dosyasına yazılır. Giriş `/login`, yönetim paneli `/backoffice` adresindedir. Yönetim paneline tasarım ekranında bağlantı verilmez.

Kurulum, yetkilendirme, bölgesel yükler ve yedekleme: [Veritabanı ve yönetim](VERITABANI-VE-YONETIM.md).

## Kullanım

1. Hesabınızla giriş yapın. Projeyi adlandırın, depolanacak ürünü kendi simgesinden seçin.
2. Sağ çekmeceden kara veya liman tesisini, ülkeyi ve saha bölgesini seçin; arsanın genişlik ve derinliğini metre olarak girin. Satış temsilcisi ve onaylı yük profili konumdan otomatik gelir. İlk seçimden sonra merkezdeki saha görünümü korunur.
3. Başlangıç silo tipini, yoğunluğu ve isteğe bağlı hedef kapasiteyi seçin. Proje boş açılır.
4. Sağdaki **Ekipmanlar** sekmesinden silo tipi seçin; silo adedini alttaki − / + kontrolünden veya sağ panelden, sıra başına adedi sağ panelden girin. Çevre/temel aralıklarıyla ortalanan taban izlerini kontrol edip **Oluştur** düğmesine basın. Kepçe kazısı, beton mikseriyle döküm, düz tabanlı/endüstriyel modellerde hava kanalı ızgaraları, çatı, kaldırma ve sac montajı sırasıyla canlandırılır. Kazı içinde ızgara çizgileri görünmez. Hızı üst çubuktan 1×–8× arasında değiştirin; ilerleme panelinden duraklatın. Kurulum bitince diğer ekipmanları ekleyebilirsiniz. Sağdaki **Ekipmanlar** sekmesinden bir ekipman seçin. Sağda çap, yükseklik, kot ve dönüşü düzenleyin; arsaya tıklayarak yerleştirin. Ekipman yerleştirmek türüne uygun ayrı bir kurulum canlandırması başlatır; tamamlanınca sonraki ekipmanı ekleyebilirsiniz. Seçili mevcut ekipmanın **Kurulumu oynat** düğmesi aynı konumda yeniden canlandırır. Silo grupları aynı aks üzerinde birlikte hareket eder. Silo kurulumu yürüme yolu eklemez. Sonradan **Yürüme yolu** seçimi, zeminde montaj ve vinçle çatıya kaldırma canlandırmasını başlatır; yollar ortak kotta, çatı merkezlerine bağlı bir ağ oluşturur. Montaj alanı yetersizse ekleme başlamaz. Seçim aracıyla mevcut nesneyi seçin; taşıma, döndürme, çoğaltma, silme, geri alma ve yineleme düğmelerini kullanın. Nesneyi seçip sağ panelde **Taşı** düğmesine basın, ardından yeni konuma tıklayın. **Seçili / bağlı grup** bağımsız makineleri tek tek; silo, yol ve elevatör bağlantılarını birlikte taşır. **Tüm tesis** bütün nesneleri aynı mesafede kaydırır. Aynı işlem sağdaki X/Z alanlarından Uygula ile de yapılır. Sınır veya çakışma nedeniyle uygun olmayan taşıma uygulanmaz; Geri al ile önceki konuma dönülür. Escape yerleştirmeyi iptal eder.
5. Projeyi indir düğmesi ad, soyad, firma, e-posta ve telefon ister. Ülke ve adres isteğe bağlıdır. İndirmeden önce müşteri kaydı ve projenin değişmez teklif anlık görüntüsü veritabanına yazılır; teklif yönetim panelinde görünür. JSON düzenlenebilir proje dosyası; GLB ise 3B sahne ve proje meta verilerini içerir.

Logo veya proje adına tıklayarak kayıtlı projelere dönülür. Proje ayarlarında ad, tesis tipi, arsa, yoğunluk ve hedef kapasite değişir. Yeni arsa mevcut ekipmanı dışarıda bırakıyorsa değişiklik uygulanmaz.

## Kayıtlar ve diller

- Asıl kayıt yerel sunucudaki SQLite/D1 veritabanıdır: `data/mysilo.sqlite`. Kullanıcılar, ilk adımdan itibaren taslaklar, projeler, kurulum ilerlemesi, müşteri bilgileri, teklifler, satış bölgeleri ve işlem geçmişi burada tutulur.
- Her kesinleşen proje değişikliği sürümlü kaydedilir. Animasyon ilerlemesi 1,5 saniyelik kontrol noktalarıyla, duraklatma/tamamlama ve sayfa görünürlüğü değişimlerinde saklanır. Proje yeniden açıldığında kayıtlı noktadan sürer.
- Sunucuya henüz ulaşmayan değişiklikler kullanıcıya özel tarayıcı kuyruğunda tutulur; bağlantı geldiğinde yeniden denenir. Üst çubukta kayıt durumu görünür. Çakışan sürüm sessizce üzerine yazılmaz.
- Tarayıcı verisini temizlemek sunucuya ulaşmış projeleri silmez. Bekleyen çevrimdışı değişiklikler ancak sunucu kaydı tamamlandığında veritabanında bulunur. Projeler arşivlenir; yönetim panelinden geri alınabilir.
- Yeni projelerde varsayılan para birimi **TRY**. TRY, USD, EUR ve GBP desteklenir; liste `lib/i18n.ts` üzerinden genişletilir. Mevcut projelerin kendi para birimi korunur. Fiyat ve kur hesabı henüz yoktur; teklifler fiyatlandırma bekler.
- Türkçe, İngilizce, Fransızca, Arapça (RTL), Rusça, İspanyolca ve Almanca. Dil ve para birimi projeye kaydedilir; tercihlerin tarayıcı kopyası da bulunur.
- JSON dosyaları yeni proje olarak içe alınır. Önceki v1/v2 yerel projeler yönetici hesabında veritabanına aktarılır; eski kaynak ve aktarımın orijinal görüntüsü korunur.
- Geliştirme verisi bu bilgisayarda, üretim verisi sunucuda tutulur. `npm run db:backup` tutarlı SQLite yedeğini `data/backups/` altına alır.

## Katalog ve hesap kapsamı

- 7 depo ailesi: düz tabanlı, ekonomik konik, ticari konik, endüstriyel, kare, yem, geçici tahıl deposu.
- 9 ekipman: elevatör, yürüyüş yolu, makine binası, destek kulesi, konveyör, alım bunkeri, kurutucu, temizleyici ve gemi yükleyici.
- Gerçek Mysilo katalog görselleri / SVG dosyaları: `public/mysilo/`. Kaynak adresleri `public/mysilo/sources.json`. Kullanıcının varlıkların kendilerine ait olduğu beyanıyla entegre edilmiştir. Logo kullanıcı tarafından verilen dosyadır; `public/brand/logo.png`.
- 3B modeller özgün parametrik ön yerleşim geometrileridir; üretici CAD/SKU doğrulaması değildir. Kartlardaki üretici görseli ile sahne modeli aynı dosya değildir.
- Metre, metrik ton ve kg/m³. Silindirik siloda gövde, 28° üst yığın, konik siloda 45° alt koni ve %95 dolum varsayılır. Kare depoda nominal prizma hacmi; geçici depoda silindir + eğimi 0,3 olan üst yığın kullanılır. Kapasite yaklaşık hesaplanır.
- Tek proje ürünü ve yoğunluğu; 20–600 m dikdörtgen arsa, en fazla 150 bileşen. 0,5 m konum adımı; serbest ürün ölçüleri. Silo gövde yüksekliği çatı ve alt koniyi kapsamaz.
- Nominal döndürülmüş dikdörtgen tabanlar ve düşey aralıklarla çakışma kontrolü yapılır. Yuvarlak nesnelerde muhafazakâr dikdörtgen zarf kullanılır. Kotlar ayrıştığında üst hatlar siloların üzerinden geçebilir. Merdiven, temel ve çıkıntıların detay çakışması, bakım mesafesi ve kamyon dönüşü kontrol edilmez.
- Liman projesinde kıyı yönü, rıhtım genişliği, gemi mesafesi, boyu, eni ve ambar adedi düzenlenir. Silolar parsel içinde, gemi yükleyici tabanı rıhtımda kalır; konveyörler rıhtıma uzanabilir. Yükleme ucu için ambarın plan izdüşümüne erişim gösterilir. Deniz parselden bağımsız geniş yüzey ve hareketli dalga ayrıntısı kullanır. Bunlar coğrafi veri veya liman mühendisliği modeli değildir.

Araştırma: `ARASTIRMA.md` ve `/research`. Gerçek ürün görselleri ve 3B karşılıkları `/catalog` altında incelenir. İlk sürüm otomatik planlayıcısı ve testleri kaynakta korunur; ana arayüz artık elle yerleşim kullanır. Önceki otomatik planlayıcıya ait WebMCP araçları bu yeni arayüzde etkin değildir.

## Doğrulama

```sh
npm test
npx tsc --noEmit
npm run build
```

100 test; oturum ve kullanıcı yetkileri, kıta/ülke atamaları, sunucuda yük kilidi, sürüm çakışmaları, çevrimdışı kayıt kuyruğu, değişmez teklifler, taslaklar, arşivleme, yedekten okuma ve proje kayıtları, v1 dönüşümü, müşteri zorunluluğu, JSON/GLB, ölçü doğrulaması, döndürülmüş ve düşey çakışmalar, tüm katalog modelleri, çeviriler ve kaynak varlıklarını kapsar. Önceki planlayıcının 576 senaryoluk taraması korunur.

Montaj sırası, payların anlamı, bağlantı kuralları ve kaynaklar: [Kurulum ve yerleşim](KURULUM-VE-YERLESIM.md). Varsayılan 5 m çevre payı, 3 m temel aralığı, 0,60 m temel payı ve 2 m yol taşması ön yerleşim varsayımlarıdır; saha mühendisliği ölçüsü değildir.

## Taşıma, liman ve saha yükleri

- **Konveyör → Model**: K/V/R/U bant, F·H/S·HI/C zincir, D/L tüp, U/tüp helezon, mobil bant, R/U arabalı bant. **Gemi yükleyici → Model**: MYPORT veya mobil teleskopik bant. Toplam 16 seçim. Üretici görselleri `public/mysilo/handling/`, kaynak manifesti `public/mysilo/handling/sources.json`.
- Konveyör montajı boş ve yeterli alanda tıklanan noktada başlar; seçilen kota aynı x/z üzerinde kaldırılır. Zemin doluysa en yakın uygun montaj alanı aranır; nihai konum değişmez. Yerleştirme kamerayı yeniden ortalamaz.
- Limanda arsa boyutu ana kara parselidir; rıhtım bunun dışına eklenir. Başlangıç kıyısı güney, rıhtım 14 m, gemi mesafesi 3 m, gemi 90 × 20 m ve 4 ambar: değiştirilebilir ön yerleşim varsayımlarıdır. Yükleyicinin uzunluğu pivotundan yükleme ucuna yatay erişimdir; döndürme kıyı yönüne göre başlatılır. Erişim göstergesi sadece 2B ambar izdüşümünü denetler, bom veya gemi hareketini hesaplamaz.
- Yönetici **Yük profilleri** bölümünde ülke/saha bölgesi, kaynak, standart, kar ve deprem zone değerleri, kar yükü, PGA, rüzgâr, zemin ve korozyonu tanımlar. Onaylı profil konuma göre sunucu tarafından projeye uygulanır; satış ekranından yük değerleri değiştirilemez. Onaylı veri yoksa **Profil bekleniyor** gösterilir; ülke geneline uydurma bir yük değeri atanmaz. Hedef t/h proje girdisi olarak düzenlenebilir. Kar özeti düzgün yayılı çatı yükünün yatay alana etkisidir; statik yeterlilik değildir.
- Bu alanlar JSON ve tesis GLB meta verisinde korunur. Eski projeler yeni alanlar olmadan açılır. Mevcut projeler kendiliğinden yeniden yerleştirilmez.

## Devam edilecek kapsam

Üretici model/SKU ve kapasite tabloları; gerçek CAD/GLB varlıkları; poligon arsa ve girişler; silo başına ürün ve parti; boru/konveyör bağlantı grafiği, debi ve kot uyumu; bakım mesafeleri; maliyet kalemleri ve teklif/PDF. Statik, zemin, deprem, yangın/ATEX ve kurulum uygulama projesi ayrıca mühendislik doğrulaması gerektirir.

Çatı güncellemesi: dairesel sac silolarda saçaklara ulaşan panel birleşimleri, aynı akslı stiffenerlar, çatı merdiveni, çevre korkuluğu, havalandırma başlıkları ve egzoz fanı görünür. Yol uçları kapalıdır; bağlantı noktalarında geçiş açıklığı korunur. Elevatörü seçip **Yürüme yoluna bağla** ile servis platformu bağlantısını kaydedebilirsiniz. Bağlantı kurulurken mevcut elevatör yerinde kalır; destek, servis döşemesi, merdiven ve korkuluklar ayrı montaj sürecinde eklenir. Bağlantı geometrisi 2B/3B görünüm ve GLB çıktısına dahildir.


## Son model ve performans güncellemesi

Temizleyici S, kurutucu E, alım bunkeri S, elevatör destek kulesi ve 7 model alım binası; yerel Mysilo görsellerine göre yeniden modellenmiştir. Bunkerin yüksekliği artık zeminin altındaki derinliğidir; ızgara 0,12 m üst kotta durur. Taşıma kontrolleri bu düşey zarfı da kullanır. Tam üretici CAD veya teknik model seçimi yapılmış sayılmaz.

Kurulum listesi: sırada/duraklatılmış → sarı saat, kuruluyor → sarı dönen simge, tamamlandı → yeşil tik. Bitmemiş iş yeşil tik göstermez.

Sabit yüzeyler malzemelerine göre birleştirilir; hareket eden halka ve montaj birimleri ayrı kalır. Seçim değişmesi sahneyi yeniden üretmez. Arayüz ilerleme güncellemeleri saniyede 4 kez, 3B hareketler ekranın çizim döngüsünde yapılır. Ayrıntılar, kaynaklar ve karşılaştırma: [Taşıma ve performans notu](TASIMA-MODELLER-PERFORMANS.md).
