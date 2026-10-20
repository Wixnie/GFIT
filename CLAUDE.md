\# TASK: Complete UI/UX Overhaul, Bug Fixes \& Personalization Architecture for GFit (React / Vite) — Logma Style System



Selam Claude! Ekteki React/Vite tabanlı projemiz "GFit" için kapsamlı bir UI/UX refactoring, kritik bug temizliği ve kişiselleştirilmiş kullanıcı akışı gerçekleştiriyoruz. 



Amacımız; fonksiyonel altyapımızı (Supabase, Türkçe yemek kütüphanesi, antrenman şablonları, supplement/kilo takibi ve XP seviye mantığını) koruyarak arayüzü doğrudan modern \*\*Logma fitness uygulaması\*\* standartlarına taşımak ve tespit edilen tüm mantık/veri hatalarını kökten çözmektir\[cite: 12, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40].



\---



\### KRİTİK HATA VE MANTIK DÜZELTMELERİ (ACİL)

1\. \*\*Profilde Sabit (Hardcoded) Veri Hatası:\*\* 

&#x20;  - Girişte veya onboarding'de ne girilirse girilsin profil ekranında hep sabit geliştirici bilgileri (Efehan, 22 yaş, 185 boy, 90 kg vb.) çıkıyor\[cite: 7, 42]. 

&#x20;  - Bu hardcoded/mock veriyi tamamen kaldır. `currentUser` state'i veya Supabase auth/profile tablosundaki dinamik kullanıcı verilerini bağla; yeni üyenin kendi girdiği değerleri getir.

2\. \*\*Uyku Doğrulama (Validation) ve Bilimsel Eşikler:\*\*

&#x20;  - Uyku inputuna "090" veya mantıksız değerler yazıldığında bile "İdeal uyku süresi" yazıyor\[cite: 41].

&#x20;  - Girişi `min: 0`, `max: 24` aralığında sınırla\[cite: 41]. 

&#x20;  - Bilimsel uyku eşiklerini uygula:

&#x20;    - `< 6 saat`: `text-red-400` ("Yetersiz uyku: Toparlanma ve kas onarımı için riskli")\[cite: 13]

&#x20;    - `7 - 9 saat`: `text-green-400` ("İdeal uyku süresi: Optimum anabolik yenilenme")\[cite: 41]

&#x20;    - `> 10 saat`: `text-amber-400` ("Aşırı uyku / Halsizlik eğilimi")

3\. \*\*Doğum Tarihi \& Yaş Seçimi:\*\*

&#x20;  - Klavyeyle ham yazı yazılan tarih alanını kaldır; iOS/Native benzeri açılır tarih seçici (Date Picker dropdown) veya ay/gün/yıl spinner/stepper bileşeni ekle.

4\. \*\*Hata \& Öneri Bildir Formu Çökmesi:\*\*

&#x20;  - "Hata / Öneri Bildir" alanına metin girilip gönderildiğinde hata veriyor\[cite: 6]. API rotasını / Supabase tablosunu (`feedback`) kontrol et; try-catch bloğu ekle ve başarılı gönderimde modern bir "Bildiriminiz iletildi" toast mesajı göster.

5\. \*\*Onboarding Akıllı İlerleme (Auto-Advance):\*\*

&#x20;  - Kullanıcı kart seçeneğine (Cinsiyet, Hedef vb.) tıkladığı anda "Devam Et" butonunu bekletmeden, \~250ms'lik yumuşak bir seçim animasyonu (scale-95 -> scale-100) ile doğrudan bir sonraki soruya otomatik atlasın\[cite: 1, 4].

6\. \*\*Hedefe Göre Kişiselleştirilmiş UI/İçerik:\*\*

&#x20;  - Kullanıcının onboarding'de seçtiği ana amaca göre dashboard ve öneriler tamamen ayrışsın\[cite: 4]:

&#x20;    - \*\*Kilo Vermek İsteyene:\*\* Günlük net kalori açığı (Deficit) sayacı, kardiyo/adım vurgusu, yüksek lif/doyurucu besin önerileri\[cite: 4, 36].

&#x20;    - \*\*Kas Yapmak (Hipertrofi) İsteyene:\*\* Progressive overload, set/hacim ağırlık grafikleri, yüksek protein hedefleri ve antrenman bazlı göstergeler\[cite: 4, 18, 19].

&#x20;    - \*\*Sağlıklı Beslenme / Form Koruma:\*\* Makro mikro dengesi, su ve uyku stabilitesi odaklı göstergeler\[cite: 4].



\---



\### MARKA \& TASARIM SİSTEMİ (GFIT ORANGE + LOGMA DARK)

\- \*\*Arka Plan:\*\* `bg-\[radial-gradient(ellipse\_at\_top,\_var(--tw-gradient-stops))] from-\[#1C1836] via-\[#0E0C1B] to-\[#08070F] text-white min-h-screen`

\- \*\*Kartlar \& Cam Efekti:\*\* `bg-\[#181528]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl`

\- \*\*Vurgu Rengi (GFit Orange):\*\* Canlı Turuncu `#FF8A00` (Hover: `#FFA02E`, Glow: `rgba(255, 138, 0, 0.45)`)\[cite: 1, 2, 5, 8, 12, 14, 19]

\- \*\*Makro Renk Kodlaması:\*\*

&#x20; - Protein: `#22C55E` (Yeşil) veya `#FACC15` (Canlı Sarı)

&#x20; - Karbonhidrat: `#818CF8` (Soft İndigo)

&#x20; - Yağ: `#FB923C` (Sıcak Mercan)

\- \*\*İkonografi:\*\* Sistem emojilerini tamamen temizle; `lucide-react` vektör ikonları kullan (LayoutGrid, Dumbbell, UtensilsCrossed, User, BarChart3, Clock, Plus, Mic vb.).

\- \*\*Yazım ve Tipografi:\*\* "Giris yap" gibi Türkçe karakter eksikliklerini (`Giriş Yap`) ve genel arayüz metinlerini baştan sona temizle\[cite: 5, 6].



\---



\### UYGULAMA AŞAMALARI (SPRINT SIRALAMASI)



\#### AŞAMA 1 — Design System \& Global Tokens

\- `index.css` ve `tailwind.config.js` dosyalarını yukarıdaki renk paleti, cam efektleri ve border-radius standartlarına göre güncelle.

\- Tüm sayfalarda geçerli olacak font ailesini ve arka plan gradyanını tanımla.



\#### AŞAMA 2 — Floating Bottom Navigation Bar

\- `fixed bottom-6 left-4 right-4 h-16 bg-\[#161326]/90 backdrop-blur-2xl border border-white/10 rounded-full px-6 flex items-center justify-between z-50` yapısını kur\[cite: 26, 27, 29, 34].

\- 4 ana sekme: \*\*Özet (Bugün)\*\*, \*\*Yemek\*\*, \*\*Antrenman\*\*, \*\*Profil (Sen)\*\*.

\- Ortada büyük turuncu FAB: `w-14 h-14 -top-5 relative rounded-full bg-\[#FF8A00] shadow-\[0\_0\_25px\_rgba(255,138,0,0.45)] text-white flex items-center justify-center`. Tıklanınca hızlı kayıt/modal açacak\[cite: 30, 31, 39, 40].



\#### AŞAMA 3 — Dashboard (Özet) \& Dairesel İlerleme (Circular Ring)

\- Kaba çizgileri kaldır; sol tarafta dinamik SVG Rainbow Circular Progress Ring (tüketilen kalori ortada büyük fontla, altında hedef), sağında 3 adet animasyonlu yatay makro çubuğu yerleştir\[cite: 26, 37, 38, 40].

\- Kullanıcının hedefine göre (kilo verme / kas yapma) odak widget'ını dinamik render et\[cite: 4].

\- Uyku widget'ını bilimsel validasyon mantığı ile bağla\[cite: 13, 41].



\#### AŞAMA 4 — Yemek Takibi \& Loglama Popup Modalı

\- Yemek listesini modernize et: Solda koyu daire içinde şık yemek ikonu, ortada yemek adı + porsiyon/gramaj, sağda kalori + protein ve kayıt zamanı\[cite: 25, 26, 37, 38, 40].

\- Yemek eklendiğinde açılan Logma tarzı özet modalı: \*"LOGLANDI - 970 kal"\*, eklenen kalemler, makro dökümü (`38g P | 75g C | 51g F`) ve günlük ilerleme barı\[cite: 25].



\#### AŞAMA 5 — Analiz \& Geçmiş Ekranları

\- Haftalık dikey bar grafiği: Renk kodlu (Hedefte = Yeşil, Altında = Mavi, Üstünde = Turuncu)\[cite: 27, 29, 35, 36].

\- Günlük geçmiş listesi: Tarih, toplam kalori, durum rozeti (`\[HEDEFTE]`, `\[ALTINDA]`, `\[ÜSTÜNDE]`) ve mini progress göstergesi\[cite: 29, 35].



\#### AŞAMA 6 — Onboarding Revizyonu, Otomatik İlerleme \& Veri Bağlantısı

\- Cinsiyet, Zorluk ve Hedef Hızı ekranlarındaki aşırı dikey boşlukları gider\[cite: 1, 2, 9].

\- Seçime tıklandığında otomatik sonraki adıma geçen akış ve animasyonları uygula\[cite: 1, 2, 4].

\- Doğum günü / yaş alanını dropdown/stepper haline getir\[cite: 32, 33].

\- Tamamlanan onboarding verilerini doğrudan kullanıcı profiline kaydet ve hardcoded state'i geçersiz kıl\[cite: 7, 42].



\#### AŞAMA 7 — PWA Entegrasyonu \& Hata Bildirimi Onarımı

\- `manifest.json` ve `vite-plugin-pwa` yapılandırmasını doğrula (özel renkler, standalone modu, ikonlar).

\- iOS Safari ve Android Chrome için modern "Ana Ekrana Ekle" (Add to Home Screen) alt bildirim modalını oluştur.

\- "Hata / Öneri Bildir" formunun Supabase/API bağlantısını ve hata yönetimini onar\[cite: 6].



\---



\### ÇALIŞMA KURALI

Gereksiz açıklama yapma. Doğrudan dosya adlarını ve yollarını belirterek \*\*AŞAMA 1 (Design tokens, Tailwind ve index.css)\*\* ile başla ve ilk güncellenecek dosyaların tam kod bloklarını ver.

