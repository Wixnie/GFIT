import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FOODS, macrosForGrams } from '../data/foods'
import { useAuth } from '../context/AuthContext'
import { addFood, deleteFood, listFood } from '../lib/api'
import { todayISO, yesterdayISO } from '../lib/dates'
import DayNav from '../components/DayNav'
import MacroBars from '../components/MacroBars'
import { PERSONAL_DEFAULTS } from '../data/programs'
import { sumLogs } from '../lib/suggestions'
import { ScanLine } from 'lucide-react'

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
  const [showRestaurants, setShowRestaurants] = useState(false)
  const [showCheatDay, setShowCheatDay] = useState(false)
  const [showPlateauBreaker, setShowPlateauBreaker] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [showLateNightSnack, setShowLateNightSnack] = useState(false)
  const [loggedModalOpen, setLoggedModalOpen] = useState(false)
  const [loggedFoodName, setLoggedFoodName] = useState('')
  const [loggedCalories, setLoggedCalories] = useState(0)

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
    const saved = localStorage.getItem('gfitt_saved_meals')
    if (saved) setSavedMeals(JSON.parse(saved))
    
    // Check if it's late night (after 22:00)
    const hour = new Date().getHours()
    if (hour >= 22) {
      setShowLateNightSnack(true)
    }
  }, [date, session.id])

  const results = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    if (!s) return FOODS.slice(0, 12)
    return FOODS.filter((f) => f.name.toLocaleLowerCase('tr').includes(s)).slice(0, 20)
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
      setLoggedFoodName(selected.name)
      setLoggedCalories(preview.calories)
      setLoggedModalOpen(true)
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

  async function saveFood(food) {
    const macros = macrosForGrams(food, Number(grams) || 100)
    
    // Blood sugar spike warning for high-carb foods
    if (macros.c > 50 && macros.cals > 300) {
      const userConfirmed = confirm('Dikkat: Bu öğün kan şekerini hızla zıplatababilir. Emilimi yavaşlatmak için yanına 2 kaşık yoğurt veya yeşillik ekle.')
      if (!userConfirmed) return
    }
    
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
      const existing = JSON.parse(localStorage.getItem('gfitt_saved_meals') || '[]')
      if (existing.length >= 2 && !profile?.is_pro) {
        setError('Ücretsiz kullanıcılar maksimum 2 şablon kaydedebilir.')
      } else {
        existing.push(template)
        localStorage.setItem('gfitt_saved_meals', JSON.stringify(existing))
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
    setSavedMeals(JSON.parse(localStorage.getItem('gfitt_saved_meals') || '[]'))
  }, [])

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">Türk yemek veritabanı</p>
          <h1>Yemek</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/etiket-okuyucu"
            className="btn ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
          >
            <ScanLine size={20} />
            <span style={{ fontSize: '14px' }}>Etiket Oku</span>
          </Link>
          <DayNav date={date} onChange={setDate} />
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Late Night Snack Popup */}
      {showLateNightSnack && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(139, 92, 246, 0.1)', borderColor: '#8B5CF6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#8B5CF6' }}>🌙 Gece Açlığı mı Vurdu?</h4>
              <p className="sub" style={{ margin: 0 }}>
                Uyku melatoninini bozmayacak 100 kcal altı 3 kurtarıcı atıştırmalık
              </p>
            </div>
            <button className="btn ghost" onClick={() => setShowLateNightSnack(false)} style={{ fontSize: '12px' }}>
              ✕
            </button>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gap: '8px' }}>
            {[
              { name: 'Süzme yoğurt (100g)', kcal: 97, p: 9, c: 4, f: 5 },
              { name: 'Sade ayran (200ml)', kcal: 70, p: 3.4, c: 5, f: 3.6 },
              { name: 'Lor peyniri (50g)', kcal: 45, p: 8, c: 1, f: 0.75 },
            ].map((snack) => (
              <button
                key={snack.name}
                className="btn ghost"
                style={{ fontSize: '12px', textAlign: 'left', padding: '8px 12px' }}
                onClick={() => {
                  saveFood({ name: snack.name, kcal: snack.kcal, p: snack.p, c: snack.c, f: snack.f })
                  setShowLateNightSnack(false)
                }}
              >
                {snack.name} ({snack.kcal} kcal)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRO Features */}
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn ghost" onClick={() => setShowRestaurants(!showRestaurants)} disabled={loading}>
          🍔 Restoran Menüleri
        </button>
        <button className="btn ghost" onClick={() => setShowCheatDay(!showCheatDay)} disabled={loading}>
          🎉 Kaçamak Telafisi
        </button>
        <button className="btn ghost" onClick={() => setShowPlateauBreaker(!showPlateauBreaker)} disabled={loading}>
          📈 Plato Kırıcı
        </button>
        <button className="btn ghost" onClick={() => setShowVoiceInput(!showVoiceInput)} disabled={loading}>
          🎤 Sesli Günlük
        </button>
      </div>

      {/* Restaurant Menus */}
      {showRestaurants && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Dışarıda Ne Yesem?</h3>
          {!profile?.is_pro && (
            <div style={{ marginBottom: 12, padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
              <p className="sub" style={{ margin: 0 }}>
                PRO özellik - 1 reklam izle, 24 saat aç
              </p>
            </div>
          )}
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { name: 'Köfteci Yusuf', items: ['Köfte (180g) - 450 kcal', 'Pilav - 250 kcal', 'Salata - 80 kcal'], fit: 'Köfte (180g) - 450 kcal', calories: 450 },
              { name: 'Tavuk Dünyası', items: ['Döner (200g) - 520 kcal', 'Tavuk Burger - 420 kcal', 'Salata - 90 kcal'], fit: 'Grill Tavuk (200g) - 280 kcal', calories: 280 },
              { name: 'Burger King', items: ['Whopper - 650 kcal', 'Cheeseburger - 550 kcal'], fit: 'Grill Chicken - 350 kcal', calories: 350 },
              { name: 'Starbucks', items: ['Latte - 190 kcal', 'Frappuccino - 450 kcal'], fit: 'Americano - 15 kcal', calories: 15 },
              { name: 'McDonalds', items: ['Big Mac - 550 kcal', 'McChicken - 400 kcal'], fit: 'Grill Chicken - 350 kcal', calories: 350 },
            ].map((restaurant) => (
              <div key={restaurant.name} className="card" style={{ padding: '12px' }}>
                <strong>{restaurant.name}</strong>
                <p className="sub" style={{ fontSize: '11px', marginBottom: 8 }}>
                  {restaurant.items.join(' · ')}
                </p>
                <button 
                  className="btn" 
                  style={{ fontSize: '12px', width: '100%' }}
                  onClick={() => {
                    if (!profile?.is_pro) {
                      alert('1 reklam izle, bu restoranı 24 saat aç!')
                    } else {
                      saveFood({ name: restaurant.fit, kcal: restaurant.calories, p: 25, c: 0, f: 10 })
                    }
                  }}
                >
                  Fit Alternatif Ekle ({restaurant.fit})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cheat Day Recovery */}
      {showCheatDay && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, color: '#EF4444' }}>🎉 Kaçamak Sonrası Telafi Motoru</h3>
          <p className="sub" style={{ marginBottom: 16 }}>
            Dün kaçamak yaptın mı? Ertesi 2 günün su hedefini artır, ödem atıcı besinlerle telafi et.
          </p>
          <button 
            className="btn" 
            style={{ width: '100%', background: '#EF4444' }}
            onClick={() => {
              localStorage.setItem('gfitt_cheat_mode', 'true')
              localStorage.setItem('gfitt_cheat_date', new Date().toISOString())
              alert('Telafi modu aktif! Sonraki 2 gun su hedefi +20% arttirildi.')
            }}
          >
            Kaçamak Modunu Başlat
          </button>
        </div>
      )}

      {/* Plateau Breaker */}
      {showPlateauBreaker && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, color: '#F59E0B' }}>📈 Plato Kırıcı (Refeed)</h3>
          <p className="sub" style={{ marginBottom: 16 }}>
            2 hafta kilo değişmedi mi? Yüksek karbahidrat günü metabolizmayı hızlandır.
          </p>
          <button 
            className="btn" 
            style={{ width: '100%' }}
            onClick={() => {
              alert('Refeed günü aktif! Bugun kalori hedefini +500 kcal artir.')
            }}
          >
            Refeed Günü Başlat
          </button>
        </div>
      )}

      {/* Voice Input */}
      {showVoiceInput && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>🎤 Sesli Günlük</h3>
          <p className="sub" style={{ marginBottom: 16 }}>
            Konuşarak yemek ekleyin: "Tavuk 100 gram"
          </p>
          <button 
            className="btn" 
            style={{ width: '100%' }}
            onClick={() => {
              if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                const recognition = new SpeechRecognition()
                recognition.lang = 'tr-TR'
                recognition.onresult = (event) => {
                  setVoiceText(event.results[0][0].transcript)
                  setIsListening(false)
                }
                recognition.onerror = () => setIsListening(false)
                recognition.onend = () => setIsListening(false)
                recognition.start()
                setIsListening(true)
              } else {
                alert('Tarayıcınız sesli girişi desteklemiyor.')
              }
            }}
            disabled={isListening}
          >
            {isListening ? 'Dinleniyor...' : 'Mikrofonu Aç'}
          </button>
          {voiceText && (
            <div style={{ marginTop: 12, padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
              <p className="sub" style={{ margin: 0 }}>Alınan: "{voiceText}"</p>
            </div>
          )}
        </div>
      )}
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
              <button key={f.id} onClick={() => setSelected(f)} className="food-card">
                <span className="food-emoji">{f.emoji || '🍽️'}</span>
                <div>
                  <strong>{f.name}</strong>
                  <div className="sub">{f.kcal} kcal · P{f.p} C{f.c} F{f.f} / 100g</div>
                </div>
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
        <>
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
        </>
      )}

      {/* Save Template Modal */}
      {saveMealModalOpen && (
        <>
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
        </>
      )}

      {/* Logged Modal Popup */}
      {loggedModalOpen && (
        <div className="logged-modal" onClick={() => setLoggedModalOpen(false)}>
          <div className="logged-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="logged-modal-icon">✅</div>
            <div className="logged-modal-title">Kaydedildi!</div>
            <div className="logged-modal-text">
              {loggedFoodName}<br />
              {Math.round(loggedCalories)} kcal loglandı
            </div>
            <button className="btn" onClick={() => setLoggedModalOpen(false)} style={{ width: '100%' }}>
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
