import { useState, useEffect } from 'react'

const NUDGES = [
  { icon: '💪', message: 'Demirler seni özledi!' },
  { icon: '🔥', message: "Streak'ini bozma!" },
  { icon: '💧', message: 'Su içme vakti geldi!' },
  { icon: '🥗', message: 'Öğünün kaydını unutma!' },
  { icon: '🏋️', message: 'Bugün antrenman var mı?' },
  { icon: '⚡', message: 'Hedefine bir adım daha yaklaş!' },
  { icon: '🎯', message: 'Günlük hedeflerine odaklan!' },
  { icon: '💪', message: 'Pes etmek yok, devam et!' },
  { icon: '🌟', message: 'Harika gidiyorsun, devam et!' },
  { icon: '🥚', message: 'Protein alımını tamamladın mı?' },
]

export default function NudgeBanner() {
  const [visible, setVisible] = useState(false)
  const [currentNudge, setCurrentNudge] = useState(null)

  useEffect(() => {
    // Check if user is inactive for a while or hasn't logged today
    const lastActivity = localStorage.getItem('gfit_last_activity')
    const today = new Date().toDateString()
    
    if (lastActivity !== today) {
      // New day, show a welcome nudge
      const randomNudge = NUDGES[Math.floor(Math.random() * NUDGES.length)]
      setCurrentNudge(randomNudge)
      setVisible(true)
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }

    // Random nudge every 30 minutes of inactivity
    const checkInactivity = () => {
      const lastLog = parseInt(localStorage.getItem('gfit_last_activity_time') || Date.now())
      const inactiveTime = Date.now() - lastLog
      
      if (inactiveTime > 30 * 60 * 1000) { // 30 minutes
        const randomNudge = NUDGES[Math.floor(Math.random() * NUDGES.length)]
        setCurrentNudge(randomNudge)
        setVisible(true)
        
        setTimeout(() => setVisible(false), 5000)
      }
    }

    const interval = setInterval(checkInactivity, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  if (!visible || !currentNudge) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      animation: 'slideDown 0.5s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: '#111827',
        padding: '12px 24px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
        maxWidth: '90vw',
        fontSize: '14px',
        fontWeight: 600
      }}>
        <span style={{ fontSize: '24px' }}>{currentNudge.icon}</span>
        <span>{currentNudge.message}</span>
        <button 
          onClick={() => setVisible(false)}
          style={{
            background: 'rgba(0,0,0,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            color: '#111827',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
