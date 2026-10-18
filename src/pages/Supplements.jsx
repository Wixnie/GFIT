import { useEffect, useState } from 'react'
import { SUPPLEMENTS } from '../data/supplements'
import { useAuth } from '../context/AuthContext'
import { listSupplements, toggleSupplement } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'

export default function Supplements() {
  const { session } = useAuth()
  const [date, setDate] = useState(todayISO())
  const [taken, setTaken] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const rows = await listSupplements(session.id, date)
      setTaken(rows.map((r) => r.supplement_id))
    } catch (err) {
      console.error('Supplementler yüklenirken hata:', err)
      setError('Supplementler yüklenirken hata oluştu')
      setTaken([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [date, session.id])

  async function onToggle(id) {
    setLoading(true)
    setError(null)
    try {
      await toggleSupplement(session.id, id, date)
      await refresh()
    } catch (err) {
      console.error('Supplement değiştirilirken hata:', err)
      setError('Supplement değiştirilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const done = taken.length
  const total = SUPPLEMENTS.length

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="sub">{done}/{total} tamamlandı</p>
          <h1>Supplement</h1>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div className="card">
        {SUPPLEMENTS.map((s) => {
          const on = taken.includes(s.id)
          return (
            <button
              key={s.id}
              className={`check-item ${on ? 'done' : ''}`}
              onClick={() => onToggle(s.id)}
              disabled={loading}
              style={{ width: '100%', background: 'transparent', border: 0, cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left' }}
            >
              <div>
                <strong>{s.name}</strong>
                <div className="sub">{s.hint}</div>
              </div>
              <span className={`check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
