import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { PERSONAL_DEFAULTS } from '../data/programs'
import { sumLogs } from '../lib/suggestions'
import { listFood } from '../lib/api'
import { todayISO } from '../lib/dates'

export default function AICoach() {
  const { session, profile } = useAuth()
  const p = { ...PERSONAL_DEFAULTS, ...profile }
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [selectedRole, setSelectedRole] = useState('diet')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [aiUsageCount, setAiUsageCount] = useState(0)

  const roles = [
    { id: 'diet', name: 'AI Diyet Koçu', icon: '🥗', description: 'Beslenme ve makro danışmanlığı' },
    { id: 'workout', name: 'AI Antrenman Koçu', icon: '💪', description: 'Antrenman programı ve teknik' },
    { id: 'health', name: 'AI Sağlık Koçu', icon: '❤️', description: 'Uyku, su ve genel sağlık' },
  ]

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setLogs(await listFood(session.id, todayISO()))
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
    const count = localStorage.getItem('gfit_ai_usage_count')
    setAiUsageCount(count ? parseInt(count) : 0)
  }, [session.id])

  const totals = sumLogs(logs)
  const remainingCalories = p.calorie_target - totals.calories
  const remainingProtein = p.protein_target - totals.protein
  const remainingCarbs = p.carb_target - totals.carbs
  const remainingFat = p.fat_target - totals.fat

  const getHourBasedCoach = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return {
        title: 'Günaydın! 💪',
        message: 'Sabah enerjini protein ile başlat. Kahvaltıda kaliteli protein kaynağı tercih et.',
        color: '#F59E0B'
      }
    } else if (hour >= 12 && hour < 17) {
      return {
        title: 'Öğle Saati ⚡',
        message: 'Antrenman öncesi karbhidrat almayı unutma. Antrenman performansını artırır.',
        color: '#10B981'
      }
    } else {
      return {
        title: 'Akşam Saati 🌙',
        message: 'Akşam yemeğinde karbhidratı sınırla, protein ve sebze ağırlıklı beslen.',
        color: '#6366F1'
      }
    }
  }

  const generateSuggestions = () => {
    const coach = getHourBasedCoach()
    const foodSuggestions = []

    if (remainingProtein > 30) {
      foodSuggestions.push({
        name: 'Tavuk Göğsü',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        reason: 'Yüksek protein ihtiyacını karşılar'
      })
    }
    if (remainingCarbs > 50) {
      foodSuggestions.push({
        name: 'Pirinç Pilavı',
        calories: 140,
        protein: 2.6,
        carbs: 28,
        fat: 2.2,
        reason: 'Karb ihtiyacını karşılar'
      })
    }
    if (remainingFat > 15) {
      foodSuggestions.push({
        name: 'Ceviz',
        calories: 654,
        protein: 15,
        carbs: 14,
        fat: 65,
        reason: 'Sağlıklı yağ kaynağı'
      })
    }

    setSuggestions(foodSuggestions.slice(0, 3))
  }

  useEffect(() => {
    generateSuggestions()
  }, [logs, p])

  const handleAskAI = async () => {
    if (!question.trim()) return
    if (aiUsageCount >= 1 && !profile?.is_pro) {
      setError('Ücretsiz kullanıcılar günde 1 AI soru hakkına sahiptir. Reklam izleyerek +1 hak kazanabilirsiniz.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Mock AI response - In production, this would call Gemini API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setAnswer({
        question,
        response: getMockResponse(selectedRole, question)
      })
      const newCount = aiUsageCount + 1
      setAiUsageCount(newCount)
      localStorage.setItem('gfit_ai_usage_count', newCount.toString())
      setQuestion('')
    } catch (err) {
      console.error('AI sorusu işlenirken hata:', err)
      setError('AI sorusu işlenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getMockResponse = (role, question) => {
    const responses = {
      diet: 'Sorunuza göre, önerim kalori hedefinize ulaşmak için protein ağırlıklı beslenmek. Tavuk, balık ve yumurta gibi protein kaynaklarını tercih edin.',
      workout: 'Antrenman programınızda protein sentezini artırmak için compound hareketlere (squat, deadlift, bench press) öncelik verin.',
      health: 'Sağlıklı bir yaşam için günde en az 2-3 litre su içmek ve 7-8 saat uyumak önemlidir. Ayrıca düzenli fiziksel aktivite yapın.'
    }
    return responses[role] || 'Sorunuza yardımcı olmaktan mutluluk duyarım. Daha spesifik bir soru sorarsanız daha detaylı cevap verebilirim.'
  }

  const coach = getHourBasedCoach()

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">AI Destekli Koçluk</p>
          <h1>AI Koç</h1>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Saate Göre Koçluk Kartı */}
      <div className="card" style={{ marginBottom: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: coach.color }}>
        <h3 style={{ margin: '0 0 8px', color: coach.color }}>{coach.title}</h3>
        <p className="sub">{coach.message}</p>
      </div>

      {/* Kalan Makro Önerileri */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Kalan Makro Hedeflerine Göre Öneriler</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: 16 }}>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <div className="sub">Kalan Kalori</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#F59E0B' }}>{Math.round(remainingCalories)} kcal</div>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <div className="sub">Kalan Protein</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981' }}>{Math.round(remainingProtein)}g</div>
          </div>
        </div>

        {suggestions.length > 0 ? (
          <div>
            <p className="sub" style={{ marginBottom: 12 }}>Önerilen Yiyecekler:</p>
            {suggestions.map((s, i) => (
              <div key={i} className="food-item">
                <div>
                  <strong>{s.name}</strong>
                  <div className="sub">{s.reason}</div>
                  <div className="sub" style={{ fontSize: '12px' }}>
                    {s.calories} kcal · P{s.protein} C{s.carbs} F{s.fat}
                  </div>
                </div>
              </div>
            ))}
            <button className="btn ghost" onClick={generateSuggestions} style={{ width: '100%', marginTop: 12 }}>
              Farklı Öneri Getir
            </button>
          </div>
        ) : (
          <p className="sub">Günlük hedeflerinize ulaştınız! 🎉</p>
        )}
      </div>

      {/* Rol Bazlı AI Koç */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>AI Koçlar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: 16 }}>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className="card"
              style={{
                border: selectedRole === role.id ? '2px solid #F59E0B' : '1px solid #1E293B',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: 8 }}>{role.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>{role.name}</div>
              <div className="sub" style={{ fontSize: '12px' }}>{role.description}</div>
            </button>
          ))}
        </div>

        <div className="field">
          <label>Sorunuzu Yazın</label>
          <textarea
            className="input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Örn: Kas kütlesi için hangi proteinleri tercih etmeliyim?"
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p className="sub">
            Günlük Kullanım: {aiUsageCount}/1 {profile?.is_pro ? '(PRO: Sınırsız)' : ''}
          </p>
        </div>

        <button className="btn" onClick={handleAskAI} disabled={loading || !question.trim()}>
          {loading ? 'Yanıtlanıyor...' : 'Sor'}
        </button>

        {answer && (
          <div style={{ marginTop: 16, padding: '16px', background: '#0B101B', borderRadius: '12px' }}>
            <p className="sub" style={{ marginBottom: 8, color: '#F59E0B' }}>Soru:</p>
            <p style={{ marginBottom: 12 }}>{answer.question}</p>
            <p className="sub" style={{ marginBottom: 8, color: '#10B981' }}>Cevap:</p>
            <p>{answer.response}</p>
          </div>
        )}
      </div>

      {!profile?.is_pro && aiUsageCount >= 1 && (
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Hak Sınırına Ulaştınız</h3>
          <p className="sub" style={{ marginBottom: 16 }}>
            Ücretsiz kullanıcılar günde 1 AI soru hakkına sahiptir.
          </p>
          <button className="btn ghost" style={{ width: '100%' }}>
            1 Reklam İzle +1 Hak Kazan
          </button>
        </div>
      )}
    </div>
  )
}
