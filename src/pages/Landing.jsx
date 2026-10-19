import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      q: 'GFIT ücretsiz mi?',
      a: 'Evet, GFIT temel özellikleri ücretsiz olarak sunar. Premium özellikler için ücretli planlar mevcuttur.'
    },
    {
      q: 'Verilerim güvende mi?',
      a: 'Evet, tüm verileriniz Supabase ile şifreli olarak saklanır ve KVKK gerekliliklerine uygun şekilde korunur.'
    },
    {
      q: 'Hangi özellikler ücretsiz?',
      a: 'Kalori/makro takibi, antrenman kaydı, supplement takibi, kilo takibi ve temel özellikler ücretsizdir.'
    },
    {
      q: 'Mobil uygulama var mı?',
      a: 'Evet, GFIT mobil-first tasarım sunar ve PWA olarak mobil cihazlarda natif uygulama gibi çalışır.'
    },
    {
      q: 'Offline çalışır mı?',
      a: 'Evet, PWA desteği sayesinde internet olmadan da verilerinizi görüntüleyebilir ve kaydedebilirsiniz.'
    },
    {
      q: 'Hesabımı nasıl silebilirim?',
      a: 'Profil sayfasından "Hesabımı Sil" butonunu kullanarak tüm verilerinizi kalıcı olarak silebilirsiniz.'
    }
  ]

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="app-container" style={{ padding: 0 }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B101B 0%, #1a1f35 100%)',
        padding: '60px 24px',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          margin: '0 0 16px',
          background: 'linear-gradient(135deg, #F59E0B 0%, #d97706 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Syne, sans-serif',
          letterSpacing: '-0.04em'
        }}>
          GFIT
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          color: 'var(--muted)',
          marginBottom: 32,
          maxWidth: '500px'
        }}>
          Fitness hedeflerinizi takip edin, gelişiminizi görün. Türk yemek veritabanı, antrenman programları ve daha fazlası.
        </p>
        <Link to="/kayit" className="btn" style={{
          padding: '16px 32px',
          fontSize: '1.1rem',
          borderRadius: '12px',
          display: 'inline-block'
        }}>
          Ücretsiz Başla
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="card" style={{ margin: '32px 16px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: 24 }}>Sıkça Sorulan Sorular</h2>
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <button
              onClick={() => toggleFaq(index)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontWeight: 600 }}>{faq.q}</span>
              <span style={{ fontSize: '20px', color: 'var(--lime)' }}>
                {openFaq === index ? '−' : '+'}
              </span>
            </button>
            {openFaq === index && (
              <div style={{
                padding: '16px',
                background: 'var(--card-2)',
                borderRadius: '0 0 12px 12px',
                borderTop: '1px solid var(--line)',
                marginTop: '-1px',
                color: 'var(--muted)',
                lineHeight: 1.6
              }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid var(--line)',
        marginTop: 48,
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: 16 }}>
          <Link to="/gizlilik-politikasi" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
            Gizlilik Politikası
          </Link>
          <Link to="/kullanim-kosullari" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
            Kullanım Koşulları
          </Link>
          <Link to="/mesafeli-satis-sozlesmesi" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
            Mesafeli Satış Sözleşmesi
          </Link>
          <Link to="/iade-politikasi" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
            İade Politikası
          </Link>
          <Link to="/kvkk" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
            KVKK
          </Link>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
          © 2026 GFIT. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  )
}
