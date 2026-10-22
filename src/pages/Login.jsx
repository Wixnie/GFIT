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

        {/* Social Login Buttons */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            style={{ 
              width: '100%', 
              marginBottom: 8, 
              background: 'white', 
              color: 'black', 
              fontWeight: 600,
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s ease'
            }}
            onClick={() => handleOAuthLogin('apple')}
            disabled={busy}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3 1.32-3.23 2.44-1.87 2.24-2.54 6.41-1.06 10.39.93 2.52 2.46 3.31 4.58 3.36 1.1.03 2.39-.5 3.25-1.5.87-1 1.43-1.07 2.66-1.07 1.24 0 1.75.77 2.66 1.07.9.3 2.49 1.43 3.26 2.44zM15.5 7.5c.71-1.12 1.2-2.68 1.06-4.24-1.03.05-2.28.69-3.02 1.53-.67.77-1.22 2.19-1.07 3.57 1.15.09 2.32-.53 3.03-1.86z"/>
            </svg>
            Apple ile Giriş Yap
          </button>
          <button
            type="button"
            style={{ 
              width: '100%', 
              marginBottom: 8, 
              background: '#181528', 
              color: 'white', 
              fontWeight: 600,
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s ease'
            }}
            onClick={() => handleOAuthLogin('google')}
            disabled={busy}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#181528'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Giriş Yap
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
          className="btn-secondary"
          style={{ 
            width: '100%', 
            marginTop: 12,
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={demoLogin}
          disabled={busy}
        >
          Şimdilik Atla (Misafir Modu)
        </button>

        {demo && (
          <button 
            type="button" 
            style={{ 
              width: '100%', 
              marginTop: 8,
              background: 'transparent',
              color: '#94A3B8',
              fontWeight: 500,
              padding: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationOffset: '4px',
              transition: 'color 0.2s ease'
            }} 
            disabled={busy} 
            onClick={demoLogin}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            Demo ile dene
          </button>
        )}
        <p className="sub" style={{ marginTop: 14 }}>
          Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link>
        </p>
        <div className="global-footer">
          Made by Efehan Çetin · GFitt © 2026
        </div>
      </form>
    </div>
  )
}
