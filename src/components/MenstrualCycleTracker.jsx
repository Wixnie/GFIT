import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Droplets, Zap, Moon, Sun } from 'lucide-react'

export default function MenstrualCycleTracker({ profile, onUpdate }) {
  const [cycleStartDate, setCycleStartDate] = useState(profile?.cycle_start_date || '')
  const [cycleLength, setCycleLength] = useState(profile?.cycle_length || 28)
  const [currentPhase, setCurrentPhase] = useState(null)
  const [daysUntilNext, setDaysUntilNext] = useState(0)

  useEffect(() => {
    if (cycleStartDate) {
      const today = new Date()
      const start = new Date(cycleStartDate)
      const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24))
      const dayInCycle = (daysSinceStart % cycleLength) + 1
      
      setDaysUntilNext(cycleLength - dayInCycle + 1)
      
      // Calculate phase based on cycle day
      if (dayInCycle <= 5) {
        setCurrentPhase({ name: 'Menstrüasyon', icon: Droplets, color: '#EF4444', day: dayInCycle })
      } else if (dayInCycle <= 13) {
        setCurrentPhase({ name: 'Foliküler', icon: Sun, color: '#10B981', day: dayInCycle })
      } else if (dayInCycle <= 16) {
        setCurrentPhase({ name: 'Ovülasyon', icon: Zap, color: '#F59E0B', day: dayInCycle })
      } else {
        setCurrentPhase({ name: 'Luteal', icon: Moon, color: '#8B5CF6', day: dayInCycle })
      }
    }
  }, [cycleStartDate, cycleLength])

  const handleSave = () => {
    onUpdate({
      cycle_start_date: cycleStartDate,
      cycle_length: cycleLength
    })
  }

  const getPhaseAdjustments = () => {
    if (!currentPhase) return null
    
    switch (currentPhase.name) {
      case 'Menstrüasyon':
        return {
          calories: '+150 kcal',
          protein: '+10g',
          notes: 'Demir açığı için koyu yeşil yapraklı sebze, kırmızı et tüketin. Omega-3 ile krampları azaltın.'
        }
      case 'Foliküler':
        return {
          calories: 'Standart',
          protein: 'Standart',
          notes: 'Enerji yüksek, yüksek yoğunluklu antrenman için ideal dönem.'
        }
      case 'Ovülasyon':
        return {
          calories: 'Standart',
          protein: 'Standart',
          notes: 'Maksimum güç ve performans. PR denemeleri için uygun.'
        }
      case 'Luteal':
        return {
          calories: '+200 kcal',
          protein: '+15g',
          notes: 'Tatlı krizi için magnezyum açığı. Karbonhidratları kompleks kaynaklardan alın.'
        }
      default:
        return null
    }
  }

  const adjustments = getPhaseAdjustments()

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginTop: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={20} color="#FF8A00" />
        Regl Döngüsü Takibi
      </h3>

      <div style={{ display: 'grid', gap: '12px', marginBottom: 16 }}>
        <div className="field">
          <label>Son Regl Başlangıç Tarihi</label>
          <input
            className="input"
            type="date"
            value={cycleStartDate}
            onChange={(e) => setCycleStartDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Döngü Uzunluğu (gün)</label>
          <input
            className="input"
            type="number"
            min="21"
            max="35"
            value={cycleLength}
            onChange={(e) => setCycleLength(parseInt(e.target.value))}
          />
        </div>
        <button className="btn" onClick={handleSave} style={{ width: '100%' }}>
          Kaydet
        </button>
      </div>

      {currentPhase && (
        <div style={{ 
          padding: '16px', 
          background: `${currentPhase.color}15`, 
          borderRadius: '12px',
          border: `1px solid ${currentPhase.color}40`,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 12 }}>
            <currentPhase.icon size={24} color={currentPhase.color} />
            <div>
              <h4 style={{ margin: 0, color: currentPhase.color }}>{currentPhase.name} Fazı</h4>
              <p className="sub" style={{ margin: 0 }}>Döngü günü: {currentPhase.day}/{cycleLength}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: 12 }}>
            <div>
              <p className="sub" style={{ fontSize: '12px' }}>Sonraki regle</p>
              <strong style={{ color: '#F1F5F9' }}>{daysUntilNext} gün</strong>
            </div>
          </div>

          {adjustments && (
            <div style={{ 
              padding: '12px', 
              background: '#0B101B', 
              borderRadius: '8px',
              marginTop: 12
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: 8 }}>
                <div>
                  <p className="sub" style={{ fontSize: '11px' }}>Kalori Ayarı</p>
                  <strong style={{ fontSize: '14px', color: '#F59E0B' }}>{adjustments.calories}</strong>
                </div>
                <div>
                  <p className="sub" style={{ fontSize: '11px' }}>Protein Ayarı</p>
                  <strong style={{ fontSize: '14px', color: '#10B981' }}>{adjustments.protein}</strong>
                </div>
              </div>
              <p className="sub" style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
                {adjustments.notes}
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: 16 }}>
        {Array.from({ length: cycleLength }, (_, i) => {
          const day = i + 1
          let phaseColor = '#1E293B'
          let isCurrent = false
          
          if (day <= 5) {
            phaseColor = '#EF4444'
          } else if (day <= 13) {
            phaseColor = '#10B981'
          } else if (day <= 16) {
            phaseColor = '#F59E0B'
          } else {
            phaseColor = '#8B5CF6'
          }
          
          if (currentPhase && day === currentPhase.day) {
            isCurrent = true
          }
          
          return (
            <div
              key={day}
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                borderRadius: '4px',
                background: isCurrent ? phaseColor : `${phaseColor}40`,
                color: isCurrent ? '#fff' : phaseColor,
                fontWeight: isCurrent ? 700 : 400,
                border: isCurrent ? `2px solid ${phaseColor}` : 'none'
              }}
            >
              {day}
            </div>
          )
        })}
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginTop: 12, fontSize: '11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#EF4444' }} />
          <span className="sub">Menstrüasyon</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10B981' }} />
          <span className="sub">Foliküler</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#F59E0B' }} />
          <span className="sub">Ovülasyon</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#8B5CF6' }} />
          <span className="sub">Luteal</span>
        </div>
      </div>
    </div>
  )
}
