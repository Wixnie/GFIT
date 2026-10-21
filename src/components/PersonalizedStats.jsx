import { calculateBMR, calculateTDEE } from '../lib/tdee'
import { Activity, Flame, Zap } from 'lucide-react'

export default function PersonalizedStats({ profile }) {
  if (!profile) return null

  const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender)
  const tdee = calculateTDEE(bmr, profile.activity_level || 'moderate')

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginTop: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={20} color="#FF8A00" />
        Kişisel Metabolizma Verileri
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ 
          padding: '16px', 
          background: '#0B101B', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <Flame size={24} color="#EF4444" style={{ marginBottom: '8px' }} />
          <p className="sub" style={{ fontSize: '12px', marginBottom: '4px' }}>BMR (Bazal)</p>
          <strong style={{ fontSize: '20px', color: '#EF4444' }}>{Math.round(bmr)}</strong>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>kcal/gün</p>
        </div>
        
        <div style={{ 
          padding: '16px', 
          background: '#0B101B', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <Zap size={24} color="#F59E0B" style={{ marginBottom: '8px' }} />
          <p className="sub" style={{ fontSize: '12px', marginBottom: '4px' }}>TDEE (Toplam)</p>
          <strong style={{ fontSize: '20px', color: '#F59E0B' }}>{Math.round(tdee)}</strong>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>kcal/gün</p>
        </div>
        
        <div style={{ 
          padding: '16px', 
          background: '#0B101B', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <Activity size={24} color="#10B981" style={{ marginBottom: '8px' }} />
          <p className="sub" style={{ fontSize: '12px', marginBottom: '4px' }}>Hedef</p>
          <strong style={{ fontSize: '20px', color: '#10B981' }}>{profile.calorie_target}</strong>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>kcal/gün</p>
        </div>
      </div>
      
      <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255, 138, 0, 0.1)', borderRadius: '8px' }}>
        <p className="sub" style={{ margin: 0, fontSize: '12px', lineHeight: 1.5 }}>
          <strong>BMR:</strong> Dinlenirken vücudun yaktığı minimum kalori.<br />
          <strong>TDEE:</strong> Aktivite seviyeni içeren günlük toplam kalori ihtiyacı.<br />
          <strong>Hedef:</strong> Kil verme/koruma/kas yapma amacına göre ayarlanmış kalori hedefi.
        </p>
      </div>
    </div>
  )
}
