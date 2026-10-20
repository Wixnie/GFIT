# 🏋️ GFitt — Modern Fitness & Nutrition Tracker

GFitt; günlük kalori ve makro besin takibinden özel antrenman şablonlarına (Upper/Lower & PPL), supplement kontrol listesinden kilo ve gelişim grafiklerine kadar tüm fitness sürecini tek bir merkezde toplayan modern bir web uygulamasıdır.

[![Live Demo](https://img.shields.io/badge/Live_Demo-g--fitt.vercel.app-blue?style=for-the-badge&logo=vercel)](https://g-fitt.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## ⚡ Temel Özellikler

- **🍽️ Akıllı Beslenme & Makro Takibi:** Günlük hedef kalori, protein, karbonhidrat ve yağ takibi; Türk mutfağına özel genişletilmiş yemek veritabanı.
- **💪 Antrenman Yönetimi:** Kişiselleştirilmiş 4 günlük Upper/Lower ve Push/Pull/Legs (PPL) antrenman şablonları, egzersiz kayıtları.
- **💊 Supplement Takip Çizelgesi:** Günlük vitamin ve takviye kullanımını pratikçe işaretleme checklist'i.
- **📈 İlerleme & Metrik Grafikleri:** Vücut ağırlığı, kalori trendleri ve makro tüketimini gösteren görselleştirilmiş analitik grafikler.
- **⚡ Hibrit Veri Modeli:** Supabase bağlantısı olmadan da yerel tarayıcı hafızasında (`localStorage`) kesintisiz çalışan **Demo Modu**.

---

## 🛠️ Teknoloji Yığını

- **Frontend:** React, Vite, Modern CSS / Tailwind
- **Backend / Veritabanı:** Supabase (PostgreSQL, Auth)
- **Deployment & Hosting:** Vercel (CI/CD)
- **Veri Saklama:** Supabase DB & LocalStorage Fallback

---

## 📱 Sayfa Mimarisi & Rotalar

| Rota | İşlev |
|---|---|
| `/` | Günlük makro özeti ve kural tabanlı akıllı yemek önerisi |
| `/yemek` | Türk yemekleri veritabanında arama, porsiyon/gramaj girişi ve günlük log |
| `/antrenman` | Upper/Lower ve PPL programları, set ve tekrar yönetimi |
| `/supplement` | Günlük takviye ve vitamin kontrol listesi |
| `/kilo` | Kilo girişi ve ağırlık değişim mini grafiği |
| `/ilerleme` | Kalori, protein ve kilo değişim analizleri |
| `/profil` | Kişisel hedefler, makro katsayıları ve vücut ölçüleri |

---

## 🚀 Yerel Geliştirme (Kurulum)

Projeyi bilgisayarınızda yerel olarak çalıştırmak için **Node.js 20+** yüklü olmalıdır.

```bash
# Repoyu klonlayın
git clone [https://github.com/Wixnie/GFitt.git](https://github.com/Wixnie/GFitt.git)

# Proje dizinine gidin
cd GFitt

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
