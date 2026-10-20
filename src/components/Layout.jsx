import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Footer from './Footer'
import FeedbackModal from './FeedbackModal'

const links = [
  { to: '/dashboard', label: 'Özet', icon: '📊' },
  { to: '/yemek', label: 'Yemek', icon: '🍽️' },
  { to: '/antrenman', label: 'Antrenman', icon: '💪' },
  { to: '/profil', label: 'Profil', icon: '👤' },
]

export default function Layout() {
  const { profile, signOut, demo } = useAuth()
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    const handleOpenFeedback = () => setShowFeedback(true)
    window.addEventListener('openFeedback', handleOpenFeedback)
    return () => window.removeEventListener('openFeedback', handleOpenFeedback)
  }, [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">GFIT</div>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {l.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto' }}>
          {demo && <div className="chip" style={{ marginBottom: 10 }}>Demo mod (local)</div>}
          <div className="sub" style={{ marginBottom: 8 }}>{profile?.display_name}</div>
          <button className="btn ghost" onClick={signOut}>Çıkış</button>
        </div>
      </aside>
      <main className="main">
        <div className="mobile-top">
          <div className="brand">GFIT</div>
          <div className="row">
            <NavLink className="chip" to="/profil">Profil</NavLink>
            <button className="btn ghost" onClick={signOut}>Çıkış</button>
          </div>
        </div>
        <Outlet />
        <Footer />
      </main>
      <nav className="bottom-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="fab" onClick={() => window.location.href = '/yemek'}>
        <span className="fab-icon">+</span>
      </button>
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  )
}