import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FOODS, macrosForGrams } from '../data/foods'
import { PROGRAMS, PERSONAL_DEFAULTS } from '../data/programs'
import { SUPPLEMENTS } from '../data/supplements'
import { useAuth } from '../context/AuthContext'
import {
  addFood,
  deleteFood,
  listFood,
  listSupplements,
  listWeight,
  listWorkouts,
  saveWorkout,
  toggleSupplement,
  upsertWeight,
} from '../lib/api'
import { todayISO } from '../lib/dates'
import { suggestFoods, sumLogs } from '../lib/suggestions'
import DayNav from '../components/DayNav'
import MacroBars from '../components/MacroBars'

export default function Dashboard() {
  const { profile, session } = useAuth()
  const p = { ...PERSONAL_DEFAULTS, ...profile }
  const [date, setDate] = useState(todayISO())
  const [logs, setLogs] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [taken, setTaken] = useState([])
  const [weights, setWeights] = useState([])
  const [q, setQ] = useState('')
  const [grams, setGrams] = useState(100)
  const [kg, setKg] = useState(profile?.weight_kg || 90)
  const [active, setActive] = useState(null)
  const [draft, setDraft] = useState([])
  const [busy, setBusy] = useState(false)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)

  async function refresh() {
    const [food, wo, supps, wt] = await Promise.all([
      listFood(session.id, date),
      listWorkouts(session.id, date),
      listSupplements(session.id, date),
      listWeight(session.id),
    ])
    setLogs(food)
    setWorkouts(wo)
    setTaken(supps.map((r) => r.supplement_id))
    setWeights(wt)
    const todayW = wt.find((row) => row.logged_on === date)
    if (todayW) setKg(todayW.weight_kg)

    // Load gamification data
    const savedXp = localStorage.getItem('gfit_xp')
    const savedStreak = localStorage.getItem('gfit_streak')
    setXp(savedXp ? parseInt(savedXp) : 0)
    setStreak(savedStreak ? parseInt(savedStreak) : 0)
  }

  useEffect(() => {
    refresh().catch(() => {})
  }, [date, session.id])

  const totals = sumLogs(logs)
  const { remaining, reason, foods } = suggestFoods(totals, p)
  const results = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    if (!s) return []
    return FOODS.filter((f) => f.name.toLocaleLowerCase('tr').includes(s)).slice(0, 6)
  }, [q])
  const latestWeight = weights.length ? weights[weights.length - 1] : null

  // Calculate rank based on XP
  const getRank = (xp) => {
    if (xp >= 1000) return { name: 'GOLD', color: '#FFD700', next: 1000 }
    if (xp >= 500) return { name: 'SILVER', color: '#C0C0C0', next: 500 }
    return { name: 'BRONZE', color: '#CD7F32', next: 0 }
  }

  const rank = getRank(xp)
  const xpProgress = rank.next > 0 ? (xp % rank.next) / rank.next * 100 : 100

  async function saveFood(food) {
    const macros = macrosForGrams(food, Number(grams) || 100)
    await addFood(session.id, {
      food_name: food.name,
      amount_g: Number(grams) || 100,
      logged_on: date,
      ...macros,
    })
    setQ('')
    setGrams(100)
    await refresh()
  }

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

  async function completeWorkout() {
    setBusy(true)
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
      // Add XP for workout
      const newXp = xp + 100
      setXp(newXp)
      localStorage.setItem('gfit_xp', newXp.toString())
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <p className="sub">Merhaba {p.display_name}</p>
            <span className="chip" style={{ background: rank.color, color: '#111', border: 'none' }}>
              {rank.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1>Bugünün özeti</h1>
            <span style={{ fontSize: '20px' }}>🔥 {streak}</span>
          </div>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {/* XP Progress Bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="sub">XP Seviyesi</span>
          <span style={{ fontWeight: 600, color: '#F59E0B' }}>{xp} XP</span>
        </div>
        <div style={{ background: '#0B101B', borderRadius: '12px', padding: '8px' }}>
          <div
            style={{
              height: '24px',
              background: '#F59E0B',
              borderRadius: '8px',
              width: `${xpProgress}%`,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
        <p className="sub" style={{ marginTop: 8, fontSize: '12px' }}>
          Sonraki seviye: {rank.next > 0 ? rank.next - (xp % rank.next) : 'Maksimum'} XP
        </p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <Stat label="Kalan kcal" value={Math.round(remaining.calories)} />
        <Stat label="Kalan protein" value={`${Math.round(remaining.protein)}g`} />
        <Stat label="Antrenman" value={workouts.length ? workouts[0].name : 'Yok'} />
        <Stat label="Supplement" value={`${taken.length}/${SUPPLEMENTS.length}`} />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Kalori & makro</h3>
            <Link className="chip" to="/yemek">Tümü</Link>
          </div>
          <div style={{ margin: '14px 0' }}>
            <MacroBars totals={totals} profile={p} />
          </div>
          <div className="row">
            <input
              className="input"
              style={{ flex: 1, minWidth: 140 }}
              placeholder="Yemek ara: tavuk, pilav…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              className="input"
              style={{ width: 90 }}
              type="number"
              min="1"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              aria-label="Gram"
            />
          </div>
          {results.map((f) => (
            <button key={f.id} className="food-item" style={{ width: '100%', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => saveFood(f)}>
              <div>
                <strong>{f.name}</strong>
                <div className="sub">{f.kcal} kcal / 100g · {grams}g ekle</div>
              </div>
              <span className="chip">+</span>
            </button>
          ))}
          {logs.map((row) => (
            <div className="food-item" key={row.id}>
              <div>
                <strong>{row.food_name}</strong>
                <div className="sub">{row.amount_g}g · {Math.round(row.calories)} kcal</div>
              </div>
              <button className="btn ghost" onClick={async () => { await deleteFood(session.id, row.id); await refresh() }}>Sil</button>
            </div>
          ))}
          {!q && logs.length === 0 && <p className="sub">Bugün henüz yemek yok. Yukarıdan ara.</p>}
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>Öneri</h3>
          <p>{reason}</p>
          {foods.map((f) => (
            <button key={f.id} className="food-item" style={{ width: '100%', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => saveFood(f)}>
              <div>
                <strong>{f.name}</strong>
                <div className="sub">{f.kcal} kcal · P {f.p} C {f.c} F {f.f}</div>
              </div>
              <span className="chip">{f.cat}</span>
            </button>
          ))}
        </section>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Antrenman</h3>
            <Link className="chip" to="/antrenman">Şablonlar</Link>
          </div>
          {!active && (
            <div className="row" style={{ marginTop: 12 }}>
              {PROGRAMS.filter((pr) => pr.split === 'Upper/Lower').map((pr) => (
                <button key={pr.id} className="btn ghost" onClick={() => start(pr)}>{pr.name}</button>
              ))}
            </div>
          )}
          {active && (
            <div style={{ marginTop: 12 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{active.name}</strong>
                <button className="btn ghost" onClick={() => setActive(null)}>İptal</button>
              </div>
              {draft.map((row, i) => (
                <div className="set-row" key={`${row.exercise_name}-${i}`}>
                  <div style={{ flex: 1 }}>
                    <strong>{row.exercise_name}</strong>
                    <div className="sub">Set {(row.set_index % 10) + 1}</div>
                  </div>
                  <input className="input" style={{ width: 72 }} placeholder="kg" value={row.weight_kg} onChange={(e) => setDraft((rows) => rows.map((r, idx) => (idx === i ? { ...r, weight_kg: e.target.value } : r)))} />
                  <input className="input" style={{ width: 72 }} placeholder="rep" value={row.reps} onChange={(e) => setDraft((rows) => rows.map((r, idx) => (idx === i ? { ...r, reps: e.target.value } : r)))} />
                </div>
              ))}
              <button className="btn" style={{ marginTop: 12 }} disabled={busy} onClick={completeWorkout}>
                {busy ? 'Kaydediliyor…' : 'Antrenmanı kaydet'}
              </button>
            </div>
          )}
          {workouts.map((w) => (
            <div className="food-item" key={w.id}>
              <div>
                <strong>{w.name}</strong>
                <div className="sub">{(w.sets || []).length} set kaydı</div>
              </div>
              <span className="chip">tamam</span>
            </div>
          ))}
        </section>

        <div className="grid" style={{ gap: 16 }}>
          <section className="card">
            <h3 style={{ marginTop: 0 }}>Supplement</h3>
            {SUPPLEMENTS.map((s) => {
              const on = taken.includes(s.id)
              return (
                <button
                  key={s.id}
                  className={`check-item ${on ? 'done' : ''}`}
                  onClick={async () => { await toggleSupplement(session.id, s.id, date); await refresh() }}
                  style={{ width: '100%', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  <div>
                    <strong>{s.name}</strong>
                    <div className="sub">{s.hint}</div>
                  </div>
                  <span className={`check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                </button>
              )
            })}
          </section>

          <section className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Kilo</h3>
              <Link className="chip" to="/kilo">Grafik</Link>
            </div>
            <p className="sub">{latestWeight ? `Son: ${latestWeight.weight_kg} kg (${latestWeight.logged_on})` : 'Henüz tartı yok'}</p>
            <form
              className="row"
              onSubmit={async (e) => {
                e.preventDefault()
                await upsertWeight(session.id, Number(kg), date)
                await refresh()
              }}
            >
              <input className="input" style={{ flex: 1 }} type="number" step="0.1" value={kg} onChange={(e) => setKg(e.target.value)} />
              <button className="btn">Kaydet</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className="stat-num">{value}</div>
    </div>
  )
}
