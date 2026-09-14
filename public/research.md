# Tahıl depolama tesisleri: araştırma ve tasarım esasları

## Güncel uygulama: yerleşim, liman ve taşıma

14 Eylül 2026 tarihli bu genişletme, elle yerleşim yapılan yerel editör içindir. Proje adı, ürün, arsa, silo sayısı, isteğe bağlı ekipmanlar, müşteri bilgisi, yedi dil ve dört para birimi önceki geliştirmelerde uygulanmıştır. Aşağıdaki ilk araştırma bölümlerinde geçen otomatik planlayıcı ve geliştirme önerileri başlangıç çalışmasının kaydıdır; güncel ana arayüzün tamamlanmamış özellik listesi olarak okunmamalıdır.

Bu çalışmada cevaplanan sorular: Konveyör nerede kurulmalı? Hangi Mysilo taşıma aileleri ayrı seçilmeli? Gemiye yükleme için kullanılabilir kara sınırı nerede bitmeli? Kar, rüzgâr ve kıyı ortamı hangi tasarım girdilerini gerektirir? Ürün biçimleri ve kullanım amaçları için öncelik Mysilo sayfalarına; iklim ve yapısal tasarım kapsamı için resmi kurumlara; liman iş akışını çapraz kontrol etmek için gemi yükleme üreticisine verildi. Kaynak sayfalarının revizyonu bilinmediğinde erişim tarihi, yayın tarihi yerine kullanılmadı.

Sonuç olarak 16 taşıma/yükleme seçeneği, yerel üretici görselleri, ürün ailesine göre farklı 3B geometriler, dört yöne dönebilen rıhtım, ayarlanabilir gemi ve kayıtlı tasarım girdileri eklendi. Kar yükünden yalnızca kullanıcı tarafından verilmiş düzgün yayılı çatı yükünün toplam kuvveti hesaplanır. Üretici SKU seçimi, yapısal yeterlilik, kesintisiz tahıl akışı ve uygulama projesi bu modelin çıktısı değildir.

## Liman akışı, rıhtım sınırları ve gemiye yükleme

Kullanıcının tarif ettiği akış, depodaki tahılın gemiye yüklenmesidir. Ship loader bu işi yapar; ship unloader ise gemi ambarından ürünü karaya alır. İki makine aynı isim altında seçilmemelidir. Mysilo MYPORT ve mobil teleskopik bant seçenekleri gemiye yükleme tarafında değerlendirilmiştir. NEUERO’nun ayrı yükleme/tahliye ürünleri de bu işlev ayrımını doğrular; onun makineleri Mysilo modeli olarak kopyalanmamıştır. [40](https://www.mysilo.com/tr/category/377/Mobil-Teleskopik-Bant-Konveyor) [41](https://www.mysilo.com/tr/category/434/Gemi-Yukleme-) [52](https://neuero.de/en/produkte/schiffsbelader) [53](https://neuero.de/en/produkte/schiffsentlader)

Önerilen işletme zinciri ana stok → silo boşaltma hattı → transfer/elevatör → rıhtım taşıma hattı → yükleyici → gemi ambarıdır. Bu bir ön proje akış önerisidir. Numune, tartım, toz toplama, yönlendirme klapeleri ve bakım erişimi gerçek işletme ihtiyacına göre eklenir. Hat debisi tek bir büyük makinenin kapasitesiyle belirlenemez; besleyen ve boşaltan ekipmanların birlikte çalışması gerekir. Uygulamadaki hedef t/h alanı müşteri talebini kaydeder, otomatik makine kapasitesi veya motor gücü seçmez.

Editörde arsa ana kara parselidir; rıhtım seçilen kıyı kenarının dışına eklenir. Kıyı kuzey, güney, doğu veya batı olabilir. Silolar kendi temel ve çevre paylarıyla parsel içinde kalır. Konveyörler rıhtıma uzanabilir. Yeni gemi yükleyicilerin taşıyıcı tabanı rıhtım üzerinde kalır; uzatma kolu suya erişebilir. Böylece uzun bomun bütünü kara tabanı gibi yorumlanmaz. Görünüm, yerleşim denetimi, 2B plan ve gemi ambarı kontrolü aynı kıyı koordinatlarını kullanır.

Başlangıç rıhtımı 14 m, gemi-kıyı boşluğu 3 m, gemi eni 20 m, boyu 90 m ve ambar sayısı 4 olarak seçildi. Bunlar değiştirilebilir görsel başlangıç değerleridir; mevcut limana ait ölçüm veya zorunlu standart mesafesi değildir. Kullanıcı gerçek iskele projesi ve hedef gemiyle değiştirmelidir. Birbirine sığmayan gemi eni/boyu veya ambar sayısı kayda alınmaz. Yükleyici ucunun ambarın plan izdüşümüne ulaşıp ulaşmadığı gösterilir; gemi draftı, gelgit, trim, hareket, borda geçiş yüksekliği ve bom çalışma zarfı henüz çözülmez.

Deniz artık parsel kadar küçük bir dikdörtgen değildir. Kıyıdan dışarı uzanan geniş bir yüzey, hareketli ışık/dalga ayrıntısı, rıhtım tamponları, babalar, bağlama hatları ve açık ambarlı dökme yük gemisi kullanılır. Bu çevre görsel bağlam sağlar; hidrografik harita, su derinliği, yaklaşma kanalı, rıhtım taşıma gücü ve işletme izni yerine geçmez.

## Mysilo taşıma kataloğu ve model karşılıkları

Bantlı grup dört ayrı seçim içerir: K, V, R ve U. K için kapalı modüler kasa; V için açık bant ve rulolar; R/U için farklı oranlarda taşıyıcı gövde ve üretici görsellerindeki bombeli kapak biçimi kullanıldı. Sayfalarda açık/kapalı düzen, boy ve kapasite anlatımları modele göre değişir; tek bir “konveyör” kutusuyla bütün aileleri temsil etmek uygun değildir. Editördeki uzunluk, genişlik ve kotlar düzenlenebilir yerleşim ölçüleridir. [28](https://www.mysilo.com/tr/category/98/K-model) [29](https://www.mysilo.com/tr/category/99/V-model) [30](https://www.mysilo.com/tr/category/100/R-model) [31](https://www.mysilo.com/tr/category/211/U-Model)

Zincirli grup F · H, S · HI ve C olarak ayrıldı. F ve S üretici serileridir; H ve HI burada görsel olarak temsil edilen düzenlerdir. F içindeki bütün H/BH/IH/U veya S içindeki bütün HI/I/HIH alt tipleri ayrı SKU olarak uygulanmış değildir. F için düz kapalı modüller; S için yatay başlangıç ve yükselen bölüm; C için daha kompakt boşaltma kasası, kapaklar, flanşlar ve tahrik kullanıldı. [32](https://www.mysilo.com/tr/category/386/F-Serisi) [33](https://www.mysilo.com/tr/category/387/S-Serisi) [34](https://www.mysilo.com/tr/category/388/C-Serisi)

D ve L tüp konveyörlerde üretici resimlerindeki paralel tüp/geri dönüş düzeni farklı geometrilerle gösterilir. U helezonunda açık oluk, şaft ve helis; tüp helezonda kapalı boru ve tahrik bulunur. Tüp konveyörün kapalı taşıma devresi ile helezonun dönen vidalı mekanizması aynı makine olarak sunulmaz. Eğim/yükselti girilebilmesi, her ürünün bu eğimde istenen kapasiteyi sağlayabileceği anlamına gelmez. [35](https://www.mysilo.com/tr/category/366/D-Model) [36](https://www.mysilo.com/tr/category/368/L-Model) [37](https://www.mysilo.com/tr/category/103/U-Helezonu) [38](https://www.mysilo.com/tr/category/105/tup-helezon)

Mobil bant; tekerlek, eğimli kafes taşıyıcı ve kaldırma bağlantılarıyla temsil edilir. Mobil teleskopik bant ayrı gemi yükleme seçeneğidir. MYPORT modelinde üretici görselinden portal kule, platformlar, silindirik/konik gövdeler, taşıyıcı bom ve aşağı uzanan yükleme ucu ayrıştırıldı. R ve U arabalı bantlarda ise yüksek boşaltma bölümü ve yönlendirme ağzı bulunur. Hareketli arabanın hat boyunca seyri ve ürünün dinamik akışı bu sürümde simüle edilmez. [39](https://www.mysilo.com/tr/category/376/Mobil-Bant-Konveyor) [40](https://www.mysilo.com/tr/category/377/Mobil-Teleskopik-Bant-Konveyor) [41](https://www.mysilo.com/tr/category/434/Gemi-Yukleme-) [42](https://www.mysilo.com/tr/category/454/R-Model) [43](https://www.mysilo.com/tr/category/453/U-Model)

Toplam 16 modelin seçim kartındaki SVG/PNG/JPG dosyası üreticinin kendi ürün sayfasından alınmıştır. Dosyalar yereldir; editör açıldığında üretici sunucusuna bağlı kalmaz. Her dosyanın kaynak sayfası, medya adresi ve inceleme tarihi varlık manifestinde tutulur. 3B nesneler bu görsellerle aynı CAD dosyası değildir: sahne için geliştirilen parametrik geometrilerdir. Birebir imalat geometrisi için revizyonu belli üretici CAD/GLB dosyaları ve model kodları gerekir.

Kapasite verisinde dikkat çeken açık nokta birim tutarlılığıdır: U sayfasındaki tanıtım anlatımıyla teknik tabloda kullanılan m³/h birimi aynı biçimde yazılmamıştır. Bu nedenle başlık rakamları doğrudan t/h olarak içe aktarılmadı. Kütlesel debi, doğrulanmış hacimsel debi ile gerçek yığın yoğunluğundan türetilir: t/h = m³/h × kg/m³ ÷ 1000. Bant hızı, doluluk, eğim, ürün ve kesin model kodu doğrulanmadan uygulama nominal performans puanı göstermez. [31](https://www.mysilo.com/tr/category/211/U-Model)

## Liman ve kara tesisi için depolama seçimi

Liman seçimi bütün siloları farklı bir gövdeye dönüştürmez. Mysilo düz tabanlı siloları yüksek tonajlı ve uzun süreli stok için tanımlar; ticari konik silolar farklı boşaltma/işletme ihtiyaçlarına cevap verir. Buradan çıkan ön proje önerisi, büyük liman ana stoklarında düz tabanlı veya endüstriyel ana depoları, hızlı parti geçişi ve kısa süreli tampon ihtiyacında uygun konik çözümleri birlikte değerlendirmektir. Bu bir zorunlu ürün reçetesi değildir. [45](https://www.mysilo.com/tr/category/17/duz-tabanli-silo) [46](https://www.mysilo.com/tr/category/18/ticari-konik-silo)

Silo adedi toplam tonaja ek olarak ürün ve kalite ayrımı, aynı anda gemiye ayrılan parti, kabul ve yükleme sırasında hatların paylaşımı, bakımda yedeklilik ve büyüme ihtiyacına bağlıdır. Kare, yem ve geçici depolama seçenekleri otomatik olarak yasaklanmadı; uygunluk müşterinin ürününe ve işletme amacına göre değerlendirilir. Arayüzde liman için ana stok/tampon ayrımı kısa bir notla açıklanır; karar kullanıcıda kalır.

Gerçek çap, halka sayısı, gövde sacı, stiffener, çatı taşıyıcıları ve ankraj seçimi yalnız depolama hacminden çıkmaz. Mysilo ürün ve F serisi belgeleri saha rüzgârı, karı ve deprem koşullarının tasarımla ilişkisini belirtir. Editörde iklim girdisi değişince görsel sac kalınlığına rastgele bir katsayı uygulanmaz; modelin uygun olduğunu söylemek için üretici hesap revizyonu gerekir. [44](https://www.mysilo.com/upload/ckfinder/files/catalogue/en/mysilo-flat-bottom-silo.pdf) [45](https://www.mysilo.com/tr/category/17/duz-tabanli-silo)

## Kar, rüzgâr, deprem, zemin ve kıyı ortamı

Kar için zemindeki karakteristik kar yükü ile çatıda uygulanacak yük ayrılmalıdır. Çatı biçimi, kar dağılımı ve birikme durumları tasarım standardına bağlıdır. Rüzgârda temel hız tek başına basınç ve taşıyıcı kuvvet sonucu değildir. JRC kapsam sayfası kar için EN 1991-1-3, rüzgâr için EN 1991-1-4, silo/tank etkileri için EN 1991-4; çelik silo tasarımı için EN 1993-4-1 gibi ayrı başlıklar gösterir. Projede uygulanacak baskı ve ulusal ek yetkili tasarımcı tarafından belirlenmelidir. [47](https://eurocodes.jrc.ec.europa.eu/EN-Eurocodes/eurocode-1-actions-structures) [48](https://eurocodes.jrc.ec.europa.eu/EN-Eurocodes/eurocode-3-design-steel-structures)

Ülke ve saha önemlidir: Eurocode ulusal parametreleri, ilgili ülkenin iklim/coğrafya koşullarını ve ulusal tercihlerini kapsar. Uygulama konum ve standart/ulusal ek metniyle birlikte çatı kar yükünü kN/m², temel rüzgâr hızını m/s, deprem PGA değerini g, zemin taşıma girdisini kPa olarak saklar. Boş alanlar null kalır. Eksik bilgi sıfır yük veya risksiz saha olarak kabul edilmez; girilmiş alan sayısı tasarım onayı değil veri tamlığı göstergesidir. [49](https://eurocodes.jrc.ec.europa.eu/en-eurocodes-implementation/nationally-determined-parameters)

Kar özeti yalnız düzgün yayılı kullanıcı çatı yükü × yatay çatı izdüşüm alanıdır. Dairesel siloda alan πD²/4, kare siloda en × boy alınır. Örneğin 10 m çapta 1,2 kN/m² yük yaklaşık 94,2 kN toplam kuvvet verir. Bu basit aritmetik, birleşik yük halleri, dengesiz kar birikmesi, burkulma, bağlantı, temeller veya malzeme dayanımı hesabı değildir. Zemindeki kar haritası değeri doğrudan bu alana taşınmamalıdır.

Türkiye için eski “deprem bölgesi” numarasını yeni bir proje varsayımı yapmak uygun değildir. AFAD yeni haritayı 2018’de duyurmuş, 2019 yürürlüğünü açıklamış ve bölge yerine koordinata bağlı tehlike değerlerine geçmiştir. Harita uygulaması da yerel zemin büyütmesi, sıvılaşma ve oturma etkilerinin ayrıca değerlendirilmesi gerektiğini bildirir. Tek PGA girdisi bir silo için deprem tasarımını tamamlamaz; spektrum, zemin sınıfı, önem ve davranış parametreleri ayrıca gerekir. Bu sürüm AFAD oturumuna girmez veya otomatik değer çekmez. [50](https://tdth.afad.gov.tr/TDTH/loginControl.xhtml) [51](https://en.afad.gov.tr/turkeys-new-earthquake-hazard-map-is-published)

Kıyıda korozyon, yağışla yıkanma, klorür, ıslanma-kuruma ve su sıçrama koşulları kaplama ömrünü etkileyebilir. Deniz atmosferi ile sürekli su altında veya gelgit/sıçrama bölgesindeki davranış aynı değildir. Bu nedenle kara ve liman projelerinde korozyon sınıfı ayrıca kaydedilir; liman seçildi diye otomatik C5/CX atanmaz. Kullanıcı sınıfı ve kaplama sistemi saha değerlendirmesiyle belirlemelidir. Renkli 3B malzeme galvaniz kalınlığı veya korozyon dayanımı belgesi sayılmaz. [54](https://galvanizing.org.uk/atmospheric-corrosion/) [55](https://galvanizing.org.uk/corrosion-performance-in-other-environments/)

Kaynaklar arasında dönem farkı bulunur. Mysilo’nun eski depolama kitapçığında eski deprem/standart referansları ve belirli ürün koşullarına ait rüzgâr/kar kabulleri vardır; bunlar bütün sahalara güncel varsayılan olarak kopyalanmadı. F serisi broşürü saha yüklerinin belirlenmesini vurgular. Eski katalogdaki sayı, yeni lokasyon ve güncel sipariş şartının yerine geçmez. Kullanılacak standart baskısı ve ürün tasarım esasları üreticiyle teyit edilmelidir. [44](https://www.mysilo.com/upload/ckfinder/files/catalogue/en/mysilo-flat-bottom-silo.pdf) [56](https://mysilo.com/assets/tahil-depolama-kitapcik.pdf)

## Konum, montaj animasyonu ve doğrulama sınırları

Yerleştirme hatasının nedeni son nesnenin koordinatını kaybetmesi değildi: montaj alanı parselin sabit tarafına öncelik veriyor, yeni iş başlayınca kamera yeniden ortalanıyordu. Montaj adayları artık tıklanan noktaya uzaklığıyla sıralanır. Boş ve yeterli alanda konveyör doğrudan tıklanan konumda zeminde birleştirilir; sonra o konumun üstündeki seçilmiş kota kaldırılır. Yerleştirmenin 0,5 m konum adımı korunur. Kamera her yeni ekipmanda başlangıç açısına dönmez.

Silo veya başka ekipmanla dolu bir noktadaki üst kot hattı için zeminde aynı yerde montaj mümkün olmayabilir. Böyle bir durumda yakın uygun montaj alanı aranır; yeterli alan yoksa işlem başlamaz. Kaydedilen nihai x/z koordinatı bu arama nedeniyle değiştirilmez. Vinç, işçi ve montaj rezervi gerçek kaldırma planı değildir; saha uygulanabilirliği ayrıca doğrulanmalıdır. Rıhtım da montaj için kullanılabilir kara hesabına katılır, su montaj alanı sayılmaz.

Otomatik doğrulamalar farklı konumlarda konveyörün başlangıç ve bitiş koordinatlarını, bütün üretici varyantlarının sonlu geometrisini, yerel görselleri ve kayıt kimliğini, dört kıyı yönünün sınırlarını, ambar erişimini, kurulum sonu geometri eşitliğini, deniz alanını ve boş/yanlış yük girdilerini kapsar. Bunlar yazılım ve geometri kontrolleridir; üretici performans testi veya statik mühendislik onayı değildir.

Sonraki teknik veri entegrasyonunun sırası: kesin SKU ve revizyonlu CAD → doğrulanmış kapasite tabloları → bağlantı ağı ve debi/kot uyumu → işletme/bakım zarfları → saha yüklerine göre üretici tasarım seçimi → mühendis incelemesi ve teklif. Yeni model dosyaları geldiğinde gerçek görsel ile parametrik model arasındaki fark kapatılabilir. Böylece yerleşim özgürlüğü korunurken teklif ve uygulama çıktısı gerçek ürün verisine dayanır.

## Tesisin kapsamı ve terminoloji

Bir tahıl tesisi, ürün kabulünden sevkiyata kadar birbirine bağlı bir sistemdir. Ana stok hacmi; taşıma hatları, şartlandırma, numune alma, kalite ayrımı, araç hareketleri ve işletme disipliniyle birlikte ele alınmalıdır. Kuzey Amerika kataloglarında grain bin, grain storage bin, grain leg; Avrupa ve Türkiye kataloglarında steel silo, grain storage silo, bucket elevator, flat-bottom ve hopper-bottom ifadeleri kullanılır. Ürün ararken yalnızca silo kelimesi kullanılması silaj, çimento ve sıvı depolarını da sonuçlara getirir. Tahıl ürünü, malzeme ve boşaltma biçimi birlikte belirtilmelidir. [1](https://www.mysilo.com/en/category/17/flat-bottom-silos) [11](https://www.siloscordoba.com/wp-content/uploads/2024/09/02.Handling-Equipment-En-V1.pdf) [26](https://www.brockgrain.com/brock-product/on-farm-grain-bins/)

Ön proje için doğru başlangıç, müşteri bilgi formu ve tasarım esasları belgesidir. Bu çalışmanın yazılım önerisi; her kararın girdisini, hesap yöntemini, kaynağını ve doğrulanma durumunu aynı proje içinde tutmaktır. “Üretici verisi”, “kullanıcı ölçümü”, “geometrik tahmin” ve “temsili ekipman” birbirinden ayrılmalıdır. Böylece bir katalogdan alınan çapın, aynı katalogdaki taşıma kapasitesi veya statik yeterlilikle karıştırılması önlenir.

İlk uygulama Türkiye odaklı ticari tesislerin ön yerleşimini hedefler. Örnek senaryo 6.000 ton buğday ve 120 × 85 metre dikdörtgen arsadır. Girdiler değiştirilebilir. Bu ölçek seçimi bir pazar büyüklüğü tahmini değildir; geliştirme kapsamıdır. Arsa poligonu, farklı ürünlerin birlikte stoklanması, gerçek marka/model eşleştirmesi ve teklif maliyeti sonraki geliştirme aşamalarında ele alınacaktır.

## Müşteriden alınacak bilgiler

Ürün dosyasında ürün türü, çeşidi, kullanım amacı, hasat bölgesi, ölçülmüş yığın yoğunluğu, giriş nemi dağılımı, sıcaklığı, yabancı madde oranı, kırık tane oranı ve hedef kalite sınıfı bulunmalıdır. Tohumluk ve maltlık ürünlerin kalite hedefleri yemlik ürünle aynı değildir. Müşterinin beyan ettiği toplam tonaj, aynı anda tutulacak stok mu yoksa yıllık işlem hacmi mi olduğu belirtilmeden tasarıma alınmamalıdır.

İşletme dosyası; pik günlük kabul, çalışma saatleri, araç başına yük, aynı anda boşaltılacak araç sayısı, sevkiyat hızı, farklı partilerin sayısı ve sezon dışı kullanımını kapsamalıdır. Altı farklı kalite partisi tutulacaksa tek bir büyük silo toplam tonajı karşılasa bile işletme ihtiyacını karşılamaz. İlk sürümde “en az parti” girdisi, bu gereksinimin basitleştirilmiş karşılığı olarak asgari silo sayısına uygulanır. Parti başına farklı kapasite henüz atanmaz.

Saha dosyasında ölçülü sınır, kuzey, kotlar, topoğrafya, yol bağlantısı, mevcut yapılar, irtifaklar, çekme mesafeleri, yükseklik sınırı, zemin etüdü, yeraltı suyu, elektrik gücü ve yakıt kaynağı yer almalıdır. Bir arsaya makine yerleştirmek için sadece metrekare bilgisi yeterli değildir. Aynı alandaki dar uzun ve kare parsellerin araç dolaşımı, konveyör uzunluğu ve büyüme olanağı farklıdır.

Teslim beklentileri ayrıca kaydedilmelidir: yalnız ekipman tedariki, temel dahil anahtar teslim, otomasyon, operatör eğitimi, yedek parça, performans testi ve bakım kapsamı. Belirsiz kalan bilgiler tahminle sessizce doldurulmamalı; ön proje varsayımı olarak işaretlenmelidir. Yazılımın önerilen müşteri akışı ürün → işletme → saha → teknoloji → alternatifler → teknik inceleme sırasını izler.

## Ürün özellikleri ve depolanabilirlik

Depolama kütlesi hacim ile yığın yoğunluğunun çarpımıdır. Bu yoğunluk, tane malzemesinin gerçek yoğunluğu değildir; taneler arası boşlukları da içerir. Çeşit, nem, saflık ve yerleşme durumuna bağlıdır. Cimbria Delta 145 tablosu örneğin buğday için 0,76 t/m³, mısır için 0,71, soya için 0,72, ayçiçeği için 0,40 ve çeltik için 0,51 değerlerini kendi performans koşullarında kullanır. Bu değerler tüm partiler için sabit fiziksel özellik sayılmamalıdır. [7](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/data-sheets/screen-cleaner/140/Pre_Cleaner_145_Datasheet_EN.pdf)

Uygulamada başlangıç yoğunlukları buğday 769, mısır 720, arpa 640, soya 720, ayçiçeği 400 ve çeltik 510 kg/m³ olarak kullanılır. İlk üç değer Mysilo kapasite tablosundaki referans yoğunluk sınıflarıyla uyumludur; ürünlere eşleştirilmesi ön proje varsayımıdır. Diğer üç değer Cimbria örneklerinden alınmıştır. Kullanıcı bunları numune ölçümüyle değiştirmelidir. Aynı silo hacminde 400 kg/m³ ürün, 769 kg/m³ ürünün yaklaşık %52’si kadar kütle tutar. [2](https://www.mysilo.com/upload/ckfinder/files/capacity/mysilo-flat-bottom-silo-capacity-chart-en.pdf) [7](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/data-sheets/screen-cleaner/140/Pre_Cleaner_145_Datasheet_EN.pdf)

Nem hedefi ürün, sıcaklık, depolama süresi ve son kullanım koşuluyla tanımlanmalıdır. University of Minnesota, buğday ve arpa kurutmada %13–14 aralığını genel çerçeve olarak verir. Aynı kurumun sıcak dönem depolama rehberi daha düşük hedefler belirtir: mısır %13–14, soya %11–12, buğday %13, arpa %12 ve yağlık ayçiçeği %8. Bu fark çelişki değil; depolama koşulu ve süre farkıdır. Minnesota kış sıcaklıkları Türkiye için doğrudan işletme reçetesi değildir. [4](https://extension.umn.edu/agriculture/crop-production/small-grains/drying-wheat-and-barley) [6](https://blog-crop-news.extension.umn.edu/2024/03/proper-spring-grain-drying-and-storage.html)

İlk sürümde nem değerleri düzenlenebilir senaryo girdileridir; güvenli depolama garantisi vermez. Arpa %12 ve ayçiçeği %8 başlangıç hedefiyle açılır. Çeltik için %13 yalnızca yer tutucu proje varsayımıdır; çeşit, çatlama, randıman ve kademeli kurutma reçetesi ayrıca alınmalıdır. Yağlı tohumlar ve çeltik için ürün özel inceleme uyarısı gösterilir. Sıcaklık, nem ve süreye bağlı izin verilebilir depolama ömrü modeli henüz uygulanmamıştır.

## Silo tipi ve kapasite hesabı

Düz tabanlı çelik silolar uzun süreli ve yüksek hacimli stok için yaygın bir çözümdür. Mysilo ürün sayfası 4,58–41,25 metre çap aralığı bildirir. OBIAL farklı bir ürün ailesinde 3,67–32,72 metre aralığı verir. Bu fark, tüm üreticilerin tek bir evrensel modüler çap dizisi kullanmadığını gösterir. Üretici model kodu, çap, gövde yüksekliği ve hacim aynı kayıt altında tutulmalıdır. [1](https://www.mysilo.com/en/category/17/flat-bottom-silos) [21](https://obial.com.tr/urunler/dtsilo)

Konik tabanlı silo; yerçekimiyle boşaltma, sık parti değişimi, tamponlama veya proses beslemesi için değerlendirilebilir. Bununla birlikte bir koninin bulunması tüm ürünlerde tam boşalmayı, kütlesel akışı veya FIFO işletmesini tek başına kanıtlamaz. Duvar sürtünmesi, ürün akış özellikleri, çıkış ölçüsü ve koni açısı üreticiyle belirlenmelidir. Bu yazılımın hopper modeli bir geometrik hacimdir; akış garantisi değildir.

Ön hesapta r = D/2, Vsilindir = πr²H, Vüst = πr² × (r tan 28°)/3 alınır. Konik taban seçilirse 45° varsayımıyla Valt = πr³/3 eklenir. Kullanılabilir hacim, bu toplamın %95’idir. Kütle ton = Vkullanılabilir × yoğunluk kg/m³ ÷ 1000. %95 dolum katsayısı uygulama varsayımıdır; kullanıcıya bildirilen hesap esasıdır. H, silindirik gövde yüksekliğidir; zemin ile çatı tepesi arası mesafe değildir.

Mysilo’nun 800 kg/m³ tablosu kapasite hesabında %6 sıkışma ve 28° yığılma açısı kullandığını belirtir. Bu uygulama sıkışma artışı uygulamaz. Bu nedenle aynı çap ve gövde yüksekliği seçilse bile marka kataloğundaki tonajla birebir eşleşme beklenmez. Üst ürün yığını ile fiziksel çatı arasındaki boşluk da gerçek ürün tasarımından doğrulanmalıdır. Statik duvar yükü hesabı hacim hesabından türetilemez. [3](https://www.mysilo.com/dosyalar/kapasite-tablolari/mysilo-flat-bottom-silo-capacities-table-800.pdf)

Düz taban boşaltmada merkez çıkış, ara çıkışlar, helezon veya zincirli çıkarma hattı ve dip süpürücü birlikte ele alınmalıdır. Dip süpürücü ve üst yürüme yolları üretici ekipman kataloğunda ayrı bileşenlerdir. İlk sürüm bunların yapısal ve mekanik hesabını yapmaz; ana silo ve üst hatları şematik gösterir. [25](https://mysilo.com/en/category/222/silo-equipments)

## Ürün akışı ve taşıma hatları

Önerilen genel akış; giriş kaydı ve numune → tartım → alım çukuru → kaba temizleme ve aspirasyon → gerekirse yaş ürün tamponu → kurutma ve soğutma → depolama → geri alma → sevkiyat tartımıdır. Kuru ürün için kurutucu bypass hattı, farklı ürünler için ayrı rotalar ve bakım için erişim düşünülmelidir. Bu bir kavramsal proses önerisidir; her tesisin kabul protokolü ve ürün hattı ayrıca tanımlanır.

Kovalı elevatör dikey taşıma, zincirli konveyör ve bant konveyör yatay dağıtım, helezon kısa mesafe aktarım ve boşaltma işlerinde değerlendirilen ekipman aileleridir. Silos Córdoba endüstriyel ürün listesi bunları, sürgülü klapeler ve dip süpürücülerle birlikte sunar. Seçim; mesafe, kot, ürün hassasiyeti, çalışma süresi, temizlenebilirlik ve kapasiteye göre yapılmalıdır. [11](https://www.siloscordoba.com/wp-content/uploads/2024/09/02.Handling-Equipment-En-V1.pdf)

Günlük kabulün çalışma saatine bölünmesi ortalama gerekli debiyi verir: 800 ton/gün ÷ 10 saat/gün = 80 t/sa. Bu değer pik kamyon boşaltma debisi değildir. Örneğin 25 tonluk bir aracın 10 dakikada boşaltılması anlık 150 t/sa kabul gerektirebilir. Çukur tamponu, vardiya dağılımı ve hat eşzamanlılığı bu farkı karşılamalıdır. Yazılım bugün ortalamayı gösterir; araç kuyruğu veya dinamik tampon simülasyonu yapmaz.

Bir hattın performansını en dar kapasite ve ürün koşulu belirler. Referans olarak Delta 145’in buğday ön temizleme tablosundaki 60 t/sa değeri, 80 t/sa hedefli örnek tesise otomatik uygun sayılmaz. Aynı veri sayfası nem ve yabancı madde değişiminin kapasiteyi etkilediğini söyler. Bu nedenle uygulamadaki temizleyici görünümü gerçek Delta 145 seçimi değildir. [7](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/data-sheets/screen-cleaner/140/Pre_Cleaner_145_Datasheet_EN.pdf)

Zincirli taşıma hatlarında taşma, dönme ve sıcaklık algılama gibi izleme noktaları ürün tasarımının bir parçasıdır. Silos Córdoba’nın ağır hizmet zincirli konveyörü bu tip sensörleri açıklamaktadır. İlk sürümde turuncu üst bağlantılar yalnızca şematik rota gösterir; taşıyıcı köprü, destek kulesi, tahrik gücü, eğim, klape ve çakışma çözümü yerine geçmez. [10](https://www.siloscordoba.com/products/handling-equipment/heavy-duty-range/chain-conveyor/)

## Kurutma, havalandırma ve kütle dengesi

Kurutma üründen su uzaklaştırır; depolama havalandırmasının başlıca amacı ise tane sıcaklığını yönetmek ve depolama koşullarını düzenlemektir. University of Minnesota düşük sıcaklıklı doğal hava kurutmasını yüksek sıcaklıklı kurutmadan ayırır; doğal hava kurutmasının haftalar sürebildiğini belirtir. Bu nedenle küçük bir depolama fanının varlığı, yüksek nemli ürün için endüstriyel kurutucu kapasitesinin bulunduğu anlamına gelmez. [4](https://extension.umn.edu/agriculture/crop-production/small-grains/drying-wheat-and-barley)

Sürekli akışlı kurutucuda ürün, kurutma ve soğutma bölümlerinden geçer. Cimbria karışık akışlı modüler kurutma kolonlarını, değişken boşaltma ve hava dağılımı elemanlarıyla açıklar. Gerçek seçim için giriş ve hedef nemi, ürün, ortam sıcaklığı ve bağıl nemi, yakıt, enerji verimi, kalite kaybı ve garanti koşulları birlikte istenmelidir. [8](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/brochures/drying/continuous-flow-dryer/Continuous_Flow_Dryer_GB.pdf) [9](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/data-sheets/continuous-flow-dryers/a-b-c-d-e-dryers-eco-master/Dryer_Column_Datasheet_EN.pdf)

Yaş bazda nemler kullanıldığında kuru madde korunumu: Mkuruürün = Myaşgiriş × (100 − nin)/(100 − nout). Uzaklaştırılan su = Myaşgiriş − Mkuruürün. Örnek senaryoda 80 t/sa ürün %16’dan %13,5’e indirildiğinde yaklaşık 2,31 t/sa su uzaklaşır; çıkış yaklaşık 77,69 t/sa olur. Bu matematiksel denge yabancı madde ayırma, tane kaybı veya yakıt tüketimini içermez. Kurutucu t/sa değeri yerine kullanılmamalıdır.

Yaş tampon kapasitesi, saatlik kabul ve kurutma farkının süre boyunca birikmesinden hesaplanmalıdır. Tek bir sabit tampon silosunun her senaryoya yeterli olduğu varsayılmamalıdır. Bu sürüm yaş tamponunu yerleşim rezervi olarak gösterir ve ana stok tonajına katmaz. Gerçek hacim, bekleme süresi ve sıcak ürün riskleri için ayrı boyutlandırma gereklidir.

Depolama izleme planı sıcaklık kabloları, fan çalışma kayıtları, nem kontrolü ve gerektiğinde numune analizini içermelidir. UMN, nem göçü ve sıcaklık farklarının bozulmaya yol açabildiğini; tahılın düzenli izlenmesi gerektiğini vurgular. Türkiye’deki iklim ve işletme koşulu için fan kontrol stratejisi yerel uzmanlıkla uyarlanmalıdır. Uygulama fan gücü, statik basınç ya da hava dağılımı çözmez. [5](https://extension.umn.edu/agriculture/crop-production/small-grains/storing-wheat-and-barley)

## Arsa yerleşimi ve optimizasyon yaklaşımı

Yerleşim tasarımında önce parselin kullanılabilir bölgesi belirlenir. Bina yaklaşma sınırları, mevcut yapılar, enerji hatları, kapılar, yangın erişimi, kamyon manevrası, drenaj, bakım ve gelecekteki genişleme alanları ayrı katmanlardır. Ekipman yalnız nominal sac çapıyla değil, temel çıkması, fan, merdiven, servis boşluğu ve bağlantılarıyla birlikte değerlendirilmelidir.

Mevcut algoritma iki yerleşim yönünü dener. Seçilmiş çaplar ve gövde yükseklikleri arasından hacim hesabıyla silo adedi bulur; asgari parti sayısını korur. Dış sınır mesafeleri çıkarılır, kurutuculu tesiste 32 metre, kurutucusuz tesiste 22 metre derinlikte ekipman bölgesi ayrılır. Bunlar yazılımın başlangıç rezervleridir; resmi güvenlik mesafesi değildir.

Aday silolar satır ve sütun düzeninde yerleştirilir. Kapasite hedefini karşılamayan veya dikdörtgen depolama alanına sığmayan adaylar elenir. Kalan adaylar fazla kapasite, silo sayısı, kaplanan alan ve yükseklik ağırlıklarıyla sıralanır. Bu skor satın alma maliyeti değildir ve küresel optimum kanıtı sunmaz. Mevcut katalog aramasında en fazla 36 ana silo vardır.

Ekipman bandında alım çukuru, elevatör, isteğe bağlı temizleyici ve kurutucu, yaş tamponu ve kontrol binası bulunur. Nominal yerleşim zarfı için yeterli alan kontrol edilir. Ancak araç dönüş eğrisi, bağlantı borusu eğimi, elevatör kulesi statik modeli, patlama tahliye yönü ve inşaat vinci çalışma alanı çözülmez. “Yerleşim oluşturuldu” mesajı yalnız bu geometrik aday aramasının başarılı olduğunu anlatır.

İkinci aşama önerisi: GeoJSON veya ölçülü poligon girişi, kapı ve engel çizimi, tekil sürükleme, çakışma geri bildirimi, bakım zarfları, kamyon dönüş şablonları ve büyüme rezervi. Üçüncü aşamada farklı üreticilerden doğrulanmış SKU aileleri ve alternatif maliyetler eklenebilir. Kullanıcı bir kuralı değiştirdiğinde sonuçta hangi kısıtın aktif olduğu açıklanmalıdır.

## İnşaat, montaj ve devreye alma

Önerilen proje sırası: ihtiyaç ve saha verilerinin onayı; kapasite ve proses alternatifleri; üretici ön seçimi; jeoteknik ve yük verileri; mimari, statik, mekanik ve elektrik projelerinin koordinasyonu; izinler; satın alma; saha altyapısı; temel; ekipman montajı; otomasyon; boşta ve ürünlü testler; kabul ve eğitim. Bu sıra genel bir iş kırılımıdır. Saha ve sözleşmeye göre bazı işler paralel yürüyebilir.

Temel hesabına yalnız ürün tonajı değil; gövde, çatı, ekipman, kar, rüzgâr, deprem, asimetrik boşaltma ve ankraj etkileri girer. Brock temel rehberi zeminin, kotun, ankrajın, fan ve rijitleştirici desteğinin önemini vurgular. Bu yüzden uygulamadaki beton daireler sadece görsel temel alanıdır; radye kalınlığı, donatı, zemin emniyeti veya ankraj planı vermez. [13](https://www.brockgrain.com/blog/5-key-points-for-a-strong-bin-foundation/)

Saha drenajı, temele su girişini ve alt bölgedeki ürünün ıslanmasını önlemeye yönelik tasarlanmalıdır. Brock bakım kılavuzu temel çevresindeki drenajın saha planında ele alınmasını, kurulum ve ilk dolum sonrası kot ölçümlerinin kaydedilmesini önerir. Temel oturmasının izlenmesi, devreye alma dosyasına ölçülebilir bir başlangıç kaydı ekler. [14](https://blog.brockgrain.com/wp-content/uploads/2025/07/Storage-Bin-Maintenance-MCB2040B.pdf)

Montaj planı üreticinin onaylı kılavuzu, kaldırma düzeni, çalışma koşulları ve ekipman sırasına göre hazırlanır. Gövde ve çatı elemanlarının sahada sıralanması, sızdırmazlık, ankraj ve bağlantı kontrolleri için üretici denetim kayıtları gerekir. Mysilo, mekanik montaj gözetimi, yetkin elektrik montajı, devreye alma ve operatör eğitimi hizmetlerini birlikte tanımlar. Buradaki görseller montaj talimatı değildir. [15](https://mysilo.com/en/page/After-Sales-Service)

Önerilen kabul dosyasında malzeme ve teslim listeleri, uygunluk belgeleri, montaj kontrol kayıtları, topraklama ve elektrik ölçümleri, motor yönleri, sensör ve kilitleme testleri, alarm senaryoları, boşta deneme, ürünlü kapasite denemesi ve kalite ölçümleri bulunur. Performans denemesi ürün, nem, çalışma süresi ve ölçüm cihazları belirtilmiş bir protokole dayanmalıdır. Teslimden sonra kullanım talimatı, yedek parça, eğitim, bakım periyodu ve garanti kapsamı işletmeye devredilir.

## İşletme güvenliği ve tasarım sınırları

Tahıl tozu yangın ve patlama, ürün içine gömülme, sıkışma, hareketli makine ve yüksekten düşme riskleri doğurabilir. OSHA 1910.272, ABD tahıl elleçleme tesisleri için toz kontrolü, eğitim, bakım, kilitleme ve tahıl içine giriş gibi başlıkları düzenler. Bu kaynak iyi uygulama araştırması için kullanılmıştır; Türkiye’de doğrudan mevzuat uygunluğu belgesi olarak kullanılamaz. [16](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.272)

Patlama riski değerlendirmesi ekipman seçiminden sonra eklenen bir etiket değildir. Toz oluşum noktaları, toplama sistemi, tutuşturucu kaynaklar, zon sınıflandırması, tahliye veya bastırma, izolasyon ve emniyetli boşaltım yönleri uzman tasarımına bağlanmalıdır. Alım çukuru aspirasyonu için Cimbria ayrı sistem seçenekleri sunar. Çalışma ve Sosyal Güvenlik Bakanlığı tarım rehberi de silo ve tahıl ambarlarını sınırlanmış alan örnekleri arasında ele alır. [12](https://www.cimbria.com/en/products/conveying/intake-systems/) [27](https://www.csgb.gov.tr/Media/sy1d1aul/tar%C4%B1mda-guevenlik-ve-sa%C4%9Fl%C4%B1k.pdf)

İlk uygulama bir risk analizi aracı değildir. Uyarı listesi, eksik tasarım başlıklarını görünür kılmak için bulunur. Sabit mesafelerden “ATEX uygun”, “yangın güvenli” veya “kuruluma hazır” sonucu üretilmez. Personelin silo içine girmesi, tahıl üzerinde yürümesi veya çalışan ekipmana müdahalesi için operasyon talimatı oluşturulmamıştır.

Otomasyonun ileriki kapsamı; seviye, sıcaklık, yatak sıcaklığı, bant kaçıklığı, hız, tıkanma ve fan geri bildirimlerini ekipman grafiğine bağlamaktır. Çalıştırma ve durdurma sıraları ile acil duruş tasarımı yetkin otomasyon ekibinin onayına tabidir. Bir ekrandaki animasyonun gerçek tesisi kontrol etmesi bu sürümün kapsamı değildir.

## Türkiye mevzuatı ve standart doğrulaması

Lisanslı depoculuk ile özel işletmenin kendi ürün deposu aynı hukuki statü değildir. Ticaret Bakanlığının güncel mevzuat dizini 5300 sayılı Kanunu, Tarım Ürünleri Lisanslı Depoculuk Yönetmeliğini, Hububat, Baklagiller ve Yağlı Tohumlar Lisanslı Depo Tebliğini ve 11 Mart 2026 tarihli kuruluş izni tebliğini listeler. Yalnız eski bir yönetmelik kopyasına dayanarak lisans şartı çıkarılmamalıdır. Proje kararı güncel konsolide metin ve yetkili kurumla doğrulanmalıdır. [17](https://www.ticaret.gov.tr/ic-ticaret/mevzuat/lisansli-depoculuk)

Bakanlık ayrıca hububat, baklagiller ve yağlı tohumlar lisanslı depoları için inceleme rehberine yönlendirir. Uygulamanın sonraki sürümünde “lisanslı depo hedefleniyor mu?” ayrı bir müşteri girdisi olmalı; kalite sınıflandırma, kayıt ve denetim belgeleri ayrı iş paketi olarak izlenmelidir. Bu araştırmada işletmeye özel izin uygunluğu veya asgari lisans kapasitesi kararı verilmemiştir. [18](https://www.ticaret.gov.tr/ic-ticaret/lisansli-depoculuk/lisansli-depoculuk-denetim-inceleme-surecleri)

Silo projesinde yükler, çelik kabuk, temel ve deprem hesabı için uygulanacak standart seti proje mühendisi tarafından belirlenmelidir. JRC, Eurocode ailesinde ikinci nesle geçiş ve ülkeye özgü parametreleri ayrı ele alır. Bu nedenle standardın sadece adı değil; baskısı, ulusal eki, geçiş durumu ve proje kapsamında uygulanabilirliği kaydedilmelidir. Bu yazılım herhangi bir Eurocode hesap modülü uygulamamaktadır. [19](https://eurocodes.jrc.ec.europa.eu/)

AFAD’ın broşürü Türkiye Bina Deprem Yönetmeliğinin 1 Ocak 2019’da yürürlüğe girdiğini bildirir. Bunun tek başına bütün silo yapılarının hesap yöntemini belirlediği varsayılmamalıdır; yapının kapsamı ve ilgili özel esaslar yetkin mühendis tarafından değerlendirilir. Arsa imarı, yapı ruhsatı, çevresel izinler, işyeri açılışı, yangın ve patlayıcı ortam yükümlülükleri de yer ve tesis niteliğine göre ayrıca incelenmelidir. [20](https://www.afad.gov.tr/kurumlar/afad.gov.tr/39505/xfiles/yonetmelik_brosur.pdf)

## Üretici ve ekipman verisi stratejisi

İlk kaynak kümesi Türkiye’den Mysilo ve OBIAL; depolama ve bakım referansı olarak Brock; taşıma ekipmanları için Silos Córdoba; temizleme ve kurutma için Cimbria’dan oluşur. Bunlar doğrulanmış teknik kaynak örnekleridir, satın alma sıralaması veya fiyat karşılaştırması değildir. Marka logosu veya katalog görseli kullanma hakkı, teknik sayfaya erişimden otomatik doğmaz.

Üretici kartı; firma, ürün ailesi, model kodu, tarih, kaynak URL, ölçü çizimi, hacim, yoğunluk esası, dolum/sıkışma katsayısı, yük sınırları ve model lisansını içermelidir. Kurutucu kartında kapasite ürün ve nem koşullarıyla; konveyörde yatay/eğimli debi, hız, motor ve mesafeyle; temizleyicide ürün, kirlilik ve temizlik seviyesiyle birlikte tutulmalıdır. Her güncellemede eski proje referansı korunmalıdır.

Bütçe için çelik ve mekanik ekipman bedellerinden ayrı; temel ve altyapı, nakliye, gümrük, vinç, montaj, enerji bağlantısı, kontrol sistemi, test, eğitim, yedek parça ve proje hizmetleri gerekir. Sabit bir ton başı bedel saha koşullarını gizler. Güncel teklif alınmadığı için uygulamada parasal maliyet üretilmemiştir. Karşılaştırma ekranı ileride tarihli, kapsamı açık tekliflerden beslenmelidir.

Üreticiden istenecek ilk paket: seçilen ailelerin güncel kapasite tablosu; ölçülü genel yerleşim çizimi; yük ve temel reaksiyonları; bağlantı noktaları; nominal ve ürün bazlı debi eğrileri; enerji bilgileri; bakım zarfları; kurulum kılavuzu; yeniden dağıtım izni olan STEP, IFC veya glTF modeller. Kamuya açık pazarlama modeli ile mühendislik onaylı ölçü modelinin veri düzeyi ayrı tutulmalıdır.

## 3B varlıklar ve lisansları

İlk çalışan kütüphane sekiz özgün parametrik model içerir: düz tabanlı silo, konik silo, elevatör, kurutucu, temizleyici, alım çukuru, yaş ürün tamponu ve kontrol binası. Modeller bu proje için Three.js geometrisiyle oluşturulmuştur; üreticinin CAD dosyası değildir. Boyutları metre cinsindedir, düşey eksen Y’dir. GLB varlıkları yerel dosyalarda sunulur ve tesisin tamamı GLB olarak dışa aktarılabilir.

Bulunan dış model: juninholiveira tarafından yayımlanan Grain Silo, Sketchfab sayfasında 10 Şubat 2016 tarihli ve Creative Commons Attribution-ShareAlike lisanslı görünmektedir. Kaynak kartına eklenmiştir; uygulamaya indirilmiş veya dahil edilmiş değildir. Bu modelin görsel referans niteliği, ölçü doğruluğunun veya mühendislik uygunluğunun doğrulandığı anlamına gelmez. [22](https://sketchfab.com/3d-models/grain-silo-395938614968466394a45456cbd188f6)

Sketchfab indirme API rehberi oturum açma gereksinimini ve modelle birlikte taşınması gereken atıf/lisans bilgisini açıklar. Sonraki entegrasyonda kullanıcı, kaynak, lisans sürümü, değişiklik kaydı ve dışa aktarılan türev dosyaların koşulları takip edilmelidir. Kamuya açık önizleme, sınırsız yeniden dağıtım izni olarak yorumlanmaz. [23](https://sketchfab.com/developers/download-api/guidelines)

Three.js GLTFExporter, sahnenin glTF veya ikili GLB biçiminde verilmesini sağlar. Bu biçim görsel sahnenin taşınması için uygundur. BIM sınıfları, imalat toleransları veya onaylı mühendislik belgesi içerdiği varsayılmamalıdır. Yerel GLB manifestinde temsili geometri durumu ve kaynaklar bulunur. Tam proje JSON dosyası ise girdileri, sürümü, sonuçları ve uyarıları saklar. [24](https://threejs.org/docs/pages/GLTFExporter.html)

## Uygulama mimarisi ve geliştirme yolu

Silo Studio 0.1; React ve TypeScript arayüzü, Three.js sahnesi, tarayıcıda çalışan deterministik yerleşim motoru ve cihaz içi proje kaydı kullanır. Sunucu yalnızca yerel arayüzü sunar. Proje verileri harici hesaba gönderilmez; görsel model için uzak CDN veya harita servisi gerekmez. Kaynak bağlantıları isteğe bağlı olarak dış siteleri açar.

Hesap motoru görselleştirmeden ayrıdır. Aynı girdiler aynı yerleşimi verir. JSON içe aktarımı doğrulanır ve sonuç dosyada yazılı olsa bile yeniden hesaplanır. Hatalı girdiler mevcut çalışan projenin üzerine sessizce uygulanmaz. Kapasite, sınır ve çakışma değişmezleri otomatik testlerle kontrol edilir. Kurutma kütle dengesi ayrıca sınanır.

İlk sürümün kapsamı: tek ürün ve yoğunluk, dikdörtgen arsa, sabit sınır aralığı, çap/yükseklik aday araması, partiye göre asgari silo sayısı, isteğe bağlı kurutma/temizleme/havalandırma, 3B sahne, ölçülü 2B plan, ekipman listesi, uyarılar, proje JSON ve GLB çıktısı. Kurutucu veya elevatör gerçek SKU boyutlandırması, enerji ve maliyet tahmini, poligon arsa, arazi eğimi, otomatik ruhsat uygunluğu ve imalat projesi kapsam dışıdır.

Önerilen bir sonraki geliştirme dilimi; müşteri kaydı ve birden fazla proje, çok ürün/parti dağılımı, poligon arsa ve engellerdir. Ardından üretici veri içe aktarma, bakım zarfları ve hat bağlantıları gelir. Son aşamada mühendis inceleme iş akışı, onay revizyonları ve teklif karşılaştırması eklenebilir. Her aşamanın tamamlanma ölçütü görünür bir ekran değil, doğru veriyle tekrar üretilebilir bir karar ve doğrulanmış çıktıdır.

## Doğrulanması gereken başlıklar

Kaynaklar 14 Eylül 2026 tarihinde incelendi. Web sayfalarının arama motorunda görünen güncellenme tarihleri, belgenin gerçek revizyon tarihi yerine kullanılmadı. Üretici PDF’lerinde açıkça okunamayan baskı tarihi “doğrulanamadı” olarak kaydedildi. Üretici verileri teknik aralık ve örnek performans için değerlendirildi; ticari performans iddiaları bağımsız olarak doğrulanmış sayılmadı.

Kritik açık noktalar: müşteri ürünü ve depolama süresi, ölçülmüş yoğunluk, gerçek parsel ve kotlar, zemin, pik araç profili, saha iklimi, üretici boyut ve yük tabloları, elektrik/yakıt olanakları, kalite kriterleri, izin rejimi ve gerçek bütçe. Bunlar tamamlanmadan uygulamanın ürettiği yerleşim satın alma veya inşa onayı olarak kullanılmamalıdır.

Katalog araması stokların hangi yıl ve kalite sınıfına ayrılacağını çözmez. Tek yoğunluk bütün ana silolara uygulanır. Silo kapasitesindeki pay ile kurutma sonrası kütle kaybı ayrı kavramlardır. Gösterilen taban kullanım oranı ekipmanların nominal tabanlarıyla hesaplanır; yolların, temellerin, servis zarflarının ve tüm mevzuat rezervlerinin toplam işgal oranı değildir.

## Kaynakça

İnceleme tarihi: 14 Eylül 2026.

1. Mysilo. [Flat Bottom Silos](https://www.mysilo.com/en/category/17/flat-bottom-silos). Tarih belirtilmemiş.

2. Mysilo. [Flat Bottom Silo – Capacity Chart](https://www.mysilo.com/upload/ckfinder/files/capacity/mysilo-flat-bottom-silo-capacity-chart-en.pdf). Belgede tarih doğrulanamadı.

3. Mysilo. [Flat Bottom Silo Capacities – 800 kg/m³](https://www.mysilo.com/dosyalar/kapasite-tablolari/mysilo-flat-bottom-silo-capacities-table-800.pdf). Belgede tarih doğrulanamadı.

4. University of Minnesota Extension. [Drying wheat and barley](https://extension.umn.edu/agriculture/crop-production/small-grains/drying-wheat-and-barley). Tarih belirtilmemiş.

5. University of Minnesota Extension. [Storing wheat and barley](https://extension.umn.edu/agriculture/crop-production/small-grains/storing-wheat-and-barley). Tarih belirtilmemiş.

6. University of Minnesota Extension. [Proper Spring Grain Drying and Storage Critical](https://blog-crop-news.extension.umn.edu/2024/03/proper-spring-grain-drying-and-storage.html). Mart 2024.

7. Cimbria. [Delta 145 Pre-cleaner – Data Sheet](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/data-sheets/screen-cleaner/140/Pre_Cleaner_145_Datasheet_EN.pdf). Haziran 2023.

8. Cimbria. [Continuous Flow Dryer – Brochure](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/brochures/drying/continuous-flow-dryer/Continuous_Flow_Dryer_GB.pdf). Belgede tarih doğrulanamadı.

9. Cimbria. [Dryer Column – Data Sheet](https://www.cimbria.com/content/dam/public/grain-and-protein/cimbria/data-sheets/continuous-flow-dryers/a-b-c-d-e-dryers-eco-master/Dryer_Column_Datasheet_EN.pdf). Ekim 2024.

10. Silos Córdoba. [Heavy Duty Chain Conveyor](https://www.siloscordoba.com/products/handling-equipment/heavy-duty-range/chain-conveyor/). Tarih belirtilmemiş.

11. Silos Córdoba. [Handling Equipment – Industrial Range](https://www.siloscordoba.com/wp-content/uploads/2024/09/02.Handling-Equipment-En-V1.pdf). Dosya yolu 2024/09; belge tarihi doğrulanamadı.

12. Cimbria. [Intake Systems](https://www.cimbria.com/en/products/conveying/intake-systems/). Tarih belirtilmemiş.

13. Brock Grain. [5 Key Points for a Strong Bin Foundation](https://www.brockgrain.com/blog/5-key-points-for-a-strong-bin-foundation/). 25 Ekim 2022.

14. Brock Grain. [Grain System Management – Bin Inspections and Maintenance, MCB2040B](https://blog.brockgrain.com/wp-content/uploads/2025/07/Storage-Bin-Maintenance-MCB2040B.pdf). Belgede yayın tarihi doğrulanamadı.

15. Mysilo. [After-Sales Service](https://mysilo.com/en/page/After-Sales-Service). Tarih belirtilmemiş.

16. OSHA. [29 CFR 1910.272 – Grain handling facilities](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.272). Güncel web metni; ABD.

17. T.C. Ticaret Bakanlığı. [Lisanslı Depoculuk Mevzuatı](https://www.ticaret.gov.tr/ic-ticaret/mevzuat/lisansli-depoculuk). Sayfa tarihi 17 Nisan 2026.

18. T.C. Ticaret Bakanlığı. [Lisanslı Depoculuk Denetim / İnceleme Süreçleri](https://www.ticaret.gov.tr/ic-ticaret/lisansli-depoculuk/lisansli-depoculuk-denetim-inceleme-surecleri). Erişim 14 Eylül 2026.

19. European Commission JRC. [Eurocodes – second generation and national parameters](https://eurocodes.jrc.ec.europa.eu/). Güncel web sayfası.

20. AFAD. [Türkiye Bina Deprem Yönetmeliği – Broşür](https://www.afad.gov.tr/kurumlar/afad.gov.tr/39505/xfiles/yonetmelik_brosur.pdf). 2018 yönetmeliği; 1 Ocak 2019 yürürlük bilgisi.

21. OBIAL. [Düz Taban Silolar](https://obial.com.tr/urunler/dtsilo). Tarih belirtilmemiş.

22. Sketchfab / juninholiveira. [Grain Silo – 3D model](https://sketchfab.com/3d-models/grain-silo-395938614968466394a45456cbd188f6). 10 Şubat 2016.

23. Sketchfab. [Download API Guidelines](https://sketchfab.com/developers/download-api/guidelines). Güncel geliştirici rehberi.

24. Three.js. [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html). Güncel dokümantasyon.

25. Mysilo. [Silo Equipments](https://mysilo.com/en/category/222/silo-equipments). Tarih belirtilmemiş.

26. Brock Grain. [On-Farm Grain Bins](https://www.brockgrain.com/brock-product/on-farm-grain-bins/). Tarih belirtilmemiş.

27. T.C. Çalışma ve Sosyal Güvenlik Bakanlığı. [Tarımda Güvenlik ve Sağlık](https://www.csgb.gov.tr/Media/sy1d1aul/tar%C4%B1mda-guevenlik-ve-sa%C4%9Fl%C4%B1k.pdf). Belgede tarih doğrulanamadı.

28. Mysilo. [Bant konveyör K model](https://www.mysilo.com/tr/category/98/K-model). Revizyon tarihi belirtilmemiş.

29. Mysilo. [Bant konveyör V model](https://www.mysilo.com/tr/category/99/V-model). Revizyon tarihi belirtilmemiş.

30. Mysilo. [Bant konveyör R model](https://www.mysilo.com/tr/category/100/R-model). Revizyon tarihi belirtilmemiş.

31. Mysilo. [Bant konveyör U model](https://www.mysilo.com/tr/category/211/U-Model). Revizyon tarihi belirtilmemiş.

32. Mysilo. [Zincirli konveyör F serisi](https://www.mysilo.com/tr/category/386/F-Serisi). Revizyon tarihi belirtilmemiş.

33. Mysilo. [Zincirli konveyör S serisi](https://www.mysilo.com/tr/category/387/S-Serisi). Revizyon tarihi belirtilmemiş.

34. Mysilo. [Zincirli konveyör C serisi](https://www.mysilo.com/tr/category/388/C-Serisi). Revizyon tarihi belirtilmemiş.

35. Mysilo. [Tüp konveyör D model](https://www.mysilo.com/tr/category/366/D-Model). Revizyon tarihi belirtilmemiş.

36. Mysilo. [Tüp konveyör L model](https://www.mysilo.com/tr/category/368/L-Model). Revizyon tarihi belirtilmemiş.

37. Mysilo. [U helezonu](https://www.mysilo.com/tr/category/103/U-Helezonu). Revizyon tarihi belirtilmemiş.

38. Mysilo. [Tüp helezon](https://www.mysilo.com/tr/category/105/tup-helezon). Revizyon tarihi belirtilmemiş.

39. Mysilo. [Mobil bant konveyör](https://www.mysilo.com/tr/category/376/Mobil-Bant-Konveyor). Revizyon tarihi belirtilmemiş.

40. Mysilo. [Mobil teleskopik bant konveyör](https://www.mysilo.com/tr/category/377/Mobil-Teleskopik-Bant-Konveyor). Revizyon tarihi belirtilmemiş.

41. Mysilo. [MYPORT gemi yükleme](https://www.mysilo.com/tr/category/434/Gemi-Yukleme-). Revizyon tarihi belirtilmemiş.

42. Mysilo. [Arabalı bant konveyör R model](https://www.mysilo.com/tr/category/454/R-Model). Revizyon tarihi belirtilmemiş.

43. Mysilo. [Arabalı bant konveyör U model](https://www.mysilo.com/tr/category/453/U-Model). Revizyon tarihi belirtilmemiş.

44. Mysilo. [Flat Bottom Silo – F series brochure](https://www.mysilo.com/upload/ckfinder/files/catalogue/en/mysilo-flat-bottom-silo.pdf). Belgede revizyon tarihi doğrulanamadı.

45. Mysilo. [Düz tabanlı silo](https://www.mysilo.com/tr/category/17/duz-tabanli-silo). Revizyon tarihi belirtilmemiş.

46. Mysilo. [Ticari konik silo](https://www.mysilo.com/tr/category/18/ticari-konik-silo). Revizyon tarihi belirtilmemiş.

47. European Commission, Joint Research Centre. [Eurocode 1: Actions on structures](https://eurocodes.jrc.ec.europa.eu/EN-Eurocodes/eurocode-1-actions-structures). Güncel resmi kapsam sayfası.

48. European Commission, Joint Research Centre. [Eurocode 3: Design of steel structures](https://eurocodes.jrc.ec.europa.eu/EN-Eurocodes/eurocode-3-design-steel-structures). Güncel resmi kapsam sayfası.

49. European Commission, Joint Research Centre. [Nationally Determined Parameters](https://eurocodes.jrc.ec.europa.eu/en-eurocodes-implementation/nationally-determined-parameters). Güncel resmi açıklama.

50. AFAD. [Türkiye Deprem Tehlike Haritaları İnteraktif Web Uygulaması](https://tdth.afad.gov.tr/TDTH/loginControl.xhtml). Harita uyarıları; erişim 14 Eylül 2026.

51. AFAD. [Turkey’s New Earthquake Hazard Map is Published](https://en.afad.gov.tr/turkeys-new-earthquake-hazard-map-is-published). 30 Mart 2018.

52. NEUERO. [Ship loaders](https://neuero.de/en/produkte/schiffsbelader). Revizyon tarihi belirtilmemiş.

53. NEUERO. [Ship unloaders](https://neuero.de/en/produkte/schiffsentlader). Revizyon tarihi belirtilmemiş.

54. Galvanizers Association. [Atmospheric corrosion](https://galvanizing.org.uk/atmospheric-corrosion/). Revizyon tarihi belirtilmemiş.

55. Galvanizers Association. [Corrosion performance in other environments](https://galvanizing.org.uk/corrosion-performance-in-other-environments/). Revizyon tarihi belirtilmemiş.

56. Mysilo. [Tahıl Depolama Bilgi Kitapçığı](https://mysilo.com/assets/tahil-depolama-kitapcik.pdf). Eski standart referansları içerir; baskı tarihi doğrulanamadı.
