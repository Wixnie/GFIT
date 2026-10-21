import { Flame } from 'lucide-react'

export default function StreakCounter({ streak }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        padding: '8px 16px',
        background: 'rgba(249, 115, 22, 0.15)',
        borderRadius: '9999px',
        border: '1px solid rgba(249, 115, 22, 0.3)'
      }}>
        <Flame 
          size={20} 
          color={streak > 0 ? '#F97316' : '#64748B'} 
          style={{ 
            animation: streak > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
          }}
        />
        <span style={{ 
          fontSize: '18px', 
          fontWeight: 700, 
          color: streak > 0 ? '#F97316' : '#64748B'
        }}>
          {streak}
        </span>
        <span className="sub" style={{ 
          fontSize: '12px', 
          color: streak > 0 ? '#F97316' : '#64748B',
          margin: 0
        }}>
          gün
        </span>
      </div>
    </div>
  )
}
