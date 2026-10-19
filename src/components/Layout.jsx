import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Özet' },
  { to: '/yemek', label: 'Yemek' },
  { to: '/antrenman', label: 'Antrenman' },
  { to: '/supplement', label: 'Supplement' },
  { to: '/kilo', label: 'Kilo' },
  { to: '/ilerleme', label: 'İlerleme' },
  { to: '/aliskanliklar', label: 'Alışkanlıklar' },
  { to: '/ai-koc', label: 'AI Koç' },
  { to: '/etiket-okuyucu', label: 'Etiket' },
  { to: '/pazar', label: 'Pazar' },
  { to: '/premium', label: 'Premium' },
  { to: '/profil', label: 'Profil' },
]

export default function Layout() {
  const { profile, signOut, demo } = useAuth()
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
      </main>
      <nav className="bottom-nav">
        {links.slice(0, 5).map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/premium" className={({ isActive }) => (isActive ? 'active' : '')}>
          Premium
        </NavLink>
      </nav>
    </div>
  )
}