<<<<<<< HEAD
# FitApp

Kalori/makro takibi, Türk yemekleri, Upper/Lower + PPL antrenman, supplement checklist, kilo ve ilerleme grafikleri.

Stack: **React + Vite**, **Supabase** (auth + Postgres), **Vercel**.

Varsayılan hedefler (kişisel program): 2600 kcal, 170g protein, 310g karb, 75g yağ · Upper A / Lower A / Upper B / Lower B.

## 1. Yerelde çalıştır

Node.js 20+ gerekir.

```bash
npm install
npm run dev
```

Supabase anahtarı yokken uygulama **demo modunda** açılır: kayıt/giriş ve tüm veriler tarayıcı `localStorage` içindedir. Çok kullanıcılı gerçek hesap için aşağıdaki adımları tamamla.

## 2. Supabase

1. [supabase.com](https://supabase.com) üzerinde ücretsiz proje oluştur.
2. SQL Editor’de `supabase/schema.sql` dosyasının tamamını çalıştır.
3. Project Settings → API içinden URL ve anon key kopyala.
4. Proje kökünde `.env` oluştur:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

5. Authentication → Providers: Email açık olsun. Geliştirme için “Confirm email” kapatılabilir.

## 3. Vercel

```bash
npm i -g vercel
vercel
```

Vercel dashboard’da aynı `VITE_SUPABASE_*` değişkenlerini ekle, sonra yeniden deploy et.

## Sayfalar

| Rota | İşlev |
|---|---|
| `/` | Günlük makro özeti + kural tabanlı yemek önerisi |
| `/yemek` | Türk yemek arama, gramaj, günlük log |
| `/antrenman` | Upper/Lower (senin programın) ve PPL şablonları |
| `/supplement` | Günlük işaretleme |
| `/kilo` | kg kaydı + mini grafik |
| `/ilerleme` | Kalori, protein, kilo grafikleri |
| `/profil` | Hedef kalori/makro ve vücut ölçüleri |
=======
# GFIT
Fitness &amp; nutrition tracking app. Calorie/macro counting, workout programs, supplement tracking. Built with Next.js &amp; Supabase.
>>>>>>> 92d29c81e4b75b569a4944f111c6d0c77ff645e0
