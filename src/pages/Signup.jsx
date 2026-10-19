import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

export default function Signup() {
  const { session, signUp, demo } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setInfo('')
    try {
      await signUp(email, password, displayName)
      if (!demo) setInfo('Kayıt alındı. E-posta onayını açtıysan gelen kutunu kontrol et, sonra giriş yap.')
    } catch (err) {
      setError(err.message || 'Kayıt başarısız')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <form className="card auth-card" onSubmit={submit} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="brand">GFIT</div>
        <h1>Hesap oluştur</h1>
        <p className="sub">Hedefler varsayılan olarak 2600 kcal / 170g protein.</p>
        <div className="field">
          <label>Ad</label>
          <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="field">
          <label>E-posta</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Şifre (min 6)</label>
          <input className="input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error">{error}</p>}
        {info && <div className="banner">{info}</div>}
        <button className="btn" disabled={busy} style={{ width: '100%' }}>{busy ? 'Kaydediliyor…' : 'Kayıt ol'}</button>
        <p className="sub" style={{ marginTop: 14 }}>
          Zaten hesabın var mı? <Link to="/giris">Giriş yap</Link>
        </p>
      </form>
      <Footer />
    </div>
  )
}
