# Veritabanı ve yönetim

Uygulama geliştirmede `http://127.0.0.1:5188`, üretimde HTTPS üzerinden çalışır. Node.js doğrudan kalıcı SQLite veritabanına erişir. Önceki Cloudflare/D1 geliştirme çalıştırıcısı kaldırılmıştır. Sunucu kurulumunu [ayrı rehber](SUNUCU-KURULUMU.md) açıklar.

## İlk çalıştırma ve erişim

Node.js 24 veya üzeri gerekir:

```sh
npm install
npm run db:init
npm run dev
```

`db:init` Drizzle SQL geçişlerini uygular. Henüz kullanıcı yoksa rastgele şifreli `admin@mysilo.local` yöneticisini oluşturur. Giriş bilgileri yalnızca `data/ilk-giris.txt` dosyasına yazılır. Var olan hesabı yeniden oluşturmaz veya şifresini değiştirmez. Hesabım menüsünden şifre değiştirilebilir.

- Kullanıcı girişi: `/login`
- Tasarım alanı: `/`
- Yönetim paneli: `/backoffice` — tasarım ekranında ve açılış sayfasında bağlantısı bulunmaz.

Kullanıcıları yönetici oluşturur; herkese açık kayıt formu yoktur. Şifreler scrypt ve kullanıcıya özel rastgele tuz ile özetlenir. Oturum anahtarlarının yalnızca özeti veritabanında tutulur; oturum çerezi HttpOnly/SameSite=Strict, HTTPS olduğunda ayrıca Secure olur. Oturum süresi 8 saattir. Giriş denemeleri sınırlandırılır. Yazma isteklerinde kaynak ve içerik türü denetlenir. Kullanıcı pasifleştirme, yetki veya şifre değişikliği mevcut oturumları iptal eder.

## Neler kaydedilir?

| Kayıt | İçerik |
| --- | --- |
| Kullanıcılar ve oturumlar | Satış/yönetici rolü, aktiflik, oturum süresi |
| Başlangıç taslakları | Proje adı, ürün, adım, dil/para birimi, tesis, arsa ve konum seçimleri |
| Projeler | Sahip, satış temsilcisi, ürün, arsa, bütün nesnelerin ölçü/konumları, montaj süreci, bölgesel profil, sürüm |
| Müşteriler | Ad, soyad, firma, e-posta, telefon, ülke ve adres; tamamlanmamış form da taslak olarak tutulur |
| Teklifler | Teklif numarası, müşteri, proje ve uygulanan yük profilinin değişmez anlık görüntüsü |
| Satış bölgeleri | Kıta veya ülkenin temsilciye atanması |
| Yük profilleri | Ülke/saha bölgesi, standart, kaynak, zone/yük değerleri, onay ve revizyon |
| İşlem geçmişi | Kullanıcı, zaman, işlem türü ve proje değişikliklerinin sürümlü görüntüleri |

İlk seçimden itibaren taslaklar kaydedilir; birden fazla taslak bağımsız sürdürülebilir. Yerleşim değişiklikleri sunucuya sırayla gönderilir. Montajın her çizim karesi yerine 1,5 saniyelik ilerleme kontrol noktaları, duraklatma/tamamlama ve görünürlük değişimleri kaydedilir. Böylece çizim döngüsüne veritabanı işi yüklenmez. Ani kapanışta en son kalıcı kontrol noktasından devam edilir.

Bekleyen isteklerin kullanıcıya özel tarayıcı kopyası bulunur. Başarısız kayıt yeniden denenir; **Kaydedildi** ancak sunucu onayından sonra görünür. Tarayıcı verisi silinirse sunucuya ulaşmış kayıtlar korunur; henüz gönderilmemiş çevrimdışı kuyruk korunmaz. Aynı proje iki yerde düzenlendiğinde eski sürüm yenisinin üzerine yazılmaz; kullanıcıya kayıt çakışması gösterilir.

Eski `mysilo:projects:v2` kayıtları ilk yönetici oturumunda aktarılır. Orijinal tarayıcı kaynağı silinmez; aktarım öncesi tam görüntü de geçmişe yazılır. Arşivlenmiş kayıtların eski tarayıcı kopyası tekrar içe alınmaz. Proje silme işlemi arşivlemedir; **Backoffice → Projeler → Arşiv** üzerinden geri getirilebilir.

## Temsilci ve yük profili yönetimi

1. **Kullanıcılar** bölümünde satış hesaplarını oluşturun.
2. **Satış bölgeleri** bölümünde kıta ataması, gerekirse ülke istisnası tanımlayın. Ülke ataması kıtadan önce gelir. Pasif kullanıcı ataması uygulanmaz; varsa aktif kıta temsilcisine dönülür. Ülke listesi `countries-list` paketinin kıta sınıflandırmasını kullanır.
3. **Yük profilleri** bölümünde ülke ve saha bölgesi için doğrulanmış kaynağı, standardı ve değerleri girin; kontrol edilen profili onaylayın.
4. Satışçı kendisine atanmış ülkelerde proje başlatır. Temsilci konumdan otomatik belirlenir. Yönetici tüm projeleri görür; satışçı yalnızca sahibi veya atanmış temsilcisi olduğu projeleri görür. Yönetici proje sorumlusunu değiştirebilir.

Kar/deprem değerleri satış ekranında kilitlidir ve API doğrudan değiştirme girişimlerini de kabul etmez. Sunucu yalnızca seçilen konumun onaylı profilini uygular. Profil yoksa sayısal değerler boş ve durum **Profil bekleniyor** kalır. Bu sürüm ülke geneline mühendislik değeri uydurmaz; otomatik harita servisi entegrasyonu henüz yoktur.

Türkiye'nin güncel deprem tehlike haritası eski 1–5 derece bölgeleri yerine koordinata bağlı yer hareketi parametreleri verir. Bir ülke veya kıta ataması tek başına PGA belirlemez. [AFAD harita açıklaması](https://www.afad.gov.tr/kurumlar/afad.gov.tr/39499/xfiles/deprem_haritasi.pdf). İklim ve yük parametreleri ulusal eklerden, saha koşullarından ve uygun haritalardan alınmalıdır. [Avrupa Komisyonu JRC — ulusal parametreler](https://eurocodes.jrc.ec.europa.eu/en-eurocodes-implementation/nationally-determined-parameters).

Profilin kaynağı, revizyonu ve uygulanma zamanı projede saklanır. Yönetici profili güncellerse düzenlenebilir proje sonraki kayıtta güncel profili alır; indirme öncesinde de profil sunucuda yenilenir. Önceden oluşturulmuş tekliflerin anlık görüntüleri değişmez. Bu profil eşleştirmesi bir statik hesap veya saha doğrulaması yerine geçmez.

## Teklifler ve müşteriler

**Projeyi indir** işlemi müşteri bilgileri tamamlandıktan ve kurulum bittikten sonra önce kayıtlı proje sürümünü kesinleştirir, ardından teklif oluşturur. Bağlantı nedeniyle aynı isteği yinelemek ikinci bir teklif üretmez. JSON/GLB dosyası kayıtlı proje görüntüsünden hazırlanır.

Yeni projelerde varsayılan para birimi **TRY**; TRY, USD, EUR ve GBP desteklenir. Eski projenin para birimi korunur. Ürün fiyat listesi henüz tanımlı olmadığından teklif toplamı `null`, fiyatlandırma durumu `pricing_pending` olur; sıfır veya uydurma fiyat yazılmaz. Teklifler, müşteriler ve projeler yönetim panelinde satış temsilcisine göre filtrelenebilir. Müşteri düzeltmeleri yeni kayda uygulanır; eski teklifin müşteri görüntüsü değişmez.

## Veritabanı ve yedek

- Kalıcı veritabanı dizini: `data/mysilo.sqlite` (üretimde `/var/lib/mysilo/mysilo.sqlite`).
- Tutarlı SQLite yedekleri: `data/backups/`.
- İlk giriş dosyası: `data/ilk-giris.txt`.
- Şema: `db/schema.ts`; geçişler: `drizzle/`.
- Veritabanı, yedekler ve giriş dosyası kaynak kontrolünden hariçtir. `data/` dizini yalnızca mevcut işletim sistemi kullanıcısına, yedek ve giriş dosyaları 0600 izinleriyle erişilebilir tutulur.

```sh
npm run db:backup
```

Komut SQLite'ın çevrimiçi yedek API'sini kullanır; açık veritabanının yalnızca ana dosyasını kopyalamaz. Kullanıcılar, projeler, teklif görüntüleri, taslaklar ve geçmiş aynı yedekte bulunur. Geliştirme yedekleri bu bilgisayardadır. Üretimde saatlik yedek servisi `/var/backups/mysilo` dizinine yazar. Sunucu dışında yedek kopyası ayrıca gereklidir; GitHub veri yedeği değildir.

Şema değişikliğinde geliştirme sunucusunu durdurun, `npm run db:init` çalıştırın, ardından `npm run dev` ile yeniden başlatın. Başka servisleri veya Docker portlarını değiştirmeyin. Geri yükleme gerekiyorsa önce sunucuyu durdurup mevcut `data/mysilo.sqlite` (üretimde `/var/lib/mysilo/mysilo.sqlite`) dizinini ayrıca koruyun; uygulama tablolarını içeren SQLite dosyasını doğrulanmış yedekle değiştirin ve eski WAL/SHM yan dosyalarını kullanmayın. Eski D1 yedeği aktarılırken `metadata.sqlite` kullanılmaz; `projects` tablosunu içeren gerçek veritabanı gerekir. `npm run db:import -- /tam/yol/yedek.sqlite` yalnızca boş hedefe aktarım yapar. Sonra sunucuyu açıp proje/teklif kayıtlarını kontrol edin.

## Bileşenler ve doğrulama

Giriş ve hesap bileşenleri `components/auth/`, proje başlangıcı/konum/sağ çekmece `components/project/`, yönetim ekranları `components/backoffice/` altındadır. Sunucu doğrulaması, yetki ve veritabanı işlemleri `lib/server/`; kalıcı istemci kuyruğu `lib/api-client.ts` içindedir. API rotası `app/api/[...path]/route.ts` üzerinden çalışır.

`npm test` oturum güvenliği, kullanıcı izolasyonu, ülke/kıta önceliği, onaylı profil zorlaması, sürüm çakışması, tekrar istekleri, teklif değişmezliği, taslaklar, kurulum kontrol noktaları, arşivden dönüş ve yedekten okuma dahil testleri çalıştırır. İş verisi testleri bağımsız SQLite örneklerinde yürütülür; gerçek proje verisini değiştirmez.
