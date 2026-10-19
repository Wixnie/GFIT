import { useEffect, useState } from 'react'
import { SUPPLEMENTS } from '../data/supplements'
import { useAuth } from '../context/AuthContext'
import { listSupplements, toggleSupplement } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'

const POPULAR_BRANDS = [
  { id: 'hiq-whey', name: 'HIQ High Pro+ Whey', type: 'protein', dose: '30g (1 silme)', timing: 'Antrenman sonrasi', hint: 'Kas gelisimi icin', brand: 'HIQ' },
  { id: 'proteinocean-whey', name: 'Proteinocean Whey Protein', type: 'protein', dose: '30g (1 silme)', timing: 'Antrenman sonrasi', hint: 'Gunluk protein ihtiyaci', brand: 'Proteinocean' },
  { id: 'proteinocean-creatine', name: 'Proteinocean Creatine', type: 'creatine', dose: '5g (1 silme)', timing: 'Antrenman oncesi/sonrasi', hint: 'Guc ve performans', brand: 'Proteinocean' },
  { id: 'bigjoy-whey', name: 'Bigjoy Bigwhey Classic', type: 'protein', dose: '30g (1 silme)', timing: 'Antrenman sonrasi', hint: 'Klasik whey', brand: 'Bigjoy' },
  { id: 'bigjoy-creatine', name: 'Bigjoy Creatine Monohydrate', type: 'creatine', dose: '5g (1 silme)', timing: 'Antrenman oncesi/sonrasi', hint: 'Guc ve performans', brand: 'Bigjoy' },
  { id: 'ocean-magnesium', name: 'Ocean Extramag Uclu Magnezyum', type: 'magnesium', dose: '2 tablet', timing: 'Yatmadan 1 saat once', hint: 'Kas gevsemesi ve uyku', brand: 'Ocean' },
  { id: 'ocean-d3k2', name: 'Ocean Vitamin D3K2', type: 'vitamin', dose: '3 damla', timing: 'Yagli ogunle', hint: 'Bagisiklik ve kemik', brand: 'Ocean' },
  { id: 'hardline-zma', name: 'Hardline ZMA', type: 'recovery', dose: '3 kapsul', timing: 'Yatmadan once', hint: 'Iyilesme ve uyku', brand: 'Hardline' },
  { id: 'solgar-whey', name: 'Solgar Whey Protein', type: 'protein', dose: '30g (1 silme)', timing: 'Antrenman sonrasi', hint: 'Kalite whey', brand: 'Solgar' },
  { id: 'natures-omega', name: 'Nature Supreme Omega-3', type: 'omega', dose: '2 kapsul', timing: 'Yemeklerle', hint: 'Kalp ve beyin sagligi', brand: 'Nature Supreme' },
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
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('brands') // 'brands', 'scanner', 'manual'

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

  const filteredBrands = POPULAR_BRANDS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        {/* Tabs */}
        <div className="row" style={{ marginBottom: 16 }}>
          <button
            className={`btn ${activeTab === 'brands' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('brands')}
            style={{ flex: 1 }}
          >
            🔍 Popüler Markalar
          </button>
          <button
            className={`btn ${activeTab === 'scanner' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('scanner')}
            style={{ flex: 1 }}
          >
            📸 Kutuyu AI ile Tara
          </button>
          <button
            className={`btn ${activeTab === 'manual' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('manual')}
            style={{ flex: 1 }}
          >
            ✍️ Elle Ekle
          </button>
        </div>

        {activeTab === 'brands' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <input
                className="input"
                placeholder="Ara: oce, hiq, big, har, sol, kre, mag, omeg..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredBrands.map((s) => {
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
                    <div className="sub">{s.brand} · {s.hint}</div>
                    <div className="sub" style={{ fontSize: '12px', marginTop: 4 }}>
                      Doz: {s.dose} · {s.timing}
                    </div>
                  </div>
                  <span className={`check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                </button>
              )
            })}
          </>
        )}

        {activeTab === 'scanner' && (
          <div style={{ textAlign: 'center', padding: '32px', background: '#0B101B', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>📸</div>
            <h3 style={{ margin: '0 0 8px' }}>Supplement Kutusunu Tara</h3>
            <p className="sub" style={{ marginBottom: 16 }}>
              AI ile supplement kutusunun fotoğrafını çek ve otomatik bilgileri al
            </p>
            <p className="sub" style={{ color: '#F59E0B' }}>
              PRO özellik - Yakında
            </p>
          </div>
        )}

        {activeTab === 'manual' && (
          <div style={{ padding: '16px', background: '#0B101B', borderRadius: '12px' }}>
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
