import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../lib/api'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { session, profile, setProfile, demo } = useAuth()
  const [form, setForm] = useState({
    display_name: profile?.display_name || '',
    age: profile?.age || 22,
    height_cm: profile?.height_cm || 185,
    weight_kg: profile?.weight_kg || 90,
    calorie_target: profile?.calorie_target || 2600,
    protein_target: profile?.protein_target || 170,
    carb_target: profile?.carb_target || 310,
    fat_target: profile?.fat_target || 75,
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

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
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Kişisel Bilgiler</h3>
          {[
            ['display_name', 'Ad', 'text'],
            ['age', 'Yaş', 'number'],
            ['height_cm', 'Boy (cm)', 'number'],
            ['weight_kg', 'Kilo (kg)', 'number'],
          ].map(([key, label, type]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input className="input" type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} disabled={loading} />
            </div>
          ))}
          <button className="btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {saved && <p className="sub">Bilgiler güncellendi.</p>}
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
          <button className="btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Hedefleri Kaydet'}
          </button>
        </form>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>VIP Koçluk</h3>
          <p className="sub" style={{ marginBottom: 16 }}>Birebir WhatsApp koçluk desteği</p>
          <a 
            href="https://wa.me/905XXXXXXXXX" 
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
    </div>
  )
}
