import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#0F172A',
      borderTop: '1px solid rgba(51, 65, 85, 0.5)',
      padding: '2rem 1rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '72rem',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          GFIT © 2026 GFIT, Inc. Tüm hakları saklıdır.
        </div>

        <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>
          Crafted with 💻 by Efehan Çetin © 2026
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link 
            to="/gizlilik-politikasi" 
            style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            Gizlilik
          </Link>
          <Link 
            to="/kvkk" 
            style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            KVKK
          </Link>
          <Link 
            to="/kullanim-kosullari" 
            style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            Şartlar
          </Link>
          <Link 
            to="/destek" 
            style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            Destek
          </Link>
          <a 
            href="#feedback" 
            onClick={(e) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('openFeedback'))
            }}
            style={{ 
              color: '#F59E0B', 
              textDecoration: 'none', 
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            Hata / Öneri Bildir 🐛
          </a>
        </div>
      </div>
    </footer>
  )
}
