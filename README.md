# 🏋️ GFIT App

**Kişisel fitness, beslenme ve alışkanlık koçu.**

GFIT App; günlük kalori ve makro takibini, Türk mutfağına uygun yemek günlüğünü, kişisel antrenmanları, su/uyku/adım hedeflerini ve ilerleme kayıtlarını tek, anlaşılır bir deneyimde birleştirir.

![GFIT App](https://img.shields.io/badge/GFIT%20App-fitness%20%26%20nutrition-FFE500?style=for-the-badge&labelColor=080B14)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=061018)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=061018)

## Ürün fikri

GFIT App'in amacı daha fazla ekran ve daha fazla sayı göstermek değil; kullanıcının her gün şu üç soruya hızlı cevap vermesidir:

1. **Bugün ne kadar enerji ve protein aldım?**
2. **Hedefime yaklaşmak için sıradaki en iyi adım ne?**
3. **İlerlemenin hangi noktasındayım?**

Bu yüzden arayüz; koyu, odaklanmış bir zemin, güçlü sarı aksanlar, büyük okunabilir rakamlar, boş durumlar ve tek bakışta anlaşılır kartlar üzerine kuruludur.

## Öne çıkan özellikler

- **Dashboard:** Kalori halkası, makro çubukları, protein hedefi, su/adım/uyku kartları ve günlük koç mesajı.
- **Beslenme:** Kahvaltıdan gece öğününe kadar kategori bazlı yemek günlüğü; gramaj ve makro hesabı.
- **Antrenman:** Program filtreleme, egzersiz form ipuçları, dinlenme sayacı ve kişisel rekor takibi.
- **Sağlık:** Su, 16:8 oruç, adım, uyku ve Apple Health senkronizasyon simülasyonu.
- **İlerleme:** Kilo grafiği, ölçüm geçmişi, OneRM hesaplama, fotoğraf galerisi ve paylaşılabilir hikâye kartı.
- **Alışkanlıklar:** Günlük alışkanlıklar, seri takibi, ısı haritası ve sigara bırakma sayaçları.
- **AI Coach:** Profil ve günlük kayıtlar bağlamında Türkçe koçluk mesajları.
- **Demo Mode:** Supabase ayarları olmadan localStorage ile çalışır; kullanıcı akışı kesilmez.
- **PWA:** Mobil kurulum, standalone manifest ve güvenli alan destekli responsive düzen.

## Sayfa mimarisi

| Rota | Amaç |
| --- | --- |
| `/` veya `/dashboard` | Günlük özet ve hedef durumu |
| `/food` | Yemek ve makro kaydı |
| `/workout` | Program ve egzersiz takibi |
| `/mobility` | Mobilite rutinleri |
| `/supplements` | Takviye kontrolü ve önerileri |
| `/water-fasting` | Su hedefi ve oruç sayacı |
| `/health` | Adım, uyku ve sağlık senkronizasyonu |
| `/progress` | Kilo, ölçüm, OneRM ve fotoğraf geçmişi |
| `/diet-plans` | Hazır beslenme planları ve tarifler |
| `/social` | Fotoğraf ve makro odaklı topluluk akışı |
| `/notes-guide` | Kişisel notlar ve bilimsel rehber |
| `/profile` | Profil, izinler, hatırlatıcılar ve PWA kurulumu |
| `/ai-coach` | AI Coach sohbeti |
| `/pro` | PRO özellikleri ve ödüllü erişim |
| `/habits` | Alışkanlık ve seri takibi |
| `/auth` | Giriş / kayıt / misafir modu |
| `/onboarding` | Kişisel hedef kurulum akışı |

## Teknoloji

- React 19 + React Router
- Vite + Tailwind CSS
- Supabase Auth ve veri katmanı
- Groq SDK ile AI Coach entegrasyonu
- Vite PWA plugin
- Lucide ikon sistemi
- LocalStorage fallback ve Demo Mode

## Yerel kurulum

```bash
git clone https://github.com/Wixnie/GFIT.git
cd GFIT
npm install
copy .env.example .env
npm run dev
```

Üretim build'i:

```bash
npm run build
npm run preview
```

## Ortam değişkenleri

`.env` dosyasını repoya commit etmeyin:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GROQ_API_KEY=your-groq-key
```

Eksik anahtarlar uygulamayı tamamen kilitlemez; Supabase ve AI özellikleri güvenli şekilde fallback davranışına geçer.

## Tasarım prensipleri

- **Önce mobil:** Alt navigasyon ve büyük dokunma alanları mobil kullanım için tasarlanır.
- **Koyu zemin, sıcak aksan:** `#080B14` zemin ve `#FFE500` ana aksan; turuncu yalnızca ikincil çağrılar için kullanılır.
- **Sıfır durumları gerçek durumdur:** Boş kalori/protein halkaları asla dolu görünmez; kullanıcıya bir sonraki aksiyon gösterilir.
- **Tek net CTA:** Her ekranda kullanıcıyı ilerleten tek birincil aksiyon bulunur.
- **Güvenli matematik:** BMR/TDEE minimum 1200 kcal ile korunur; NaN ve negatif değerler ekrana çıkmaz.

## Durum

Aktif geliştirme branch'i: [`codex/gfitt-app`](https://github.com/Wixnie/GFIT/tree/codex/gfitt-app)

Son doğrulama: `npm run build` başarılı. Bundle boyutu için Vite uyarısı bulunuyor; uygulamayı çalıştırmayı engellemiyor.

## Lisans

Bu proje kişisel geliştirme ve prototipleme amacıyla hazırlanmıştır.
