import { useEffect, useMemo, useState } from 'react'
import { FOODS, macrosForGrams } from '../data/foods'
import { useAuth } from '../context/AuthContext'
import { addFood, deleteFood, listFood } from '../lib/api'
import { todayISO, yesterdayISO } from '../lib/dates'
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
  const [editingLog, setEditingLog] = useState(null)
  const [editGrams, setEditGrams] = useState(0)
  const [saveMealModalOpen, setSaveMealModalOpen] = useState(false)
  const [mealTemplateName, setMealTemplateName] = useState('')
  const [savedMeals, setSavedMeals] = useState([])
  const [showTemplates, setShowTemplates] = useState(false)

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

  async function handleUpdateGrams() {
    if (!editingLog) return
    setLoading(true)
    setError(null)
    try {
      const updated = macrosForGrams(
        { kcal: editingLog.calories / (editingLog.amount_g / 100), p: editingLog.protein / (editingLog.amount_g / 100), c: editingLog.carbs / (editingLog.amount_g / 100), f: editingLog.fat / (editingLog.amount_g / 100) },
        Number(editGrams)
      )
      await deleteFood(session.id, editingLog.id)
      await addFood(session.id, {
        food_name: editingLog.food_name,
        amount_g: Number(editGrams),
        logged_on: date,
        ...updated,
      })
      setEditingLog(null)
      setEditGrams(0)
      await refresh()
    } catch (err) {
      console.error('Yemek güncellenirken hata:', err)
      setError('Yemek güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveAsTemplate() {
    if (!mealTemplateName.trim()) return
    setLoading(true)
    setError(null)
    try {
      const totals = sumLogs(logs)
      const template = {
        id: Date.now().toString(),
        meal_name: mealTemplateName,
        meal_type: 'custom',
        items: logs.map(log => ({
          food_name: log.food_name,
          amount_g: log.amount_g,
          calories: log.calories,
          protein: log.protein,
          carbs: log.carbs,
          fat: log.fat
        })),
        total_calories: totals.calories,
        total_protein: totals.protein,
        total_carbs: totals.carbs,
        total_fat: totals.fat
      }
      const existing = JSON.parse(localStorage.getItem('gfit_saved_meals') || '[]')
      if (existing.length >= 2 && !profile?.is_pro) {
        setError('Ücretsiz kullanıcılar maksimum 2 şablon kaydedebilir.')
      } else {
        existing.push(template)
        localStorage.setItem('gfit_saved_meals', JSON.stringify(existing))
        setSavedMeals(existing)
        setSaveMealModalOpen(false)
        setMealTemplateName('')
      }
    } catch (err) {
      console.error('Şablon kaydedilirken hata:', err)
      setError('Şablon kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyYesterday() {
    setLoading(true)
    setError(null)
    try {
      const yesterdayLogs = await listFood(session.id, yesterdayISO())
      for (const log of yesterdayLogs) {
        await addFood(session.id, {
          food_name: log.food_name,
          amount_g: log.amount_g,
          logged_on: date,
          calories: log.calories,
          protein: log.protein,
          carbs: log.carbs,
          fat: log.fat
        })
      }
      await refresh()
    } catch (err) {
      console.error('Dünkü öğün kopyalanırken hata:', err)
      setError('Dünkü öğün kopyalanırken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function loadTemplate(template) {
    setLoading(true)
    setError(null)
    try {
      for (const item of template.items) {
        await addFood(session.id, {
          food_name: item.food_name,
          amount_g: item.amount_g,
          logged_on: date,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        })
      }
      await refresh()
      setShowTemplates(false)
    } catch (err) {
      console.error('Şablon yüklenirken hata:', err)
      setError('Şablon yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSavedMeals(JSON.parse(localStorage.getItem('gfit_saved_meals') || '[]'))
  }, [])

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
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Şablon Butonları */}
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn ghost" onClick={() => setShowTemplates(!showTemplates)} disabled={loading}>
          {showTemplates ? 'Şablonları Gizle' : 'Şablonları Göster'}
        </button>
        <button className="btn ghost" onClick={handleCopyYesterday} disabled={loading}>
          Dünü Kopyala
        </button>
        {logs.length > 0 && (
          <button className="btn ghost" onClick={() => setSaveMealModalOpen(true)} disabled={loading}>
            Şablon Olarak Kaydet
          </button>
        )}
      </div>

      {/* Şablonlar Listesi */}
      {showTemplates && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 12px' }}>Kayıtlı Şablonlar</h3>
          {savedMeals.length === 0 ? (
            <p className="sub">Henüz şablon yok.</p>
          ) : (
            savedMeals.map((template) => (
              <div key={template.id} className="food-item" style={{ cursor: 'pointer' }} onClick={() => loadTemplate(template)}>
                <div>
                  <strong>{template.meal_name}</strong>
                  <div className="sub">
                    {Math.round(template.total_calories)} kcal · P{Math.round(template.total_protein)} C{Math.round(template.total_carbs)} F{Math.round(template.total_fat)}
                  </div>
                </div>
                <button className="btn ghost" style={{ fontSize: '12px' }}>Yükle</button>
              </div>
            ))
          )}
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
              <div onClick={() => {
                setEditingLog(row)
                setEditGrams(row.amount_g)
              }} style={{ cursor: 'pointer', flex: 1 }}>
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

      {/* Edit Modal */}
      {editingLog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 400 }}>
            <h3 style={{ marginTop: 0 }}>{editingLog.food_name}</h3>
            <div className="field">
              <label>Gram</label>
              <input className="input" type="number" min="1" value={editGrams} onChange={(e) => setEditGrams(e.target.value)} />
            </div>
            <div className="row">
              <button className="btn ghost" onClick={() => setEditingLog(null)} disabled={loading}>
                İptal
              </button>
              <button className="btn danger" onClick={() => {
                handleDelete(editingLog.id)
                setEditingLog(null)
              }} disabled={loading}>
                Sil
              </button>
              <button className="btn" onClick={handleUpdateGrams} disabled={loading}>
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {saveMealModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 400 }}>
            <h3 style={{ marginTop: 0 }}>Öğünü Şablon Olarak Kaydet</h3>
            <div className="field">
              <label>Şablon Adı</label>
              <input className="input" value={mealTemplateName} onChange={(e) => setMealTemplateName(e.target.value)} placeholder="Örn: Sabah kahvaltısı" />
            </div>
            <div className="row">
              <button className="btn ghost" onClick={() => setSaveMealModalOpen(false)} disabled={loading}>
                İptal
              </button>
              <button className="btn" onClick={handleSaveAsTemplate} disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
