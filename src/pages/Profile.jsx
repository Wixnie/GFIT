import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../lib/api'
import { supabase } from '../lib/supabase'
import { PERSONAL_DEFAULTS } from '../data/programs'
import MenstrualCycleTracker from '../components/MenstrualCycleTracker'

export default function Profile() {
  const { session, profile, setProfile, demo } = useAuth()
  const [form, setForm] = useState({
    display_name: profile?.display_name || '',
    age: profile?.age || '',
    height_cm: profile?.height_cm || '',
    weight_kg: profile?.weight_kg || '',
    gender: profile?.gender || 'male',
    calorie_target: profile?.calorie_target || '',
    protein_target: profile?.protein_target || '',
    carb_target: profile?.carb_target || '',
    fat_target: profile?.fat_target || '',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [sleepHours, setSleepHours] = useState(() => {
    const saved = localStorage.getItem('gfitt_sleep')
    return saved ? parseFloat(saved) : 0
  })

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || '',
        age: profile.age || '',
        height_cm: profile.height_cm || '',
        weight_kg: profile.weight_kg || '',
        gender: profile.gender || 'male',
        calorie_target: profile.calorie_target || '',
        protein_target: profile.protein_target || '',
        carb_target: profile.carb_target || '',
        fat_target: profile.fat_target || '',
      })
    }
  }, [profile])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const patch = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, k === 'display_name' ? v : Number(v)]),
      )
      const next = await updateProfile(session.id, patch)
      setProfile(next)
      setSaved(true)
    } catch (err) {
      console.error('Profil güncellenirken hata:', err)
      setError('Profil güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    try {
      // Call RPC to delete all user data
      await supabase.rpc('delete_user')
      // Sign out user
      await supabase.auth.signOut()
      // Redirect to landing page
      window.location.href = '/'
    } catch (err) {
      console.error('Hesap silinirken hata:', err)
      setError('Hesap silinirken hata oluştu. Lütfen tekrar deneyin veya destek ile iletişime geçin.')
    } finally {
      setDeleteLoading(false)
      setDeleteModalOpen(false)
      setDeleteConfirmOpen(false)
    }
  }

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">{demo ? 'Lokal hesap' : session.email}</p>
          <h1>Profil & hedefler</h1>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div className="grid grid-2">
        <form className="card" onSubmit={save}>
          <h3 style={{ marginTop: 0, marginBottom: 16, color: 'white' }}>Kişisel Bilgiler</h3>
          {[
            ['display_name', 'Ad', 'text'],
            ['age', 'Yaş', 'number'],
            ['height_cm', 'Boy (cm)', 'number'],
            ['weight_kg', 'Kilo (kg)', 'number'],
            ['gender', 'Cinsiyet', 'select'],
          ].map(([key, label, type]) => (
            <div className="field" key={key}>
              <label style={{ color: '#94A3B8' }}>{label}</label>
              {type === 'select' ? (
                <select
                  className="input"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  disabled={loading}
                >
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </select>
              ) : (
                <input
                  className="input"
                  type={type}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  disabled={loading}
                  style={key === 'display_name' ? { color: 'white', fontWeight: 'bold', fontSize: '1.25rem' } : {}}
                />
              )}
            </div>
          ))}
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {saved && <p className="sub" style={{ color: '#22C55E' }}>Bilgiler güncellendi.</p>}
        </form>

        <form className="card" onSubmit={save}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Hedefler</h3>
          {[
            ['calorie_target', 'Kalori hedefi', 'number'],
            ['protein_target', 'Protein (g)', 'number'],
            ['carb_target', 'Karb (g)', 'number'],
            ['fat_target', 'Yağ (g)', 'number'],
          ].map(([key, label, type]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input className="input" type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} disabled={loading} />
            </div>
          ))}
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Hedefleri Kaydet'}
          </button>
        </form>
      </div>

      {/* Quick Stats Tiles */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>📊 Hızlı İstatistikler</h3>
        <div className="grid grid-2">
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px', textAlign: 'center' }}>
            <p className="sub" style={{ margin: 0, fontSize: '11px' }}>🍴 Alınan kcal</p>
            <strong style={{ fontSize: '18px', color: '#FF8A00' }}>{profile?.calorie_target || 0}</strong>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px', textAlign: 'center' }}>
            <p className="sub" style={{ margin: 0, fontSize: '11px' }}>🏃 Yakılan kcal</p>
            <strong style={{ fontSize: '18px', color: '#3B82F6' }}>0</strong>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px', textAlign: 'center' }}>
            <p className="sub" style={{ margin: 0, fontSize: '11px' }}>⚖️ Kilo Değişimi</p>
            <strong style={{ fontSize: '18px', color: '#10B981' }}>0 kg</strong>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px', textAlign: 'center' }}>
            <p className="sub" style={{ margin: 0, fontSize: '11px' }}>✏️ Not Sayısı</p>
            <strong style={{ fontSize: '18px', color: '#8B5CF6' }}>0</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>VIP Koçluk</h3>
          <p className="sub" style={{ marginBottom: 16 }}>Birebir WhatsApp koçluk desteği</p>
          <a 
            href="https://wa.me/905555555555" 
            rel="noopener noreferrer" 
            target="_blank"
            className="btn" 
            style={{ display: 'inline-block', textDecoration: 'none', background: '#25D366' }}
          >
            WhatsApp ile Başvur
          </a>
        </div>

        <div className="card" style={{ borderColor: '#dc2626' }}>
          <h3 style={{ marginTop: 0, color: '#dc2626' }}>Hesabımı Sil</h3>
          <p className="sub">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecek.</p>
          <button 
            className="btn danger" 
            onClick={() => setDeleteModalOpen(true)}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Siliniyor...' : 'Hesabımı Sil'}
          </button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Tıbbi Yasal Uyarı</h3>
        <p className="sub" style={{ lineHeight: 1.6 }}>
          GFIT'te sunulan kalori, TDEE ve diğer beslenme tavsiyeleri tıbbi teşhis veya tedavi değildir.
          Bu bilgiler genel tavsiye niteliğindedir ve kişisel sağlık durumunuza uyarlanmamış olabilir.
          Herhangi bir sağlık sorunu varsa veya diyet değişikliği yapmayı planlıyorsanız,
          lütfen önce bir sağlık uzmanına veya diyetisyene danışın.
        </p>
      </div>

      {/* Menstrual Cycle Tracker - Female Only */}
      {profile?.gender === 'female' && (
        <MenstrualCycleTracker 
          profile={profile}
          onUpdate={async (data) => {
            try {
              const next = await updateProfile(session.id, data)
              setProfile(next)
            } catch (err) {
              console.error('Regl döngüsü güncellenirken hata:', err)
            }
          }}
        />
      )}

      {/* Sleep Tracker with Scientific Validation */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>🌙 Uyku Takibi</h3>
        <div className="field">
          <label>Dün Gece Kaç Saat Uydun?</label>
          <input
            className="input"
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={sleepHours}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (val >= 0 && val <= 24) {
                setSleepHours(val)
                localStorage.setItem('gfitt_sleep', val.toString())
              }
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {[5, 6, 7, 8].map((hours) => (
            <button
              key={hours}
              type="button"
              className="chip"
              onClick={() => {
                setSleepHours(hours)
                localStorage.setItem('gfitt_sleep', hours.toString())
              }}
              style={{
                padding: '6px 16px',
                cursor: 'pointer',
                background: sleepHours === hours ? '#FF8A00' : 'transparent',
                color: sleepHours === hours ? '#111827' : '#94A3B8',
                border: sleepHours === hours ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {hours} sa
            </button>
          ))}
        </div>
        <p className="sub" style={{ margin: 0, fontSize: '12px' }}>
          {(() => {
            if (sleepHours === 0) {
              return <span style={{ color: '#94A3B8' }}>Uyku analizi için dün gece kaç saat uyuduğunu gir</span>
            } else if (sleepHours < 6) {
              return <span style={{ color: '#EF4444' }}>⚠️ Yetersiz uyku: Toparlanma ve kas onarımı için riskli</span>
            } else if (sleepHours >= 7 && sleepHours <= 9) {
              return <span style={{ color: '#22C55E' }}>✅ İdeal uyku süresi: Optimum anabolik yenilenme</span>
            } else if (sleepHours > 10) {
              return <span style={{ color: '#F59E0B' }}>⚠️ Aşırı uyku / Halsizlik eğilimi</span>
            } else {
              return <span style={{ color: '#94A3B8' }}>Uyku süresi kaydedildi</span>
            }
          })()}
        </p>
      </div>

      {/* Device Permissions */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>📱 Cihaz İzinleri</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn-secondary-pill"
            onClick={async () => {
              const permission = await Notification.requestPermission()
              if (permission === 'granted') {
                new Notification('GFitt bildirimleri aktif! Su ve öğün saatlerinde yanındayız.')
              }
            }}
          >
            🔔 Bildirim İzni İste
          </button>
          <button
            className="btn-secondary-pill"
            onClick={async () => {
              try {
                await navigator.mediaDevices.getUserMedia({ video: true })
                alert('Kamera izni verildi')
              } catch (err) {
                alert('Kamera izni reddedildi')
              }
            }}
          >
            📷 Kamera İzni İste
          </button>
          <button
            className="btn-secondary-pill"
            onClick={async () => {
              try {
                await navigator.mediaDevices.getUserMedia({ audio: true })
                alert('Mikrofon izni verildi')
              } catch (err) {
                alert('Mikrofon izni reddedildi')
              }
            }}
          >
            🎤 Mikrofon İzni İste
          </button>
        </div>
      </div>

      {/* Daha Fazla / Ayarlar Section */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Daha Fazla</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <Link
            to="/gizlilik-politikasi"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            Gizlilik Politikası
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <Link
            to="/kvkk"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            KVKK
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <Link
            to="/kullanim-kosullari"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            Kullanım Şartları
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <Link
            to="/destek"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            Destek
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <button
            style={{
              width: '100%',
              background: '#181528',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('openFeedback'))}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            Hata / Öneri Bildir
            <span>🐛</span>
          </button>
          <Link
            to="/kvkk"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            KVKK
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <Link
            to="/kullanim-kosullari"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            Kullanım Şartları
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <Link
            to="/destek"
            style={{
              width: '100%',
              background: '#181528',
              textDecoration: 'none',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginBottom: '0.625rem',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#201C35'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            Destek
            <span style={{ color: '#64748B' }}>→</span>
          </Link>
          <button
            style={{
              width: '100%',
              background: 'rgba(255, 138, 0, 0.15)',
              color: '#FF8A00',
              border: '1px solid rgba(255, 138, 0, 0.4)',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease',
              marginTop: '0.25rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('openFeedback'))}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 138, 0, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 138, 0, 0.15)'}
          >
            Hata / Öneri Bildir
            <span>🐛</span>
          </button>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="sub" style={{ fontSize: '12px', marginBottom: 4 }}>
            GFIT © 2026 GFIT, Inc. Tüm hakları saklıdır.
          </p>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>
            Crafted with 💻 by Efehan Çetin © 2026
          </p>
        </div>
      </div>

      {/* Delete Account Modal - First Confirmation */}
      {deleteModalOpen && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}>
            <div className="card" style={{ maxWidth: 400, borderColor: '#dc2626' }}>
              <h3 style={{ marginTop: 0, color: '#dc2626' }}>Hesabımı Sil - Onay</h3>
              <p>Bu işlem şu verilerinizi kalıcı olarak silecek:</p>
              <ul>
                <li>Yemek kayıtları</li>
                <li>Antrenman kayıtları</li>
                <li>Supplement kayıtları</li>
                <li>Kilo kayıtları</li>
                <li>Profil bilgileri</li>
                <li>Supabase Auth kaydı</li>
              </ul>
              <p style={{ color: '#dc2626', fontWeight: 600 }}>Bu işlem geri alınamaz!</p>
              <div className="row" style={{ marginTop: 16 }}>
                <button className="btn ghost" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
                  İptal
                </button>
                <button className="btn danger" onClick={() => setDeleteConfirmOpen(true)} disabled={deleteLoading}>
                  Devam Et
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Account Modal - Second Confirmation */}
      {deleteConfirmOpen && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}>
            <div className="card" style={{ maxWidth: 400, borderColor: '#dc2626' }}>
              <h3 style={{ marginTop: 0, color: '#dc2626' }}>Son Onay</h3>
              <p>Hesabınızı kalıcı olarak silmek üzeresiniz. Bu işlem gerçekten geri alınamaz.</p>
              <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '1.1rem' }}>
                Son bir şansınız var. Gerçekten silmek istiyor musunuz?
              </p>
              <div className="row" style={{ marginTop: 16 }}>
                <button className="btn ghost" onClick={() => {
                  setDeleteConfirmOpen(false)
                  setDeleteModalOpen(false)
                }} disabled={deleteLoading}>
                  İptal
                </button>
                <button className="btn danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                  {deleteLoading ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="global-footer">
        Made by Efehan Çetin · GFitt © 2026
      </div>
    </div>
  )
}
