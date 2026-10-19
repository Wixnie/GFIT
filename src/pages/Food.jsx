import { useEffect, useMemo, useState } from 'react'
import { FOODS, macrosForGrams } from '../data/foods'
import { useAuth } from '../context/AuthContext'
import { addFood, deleteFood, listFood } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'
import MacroBars from '../components/MacroBars'
import { PERSONAL_DEFAULTS } from '../data/programs'
import { sumLogs } from '../lib/suggestions'

export default function Food() {
  const { session, profile } = useAuth()
  const p = { ...PERSONAL_DEFAULTS, ...profile }
  const [date, setDate] = useState(todayISO())
  const [logs, setLogs] = useState([])
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setLogs(await listFood(session.id, date))
    } catch (err) {
      console.error('Yemekler yüklenirken hata:', err)
      setError('Yemekler yüklenirken hata oluştu')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [date, session.id])

  const results = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    if (!s) return FOODS.slice(0, 8)
    return FOODS.filter((f) => f.name.toLocaleLowerCase('tr').includes(s)).slice(0, 12)
  }, [q])

  const totals = sumLogs(logs)
  const preview = selected ? macrosForGrams(selected, Number(grams) || 0) : null

  async function save() {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      await addFood(session.id, {
        food_name: selected.name,
        amount_g: Number(grams),
        logged_on: date,
        ...preview,
      })
      setSelected(null)
      setQ('')
      setGrams(100)
      await refresh()
    } catch (err) {
      console.error('Yemek kaydedilirken hata:', err)
      setError('Yemek kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    setLoading(true)
    setError(null)
    try {
      await deleteFood(session.id, id)
      await refresh()
    } catch (err) {
      console.error('Yemek silinirken hata:', err)
      setError('Yemek silinirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">Türk yemek veritabanı</p>
          <h1>Yemek</h1>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <input
            className="input"
            placeholder="Tavuk, pilav, menemen…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="search-list">
            {results.map((f) => (
              <button key={f.id} onClick={() => setSelected(f)}>
                <strong>{f.name}</strong>
                <div className="sub">{f.kcal} kcal · P{f.p} C{f.c} F{f.f} / 100g</div>
              </button>
            ))}
          </div>
          {selected && (
            <div style={{ marginTop: 12 }}>
              <p><strong>{selected.name}</strong> eklenecek</p>
              <div className="field">
                <label>Gram</label>
                <input className="input" type="number" min="1" value={grams} onChange={(e) => setGrams(e.target.value)} />
              </div>
              {preview && (
                <p className="sub">
                  {preview.calories} kcal · P {preview.protein} · C {preview.carbs} · F {preview.fat}
                </p>
              )}
              <button className="btn" onClick={save} disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <MacroBars totals={totals} profile={p} />
          {logs.map((row) => (
            <div className="food-item" key={row.id}>
              <div>
                <strong>{row.food_name}</strong>
                <div className="sub">
                  {row.amount_g}g · {Math.round(row.calories)} kcal · P{row.protein} C{row.carbs} F{row.fat}
                </div>
              </div>
              <button className="btn ghost" onClick={() => handleDelete(row.id)} disabled={loading}>
                {loading ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          ))}
          {logs.length === 0 && <p className="sub">Bu gün henüz yemek yok.</p>}
        </div>
      </div>
    </div>
  )
}
