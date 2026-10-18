import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listRecentFood, listWeight } from '../lib/api'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Progress() {
  const { session, profile } = useAuth()
  const [foods, setFoods] = useState([])
  const [weights, setWeights] = useState([])

  useEffect(() => {
    listRecentFood(session.id, 21).then(setFoods).catch(() => setFoods([]))
    listWeight(session.id).then(setWeights).catch(() => setWeights([]))
  }, [session.id])

  const byDay = useMemo(() => {
    const map = {}
    for (const row of foods) {
      if (!map[row.logged_on]) map[row.logged_on] = { day: row.logged_on, calories: 0, protein: 0 }
      map[row.logged_on].calories += Number(row.calories)
      map[row.logged_on].protein += Number(row.protein)
    }
    return Object.values(map).sort((a, b) => a.day.localeCompare(b.day))
  }, [foods])

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="sub">Son 3 hafta</p>
          <h1>İlerleme</h1>
        </div>
      </div>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Günlük kalori</h3>
          <p className="sub">Hedef {profile?.calorie_target || 2600} kcal</p>
          {byDay.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: '#8b9788', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8b9788', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="calories" fill="#c8f542" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="sub">Henüz yemek kaydı yok.</p>}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Günlük protein</h3>
          {byDay.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={byDay}>
                <XAxis dataKey="day" hide />
                <YAxis tick={{ fill: '#8b9788', fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="protein" stroke="#7ee0b0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="sub">Protein grafiği için kayıt ekle.</p>}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Kilo eğilimi</h3>
          {weights.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weights}>
                <XAxis dataKey="logged_on" hide />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#8b9788', fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight_kg" stroke="#7ec8ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="sub">Kilo sayfasından en az iki tartı ekle.</p>}
        </div>
      </div>
    </div>
  )
}
