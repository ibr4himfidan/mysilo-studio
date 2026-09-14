<p align="center"><img src="public/brand/logo.png" alt="Mysilo" width="230" /></p>
<h1 align="center">Mysilo Studio</h1>
<p align="center">Tahıl depolama tesislerini tarayıcıda planlayın, kurulumunu canlandırın ve teklif sürecini yönetin.</p>
<p align="center">
<a href="https://github.com/ibr4himfidan/mysilo-studio/actions/workflows/ci.yml"><img src="https://github.com/ibr4himfidan/mysilo-studio/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
<img src="https://img.shields.io/badge/Node.js-24_LTS-417e38" alt="Node.js 24" />
<img src="https://img.shields.io/badge/Next.js-16-111111" alt="Next.js 16" />
<img src="https://img.shields.io/badge/Three.js-3D_Planning-b01f35" alt="Three.js" />
</p>

---

## Projenin amacı

Mysilo Studio, satış ekiplerinin müşteri ihtiyacından başlayarak tahıl depolama tesisi oluşturmasını sağlayan bir web uygulamasıdır. Depolanacak ürün, arsa, tesis türü ve silo ailesi seçilir; silolar ve yardımcı ekipmanlar ölçüleriyle birlikte 2B/3B sahneye yerleştirilir. Kurulum adımları canlandırılır, proje kaydedilir ve müşteri bilgileriyle teklif görüntüsü oluşturulur.

Kara tesisleri ve liman tesisleri aynı düzenleyicide çalışır. Yönetim paneli; kullanıcıları, kıta/ülke bazında temsilci atamalarını, onaylı saha yüklerini, projeleri, müşterileri ve teklifleri bir araya getirir.

## Neler yapabilirsiniz?

| Alan | Özellikler |
| --- | --- |
| Proje başlangıcı | Adlandırma, ayrı ürün ikonları, arsa ölçüleri, ülke/saha bölgesi, kaydedilen taslaklar |
| Depolama | Düz tabanlı, ekonomik konik, ticari konik, endüstriyel, kare, yem ve geçici depolama |
| Ekipmanlar | Elevatör, yürüme yolu, konveyör, alım bunkeri, temizleyici, kurutucu, destek kulesi, bina, gemi yükleyici |
| Yerleşim | Hizalı silo grupları, çevre/temel payları, taşıma, dönüş, çoğaltma, çakışma ve sınır kontrolü |
| Canlandırma | Kazı, beton, hava kanalları, silo montajı, vinçle ekipman kaldırma; duraklatma ve 1×–8× hız |
| Liman | Kıyı yönü, rıhtım, gemi/ambar ölçüleri, yükleme erişimi ve deniz görünümü |
| Satış yönetimi | Kullanıcı yetkileri, ülke/kıta temsilcisi, müşteri kayıtları, satışçı bazında proje ve teklif takibi |
| Kayıt ve çıktı | Otomatik kayıt, sürüm geçmişi, çevrimdışı bekleme kuyruğu, arşivden dönüş, JSON ve GLB |

**Diller:** Türkçe, İngilizce, Fransızca, Arapça, Rusça, İspanyolca ve Almanca. Arapçada RTL düzeni desteklenir.

**Para birimleri:** TRY, USD, EUR ve GBP. Yeni proje varsayılanı **TRY**. Ürün fiyatları ve döviz dönüşümü henüz tanımlı değildir; teklif fiyatlandırma bekler.

## Teknolojiler

| Katman | Teknoloji / yaklaşım |
| --- | --- |
| Web uygulaması | Next.js 16 App Router, React 19, TypeScript |
| 3B sahne | Three.js, WebGL, parametrik modeller, GLB dışa aktarım |
| Arayüz | Tailwind CSS 4, Radix UI / shadcn bileşenleri, Lucide ikonları, özel CSS |
| Sunucu | Node.js 24 LTS, Next.js Route Handlers |
| Veritabanı | SQLite, Node `node:sqlite`, WAL, atomik işlemler, Drizzle şeması ve SQL geçişleri |
| Kimlik doğrulama | scrypt parola özetleri, sunucu oturumları, HttpOnly / SameSite çerezleri, rol denetimi |
| Üretim | Ubuntu 24.04, Nginx, systemd, Certbot / Let's Encrypt |
| Doğrulama | Node test runner, tsx, TypeScript, GitHub Actions |

3B çizim kullanıcının tarayıcısında gerçekleşir. Sunucu oturumları, kayıtları, yönetim işlemlerini ve teklif görüntülerini yönetir. Üretimde geliştirme emülatörü çalıştırılmaz.

## Hızlı başlangıç

**Gerekenler:** Node.js 24 LTS, npm ve Git. `.nvmrc` Node sürümünü belirtir.

```bash
git clone https://github.com/ibr4himfidan/mysilo-studio.git
cd mysilo-studio
npm ci
npm run db:init
npm run dev
```

Uygulama: **http://127.0.0.1:5188**

İlk çalıştırmada yönetici hesabı oluşturulur. E-posta ve rastgele parola yalnızca yerel `data/ilk-giris.txt` dosyasına yazılır. Sabit bir başlangıç şifresi yoktur. Hesabım menüsünden şifre değiştirilebilir. `db:init` tekrar çalıştırıldığında mevcut kullanıcıları veya projeleri sıfırlamaz.

| Adres | Amaç |
| --- | --- |
| `/login` | Kullanıcı girişi |
| `/` | Proje başlangıcı ve tesis düzenleyicisi |
| `/backoffice` | Yalnızca yöneticiye açık panel; ana menüde bağlantısı yoktur |
| `/catalog` | Ürün görselleri ve 3B model incelemesi |
| `/research` | Teknik kaynaklar ve araştırma notları |
| `/api/health` | Veritabanı bağlantısını da kontrol eden sağlık uç noktası |

### Üretim derlemesini denemek

```bash
npm run build:release
# Geliştirme sunucusunu durdurduktan sonra:
npm start
```

Derleme `.next/standalone` altında bağımsız bir sunucu paketi üretir. `build:release` görselleri, statik dosyaları ve veritabanı geçişlerini de pakete ekler. Linux sunucuya gönderilecek paketi Linux üzerinde derleyin.

## Kullanım akışı

1. Yönetici satış kullanıcılarını oluşturur; kıta veya ülkeleri temsilcilere atar.
2. Kullanıcı giriş yapar, projeyi adlandırır ve depolanacak ürünü seçer.
3. Sağ çekmecede tesis, konum, arsa ve silo türü belirlenir. İlk seçimden sonra merkezdeki saha korunur.
4. Silo adedi ve sıra düzeni seçilir; temelden montaja kadar kurulum oynatılır.
5. İsteğe bağlı ekipmanlar yerleştirilir; tek nesne, bağlı grup veya tüm tesis sınırlar içinde taşınabilir.
6. Kurulum tamamlanınca müşteri bilgileri girilir. İndirme öncesinde teklif görüntüsü veritabanına kaydedilir.
7. Yönetici projeyi, müşteriyi, ekipman listesini ve teklif geçmişini panelde görür.

Ayrıntılı kontroller: [Kullanım rehberi](docs/KULLANIM.md).

## Kayıtların korunması

Asıl kayıt **sunucudaki veritabanıdır**. Tarayıcı depolaması, henüz sunucuya ulaşmamış değişiklikler için yardımcı kuyruktur.

- Taslaklar ilk adımdan itibaren saklanır.
- Proje değişiklikleri sürüm kontrolüyle yazılır; eski oturum yeni sürümü sessizce ezemez.
- Kurulum ilerlemesi düzenli kontrol noktalarıyla kaydedilir.
- Müşteri formunun tamamlanmamış hali de saklanır.
- Teklif, o andaki proje/müşteri/yük profilinin değişmez görüntüsüdür.
- Proje kaldırma işlemi arşivlemedir; yönetici geri getirebilir.

```bash
# Tutarlı SQLite yedeği
npm run db:backup

# Yeni, boş bir kuruluma mevcut Mysilo SQLite/D1 yedeğini aktar
npm run db:import -- /tam/yol/mysilo-yedek.sqlite
```

Varsayılan veritabanı `data/mysilo.sqlite`, yedek dizini `data/backups/` olur. Üretimde bunlar koddan ayrı `/var/lib/mysilo` ve `/var/backups/mysilo` dizinlerindedir. Güncelleme sırasında mevcut proje kayıtları korunur. `.env.example` desteklenen ortam değişkenlerini gösterir.

GitHub kaynak kod yedeğidir; müşteri veya veritabanı yedeği değildir. `data/`, `.env`, şifre dosyaları, anahtarlar ve SQLite dosyaları depoya dahil edilmez.

## Bölgesel saha yükleri

Ülke ataması kıta atamasından önceliklidir. Temsilci konumdan belirlenir. Kar/deprem zone değerleri ve yükler, yöneticinin kaynak göstererek onayladığı saha profilinden uygulanır. Satışçı bu değerleri değiştiremez; kural API tarafında da uygulanır.

Onaylı profil bulunmuyorsa **Profil bekleniyor** gösterilir. Ülke geneline varsayımsal deprem veya kar yükü atanmaz. Profil revizyonu teklif görüntüsünde korunur. Harita servislerinden otomatik mühendislik verisi çekme entegrasyonu henüz yoktur.

## Sunucuya kurulum

Ubuntu sunucuda Nginx HTTPS bağlantısını karşılar; uygulama yalnızca `127.0.0.1:5188` üzerinde dinler. systemd uygulamayı yeniden başlatır, zamanlayıcılar veritabanını yedekler ve sertifikayı yeniler.

**[DigitalOcean / Ubuntu kurulum rehberi →](docs/SUNUCU-KURULUMU.md)**

`deploy/` dosyaları ilk kurulum, servisler, Nginx, yedekleme ve sürüm etkinleştirme adımlarını içerir. Güncelleme yeni bir sürüm dizinine açılır; sağlık kontrolü başarısız olursa önceki uygulama sürümüne dönülür. Veritabanı geçişlerinin geri alınması ayrı bir işlemdir.

## Geliştirme ve testler

```bash
npm test
npx tsc --noEmit
npm run build:release
npm run test:release
npm audit --omit=dev
```

Testler; yerleşim sınırlarını, ekipmanları, kurulum sırasını, JSON/GLB çıktısını, çevirileri, kullanıcı yetkilerini, kayıt çakışmalarını, müşteri/teklif saklamayı ve veritabanı yedeklerini kapsar. Önceki otomatik planlayıcının 576 senaryoluk doğrulaması da korunur. İş verisi testleri bağımsız SQLite örnekleri kullanır.

GitHub Actions her push ve pull request için testleri, bağımlılık kontrolünü ve Linux üretim derlemesini ve ayrı klasörde gerçek sunucu/giriş kontrolünü çalıştırır. İş akışının sunucu SSH anahtarına veya müşteri verilerine erişimi yoktur.

```text
app/                    Sayfalar ve HTTP API rotaları
components/auth/        Giriş ve hesap bileşenleri
components/project/     Başlangıç, konum ve sağ çekmece
components/backoffice/  Kullanıcı, bölge, proje, müşteri ve teklif panelleri
lib/server/             Yetkilendirme, iş kuralları ve SQLite bağlantısı
lib/                    Yerleşim, kurulum, kapasite ve model geometrisi
db/                     Drizzle veritabanı şeması
drizzle/                Sürümlü SQL geçişleri
public/                 Logo, ürün görselleri ve 3B varlıklar
scripts/                Veritabanı ve sürüm paketleme araçları
deploy/                 Ubuntu, Nginx ve systemd yapılandırması
tests/                  İşlev, geometri ve kalıcılık testleri
docs/                   Kullanım, araştırma ve işletim belgeleri
```

## Teknik kapsam ve kaynaklar

3B modeller parametrik ön yerleşim modelleridir; üretici CAD veya doğrulanmış imalat çizimi değildir. Kapasite sonuçları yaklaşık hesaplanır. Statik, zemin, deprem, yangın/ATEX ve uygulama projeleri mühendislik doğrulaması gerektirir. Ürün fiyatlandırması ve PDF teklif tasarımı sonraki kapsam içindedir.

- [Araştırma ve üretici kaynakları](docs/ARASTIRMA.md)
- [Kurulum ve yerleşim kuralları](docs/KURULUM-VE-YERLESIM.md)
- [Model ayrıntıları ve performans](docs/TASIMA-MODELLER-PERFORMANS.md)
- [Veritabanı ve yönetim](docs/VERITABANI-VE-YONETIM.md)

Mysilo logo ve ürün görsellerinin kaynak adresleri `public/mysilo/sources.json` ve alt katalog manifestlerinde yer alır. Markalar, görseller ve üçüncü taraf bileşenler kendi hak sahiplerine aittir; deponun public olması bunlar için ek kullanım hakkı vermez.
