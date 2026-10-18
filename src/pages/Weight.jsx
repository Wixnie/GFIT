import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listWeight, upsertWeight } from '../lib/api'
import { todayISO } from '../lib/dates'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Weight() {
  const { session, profile } = useAuth()
  const [rows, setRows] = useState([])
  const [kg, setKg] = useState(profile?.weight_kg || 90)
  const [date, setDate] = useState(todayISO())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setRows(await listWeight(session.id))
    } catch (err) {
      console.error('Kilo kayıtları yüklenirken hata:', err)
      setError('Kilo kayıtları yüklenirken hata oluştu')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [session.id])

  async function save(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await upsertWeight(session.id, Number(kg), date)
      await refresh()
    } catch (err) {
      console.error('Kilo kaydedilirken hata:', err)
      setError('Kilo kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="sub">Günlük tartı</p>
          <h1>Kilo</h1>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div className="grid grid-2">
        <form className="card" onSubmit={save}>
          <div className="field">
            <label>Tarih</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loading} />
          </div>
          <div className="field">
            <label>Kilo (kg)</label>
            <input className="input" type="number" step="0.1" value={kg} onChange={(e) => setKg(e.target.value)} disabled={loading} />
          </div>
          <button className="btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
        <div className="card" style={{ minHeight: 280 }}>
          {rows.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={rows}>
                <XAxis dataKey="logged_on" hide />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} width={40} />
                <Tooltip />
                <Line type="monotone" dataKey="weight_kg" stroke="#c8f542" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="sub">Grafik için en az 2 kayıt gerekir.</p>
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        {[...rows].reverse().map((r) => (
          <div className="food-item" key={r.id}>
            <strong>{r.logged_on}</strong>
            <span>{r.weight_kg} kg</span>
          </div>
        ))}
      </div>
    </div>
  )
}
