import { useState, useEffect } from 'react'
import { Droplets, Plus, Minus } from 'lucide-react'

export default function WaterTracker({ profile }) {
  const [waterIntake, setWaterIntake] = useState(0)
  const waterTarget = profile?.weight_kg ? Math.round(profile.weight_kg * 33) : 2500 // ml/kg

  useEffect(() => {
    const saved = localStorage.getItem('gfitt_water_intake')
    const savedDate = localStorage.getItem('gfitt_water_date')
    const today = new Date().toDateString()
    
    if (savedDate === today && saved) {
      setWaterIntake(parseInt(saved))
    } else {
      // Reset if new day
      setWaterIntake(0)
      localStorage.setItem('gfitt_water_intake', '0')
      localStorage.setItem('gfitt_water_date', today)
    }
  }, [])

  const addWater = (amount) => {
    const newIntake = waterIntake + amount
    setWaterIntake(newIntake)
    localStorage.setItem('gfitt_water_intake', newIntake.toString())
    localStorage.setItem('gfitt_water_date', new Date().toDateString())
  }

  const removeWater = (amount) => {
    const newIntake = Math.max(0, waterIntake - amount)
    setWaterIntake(newIntake)
    localStorage.setItem('gfitt_water_intake', newIntake.toString())
  }

  const percent = Math.min((waterIntake / waterTarget) * 100, 100)
  const remaining = Math.max(0, waterTarget - waterIntake)

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplets size={20} color="#3B82F6" />
          Su Takibi
        </h3>
        <span className="chip" style={{ background: '#3B82F6', color: '#fff', border: 'none' }}>
          {Math.round(percent)}%
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="sub">Tüketilen</span>
          <span style={{ fontWeight: 700, color: '#3B82F6' }}>{waterIntake} / {waterTarget} ml</span>
        </div>
        <div style={{ height: '12px', background: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
              width: `${percent}%`,
              transition: 'width 0.3s ease',
              borderRadius: '6px'
            }}
          />
        </div>
        {remaining > 0 && (
          <p className="sub" style={{ marginTop: 8, fontSize: '12px' }}>
            Hedefe ulaşmak için {remaining} ml daha iç
          </p>
        )}
        {percent >= 100 && (
          <p className="sub" style={{ marginTop: 8, fontSize: '12px', color: '#10B981' }}>
            🎉 Günlük su hedefine ulaştın!
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <button
          onClick={() => addWater(250)}
          style={{
            padding: '12px',
            background: '#0B101B',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#F1F5F9',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3B82F6'
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.background = '#0B101B'
          }}
        >
          <Plus size={16} color="#3B82F6" />
          +250ml
        </button>
        
        <button
          onClick={() => addWater(500)}
          style={{
            padding: '12px',
            background: '#0B101B',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#F1F5F9',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3B82F6'
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.background = '#0B101B'
          }}
        >
          <Plus size={16} color="#3B82F6" />
          +500ml
        </button>
        
        <button
          onClick={() => removeWater(250)}
          style={{
            padding: '12px',
            background: '#0B101B',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#F1F5F9',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#EF4444'
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.background = '#0B101B'
          }}
        >
          <Minus size={16} color="#EF4444" />
          -250ml
        </button>
      </div>

      <div style={{ marginTop: 12, padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px' }}>
        <p className="sub" style={{ margin: 0, fontSize: '11px' }}>
          <strong>Hedef Formül:</strong> Vücut ağırlığı × 33ml (Örn: 75kg × 33 = 2475ml)
        </p>
      </div>
    </div>
  )
}
