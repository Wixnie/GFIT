import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session, signIn, signInWithOAuth, startDemo, demo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message || 'Giriş başarısız')
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

  async function demoLogin() {
    setBusy(true)
    setError('')
    try {
      await startDemo()
    } catch (err) {
      setError(err.message || 'Demo açılamadı')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <form className="card auth-card" onSubmit={submit} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="brand">G<span>Fitt</span></div>
        <h1>Giriş yap</h1>
        <p className="sub">Kalori, makro ve antrenman takibini tek yerden tut.</p>
        {demo && (
          <div className="banner">
            Supabase bağlı değil. Hesap bu tarayıcıda saklanır. İstersen hemen demo aç.
          </div>
        )}

        {/* Social Login Buttons */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="btn ghost"
            style={{ width: '100%', marginBottom: 8, border: '1px solid #1E293B' }}
            onClick={() => handleOAuthLogin('apple')}
            disabled={busy}
          >
            🍎 Apple ile Giriş Yap
          </button>
          <button
            type="button"
            className="btn ghost"
            style={{ width: '100%', marginBottom: 8, border: '1px solid #1E293B' }}
            onClick={() => handleOAuthLogin('google')}
            disabled={busy}
          >
            🔵 Google ile Giriş Yap
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <span className="sub" style={{ fontSize: '12px' }}>veya</span>
        </div>

        <div className="field">
          <label>E-posta</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Şifre</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy} style={{ width: '100%' }}>{busy ? 'Giriliyor…' : 'Giriş'}</button>

        {/* Guest Mode */}
        <button
          type="button"
          className="btn ghost"
          style={{ width: '100%', marginTop: 12 }}
          onClick={demoLogin}
        >
          Şimdilik Atla (Misafir Modu)
        </button>

        {demo && (
          <button type="button" className="btn ghost" style={{ width: '100%', marginTop: 8 }} disabled={busy} onClick={demoLogin}>
            Demo ile dene
          </button>
        )}
        <p className="sub" style={{ marginTop: 14 }}>
          Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link>
        </p>
      </form>
    </div>
  )
}
