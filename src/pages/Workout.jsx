import { useEffect, useState } from 'react'
import { PROGRAMS } from '../data/programs'
import { useAuth } from '../context/AuthContext'
import { listWorkouts, saveWorkout } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'

export default function Workout() {
  const { session } = useAuth()
  const [date, setDate] = useState(todayISO())
  const [logs, setLogs] = useState([])
  const [active, setActive] = useState(null)
  const [draft, setDraft] = useState([])
  const [filter, setFilter] = useState('Upper/Lower')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setLogs(await listWorkouts(session.id, date))
    } catch (err) {
      console.error('Antrenmanlar yüklenirken hata:', err)
      setError('Antrenmanlar yüklenirken hata oluştu')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [date, session.id])

  function start(program) {
    setActive(program)
    setDraft(
      program.exercises.flatMap((ex, i) =>
        Array.from({ length: ex.sets }, (_, s) => ({
          exercise_name: ex.name,
          set_index: i * 10 + s,
          reps: '',
          weight_kg: '',
          done: false,
        })),
      ),
    )
  }

  function patch(index, field, value) {
    setDraft((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  }

  async function complete() {
    setLoading(true)
    setError(null)
    try {
      await saveWorkout(session.id, {
        template_id: active.id,
        name: active.name,
        logged_on: date,
        notes: '',
        sets: draft.map((s) => ({
          ...s,
          reps: s.reps === '' ? null : Number(s.reps),
          weight_kg: s.weight_kg === '' ? null : Number(s.weight_kg),
        })),
      })
      setActive(null)
      await refresh()
    } catch (err) {
      console.error('Antrenman kaydedilirken hata:', err)
      setError('Antrenman kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const templates = PROGRAMS.filter((p) => p.split === filter)

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="sub">Hazır şablonlar + kişisel Upper/Lower</p>
          <h1>Antrenman</h1>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div className="row" style={{ marginBottom: 16 }}>
        {['Upper/Lower', 'PPL'].map((s) => (
          <button key={s} className={`btn ${filter === s ? '' : 'ghost'}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {!active && (
        <div className="grid grid-2">
          {templates.map((p) => (
            <button key={p.id} className="card template" onClick={() => start(p)}>
              <div className="chip">{p.split}</div>
              <h3 style={{ marginBottom: 6 }}>{p.name}</h3>
              <p className="sub">{p.exercises.length} hareket</p>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="card">
          <div className="page-head">
            <h2 style={{ margin: 0 }}>{active.name}</h2>
            <button className="btn ghost" onClick={() => setActive(null)} disabled={loading}>İptal</button>
          </div>
          {draft.map((row, i) => (
            <div className="set-row" key={`${row.exercise_name}-${i}`}>
              <button
                type="button"
                className={`check ${row.done ? 'on' : ''}`}
                onClick={() => patch(i, 'done', !row.done)}
                aria-label="Set tamam"
              >
                {row.done ? '✓' : ''}
              </button>
              <div style={{ flex: 1 }}>
                <strong>{row.exercise_name}</strong>
                <div className="sub">Set {(row.set_index % 10) + 1}</div>
              </div>
              <input className="input" style={{ width: 90 }} placeholder="kg" value={row.weight_kg} onChange={(e) => patch(i, 'weight_kg', e.target.value)} />
              <input className="input" style={{ width: 90 }} placeholder="rep" value={row.reps} onChange={(e) => patch(i, 'reps', e.target.value)} />
            </div>
          ))}
          <button className="btn" style={{ marginTop: 16 }} onClick={complete} disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Antrenmanı kaydet'}
          </button>
        </div>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Bugünkü kayıtlar</h3>
        {logs.map((w) => (
          <div key={w.id} className="food-item">
            <div>
              <strong>{w.name}</strong>
              <div className="sub">{(w.sets || []).length} set</div>
            </div>
            <span className="chip">{w.template_id}</span>
          </div>
        ))}
        {logs.length === 0 && <p className="sub">Bu gün antrenman yok.</p>}
      </div>
    </div>
  )
}
