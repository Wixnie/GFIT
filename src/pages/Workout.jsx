import { useEffect, useMemo, useState } from 'react'
import { PROGRAMS } from '../data/programs'
import { useAuth } from '../context/AuthContext'
import { listWorkouts, saveWorkout } from '../lib/api'
import { todayISO } from '../lib/dates'
import DayNav from '../components/DayNav'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Workout() {
  const { session } = useAuth()
  const [date, setDate] = useState(todayISO())
  const [logs, setLogs] = useState([])
  const [history, setHistory] = useState([])
  const [active, setActive] = useState(null)
  const [draft, setDraft] = useState([])
  const [openExercise, setOpenExercise] = useState(null)
  const [filter, setFilter] = useState('Upper/Lower')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedExerciseForPerf, setSelectedExerciseForPerf] = useState('')

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const todayData = await listWorkouts(session.id, date)
      setLogs(todayData)
      // Son 60 günün tüm antrenman geçmişini performans grafiği için çek
      const allData = await listWorkouts(session.id)
      setHistory(Array.isArray(allData) ? allData : [])
    } catch (err) {
      console.error('Antrenmanlar yüklenirken hata:', err)
      // Hata durumunda sessizce yerel şablonlara fallback yap
      setLogs([])
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [date, session.id])

  function start(program) {
    setActive(program)
    setOpenExercise(program.exercises[0]?.name || null)
    setDraft(
      program.exercises.flatMap((ex, i) =>
        Array.from({ length: ex.sets }, (_, s) => ({
          exercise_name: ex.name,
          set_index: i * 10 + s,
          set_number: s + 1,
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

  // Egzersiz bazında gruplanmış draft
  const exerciseGroups = useMemo(() => {
    if (!active) return []
    const groups = {}
    draft.forEach((row, draftIdx) => {
      if (!groups[row.exercise_name]) {
        groups[row.exercise_name] = []
      }
      groups[row.exercise_name].push({ ...row, originalIndex: draftIdx })
    })
    return Object.entries(groups).map(([name, sets]) => ({ name, sets }))
  }, [active, draft])

  // Performans grafiği için egzersiz listesi
  const availableExerciseNames = useMemo(() => {
    const names = new Set()
    history.forEach((w) => {
      (w.sets || []).forEach((s) => {
        if (s.exercise_name) names.add(s.exercise_name)
      })
    })
    return Array.from(names)
  }, [history])

  useEffect(() => {
    if (availableExerciseNames.length && !selectedExerciseForPerf) {
      setSelectedExerciseForPerf(availableExerciseNames[0])
    }
  }, [availableExerciseNames, selectedExerciseForPerf])

  // Seçilen egzersizin gün gün ağırlık artış trendi
  const performanceTrend = useMemo(() => {
    if (!selectedExerciseForPerf || !history.length) return []
    const map = {}
    history.forEach((w) => {
      const day = w.logged_on
      ;(w.sets || []).forEach((s) => {
        if (s.exercise_name === selectedExerciseForPerf && s.weight_kg > 0) {
          if (!map[day] || Number(s.weight_kg) > map[day].max_weight) {
            map[day] = {
              day,
              max_weight: Number(s.weight_kg),
              reps: s.reps || 0,
            }
          }
        }
      })
    })
    return Object.values(map).sort((a, b) => a.day.localeCompare(b.day))
  }, [history, selectedExerciseForPerf])

  const templates = PROGRAMS.filter((p) => p.split === filter)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div className="page-head">
        <div>
          <p className="sub">Hazır şablonlar & Akıllı Set Takibi</p>
          <h1>Antrenman</h1>
        </div>
        <DayNav date={date} onChange={setDate} />
      </div>



      {/* Şablon Seçimi */}
      <div className="row" style={{ marginBottom: 18 }}>
        {['Upper/Lower', 'PPL'].map((s) => (
          <button key={s} className={`btn ${filter === s ? '' : 'ghost'}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {!active && (
        <div className="grid grid-2" style={{ marginBottom: 24 }}>
          {templates.map((p) => (
            <button key={p.id} className="card template" onClick={() => start(p)} style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="chip" style={{ color: '#F59E0B', borderColor: '#F59E0B', background: 'rgba(245, 158, 11, 0.2)' }}>{p.split}</span>
                <span className="sub" style={{ fontSize: '12px' }}>{p.exercises.length} Hareket</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '20px', color: '#ffffff' }}>{p.name}</h3>
              <p className="sub" style={{ margin: 0, fontSize: '13px' }}>
                {p.exercises.map((e) => e.name).slice(0, 3).join(', ')}...
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Aktif Antrenman (Akordiyon / Açılır Kapanır Hareketler) */}
      {active && (
        <div className="card" style={{ marginBottom: 24, border: '1px solid var(--lime)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
            <div>
              <span className="chip" style={{ color: 'var(--lime)', marginBottom: 4, display: 'inline-block' }}>Aktif Antrenman</span>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{active.name}</h2>
            </div>
            <button className="btn ghost" onClick={() => setActive(null)} disabled={loading}>
              İptal Et
            </button>
          </div>

          {/* Akordiyon Egzersiz Listesi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exerciseGroups.map((grp) => {
              const isOpen = openExercise === grp.name
              const completedCount = grp.sets.filter((s) => s.done).length

              return (
                <div
                  key={grp.name}
                  style={{
                    backgroundColor: isOpen ? '#141C2E' : '#0E141E',
                    border: `1px solid ${isOpen ? 'var(--lime-dim)' : 'var(--line)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Başlık / Buton */}
                  <div
                    onClick={() => setOpenExercise(isOpen ? null : grp.name)}
                    style={{
                      padding: '14px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: isOpen ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                        {grp.name}
                      </span>
                      <span className="chip" style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        {completedCount}/{grp.sets.length} Set
                      </span>
                    </div>
                    <span style={{ fontSize: '16px', color: '#64748B', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      ▼
                    </span>
                  </div>

                  {/* Açılan Set Satırları */}
                  {isOpen && (
                    <div style={{ padding: '8px 18px 16px', borderTop: '1px solid var(--line)' }}>
                      {grp.sets.map((set) => (
                        <div
                          key={set.originalIndex}
                          className="set-row"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                          }}
                        >
                          <button
                            type="button"
                            className={`check ${set.done ? 'on' : ''}`}
                            onClick={() => patch(set.originalIndex, 'done', !set.done)}
                            aria-label="Set tamam"
                          >
                            {set.done ? '✓' : ''}
                          </button>
                          <div style={{ flex: 1, fontSize: '14px', color: set.done ? 'var(--muted)' : 'var(--text)' }}>
                            <strong>Set {set.set_number}</strong>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              className="input"
                              style={{ width: 85, textAlign: 'center' }}
                              placeholder="kg"
                              value={set.weight_kg}
                              onChange={(e) => patch(set.originalIndex, 'weight_kg', e.target.value)}
                            />
                            <input
                              className="input"
                              style={{ width: 85, textAlign: 'center' }}
                              placeholder="tekrar"
                              value={set.reps}
                              onChange={(e) => patch(set.originalIndex, 'reps', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button className="btn" style={{ marginTop: 20, width: '100%', padding: '14px' }} onClick={complete} disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Antrenmanı Tamamla & Kaydet'}
          </button>
        </div>
      )}

      {/* Ücretsiz Örnek Antrenman Planları */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: 16 }}>Ücretsiz Örnek Antrenman Planları</h3>
        <p className="sub" style={{ marginBottom: 16 }}>
          Ücretsiz olarak temel programlara göz atabilir ve seçebilirsiniz.
        </p>
        <div className="grid grid-2">
          {PROGRAMS.slice(0, 4).map((program) => (
            <button
              key={program.id}
              className="card"
              onClick={() => start(program)}
              style={{
                cursor: 'pointer',
                border: active?.id === program.id ? '2px solid #F59E0B' : '1px solid #334155',
                background: active?.id === program.id ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                textAlign: 'left',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: 8 }}>{program.icon}</div>
              <h4 style={{ margin: '0 0 4px', color: '#fff' }}>{program.name}</h4>
              <p className="sub" style={{ margin: 0, fontSize: '12px' }}>{program.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bugünkü Kayıtlar & Performans İlerlemesi Yan Yana Düzen */}
      <div className="grid grid-2">
        {/* Bugünkü Kayıtlar */}
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: '18px' }}>Bugünkü Kayıtlar</h3>
          {logs.map((w) => (
            <div key={w.id} className="food-item">
              <div>
                <strong>{w.name}</strong>
                <div className="sub">{(w.sets || []).length} set tamamlandı</div>
              </div>
              <span className="chip" style={{ color: 'var(--lime)' }}>{w.template_id}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="sub">Bu tarihte tamamlanan antrenman bulunmuyor.</p>}
        </div>

        {/* Performans & Ağırlık Artış Grafiği */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Güç & Ağırlık Artışı</h3>
            {availableExerciseNames.length > 0 && (
              <select
                className="input"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
                value={selectedExerciseForPerf}
                onChange={(e) => setSelectedExerciseForPerf(e.target.value)}
              >
                {availableExerciseNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <p className="sub" style={{ fontSize: '13px', marginBottom: 14 }}>
            {selectedExerciseForPerf ? `${selectedExerciseForPerf} hareketindeki maksimum ağırlık trendi` : 'Kayıtlı hareket bulunamadı'}
          </p>

          {performanceTrend.length > 0 ? (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="day" stroke="#8b9788" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8b9788" fontSize={11} unit="kg" tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141C2E', borderColor: '#1E293B', borderRadius: 8, color: '#fff' }}
                    formatter={(val) => [`${val} kg`, 'Maksimum Ağırlık']}
                  />
                  <Line type="monotone" dataKey="max_weight" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="sub" style={{ padding: '24px 0', textAlign: 'center' }}>
              Grafik için bu hareketle en az 1 antrenman tamamlayın.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}