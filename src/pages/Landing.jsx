import { Link } from 'react-router-dom'
import { useState } from 'react'
import Footer from '../components/Footer'

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      q: 'GFIT ücretsiz mi?',
      a: 'Temel kalori takibi, yemek günlüğü ve antrenman şablonlarını tamamen ücretsiz kullanabilirsiniz.',
    },
    {
      q: 'Verilerim güvende mi?',
      a: 'Tüm verileriniz Supabase altyapısında şifrelenir ve KVKK standartlarına uygun olarak saklanır.',
    },
    {
      q: 'Hangi antrenman programları var?',
      a: 'Upper/Lower ve PPL gibi kanıtlanmış hipertrofi şablonları hazır olarak sunulur.',
    },
    {
      q: 'Barkod tarama nasıl çalışır?',
      a: 'Ücretsiz kullanıcılar günde 3 barkod tarama hakkına sahiptir. PRO kullanıcılar sınırsız tarama yapabilir.',
    },
    {
      q: 'AI etiket analizi nedir?',
      a: 'Yemek fotoğraflarını yükleyerek yapay zeka ile besin değerlerini analiz edebilirsiniz. Ücretsiz kullanıcılar günde 3 hak alır.',
    },
    {
      q: 'PRO\'ya geçmek zorunda mıyım?',
      a: 'Hayır. Temel özellikler her zaman ücretsiz kalır. PRO, sınırsız özellikler ve AI analizleri için opsiyoneldir.',
    },
    {
      q: 'İade politikası nedir?',
      a: 'İlk 7 gün içinde memnun kalmazsanız, tam para iadesi talep edebilirsiniz.',
    },
    {
      q: 'Mobil uygulama var mı?',
      a: 'Evet, GFIT PWA olarak çalışır ve herhangi bir indirme gerektirmeden mobil cihazlarda kullabilirsiniz.',
    },
  ]

  return (
    <div style={{ backgroundColor: '#0B101B', color: '#EEF3EA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '26px', fontWeight: 800, color: '#F59E0B' }}>
          GFIT
        </div>
        <Link to="/giris" className="btn ghost" style={{ padding: '8px 18px', fontSize: '14px' }}>
          Giriş Yap
        </Link>
      </header>

      <main style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '60px 20px', textAlign: 'center' }}>
        <div className="chip" style={{ color: '#F59E0B', borderColor: '#F59E0B', display: 'inline-block', marginBottom: '16px' }}>
          AKILLI FITNESS & BESLENME
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.03em' }}>
          Hedeflerine Ulaşmanın <br />
          <span style={{ color: '#F59E0B' }}>En Sade ve Hızlı Yolu</span>
        </h1>
        <p style={{ color: '#8B9788', fontSize: '16px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Kalori ve makro sayımı, akordiyon set takipli antrenmanlar ve performans grafikleri tek bir yerde.
        </p>

        <Link to="/onboarding" className="btn" style={{ padding: '14px 32px', fontSize: '16px', display: 'inline-block' }}>
          Ücretsiz Başla
        </Link>

        <div style={{ marginTop: '70px', textAlign: 'left', maxWidth: '700px', margin: '70px auto 0' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', textAlign: 'center', marginBottom: '20px' }}>
            Sıkça Sorulan Sorular
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                className="card"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ cursor: 'pointer', padding: '14px 18px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>{f.q}</strong>
                  <span style={{ color: '#F59E0B' }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <p style={{ color: '#8B9788', fontSize: '13px', margin: '8px 0 0', lineHeight: 1.5 }}>
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}