import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listRecentFood, listWeight } from '../lib/api'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

  // Kilo verilerini hatalı uç değerlerden (örneğin 300kg üstü yanlış girişlerden) arındır
  const cleanWeights = useMemo(() => {
    return (weights || [])
      .filter((w) => Number(w.weight_kg) > 30 && Number(w.weight_kg) < 250)
      .sort((a, b) => (a.logged_on || '').localeCompare(b.logged_on || ''))
  }, [weights])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div className="page-head">
        <div>
          <p className="sub">Son 3 Hafta Performans Analizi</p>
          <h1>İlerleme</h1>
        </div>
      </div>

      <div className="grid" style={{ gap: '20px' }}>
        {/* Günlük Kalori Grafiği (Canlı Degrade Amber / Altın) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Günlük Kalori</h3>
            <span className="chip" style={{ color: '#F59E0B', borderColor: '#F59E0B' }}>
              Hedef: {profile?.calorie_target || 2600} kcal
            </span>
          </div>
          {byDay.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={byDay}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#8b9788" fontSize={11} tickLine={false} />
                <YAxis stroke="#8b9788" fontSize={11} tickLine={false} unit=" kcal" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141C2E', borderColor: '#1E293B', borderRadius: 8, color: '#fff' }}
                  formatter={(val) => [`${val} kcal`, 'Alınan Kalori']}
                />
                <Area type="monotone" dataKey="calories" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="sub">Henüz kalori kaydı bulunmuyor.</p>
          )}
        </div>

        {/* Günlük Protein Grafiği (Elektrik Zümrüt Yeşili) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Günlük Protein Alımı</h3>
            <span className="chip" style={{ color: '#10B981', borderColor: '#10B981' }}>
              Hedef: {profile?.protein_target || 170}g
            </span>
          </div>
          {byDay.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={byDay}>
                <defs>
                  <linearGradient id="colorProt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#8b9788" fontSize={11} tickLine={false} />
                <YAxis stroke="#8b9788" fontSize={11} tickLine={false} unit="g" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141C2E', borderColor: '#1E293B', borderRadius: 8, color: '#fff' }}
                  formatter={(val) => [`${val} g`, 'Protein']}
                />
                <Area type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProt)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="sub">Protein analizi için yemek ekleyin.</p>
          )}
        </div>

        {/* Kilo Eğilimi (Canlı Cyan / Elektrik Mavisi) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Kilo Değişim Trendi</h3>
            <span className="chip" style={{ color: '#06B6D4', borderColor: '#06B6D4' }}>
              Son Tartı: {cleanWeights[cleanWeights.length - 1]?.weight_kg || profile?.weight_kg || '--'} kg
            </span>
          </div>
          {cleanWeights.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={cleanWeights}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="logged_on" stroke="#8b9788" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#8b9788" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141C2E', borderColor: '#1E293B', borderRadius: 8, color: '#fff' }}
                  formatter={(val) => [`${val} kg`, 'Tartı']}
                />
                <Area type="monotone" dataKey="weight_kg" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="sub">Kilo grafiği için Kilo sayfasından en az iki tartı kaydı ekleyin.</p>
          )}
        </div>
      </div>
    </div>
  )
}