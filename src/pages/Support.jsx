import { useState } from 'react'

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _subject: 'GFIT Destek Formu - Yeni Mesaj',
    _replyto: '' // Will be set from email field
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Formspree endpoint
      const response = await fetch('https://formspree.io/f/mqpeoqal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ 
          name: '', 
          email: '', 
          subject: '', 
          message: '',
          _subject: 'GFIT Destek Formu - Yeni Mesaj',
          _replyto: ''
        })
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Form gonderilemedi')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="app-container">
        <div className="page-head">
          <div>
            <p className="sub">Yardım Merkezi</p>
            <h1>Destek</h1>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: 16 }}>✅</div>
          <h3 style={{ margin: '0 0 8px', color: '#10B981' }}>Mesajınız Başarıyla İletildi</h3>
          <p className="sub" style={{ marginBottom: 24 }}>
            En kısa sürede dönüş yapacağız!
          </p>
          <button 
            className="btn" 
            onClick={() => setSuccess(false)}
          >
            Yeni Mesaj Gönder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">Yardım Merkezi</p>
          <h1>Destek</h1>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Bize Ulaşın</h3>
        <p className="sub" style={{ marginBottom: 24 }}>
          Sorularınız, önerileriniz veya sorunlarınız için aşağıdaki formu doldurun.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Adınız</label>
            <input
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adınız"
              required
            />
          </div>

          <div className="field">
            <label>E-posta</label>
            <input
              className="input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value, _replyto: e.target.value })}
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div className="field">
            <label>Konu</label>
            <input
              className="input"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Konu"
              required
            />
          </div>

          <div className="field">
            <label>Mesajınız</label>
            <textarea
              className="input"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Mesajınızı yazın..."
              rows={5}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#EF4444', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>İletişim Bilgileri</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p className="sub" style={{ margin: 0 }}>E-posta</p>
            <a href="mailto:getgfitapp@gmail.com" style={{ color: '#F59E0B', textDecoration: 'none' }}>
              getgfitapp@gmail.com
            </a>
          </div>
          <div>
            <p className="sub" style={{ margin: 0 }}>Yanıt Süresi</p>
            <p style={{ margin: 0 }}>Genellikle 24 saat içinde</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(37, 211, 102, 0.1)', borderColor: '#25D366' }}>
        <h3 style={{ marginTop: 0, marginBottom: 16, color: '#25D366' }}>WhatsApp ile Destek Al</h3>
        <p className="sub" style={{ marginBottom: 16 }}>
          Acil sorularınız için WhatsApp üzerinden bize ulaşabilirsiniz.
        </p>
        <a
          href="https://wa.me/905555555555"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ 
            width: '100%', 
            background: '#25D366',
            color: '#fff',
            display: 'inline-block',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          💬 WhatsApp ile Destek Al
        </a>
      </div>
    </div>
  )
}
