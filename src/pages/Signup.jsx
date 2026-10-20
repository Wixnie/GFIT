import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { session, signUp, signInWithOAuth, demo } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
      await signUp(email, password, displayName, phone)
      if (!demo) setInfo('Kayıt alındı. E-posta onayını açtıysan gelen kutunu kontrol et, sonra giriş yap.')
    } catch (err) {
      setError(err.message || 'Kayıt başarısız')
    } finally {
      setBusy(false)
    }
  }

  async function handleOAuthLogin(provider) {
    setBusy(true)
    setError('')
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError(err.message || 'OAuth girişi başarısız')
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <form className="card auth-card" onSubmit={submit} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="brand">G<span>Fitt</span></div>
        <h1>Hesap oluştur</h1>
        <p className="sub">Hedefler varsayılan olarak 2600 kcal / 170g protein.</p>

        {/* Social Login Buttons */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="btn ghost"
            style={{ width: '100%', marginBottom: 8, border: '1px solid #1E293B' }}
            onClick={() => handleOAuthLogin('apple')}
            disabled={busy}
          >
            🍎 Apple ile Kayıt Ol
          </button>
          <button
            type="button"
            className="btn ghost"
            style={{ width: '100%', marginBottom: 8, border: '1px solid #1E293B' }}
            onClick={() => handleOAuthLogin('google')}
            disabled={busy}
          >
            🔵 Google ile Kayıt Ol
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <span className="sub" style={{ fontSize: '12px' }}>veya</span>
        </div>

        <div className="field">
          <label>Ad</label>
          <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="field">
          <label>E-posta</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Telefon Numarası</label>
          <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" />
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
    </div>
  )
}
