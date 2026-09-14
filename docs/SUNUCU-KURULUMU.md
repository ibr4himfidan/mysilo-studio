# DigitalOcean / Ubuntu sunucu kurulumu

Bu dağıtım tek sunucu içindir: Ubuntu 24.04 x64, Node.js 24 LTS, Next.js standalone, SQLite, Nginx ve systemd. Uygulama root olarak çalışmaz. Veritabanı sürüm dizininin dışında kalır. Docker veya ayrı bir yönetilen veritabanı gerekmez. Daha yüksek eşzamanlı yazma yükünde PostgreSQL'e geçiş ayrıca değerlendirilmelidir.

## Dizinler ve servisler

| Yol / servis | Görev |
| --- | --- |
| `/opt/mysilo/releases/<surum>` | Değiştirilmeyen uygulama sürümleri |
| `/opt/mysilo/current` | Etkin sürüme işaret eden bağlantı |
| `/var/lib/mysilo/mysilo.sqlite` | Kalıcı proje, müşteri, kullanıcı ve teklif kayıtları |
| `/var/backups/mysilo` | Saatlik tutarlı veritabanı yedekleri |
| `/etc/mysilo/app.env` | Sunucu ortam ayarları; GitHub'a girmez |
| `/etc/letsencrypt/live/mysilo-ip` | IP sertifikası ve özel anahtar |
| `mysilo.service` | Uygulama; localhost:5188 |
| `mysilo-backup.timer` | Saatlik yedek |
| `mysilo-certbot.timer` | Günde iki kez sertifika yenileme kontrolü |

## 1. Yeni sunucuyu hazırla

Repo içindeki `deploy/` dizinini SSH ile yeni sunucuya aktarın. Aşağıdaki örnekte `SUNUCU_IP` yerini gerçek IPv4 adresiyle değiştirin:

```bash
scp -r deploy root@SUNUCU_IP:/root/mysilo-deploy
ssh root@SUNUCU_IP
bash /root/mysilo-deploy/bootstrap.sh SUNUCU_IP
```

Script Nginx ve gerekli paketleri yükler; Node.js 24 LTS'yi resmi dağıtımdan SHA-256 kontrolüyle kurar; `mysilo` sistem kullanıcısını, kalıcı veri dizinlerini, ortam dosyasını ve servisleri oluşturur. Swap yoksa 2 GiB swap ekler. SSH, HTTP ve HTTPS için UFW kuralları tanımlar. Yeni, bu projeye ayrılmış bir sunucu içindir; mevcut Nginx siteleri olan sunucuda önce yapılandırmayı inceleyin.

Let's Encrypt hesabı ve kısa ömürlü IP sertifikası oluşturulur. HTTP-01 doğrulaması için 80, HTTPS için 443 dışarıdan erişilebilir olmalıdır. DigitalOcean Cloud Firewall da kullanılıyorsa bu portlara izin verin. Uygulama portu 5188 internete açılmaz. SSH anahtarını terminalde `-i /anahtar/yolu` ile seçebilirsiniz.

## 2. Linux üretim paketini hazırla

Linux geliştirme/CI ortamında veya sunucuda:

```bash
git clone https://github.com/ibr4himfidan/mysilo-studio.git
cd mysilo-studio
npm ci
npm test
npm run build:release
tar -czf /tmp/mysilo-release.tar.gz -C .next/standalone .
```

Sunucunun kaynakları kısıtlıysa paketi ayrı Linux makinede derleyin. `.next/standalone` Linux bağımlılıkları içermelidir; macOS paketini doğrudan göndermeyin. Pakette veritabanı, özel anahtar veya `.env` bulunmamalıdır.

## 3. İlk veriyi aktar ve sürümü etkinleştir

Mevcut proje verileri taşınacaksa önce kaynakta `npm run db:backup` çalıştırın. Yedeği GitHub'a koymadan SSH üzerinden `/var/lib/mysilo/import.sqlite` olarak gönderin. Servis ilk kez başlatılmadan önce, çıkarılmış sürümün dizininde:

```bash
sudo -u mysilo env MYSILO_DATABASE_PATH=/var/lib/mysilo/mysilo.sqlite \
  MYSILO_BACKUP_DIR=/var/backups/mysilo \
  node scripts/database.mjs import /var/lib/mysilo/import.sqlite
```

Hedefte zaten veritabanı varsa aktarım reddedilir. Yerel D1 kayıtları kaynak SQL geçişleriyle birlikte dönüştürülebilir; kaynağın `projects` tablosunu içeren SQLite dosyası olması gerekir. Aktarım sonrası kullanıcı, proje, müşteri, teklif ve geçmiş sayıları kaynakla karşılaştırılmalıdır. Yeni üretim oturumlarını ayrı başlatmak için aktarılan `sessions` ve `auth_attempts` kayıtları temizlenebilir; kullanıcı şifreleri korunur.

Sunucuda uygulama arşivini etkinleştirin:

```bash
bash /root/mysilo-deploy/activate.sh /tmp/mysilo-release.tar.gz v1
```

Aktivasyon şema geçişlerini uygular ve önce yedek alır; yeni sürüme geçip sağlık kontrolünü çalıştırır. Boş kurulumda rastgele yönetici şifresi `/var/lib/mysilo/ilk-giris.txt` dosyasına yazılır. Taşınan veritabanında mevcut yönetici hesabı kullanılır.

## 4. Doğrula

```bash
curl --fail https://SUNUCU_IP/api/health
systemctl status mysilo --no-pager
systemctl list-timers 'mysilo-*'
nginx -t
/opt/certbot/bin/certbot renew --dry-run --cert-name mysilo-ip
```

Tarayıcıda `https://SUNUCU_IP/login` açın. Girişten sonra proje listesi, `/backoffice`, müşteri kayıtları ve kayıt sonrası yenileme akışı kontrol edilmelidir. HTTP otomatik olarak HTTPS'ye yönlendirilir. Üretim oturum çerezi Secure, HttpOnly ve SameSite=Strict olur.

IP sertifikaları yaklaşık altı gün geçerlidir. `mysilo-certbot.timer` yenilemeyi kontrol eder; başarıyla yenilenince Nginx yeniden yüklenir. Bir alan adına geçerken hem Nginx server_name/sertifika ayarları hem `MYSILO_PUBLIC_ORIGIN` güncellenmelidir. [Let's Encrypt IP sertifikası rehberi](https://letsencrypt.org/2026/03/11/shorter-certs-certbot).

## Güncellemeler, yedekler ve geri dönüş

Her sürümü benzersiz bir adla paketleyin. `activate.sh` başarısız sağlık kontrolünde önceki uygulama bağlantısını geri alır; uygulanmış veritabanı şemasını geri almaz. Geçişleri geriye uyumlu hazırlayın; şema geri dönüşü gerekirse servis durdurularak doğrulanmış yedek kullanılmalıdır. Güncelleme yapmadan önce yerel ve sunucu kayıtlarının farklı veritabanları olduğunu dikkate alın; geliştirme veritabanını çalışan üretimin üzerine kopyalamayın.

```bash
systemctl start mysilo-backup.service
journalctl -u mysilo -n 100 --no-pager
journalctl -u mysilo-certbot -n 100 --no-pager
```

Yedekler şimdilik aynı sunucudadır; ayrı bir makineye veya özel bir nesne depolama alanına şifreli kopya alınmalıdır. Saatlik yedeklerin kapladığı alan izlenmelidir; otomatik silme politikası uygulanmaz. DigitalOcean Droplet yedekleri uygulama içindeki tutarlı SQLite yedeğine ek korumadır.

GitHub Actions doğrulama yapar; sunucuya otomatik SSH dağıtımı yapmaz. Sunucu anahtarları depoda veya iş akışında tutulmaz. GitHub deposu ve release arşivi kaynak kod içerir; müşteri kayıtları ayrı tutulur.

Tek sunucu arızasında servis durabilir. Gerçek kullanım arttığında RAM, disk ve kayıt gecikmesini izleyerek makineyi büyütün; ayrı veritabanı, harici yedekleme ve yüksek erişilebilirliği ihtiyaçla birlikte planlayın.
