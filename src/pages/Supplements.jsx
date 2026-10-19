import { useEffect, useState } from 'react'
import { SUPPLEMENTS } from '../data/supplements'
import { useAuth } from '../context/AuthContext'
import { listSupplements, toggleSupplement } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'

const POPULAR_BRANDS = [
  { id: 'hiq-whey', name: 'HIQ Whey Protein', type: 'protein', dose: '30g', timing: 'Antrenman sonrası', hint: 'Kas gelişimi için' },
  { id: 'bigjoy-creatine', name: 'Bigjoy Creatine', type: 'creatine', dose: '5g', timing: 'Antrenman öncesi/sonrası', hint: 'Güç ve performans' },
  { id: 'ocean-magnesium', name: 'Ocean Magnesium', type: 'magnesium', dose: '400mg', timing: 'Yatmadan önce', hint: 'Kas gevşemesi ve uyku' },
  { id: 'hiq-bcaa', name: 'HIQ BCAA', type: 'bcaa', dose: '10g', timing: 'Antrenman sırasında', hint: 'Kas koruması' },
  { id: 'omega-3', name: 'Omega-3', type: 'omega', dose: '1000mg', timing: 'Yemeklerle', hint: 'Kalp ve beyin sağlığı' },
  { id: 'vitamin-d', name: 'Vitamin D3', type: 'vitamin', dose: '2000IU', timing: 'Sabah', hint: 'Bağışıklık ve kemik' },
]

export default function Supplements() {
  const { session, profile } = useAuth()
  const [date, setDate] = useState(todayISO())
  const [taken, setTaken] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSupplement, setNewSupplement] = useState({ name: '', dose: '', timing: '' })
  const [customSupplements, setCustomSupplements] = useState([])

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const rows = await listSupplements(session.id, date)
      setTaken(rows.map((r) => r.supplement_id))
    } catch (err) {
      console.error('Supplementler yüklenirken hata:', err)
      setError('Supplementler yüklenirken hata oluştu')
      setTaken([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    const saved = localStorage.getItem('gfit_custom_supplements')
    if (saved) setCustomSupplements(JSON.parse(saved))
  }, [date, session.id])

  async function onToggle(id) {
    setLoading(true)
    setError(null)
    try {
      await toggleSupplement(session.id, id, date)
      await refresh()
    } catch (err) {
      console.error('Supplement değiştirilirken hata:', err)
      setError('Supplement değiştirilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustom = () => {
    if (!newSupplement.name.trim()) return
    const custom = {
      id: 'custom-' + Date.now(),
      ...newSupplement,
      type: 'custom'
    }
    const updated = [...customSupplements, custom]
    setCustomSupplements(updated)
    localStorage.setItem('gfit_custom_supplements', JSON.stringify(updated))
    setNewSupplement({ name: '', dose: '', timing: '' })
    setShowAddForm(false)
  }

  const allSupplements = [...POPULAR_BRANDS, ...customSupplements]
  const done = taken.length
  const total = allSupplements.length

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">{done}/{total} tamamlandı</p>
          <h1>Supplement</h1>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* PRO Özellik Banner */}
      {profile?.is_pro && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }}>
          <h3 style={{ margin: '0 0 8px', color: '#F59E0B' }}>PRO: Akıllı Bildirim Şablonu</h3>
          <p className="sub">Supplement saatlerini otomatik hatırlatıcı olarak ayarla.</p>
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Popüler Markalar</h3>
          <button className="btn ghost" onClick={() => setShowAddForm(!showAddForm)} style={{ fontSize: '13px' }}>
            {showAddForm ? 'İptal' : '+ Manuel Ekle'}
          </button>
        </div>

        {showAddForm && (
          <div style={{ marginBottom: 16, padding: '16px', background: '#0B101B', borderRadius: '12px' }}>
            <div className="field">
              <label>Supplement Adı</label>
              <input
                className="input"
                value={newSupplement.name}
                onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                placeholder="Örn: ZMA"
              />
            </div>
            <div className="field">
              <label>Dozaj</label>
              <input
                className="input"
                value={newSupplement.dose}
                onChange={(e) => setNewSupplement({ ...newSupplement, dose: e.target.value })}
                placeholder="Örn: 2 kapsül"
              />
            </div>
            <div className="field">
              <label>Zamanlama</label>
              <input
                className="input"
                value={newSupplement.timing}
                onChange={(e) => setNewSupplement({ ...newSupplement, timing: e.target.value })}
                placeholder="Örn: Yatmadan önce"
              />
            </div>
            <button className="btn" onClick={handleAddCustom} style={{ width: '100%' }}>
              Ekle
            </button>
          </div>
        )}

        {allSupplements.map((s) => {
          const on = taken.includes(s.id)
          return (
            <button
              key={s.id}
              className={`check-item ${on ? 'done' : ''}`}
              onClick={() => onToggle(s.id)}
              disabled={loading}
              style={{ width: '100%', background: 'transparent', border: 0, cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left' }}
            >
              <div>
                <strong>{s.name}</strong>
                <div className="sub">{s.hint}</div>
                <div className="sub" style={{ fontSize: '12px', marginTop: 4 }}>
                  Doz: {s.dose} · {s.timing}
                </div>
              </div>
              <span className={`check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>

      {/* Bilgi Kartı */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Supplement Kullanım İpuçları</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong style={{ color: '#F59E0B' }}>Creatine</strong>
            <p className="sub" style={{ marginTop: 4 }}>Günde 5g, bol su ile alın. İlk 5 gün yüklenme yapılabilir.</p>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong style={{ color: '#F59E0B' }}>Whey Protein</strong>
            <p className="sub" style={{ marginTop: 4 }}>Antrenman sonrası 30 dakika içinde alın. En iyi sindirim için su ile karıştırın.</p>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong style={{ color: '#F59E0B' }}>Magnesium</strong>
            <p className="sub" style={{ marginTop: 4 }}>Yatmadan 1-2 saat önce alın. Uyku kalitesini artırır ve kas gevşemesine yardımcı olur.</p>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong style={{ color: '#EF4444' }}>Etkileşim Uyarısı</strong>
            <p className="sub" style={{ marginTop: 4 }}>Birden fazla supplement kullanmadan önce doktorunuza danışın. Bazı supplementler birbirleriyle etkileşebilir.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
