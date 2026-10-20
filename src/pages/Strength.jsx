import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { listWorkouts } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'
import { Dumbbell, TrendingUp, Award } from 'lucide-react'

export default function Strength() {
  const { session } = useAuth()
  const [date, setDate] = useState(todayISO())
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const data = await listWorkouts(session.id, date)
      setWorkouts(data)
    } catch (err) {
      console.error('Antrenmanlar yüklenirken hata:', err)
      setWorkouts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [date, session.id])

  // Calculate strength progress
  const strengthData = workouts.reduce((acc, workout) => {
    workout.sets?.forEach(set => {
      const key = set.exercise_name
      if (!acc[key]) {
        acc[key] = { maxWeight: 0, totalVolume: 0, setCount: 0 }
      }
      if (set.weight_kg && set.weight_kg > acc[key].maxWeight) {
        acc[key].maxWeight = set.weight_kg
      }
      if (set.weight_kg && set.reps) {
        acc[key].totalVolume += set.weight_kg * set.reps
        acc[key].setCount += 1
      }
    })
    return acc
  }, {})

  const sortedExercises = Object.entries(strengthData)
    .sort(([, a], [, b]) => b.maxWeight - a.maxWeight)

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">Performans takibi</p>
          <h1>Güç Artışı</h1>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <p className="sub">Yükleniyor...</p>
        </div>
      ) : workouts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <Dumbbell size={48} style={{ color: '#64748B', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>Henüz antrenman kaydı yok</h3>
          <p className="sub">İlk antrenmanını kaydetmeye başla.</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-3" style={{ marginBottom: 16 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#FF8A00', marginBottom: 4 }}>
                {workouts.length}
              </div>
              <p className="sub">Antrenman</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#22C55E', marginBottom: 4 }}>
                {sortedExercises.length}
              </div>
              <p className="sub">Egzersiz</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#818CF8', marginBottom: 4 }}>
                {Math.round(Object.values(strengthData).reduce((sum, ex) => sum + ex.totalVolume, 0) / 1000)}k
              </div>
              <p className="sub">Toplam Hacim (kg)</p>
            </div>
          </div>

          {/* Exercise Strength Details */}
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Egzersiz Bazlı Güç</h3>
            {sortedExercises.map(([exercise, data]) => (
              <div
                key={exercise}
                style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>{exercise}</strong>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span className="sub" style={{ color: '#22C55E' }}>
                      <TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Max: {data.maxWeight} kg
                    </span>
                    <span className="sub">
                      Set: {data.setCount}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#FF8A00' }}>
                    {Math.round(data.totalVolume)} kg
                  </div>
                  <p className="sub" style={{ fontSize: '11px' }}>Toplam Hacim</p>
                </div>
              </div>
            ))}
          </div>

          {/* PR Records */}
          <div className="card" style={{ marginTop: 16, background: 'rgba(255, 138, 0, 0.1)', borderColor: '#FF8A00' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 12 }}>
              <Award size={24} style={{ color: '#FF8A00' }} />
              <h3 style={{ margin: 0, color: '#FF8A00' }}>Kişisel Rekorlar (PR)</h3>
            </div>
            <p className="sub">
              PR takibi yakında aktif olacak. Antrenmanlarını düzenli kaydet, otomatik PR bildirimleri al.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
