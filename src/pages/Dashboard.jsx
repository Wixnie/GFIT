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
import { getAICoachAdvice } from '../lib/ai'
import { updateStreak } from '../lib/streak'
import DayNav from '../components/DayNav'
import MacroBars from '../components/MacroBars'
import NudgeBanner from '../components/NudgeBanner'
import PersonalizedStats from '../components/PersonalizedStats'
import WaterTracker from '../components/WaterTracker'
import { Sparkles, Beef, UtensilsCrossed, Wheat, Coffee, Apple, Carrot, Cake, ChefHat, GlassWater, Dumbbell, Droplets, Zap, Moon, Sun } from 'lucide-react'

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
  const [kg, setKg] = useState(profile?.weight_kg || PERSONAL_DEFAULTS.weight_kg)
  const [active, setActive] = useState(null)
  const [draft, setDraft] = useState([])
  const [busy, setBusy] = useState(false)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [fastingMode, setFastingMode] = useState(false)
  const [fastingStart, setFastingStart] = useState(null)
  const [fastingHours, setFastingHours] = useState(0)
  const [sleepHours, setSleepHours] = useState(0)
  const [workoutSplit, setWorkoutSplit] = useState('Upper/Lower')
  const [aiAdvice, setAiAdvice] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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
    const savedXp = localStorage.getItem('gfitt_xp')
    setXp(savedXp ? parseInt(savedXp) : 0)
    
    // Calculate and update streak based on all food logs
    const allFoodLogs = await listFood(session.id)
    const currentStreak = updateStreak(allFoodLogs)
    setStreak(currentStreak)

    // Load fasting data
    const savedFasting = localStorage.getItem('gfitt_fasting')
    if (savedFasting) {
      const data = JSON.parse(savedFasting)
      setFastingMode(data.active || false)
      setFastingStart(data.startTime || null)
    }

    // Load sleep data
    const savedSleep = localStorage.getItem('gfitt_sleep')
    if (savedSleep) {
      setSleepHours(parseFloat(savedSleep) || 0)
    }
  }

  useEffect(() => {
    refresh().catch(() => {})

    // Update last activity time
    localStorage.setItem('gfitt_last_activity', new Date().toDateString())
    localStorage.setItem('gfitt_last_activity_time', Date.now().toString())
  }, [date, session.id])

  // Calculate fasting hours
  useEffect(() => {
    if (fastingMode && fastingStart) {
      const diff = Date.now() - new Date(fastingStart).getTime()
      setFastingHours(Math.floor(diff / (1000 * 60 * 60)))
    }
  }, [fastingMode, fastingStart])

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

  // Get icon based on food category
  const getFoodIcon = (category) => {
    const iconMap = {
      'protein': <Beef size={20} className="text-green-400" />,
      'karb': <Wheat size={20} className="text-indigo-400" />,
      'yemek': <UtensilsCrossed size={20} className="text-orange-400" />,
      'icecek': <GlassWater size={20} className="text-blue-400" />,
      'meyve': <Apple size={20} className="text-red-400" />,
      'sebze': <Carrot size={20} className="text-yellow-400" />,
      'tatli': <Cake size={20} className="text-pink-400" />,
      'atistirmalik': <ChefHat size={20} className="text-purple-400" />,
    }
    return iconMap[category] || <UtensilsCrossed size={20} className="text-gray-400" />
  }

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
      localStorage.setItem('gfitt_xp', newXp.toString())
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const toggleFasting = () => {
    if (fastingMode) {
      setFastingMode(false)
      setFastingStart(null)
      setFastingHours(0)
      localStorage.setItem('gfitt_fasting', JSON.stringify({ active: false, startTime: null }))
    } else {
      setFastingMode(true)
      const start = new Date().toISOString()
      setFastingStart(start)
      localStorage.setItem('gfitt_fasting', JSON.stringify({ active: true, startTime: start }))
    }
  }

  return (
    <div className="app-container">
      <NudgeBanner />
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
          {/* Menstrual Cycle Phase Badge for Female Users */}
          {p.gender === 'female' && p.cycle_start_date && (() => {
            const today = new Date()
            const start = new Date(p.cycle_start_date)
            const cycleLength = p.cycle_length || 28
            const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24))
            const dayInCycle = (daysSinceStart % cycleLength) + 1
            
            let phaseInfo = { name: '', icon: null, color: '' }
            if (dayInCycle <= 5) {
              phaseInfo = { name: 'Menstrüasyon', icon: Droplets, color: '#EF4444' }
            } else if (dayInCycle <= 13) {
              phaseInfo = { name: 'Foliküler', icon: Sun, color: '#10B981' }
            } else if (dayInCycle <= 16) {
              phaseInfo = { name: 'Ovülasyon', icon: Zap, color: '#F59E0B' }
            } else {
              phaseInfo = { name: 'Luteal', icon: Moon, color: '#8B5CF6' }
            }
            
            const PhaseIcon = phaseInfo.icon
            
            return (
              <div style={{ marginTop: '8px' }}>
                <span 
                  className="chip" 
                  style={{ 
                    background: `${phaseInfo.color}20`, 
                    color: phaseInfo.color, 
                    border: `1px solid ${phaseInfo.color}40`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <PhaseIcon size={14} />
                  {phaseInfo.name} (Gün {dayInCycle})
                </span>
              </div>
            )
          })()}
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>

      {/* Calorie Circular Progress Ring - Logma Style */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="circular-progress" style={{ position: 'relative', width: '140px', height: '140px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="50%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#FB923C" />
                </linearGradient>
              </defs>
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                className="progress-bg"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="url(#rainbow)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min(totals.calories / p.calorie_target, 1))}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#FF8A00' }}>{Math.round(totals.calories)}</div>
              <div className="sub" style={{ fontSize: '12px' }}>/ {p.calorie_target} kcal</div>
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: 24 }}>
            <div className="macro-indicator" style={{ marginBottom: 12 }}>
              <div className="macro-dot protein"></div>
              <span style={{ color: '#22C55E' }}>Protein: {Math.round(totals.protein)}g / {p.protein_target}g</span>
            </div>
            <div className="macro-indicator" style={{ marginBottom: 12 }}>
              <div className="macro-dot carb"></div>
              <span style={{ color: '#818CF8' }}>Karb: {Math.round(totals.carbs)}g / {p.carb_target}g</span>
            </div>
            <div className="macro-indicator">
              <div className="macro-dot fat"></div>
              <span style={{ color: '#FB923C' }}>Yağ: {Math.round(totals.fat)}g / {p.fat_target}g</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center', padding: '8px', background: 'rgba(255, 138, 0, 0.1)', borderRadius: '8px' }}>
          <p className="sub" style={{ margin: 0, color: '#FF8A00', fontWeight: 600 }}>
            {Math.round(remaining.calories)} kalori kaldı
          </p>
        </div>
      </div>

      {/* Today's Food Feed - Timestamped */}
      {logs.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 12px' }}>Bugünün Yemekleri</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log) => {
              const food = FOODS.find(f => f.name === log.food_name)
              const icon = food?.emoji || '🍽️'
              const time = log.created_at ? new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--'
              
              return (
                <div 
                  key={log.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    background: '#0B101B',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>{log.food_name}</strong>
                    <p className="sub" style={{ margin: '2px 0 0', fontSize: '12px' }}>
                      {log.amount_g}g · {Math.round(log.calories)} kcal · {Math.round(log.protein)}g protein
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="sub" style={{ margin: 0, fontSize: '12px', color: '#8B5CF6' }}>
                      {time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Goal-Based Widget */}
      {(() => {
        const goal = p.goal || 'maintain'
        if (goal === 'weight_loss') {
          return (
            <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' }}>
              <h3 style={{ margin: '0 0 12px', color: '#EF4444' }}>🔥 Kilo Verme Modu</h3>
              <div className="grid grid-2">
                <div>
                  <p className="sub">Net Kalori Açığı</p>
                  <strong style={{ fontSize: '20px', color: '#EF4444' }}>{Math.round(remaining.calories)} kcal</strong>
                </div>
                <div>
                  <p className="sub">Kardiyo Hedefi</p>
                  <strong style={{ fontSize: '20px', color: '#3B82F6' }}>30 dk</strong>
                </div>
              </div>
            </div>
          )
        } else if (goal === 'gain') {
          return (
            <div className="card" style={{ marginBottom: 16, background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22C55E' }}>
              <h3 style={{ margin: '0 0 12px', color: '#22C55E' }}>💪 Kas Yapma Modu</h3>
              <div className="grid grid-2">
                <div>
                  <p className="sub">Protein Fazlası</p>
                  <strong style={{ fontSize: '20px', color: '#22C55E' }}>{Math.round(remaining.protein)}g</strong>
                </div>
                <div>
                  <p className="sub">Set Hacmi</p>
                  <strong style={{ fontSize: '20px', color: '#FF8A00' }}>{workouts.length * 20} set</strong>
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="card" style={{ marginBottom: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#FF8A00' }}>
              <h3 style={{ margin: '0 0 12px', color: '#FF8A00' }}>⚖️ Form Koruma Modu</h3>
              <div className="grid grid-2">
                <div>
                  <p className="sub">Makro Dengesi</p>
                  <strong style={{ fontSize: '20px', color: '#FF8A00' }}>Optimal</strong>
                </div>
                <div>
                  <p className="sub">Su Hedefi</p>
                  <strong style={{ fontSize: '20px', color: '#3B82F6' }}>{Math.round(p.weight_kg * 35)}ml</strong>
                </div>
              </div>
            </div>
          )
        }
      })()}

      {/* Scientific Protein Range Bar - ISSN Standard */}
      <div className="card" style={{ marginBottom: 16, background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22C55E' }}>
        <h3 style={{ margin: '0 0 12px', color: '#22C55E' }}>🧬 Bilimsel Protein Hedefi: 1.6–2.2g / kg</h3>
        <p className="sub" style={{ marginBottom: 16 }}>
          ISSN 2017 standardı — Antrenman yapanlar için kilo başına günlük ideal aralık
        </p>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="sub">Min: {Math.round(p.weight_kg * 1.6)}g</span>
            <span className="sub" style={{ color: '#22C55E', fontWeight: 600 }}>Hedef Aralığı</span>
            <span className="sub">Max: {Math.round(p.weight_kg * 2.2)}g</span>
          </div>
          <div style={{ height: '24px', background: '#0F172A', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            {/* Zone indicator */}
            <div 
              style={{
                position: 'absolute',
                left: `${((p.weight_kg * 1.6) / (p.weight_kg * 2.5)) * 100}%`,
                width: `${((p.weight_kg * 2.2 - p.weight_kg * 1.6) / (p.weight_kg * 2.5)) * 100}%`,
                height: '100%',
                background: 'rgba(34, 197, 94, 0.3)',
                borderLeft: '2px solid #22C55E',
                borderRight: '2px solid #22C55E'
              }}
            />
            {/* Current protein */}
            <div 
              style={{
                height: '100%',
                background: '#22C55E',
                width: `${Math.min((totals.protein / (p.weight_kg * 2.5)) * 100, 100)}%`,
                transition: 'width 0.5s ease',
                borderRadius: '12px'
              }}
            />
          </div>
        </div>
        <p className="sub" style={{ margin: 0 }}>
          {(() => {
            const minP = p.weight_kg * 1.6
            const maxP = p.weight_kg * 2.2
            if (totals.protein >= minP && totals.protein <= maxP) {
              return <span style={{ color: '#22C55E' }}>✅ İdeal hipertrofi aralığındasın!</span>
            } else if (totals.protein < minP) {
              return <span style={{ color: '#F59E0B' }}>⚠️ Hedefine {Math.round(minP - totals.protein)}g protein eksik</span>
            } else {
              return <span style={{ color: '#10B981' }}>💪 Hedefin üstündesin — optimum büyüme için iyisin!</span>
            }
          })()}
        </p>
      </div>

      {/* Personalized Stats - BMR, TDEE, Macros */}
      <PersonalizedStats profile={p} />

      {/* AI Coach Card */}
      <div className="card" style={{ marginBottom: 16, background: 'rgba(255, 138, 0, 0.1)', borderColor: '#FF8A00' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: '#FF8A00' }}>✨ AI Koç Tavsiyesi</h3>
          <button
            className="btn"
            onClick={async () => {
              setIsAnalyzing(true)
              const advice = await getAICoachAdvice({
                totals,
                targets: {
                  calorie_target: p.calorie_target,
                  protein_target: p.protein_target,
                  carb_target: p.carb_target,
                  fat_target: p.fat_target
                },
                remaining,
                workouts,
                profileName: p.display_name || 'Sporcu'
              })
              setAiAdvice(advice)
              setIsAnalyzing(false)
            }}
            disabled={isAnalyzing}
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
          >
            {isAnalyzing ? 'Analiz ediliyor...' : 'Analiz Et'}
          </button>
        </div>
        {aiAdvice ? (
          <div>
            <p style={{ marginBottom: 12, lineHeight: 1.6 }}>{aiAdvice}</p>
            <div style={{ marginTop: 12 }}>
              <p className="sub" style={{ marginBottom: 8 }}>Önerilen Yemekler:</p>
              <div style={{ display: 'grid', gap: '8px' }}>
                {foods.slice(0, 3).map((food) => (
                  <button
                    key={food.id}
                    className="btn ghost"
                    onClick={() => saveFood(food)}
                    style={{ fontSize: '0.75rem', textAlign: 'left', padding: '8px 12px' }}
                  >
                    {food.name} ({food.kcal} kcal)
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="sub">Analiz butonuna tıklayarak akşam öğünü önerisi alın.</p>
        )}
      </div>

      {/* Water Tracker */}
      <WaterTracker profile={p} />

      {/* Apple Health "Real Balance" 3-Card Layout */}
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: 8 }}>👣</div>
          <h4 style={{ margin: '0 0 4px' }}>Adımlar</h4>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>
            Evet, buzdolabına kadar yürüdüğün adımlar bile sayılır.
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: 8 }}>⚡</div>
          <h4 style={{ margin: '0 0 4px' }}>Enerji</h4>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>
            Akıllı saat takıyorsan gerçek kalori yakımı günlük dengene eklenir.
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: 8 }}>😴</div>
          <h4 style={{ margin: '0 0 4px' }}>Uyku</h4>
          <p className="sub" style={{ fontSize: '11px', margin: 0 }}>
            5 saatlik bir uykunun ertesi gün iştahına ne yaptığı.
          </p>
        </div>
      </div>

      {/* Intermittent Fasting & Sleep Cards */}
      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>16:8 Aralıklı Oruç</h3>
          {fastingMode ? (
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#10B981', marginBottom: 8 }}>
                {fastingHours}h
              </div>
              <p className="sub" style={{ marginBottom: 12 }}>Oruç devam ediyor</p>
              <button className="btn danger" onClick={toggleFasting} style={{ width: '100%' }}>
                Orucu Bitir
              </button>
            </div>
          ) : (
            <div>
              <p className="sub" style={{ marginBottom: 12 }}>Oruç modu kapalı</p>
              <button className="btn" onClick={toggleFasting} style={{ width: '100%' }}>
                Oruca Başla
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Uyku Takibi</h3>
          <div className="field">
            <label>Dün kaç saat uyudun?</label>
            <input
              className="input"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0
                setSleepHours(Math.min(24, Math.max(0, val)))
                localStorage.setItem('gfitt_sleep', e.target.value)
              }}
            />
          </div>
          <p className="sub" style={
            sleepHours < 6 ? { color: '#F87171' } :
            sleepHours >= 7 && sleepHours <= 9 ? { color: '#22C55E' } :
            sleepHours > 10 ? { color: '#FBBF24' } : {}
          }>
            {sleepHours < 6 ? '❌ Yetersiz uyku: Toparlanma ve kas onarımı için riskli' :
             sleepHours >= 7 && sleepHours <= 9 ? '✅ İdeal uyku süresi: Optimum anabolik yenilenme' :
             sleepHours > 10 ? '⚠️ Aşırı uyku / Halsizlik eğilimi' :
             '⚠️ Yeterli ama ideal değil'}
          </p>
          
          {/* Sleep-Appetite Alert */}
          {sleepHours < 6 && (
            <div style={{ marginTop: 12, padding: '12px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', border: '1px solid #F59E0B' }}>
              <p className="sub" style={{ margin: 0, color: '#F59E0B', fontWeight: 600 }}>
                🚨 İştah & Ghrelin Uyarısı
              </p>
              <p className="sub" style={{ margin: '4px 0 0', fontSize: '12px' }}>
                Dün gece az uyudun ({sleepHours} saat). Yetersiz uyku açlık hormonunu tetikler; bugün tatlı krizlerini önlemek için +500ml su iç ve öğününe +20g protein ekle.
              </p>
            </div>
          )}
          
          {/* Health Data Privacy Notice */}
          <div style={{ marginTop: 12, padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
            <p className="sub" style={{ margin: 0, fontSize: '10px' }}>
              <strong>Veri Güvenliği:</strong> Verileriniz asla reklam veya pazarlama amacıyla kullanılmaz; sadece aktivite ve uyku dengesini sunmak içindir.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <Stat label="Kalan kcal" value={Math.round(remaining.calories)} />
        <Stat label="Kalan protein" value={`${Math.round(remaining.protein)}g`} />
        <Stat label="Antrenman" value={workouts.length ? workouts[0].name : 'Yok'} />
        <Stat label="Takviye" value={`${taken.length}/${SUPPLEMENTS.length}`} />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Kalori & makro</h3>
            <Link className="chip" to="/yemek">Tümü</Link>
          </div>
          
          {/* Visual Progress Bars */}
          <div style={{ margin: '16px 0' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="sub">Kalori</span>
                <span className="sub" style={{ color: '#FF8A00' }}>{Math.round(totals.calories)} / {p.calorie_target}</span>
              </div>
              <div style={{ height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#FF8A00',
                    width: `${Math.min((totals.calories / p.calorie_target) * 100, 100)}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="sub">Protein</span>
                <span className="sub" style={{ color: '#22C55E' }}>{Math.round(totals.protein)}g / {p.protein_target}g</span>
              </div>
              <div style={{ height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#22C55E',
                    width: `${Math.min((totals.protein / p.protein_target) * 100, 100)}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="sub">Karbonhidrat</span>
                <span className="sub" style={{ color: '#818CF8' }}>{Math.round(totals.carbs)}g / {p.carb_target}g</span>
              </div>
              <div style={{ height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#818CF8',
                    width: `${Math.min((totals.carbs / p.carb_target) * 100, 100)}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="sub">Yağ</span>
                <span className="sub" style={{ color: '#FB923C' }}>{Math.round(totals.fat)}g / {p.fat_target}g</span>
              </div>
              <div style={{ height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#FB923C',
                    width: `${Math.min((totals.fat / p.fat_target) * 100, 100)}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
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
          {logs.map((row) => {
            const food = FOODS.find(f => f.name === row.food_name)
            const category = food?.cat || 'yemek'
            return (
              <div className="food-item" key={row.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)' }}>
                    {getFoodIcon(category)}
                  </div>
                  <div>
                    <strong>{row.food_name}</strong>
                    <div className="sub">{row.amount_g}g · {Math.round(row.calories)} kcal</div>
                  </div>
                </div>
                <button className="btn ghost" onClick={async () => { await deleteFood(session.id, row.id); await refresh() }}>Sil</button>
              </div>
            )
          })}
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
            <div style={{ marginTop: 12 }}>
              <div className="row" style={{ marginBottom: 12 }}>
                <button
                  className={`btn ${workoutSplit === 'Upper/Lower' ? '' : 'ghost'}`}
                  onClick={() => setWorkoutSplit('Upper/Lower')}
                  style={{ flex: 1 }}
                >
                  Upper/Lower
                </button>
                <button
                  className={`btn ${workoutSplit === 'PPL' ? '' : 'ghost'}`}
                  onClick={() => setWorkoutSplit('PPL')}
                  style={{ flex: 1 }}
                >
                  PPL
                </button>
              </div>
              <div className="row">
                {PROGRAMS.filter((pr) => pr.split === workoutSplit).map((pr) => (
                  <button key={pr.id} className="btn ghost" onClick={() => start(pr)}>{pr.name}</button>
                ))}
              </div>
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
            <h3 style={{ marginTop: 0 }}>Takviye</h3>
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
