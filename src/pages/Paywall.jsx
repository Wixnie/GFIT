import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Paywall() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleRestorePurchases() {
    setLoading(true)
    setMessage(null)
    try {
      // This would integrate with App Store / Google Play
      // For now, simulate the restoration
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMessage('Satın alımlarınız kontrol edildi. Aktif abonelikleriniz uygulanacak.')
    } catch (err) {
      console.error('Satın alımları geri yüklenirken hata:', err)
      setMessage('Satın alımları geri yüklenirken hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Premium Üyelik</h1>
        <p className="sub">Daha fazla özellik ve sınırsız kullanım</p>
        
        <div style={{ marginTop: 24 }}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, var(--card) 0%, var(--card-2) 100%)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            marginBottom: 16
          }}>
            <h3 style={{ marginTop: 0, color: 'var(--lime)' }}>GFIT Premium</h3>
            <ul style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
              <li>✓ Sınırsız AI tarama</li>
              <li>✓ Detaylı ilerleme analizleri</li>
              <li>✓ Özelleştirilmiş antrenman programları</li>
              <li>✓ İleri seviye makro analizleri</li>
              <li>✓ Öncelikli destek</li>
            </ul>
            <div style={{ marginTop: 16, fontSize: '24px', fontWeight: 700, color: 'var(--lime)' }}>
              ₺XX/ay
            </div>
            <button className="btn" style={{ width: '100%', marginTop: 12 }}>
              Premium'a Geç
            </button>
          </div>

          <div style={{ marginTop: 24, padding: '16px', background: 'var(--card-2)', borderRadius: '12px' }}>
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>Satın Alımlar</h4>
            <button 
              className="btn ghost" 
              onClick={handleRestorePurchases}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Yükleniyor...' : 'Satın Alımlarını Geri Yükle'}
            </button>
            {message && (
              <p style={{ marginTop: 12, color: 'var(--lime)', fontSize: '14px' }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
