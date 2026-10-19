import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { todayISO } from '../lib/dates'

export default function Habits() {
  const { session, profile } = useAuth()
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20)
  const [pricePerPack, setPricePerPack] = useState(60)
  const [quitDate, setQuitDate] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('gfit_smoking_habit')
    if (saved) {
      const data = JSON.parse(saved)
      setCigarettesPerDay(data.cigarettesPerDay || 20)
      setPricePerPack(data.pricePerPack || 60)
      setQuitDate(data.quitDate || null)
    }
  }, [])

  const saveHabit = () => {
    const data = { cigarettesPerDay, pricePerPack, quitDate }
    localStorage.setItem('gfit_smoking_habit', JSON.stringify(data))
  }

  const handleStartQuit = () => {
    setQuitDate(todayISO())
    saveHabit()
  }

  const handleResume = () => {
    setQuitDate(null)
    saveHabit()
  }

  const calculateStats = () => {
    if (!quitDate) return null

    const quit = new Date(quitDate)
    const now = new Date()
    const daysDiff = Math.floor((now - quit) / (1000 * 60 * 60 * 24))
    const cigarettesNotSmoked = daysDiff * cigarettesPerDay
    const moneySaved = (cigarettesNotSmoked / cigarettesPerDay) * pricePerPack

    // Health recovery score (simplified)
    let healthScore = 0
    if (daysDiff >= 1) healthScore = 20
    if (daysDiff >= 7) healthScore = 40
    if (daysDiff >= 30) healthScore = 60
    if (daysDiff >= 90) healthScore = 80
    if (daysDiff >= 365) healthScore = 100

    return {
      daysClean: daysDiff,
      cigarettesNotSmoked,
      moneySaved: Math.round(moneySaved),
      healthScore
    }
  }

  const stats = calculateStats()

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">Alışkanlık Takibi</p>
          <h1>Sigara Bırakma</h1>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Ayarlar</h3>
        <div className="field">
          <label>Günlük Paket Adedi</label>
          <input
            className="input"
            type="number"
            value={cigarettesPerDay}
            onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
            onBlur={saveHabit}
          />
        </div>
        <div className="field">
          <label>Paket Fiyatı (₺)</label>
          <input
            className="input"
            type="number"
            value={pricePerPack}
            onChange={(e) => setPricePerPack(Number(e.target.value))}
            onBlur={saveHabit}
          />
        </div>
      </div>

      {!quitDate ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <h3 style={{ marginBottom: 16 }}>Sigarayı Bırakmaya Hazır mısın?</h3>
          <p className="sub" style={{ marginBottom: 24 }}>
            Bugün sigarayı bırakmaya başla ve ilerlemeni takip et.
          </p>
          <button className="btn" onClick={handleStartQuit} disabled={loading}>
            Bırakmaya Başla
          </button>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>İlerlemen</h3>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#F59E0B', marginBottom: 8 }}>
                {stats.daysClean}
              </div>
              <p className="sub">Gündür Temizsin 🔥</p>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginBottom: 16 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h4 style={{ marginBottom: 8 }}>İçilmeyen Sigara</h4>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#10B981' }}>
                {stats.cigarettesNotSmoked}
              </div>
              <p className="sub">adet</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h4 style={{ marginBottom: 8 }}>Tasarruf</h4>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#10B981' }}>
                ₺{stats.moneySaved}
              </div>
              <p className="sub">kazanıldı</p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Sağlık Geri Kazanım Skoru</h3>
            <div style={{ background: '#0B101B', borderRadius: '12px', padding: '8px', marginBottom: 8 }}>
              <div
                style={{
                  height: '24px',
                  background: '#10B981',
                  borderRadius: '8px',
                  width: `${stats.healthScore}%`,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span className="sub">0%</span>
              <span style={{ fontWeight: 600, color: '#10B981' }}>{stats.healthScore}%</span>
              <span className="sub">100%</span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Sağlık İyileşme Zaman Çizelgesi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className={`food-item ${stats.daysClean >= 1 ? 'done' : ''}`}>
                <div>
                  <strong>20 dakika</strong>
                  <div className="sub">Kalp atışı ve kan basıncı normale döner</div>
                </div>
                {stats.daysClean >= 1 && <span className="check on">✓</span>}
              </div>
              <div className={`food-item ${stats.daysClean >= 1 ? 'done' : ''}`}>
                <div>
                  <strong>12 saat</strong>
                  <div className="sub">Kandaki karbonmonoksit seviyesi normale döner</div>
                </div>
                {stats.daysClean >= 1 && <span className="check on">✓</span>}
              </div>
              <div className={`food-item ${stats.daysClean >= 7 ? 'done' : ''}`}>
                <div>
                  <strong>1 hafta</strong>
                  <div className="sub">Tat ve koku alma duyusu iyileşir</div>
                </div>
                {stats.daysClean >= 7 && <span className="check on">✓</span>}
              </div>
              <div className={`food-item ${stats.daysClean >= 30 ? 'done' : ''}`}>
                <div>
                  <strong>1 ay</strong>
                  <div className="sub">Öksürük azalır, akciğer fonksiyonu iyileşir</div>
                </div>
                {stats.daysClean >= 30 && <span className="check on">✓</span>}
              </div>
              <div className={`food-item ${stats.daysClean >= 90 ? 'done' : ''}`}>
                <div>
                  <strong>3 ay</strong>
                  <div className="sub">Dolaşım sistemi iyileşir, yürüme kolaylaşır</div>
                </div>
                {stats.daysClean >= 90 && <span className="check on">✓</span>}
              </div>
              <div className={`food-item ${stats.daysClean >= 365 ? 'done' : ''}`}>
                <div>
                  <strong>1 yıl</strong>
                  <div className="sub">Kalp hastalığı riski yarıya düşer</div>
                </div>
                {stats.daysClean >= 365 && <span className="check on">✓</span>}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16, textAlign: 'center' }}>
            <p className="sub" style={{ marginBottom: 16 }}>
              Yanlışlıkla tıkladın mı? Tekrar başlayabilirsin.
            </p>
            <button className="btn ghost danger" onClick={handleResume} disabled={loading}>
              Bırakmayı İptal Et
            </button>
          </div>
        </>
      )}
    </div>
  )
}
