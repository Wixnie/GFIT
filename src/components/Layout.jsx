import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import FeedbackModal from './FeedbackModal'
import QuickActionSheet from './QuickActionSheet'
import FoodScannerPanel from './FoodScannerPanel'
import { LayoutGrid, UtensilsCrossed, Dumbbell, User, Plus, TrendingUp, Users, Ban } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Özet', icon: LayoutGrid },
  { to: '/yemek', label: 'Yemek', icon: UtensilsCrossed },
  { to: '/antrenman', label: 'Antrenman', icon: Dumbbell },
  { to: '/guc-artisi', label: 'Güç', icon: TrendingUp },
  { to: '/aliskanliklar', label: 'Sigara', icon: Ban },
  { to: '/sosyal', label: 'Sosyal', icon: Users },
  { to: '/profil', label: 'Profil', icon: User },
]

export default function Layout() {
  const { profile, signOut, demo } = useAuth()
  const [showFeedback, setShowFeedback] = useState(false)
  const [quickActionOpen, setQuickActionOpen] = useState(false)
  const [scannerPanelOpen, setScannerPanelOpen] = useState(false)

  useEffect(() => {
    const handleOpenFeedback = () => setShowFeedback(true)
    window.addEventListener('openFeedback', handleOpenFeedback)
    return () => window.removeEventListener('openFeedback', handleOpenFeedback)
  }, [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">G<span>Fitt</span></div>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <l.icon size={18} style={{ marginRight: 8 }} />
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
          <div className="brand">G<span>Fitt</span></div>
          <div className="row">
            {demo && <div className="chip" style={{ marginBottom: 0, marginRight: 8 }}>Demo</div>}
            <NavLink className="chip" to="/profil">Profil</NavLink>
            <button className="btn ghost" onClick={signOut}>Çıkış</button>
          </div>
        </div>
        <Outlet />
      </main>
      <nav className="bottom-nav" style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1rem',
        right: '1rem',
        height: '4rem',
        background: 'rgba(22, 19, 38, 0.9)',
        backdropFilter: 'blur(1rem)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '9999px',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50
      }}>
        {links.map((l, i) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              color: '#64748B',
              textDecoration: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              minWidth: '40px',
              ...(i === 2 ? { marginRight: '1.75rem' } : {}),
              ...(i === 3 ? { marginLeft: '1.75rem' } : {})
            }}
          >
            <l.icon className="nav-icon" size={18} style={{ marginBottom: '2px', transition: 'transform 0.2s ease' }} />
            <span>{l.label}</span>
          </NavLink>
        ))}
        <button
          className="fab"
          onClick={() => setQuickActionOpen(true)}
          style={{
            position: 'absolute',
            left: '50%',
            top: '-1.25rem',
            transform: 'translateX(-50%)',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            background: '#FF8A00',
            boxShadow: '0 0 25px rgba(255, 138, 0, 0.45)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 51
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 138, 0, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
            e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 138, 0, 0.45)'
          }}
        >
          <Plus className="fab-icon" size={28} style={{ color: '#111827' }} />
        </button>
      </nav>
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
      <QuickActionSheet 
        isOpen={quickActionOpen} 
        onClose={() => setQuickActionOpen(false)} 
        onOpenScanner={() => setScannerPanelOpen(true)}
      />
      <FoodScannerPanel isOpen={scannerPanelOpen} onClose={() => setScannerPanelOpen(false)} />
    </div>
  )
}