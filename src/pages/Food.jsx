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
import { ScanLine, Mic, Utensils, Sparkles, Check, Plus, Minus, AlertTriangle } from 'lucide-react'
import FoodScannerPanel from '../components/FoodScannerPanel'

export default function Food() {
  const { session, profile } = useAuth()
  const p = { ...PERSONAL_DEFAULTS, ...profile }
  const [date, setDate] = useState(todayISO())
  const [logs, setLogs] = useState([])
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState(100)
  const [selectedMealCategory, setSelectedMealCategory] = useState('Öğle Yemeği')
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
  const [liveTranscript, setLiveTranscript] = useState('')
  const [showLateNightSnack, setShowLateNightSnack] = useState(false)
  const [loggedModalOpen, setLoggedModalOpen] = useState(false)
  const [loggedFoodName, setLoggedFoodName] = useState('')
  const [loggedCalories, setLoggedCalories] = useState(0)
  const [loggedItems, setLoggedItems] = useState([])
  const [editingLoggedItem, setEditingLoggedItem] = useState(null)
  const [scannerPanelOpen, setScannerPanelOpen] = useState(false)

  const mealCategories = ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Ara Öğün', 'Gece Öğünü']

  async function refresh() {
    if (!session?.id) return
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
    
    const hour = new Date().getHours()
    if (hour >= 22) {
      setShowLateNightSnack(true)
    }
  }, [date, session?.id])

  const results = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    if (!s) return FOODS.slice(0, 14)
    return FOODS.filter((f) => f.name.toLocaleLowerCase('tr').includes(s)).slice(0, 25)
  }, [q])

  const totals = sumLogs(logs)
  const preview = selected ? macrosForGrams(selected, Number(grams) || 0) : null

  async function save() {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      const loggedItem = await addFood(session.id, {
        food_name: `${selected.name} (${selectedMealCategory})`,
        amount_g: Number(grams),
        logged_on: date,
        ...preview,
      })
      setLoggedFoodName(selected.name)
      setLoggedCalories(preview.calories)
      setLoggedItems([{
        id: loggedItem.id,
        food_name: selected.name,
        amount_g: Number(grams),
        calories: preview.calories,
        protein: preview.protein,
        carbs: preview.carbs,
        fat: preview.fat,
        subtext: `${Number(grams)}g · ${selectedMealCategory}`
      }])
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
    
    if (macros.carbs > 50 && macros.calories > 300) {
      const userConfirmed = confirm('Dikkat: Bu öğün kan şekerini hızlı yükseltebilir. Yanına 2 kaşık yoğurt veya yeşillik ekleyebilirsin.')
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
      const currentTotals = sumLogs(logs)
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
        total_calories: currentTotals.calories,
        total_protein: currentTotals.protein,
        total_carbs: currentTotals.carbs,
        total_fat: currentTotals.fat
      }
      const existing = JSON.parse(localStorage.getItem('gfitt_saved_meals') || '[]')
      if (existing.length >= 2 && !profile?.is_pro) {
        setError('Ücretsiz planda en fazla 2 şablon kaydedilebilir.')
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

  return (
    <div className="space-y-5 pb-16">
      {/* Başlık ve Üst Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Beslenme Günlüğü</span>
          <h1 className="text-2xl font-black text-white">Yemek & Kalori</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScannerPanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E1B38] hover:bg-[#2A264D] text-white border border-white/10 text-xs font-bold transition-all active:scale-95"
          >
            <ScanLine className="w-4 h-4 text-purple-400" />
            <span>Etiket Oku</span>
          </button>
          <DayNav date={date} onChange={setDate} />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Gece Açlığı Önerisi */}
      {showLateNightSnack && (
        <div className="p-4 rounded-3xl bg-purple-900/20 border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-purple-300">🌙 Gece Açlığı mı Vurdu?</h4>
            <button onClick={() => setShowLateNightSnack(false)} className="text-slate-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-300">
            Uyku kaliteni ve melatonin dengeni bozmayacak 100 kcal altı hafif alternatifler:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Süzme yoğurt (100g)', kcal: 97, p: 9, c: 4, f: 5 },
              { name: 'Sade ayran (200ml)', kcal: 70, p: 3.4, c: 5, f: 3.6 },
              { name: 'Lor peyniri (50g)', kcal: 45, p: 8, c: 1, f: 0.75 },
            ].map((snack) => (
              <button
                key={snack.name}
                className="p-2.5 rounded-xl bg-[#141124] border border-white/5 hover:border-purple-500/30 text-left transition-all text-xs"
                onClick={() => {
                  saveFood({ name: snack.name, kcal: snack.kcal, p: snack.p, c: snack.c, f: snack.f })
                  setShowLateNightSnack(false)
                }}
              >
                <p className="font-bold text-white text-[11px] truncate">{snack.name.split('(')[0]}</p>
                <p className="text-[10px] text-purple-400 font-semibold">{snack.kcal} kcal</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Akıllı Araç Hap Butonları */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button 
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            showRestaurants ? 'bg-purple-600 text-white border-purple-500' : 'bg-[#18152B] text-slate-300 border-white/10 hover:text-white'
          }`}
          onClick={() => setShowRestaurants(!showRestaurants)}
        >
          🍔 Restoran Menüleri
        </button>
        <button 
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            showCheatDay ? 'bg-red-600 text-white border-red-500' : 'bg-[#18152B] text-slate-300 border-white/10 hover:text-white'
          }`}
          onClick={() => setShowCheatDay(!showCheatDay)}
        >
          🎉 Kaçamak Telafisi
        </button>
        <button 
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            showPlateauBreaker ? 'bg-amber-600 text-white border-amber-500' : 'bg-[#18152B] text-slate-300 border-white/10 hover:text-white'
          }`}
          onClick={() => setShowPlateauBreaker(!showPlateauBreaker)}
        >
          📈 Plato Kırıcı
        </button>
        <button 
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            showVoiceInput ? 'bg-gradient-to-r from-purple-600 to-[#FF8A00] text-white border-transparent' : 'bg-[#18152B] text-slate-300 border-white/10 hover:text-white'
          }`}
          onClick={() => setShowVoiceInput(!showVoiceInput)}
        >
          🎤 Sesli Günlük
        </button>
      </div>

      {/* Sesli Günlük Modülü */}
      {showVoiceInput && (
        <div className="p-4 rounded-3xl bg-[#161326] border border-purple-500/30 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-[#FF8A00]" />
            Sesle Doğal Cümle Söyle
          </h3>
          
          {isListening && liveTranscript && (
            <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg animate-pulse">
              "{liveTranscript}"
            </div>
          )}

          <p className="text-[11px] text-slate-400">
            Örn: "Bir tavuk döner dürüm, 2 haşlanmış yumurta ve bir kutu ayran"
          </p>

          <div className="flex gap-2">
            <button 
              className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                isListening ? 'bg-red-500 text-white animate-bounce' : 'bg-gradient-to-r from-purple-600 to-[#FF8A00] text-white'
              }`}
              onClick={() => {
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                  const recognition = new SpeechRecognition()
                  recognition.lang = 'tr-TR'
                  recognition.continuous = false
                  recognition.interimResults = true

                  recognition.onresult = (event) => {
                    let interim = ''
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                      if (event.results[i].isFinal) {
                        setVoiceText(event.results[i][0].transcript)
                        setLiveTranscript('')
                        setIsListening(false)
                      } else {
                        interim += event.results[i][0].transcript
                      }
                    }
                    if (interim) setLiveTranscript(interim)
                  }

                  recognition.onerror = () => {
                    setIsListening(false)
                    setLiveTranscript('')
                  }

                  recognition.start()
                  setIsListening(true)
                } else {
                  alert('Tarayıcınız ses tanımayı desteklemiyor. Aşağıdaki kutuya yazabilirsiniz.')
                }
              }}
            >
              {isListening ? 'Dinliyorum… Konuşun' : '🎙️ Mikrofonu Başlat'}
            </button>
          </div>

          <div className="pt-2">
            <input
              className="w-full bg-[#100D1D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              placeholder="Veya buraya yazın (Örn: 200g tavuk göğsü, 1 tabak pilav)…"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
            />
            {voiceText && (
              <button 
                className="w-full mt-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                onClick={async () => {
                  const separators = [' ve ', ' ile ', ',', ' artı ']
                  let parts = [voiceText]
                  for (const sep of separators) {
                    if (voiceText.toLowerCase().includes(sep)) {
                      parts = voiceText.split(new RegExp(sep, 'i'))
                      break
                    }
                  }

                  for (const part of parts) {
                    const clean = part.trim().toLowerCase()
                    if (clean.length < 2) continue
                    const match = FOODS.find(f => f.name.toLowerCase().includes(clean) || clean.includes(f.name.toLowerCase()))
                    if (match) {
                      const macros = macrosForGrams(match, 100)
                      await addFood(session.id, {
                        food_name: match.name,
                        amount_g: 100,
                        logged_on: date,
                        ...macros,
                      })
                    }
                  }
                  setVoiceText('')
                  await refresh()
                }}
              >
                Besinleri Ayrıştır & Kaydet
              </button>
            )}
          </div>
        </div>
      )}

      {/* Şablon & Dünü Kopyala Çubuğu */}
      <div className="flex gap-2">
        <button 
          className="flex-1 py-2 rounded-xl bg-[#18152B] hover:bg-[#221D3B] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          {showTemplates ? 'Şablonları Gizle' : 'Şablonları Göster'}
        </button>
        <button 
          className="flex-1 py-2 rounded-xl bg-[#18152B] hover:bg-[#221D3B] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold"
          onClick={handleCopyYesterday}
        >
          Dünü Kopyala
        </button>
        {logs.length > 0 && (
          <button 
            className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold"
            onClick={() => setSaveMealModalOpen(true)}
          >
            Şablon Yap
          </button>
        )}
      </div>

      {/* Şablon Listesi */}
      {showTemplates && (
        <div className="p-4 rounded-3xl bg-[#161326] border border-white/10 space-y-2">
          <h3 className="text-xs font-bold text-white">Kayıtlı Öğün Şablonların</h3>
          {savedMeals.length === 0 ? (
            <p className="text-xs text-slate-400">Henüz kayıtlı bir şablonunuz yok.</p>
          ) : (
            savedMeals.map((template) => (
              <div 
                key={template.id} 
                className="p-3 rounded-2xl bg-[#100D1D] border border-white/5 flex items-center justify-between cursor-pointer hover:border-purple-500/40"
                onClick={() => loadTemplate(template)}
              >
                <div>
                  <p className="text-xs font-bold text-white">{template.meal_name}</p>
                  <p className="text-[10px] text-slate-400">
                    {Math.round(template.total_calories)} kcal · P{Math.round(template.total_protein)}g C{Math.round(template.total_carbs)}g F{Math.round(template.total_fat)}g
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-400">Öğüne Ekle +</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ana Arama ve Günlük Kayıtlar Alanı */}
      <div className="space-y-4">
        {/* Öğün Türü Seçici */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {mealCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedMealCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMealCategory === cat 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-[#18152B] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Yemek Arama Kartı */}
        <div className="p-4 rounded-3xl bg-[#161326] border border-white/10 space-y-3">
          <input
            className="w-full bg-[#100D1D] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            placeholder="Tavuk, pilav, menemen ara…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {results.map((f) => (
              <div 
                key={f.id} 
                onClick={() => setSelected(f)} 
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selected?.id === f.id ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{f.emoji || '🍽️'}</span>
                  <div>
                    <strong className="text-xs text-white block">{f.name}</strong>
                    <span className="text-[10px] text-slate-400">{f.kcal} kcal · P{f.p} C{f.c} F{f.f} (100g)</span>
                  </div>
                </div>
                <span className="text-xs text-purple-400 font-bold">Seç</span>
              </div>
            ))}
          </div>

          {selected && (
            <div className="p-3.5 rounded-2xl bg-[#100D1D] border border-purple-500/30 space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{selected.name}</p>
                  <span className="text-[10px] text-purple-400 font-semibold">{selectedMealCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Porsiyon:</span>
                  <input 
                    className="w-20 bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white text-center font-bold" 
                    type="number" 
                    min="1" 
                    value={grams} 
                    onChange={(e) => setGrams(e.target.value)} 
                  />
                  <span className="text-xs text-slate-400">gram</span>
                </div>
              </div>

              {preview && (
                <div className="flex items-center justify-between text-[11px] bg-white/5 p-2 rounded-xl text-slate-300">
                  <span><strong>{preview.calories}</strong> kcal</span>
                  <span><strong>{preview.protein}g</strong> Protein</span>
                  <span><strong>{preview.carbs}g</strong> Karb</span>
                  <span><strong>{preview.fat}g</strong> Yağ</span>
                </div>
              )}

              <button 
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs active:scale-95 transition-transform" 
                onClick={save} 
                disabled={loading}
              >
                {loading ? 'Kaydediliyor…' : 'Öğüne Ekle'}
              </button>
            </div>
          )}
        </div>

        {/* Günün Eklenen Öğünleri */}
        <div className="p-4 rounded-3xl bg-[#161326] border border-white/10 space-y-3">
          <MacroBars totals={totals} profile={p} />

          <div className="space-y-2 mt-4">
            {logs.map((row) => (
              <div key={row.id} className="p-3 rounded-2xl bg-[#100D1D] border border-white/5 flex items-center justify-between">
                <div 
                  onClick={() => {
                    setEditingLog(row)
                    setEditGrams(row.amount_g)
                  }} 
                  className="cursor-pointer flex-1"
                >
                  <p className="text-xs font-bold text-white">{row.food_name}</p>
                  <p className="text-[10px] text-slate-400">
                    {row.amount_g}g · {Math.round(row.calories)} kcal · P{row.protein}g C{row.carbs}g F{row.fat}g
                  </p>
                </div>
                <button 
                  className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1"
                  onClick={() => handleDelete(row.id)} 
                  disabled={loading}
                >
                  Sil
                </button>
              </div>
            ))}
            {logs.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Bu tarihte henüz yemek eklenmedi.</p>}
          </div>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      {editingLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18152B] border border-white/15 rounded-3xl p-5 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-bold text-white">{editingLog.food_name}</h3>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold">Yeni Gramajı Girin</label>
              <input 
                className="w-full bg-[#100D1D] border border-white/15 rounded-xl px-3 py-2 text-sm text-white"
                type="number" 
                min="1" 
                value={editGrams} 
                onChange={(e) => setEditGrams(e.target.value)} 
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white" onClick={() => setEditingLog(null)}>
                İptal
              </button>
              <button className="flex-1 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white" onClick={handleUpdateGrams}>
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Şablon Kaydetme Modalı */}
      {saveMealModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#18152B] border border-white/15 rounded-3xl p-5 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Öğünü Şablon Olarak Kaydet</h3>
            <input 
              className="w-full bg-[#100D1D] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              value={mealTemplateName} 
              onChange={(e) => setMealTemplateName(e.target.value)} 
              placeholder="Örn: Klasik Sabah Kahvaltısı" 
            />
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white" onClick={() => setSaveMealModalOpen(false)}>
                Vazgeç
              </button>
              <button className="flex-1 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white" onClick={handleSaveAsTemplate}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loglandı Geri Bildirimi */}
      {loggedModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setLoggedModalOpen(false)}>
          <div className="bg-[#18152B] border border-white/15 rounded-3xl p-5 w-full max-w-sm text-center space-y-3" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-base font-black text-white">LOGLANDI</h3>
            <p className="text-xl font-black text-emerald-400">{Math.round(loggedCalories)} kcal</p>
            <p className="text-xs text-slate-300">
              {loggedFoodName} başarıyla günlüğe eklendi.
            </p>
            <button 
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs" 
              onClick={() => setLoggedModalOpen(false)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Barkod & Etiket Tarayıcı Paneli */}
      <FoodScannerPanel isOpen={scannerPanelOpen} onClose={() => setScannerPanelOpen(false)} />
    </div>
  )
}