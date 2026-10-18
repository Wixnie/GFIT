import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../lib/api'

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

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="sub">{demo ? 'Lokal hesap' : session.email}</p>
          <h1>Profil & hedefler</h1>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <form className="card" onSubmit={save} style={{ maxWidth: 560 }}>
        {[
          ['display_name', 'Ad', 'text'],
          ['age', 'Yaş', 'number'],
          ['height_cm', 'Boy (cm)', 'number'],
          ['weight_kg', 'Kilo (kg)', 'number'],
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
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {saved && <p className="sub">Hedefler güncellendi.</p>}
      </form>
    </div>
  )
}
