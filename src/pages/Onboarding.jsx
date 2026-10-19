import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacros, calculateWaterTarget, getGoalRateDisplay } from '../lib/tdee'

export default function Onboarding() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    goal: '',
    gender: 'male',
    age: 25,
    height_cm: 175,
    weight_kg: 75,
    goal_rate: 'lose',
    activity_level: 'moderate',
    diet_type: '',
    allergies: '',
    username: '',
    email: '',
    password: '',
    birth_date: '',
    kvkkAccepted: false,
    healthConsent: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stepDirection, setStepDirection] = useState('forward') // 'forward' or 'backward'
  const [showConfetti, setShowConfetti] = useState(false)

  const totalSteps = 9

  const handleNext = () => {
    if (step < totalSteps) {
      setStepDirection('forward')
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStepDirection('backward')
      setStep(step - 1)
    } else {
      navigate('/')
    }
  }

  const handleFieldChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const calculateFinalTargets = () => {
    const bmr = calculateBMR(data.weight_kg, data.height_cm, data.age, data.gender)
    const tdee = calculateTDEE(bmr, data.activity_level)
    const targetCalories = calculateTargetCalories(tdee, data.goal, data.gender)
    const macros = calculateMacros(data.weight_kg, targetCalories)
    const waterTarget = calculateWaterTarget(data.weight_kg)
    
    return { bmr, tdee, targetCalories, macros, waterTarget }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!data.kvkkAccepted || !data.healthConsent) {
      setError('Lutfen KVKK ve saglik verisi onay kutularini isaretleyin.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const targets = calculateFinalTargets()
      
      localStorage.setItem('gfit_onboarding_data', JSON.stringify({
        ...data,
        ...targets
      }))

      if (data.email && data.password) {
        await signUp(data.email, data.password, {
          display_name: data.username,
          age: data.age,
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          gender: data.gender,
          activity_level: data.activity_level,
          goal: data.goal,
          calorie_target: targets.targetCalories,
          protein_target: targets.macros.protein,
          carb_target: targets.macros.carbs,
          fat_target: targets.macros.fat
        })
      } else {
        localStorage.setItem('gfit_demo_mode', 'true')
        localStorage.setItem('gfit_user_profile', JSON.stringify({
          display_name: data.username || 'Misafir',
          ...data,
          ...targets
        }))
      }

      navigate('/dashboard')
    } catch (err) {
      console.error('Kayıt hatası:', err)
      setError('Kayıt sırasında hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100

  // Check for birthday and show confetti
  useEffect(() => {
    if (data.birth_date) {
      const today = new Date()
      const birthDate = new Date(data.birth_date)
      const isBirthday = today.getDate() === birthDate.getDate() && 
                        today.getMonth() === birthDate.getMonth()
      
      if (isBirthday) {
        setShowConfetti(true)
        localStorage.setItem('gfit_birthday_pro', 'true')
        
        // Generate confetti
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div')
          confetti.className = 'confetti-piece'
          confetti.style.left = Math.random() * 100 + 'vw'
          confetti.style.top = '-10px'
          confetti.style.background = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'][Math.floor(Math.random() * 4)]
          confetti.style.animationDelay = Math.random() * 2 + 's'
          document.body.appendChild(confetti)
          
          setTimeout(() => confetti.remove(), 5000)
        }
        
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }, [data.birth_date])

  return (
    <div className="app-container" style={{ paddingTop: '80px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button 
            onClick={handleBack}
            style={{ background: 'transparent', border: 'none', color: '#F59E0B', fontSize: '24px', cursor: 'pointer', padding: 0 }}
          >
            &larr;
          </button>
          <div style={{ flex: 1, margin: '0 16px' }}>
            <div style={{ height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  background: '#F59E0B', 
                  width: `${progressPercent}%`,
                  transition: 'width 0.3s ease' 
                }} 
              />
            </div>
          </div>
          <span className="sub" style={{ minWidth: '60px', textAlign: 'right' }}>{step}/{totalSteps}</span>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="card onboarding-step">
          <h2 style={{ margin: '0 0 16px' }}>Seni GFIT'e Getiren Ne?</h2>
          <div className="grid grid-2">
            {[
              { id: 'lose', label: 'Kilo Vermek', icon: '📉', desc: 'Sağlıklı kilo ver' },
              { id: 'maintain', label: 'Korumak', icon: '⚖️', desc: 'Mevcut kilonu koru' },
              { id: 'gain', label: 'Kas Yapmak', icon: '💪', desc: 'Kas kutlesi artir' },
              { id: 'track', label: 'Sadece Takip', icon: '📊', desc: 'Ne yedigini gor' },
            ].map((goal) => (
              <button
                key={goal.id}
                className={`card interactive-card ${data.goal === goal.id ? 'selected' : ''}`}
                onClick={() => handleFieldChange('goal', goal.id)}
                style={{ 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  border: data.goal === goal.id ? '2px solid #F59E0B' : '1px solid #1E293B',
                  background: data.goal === goal.id ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: 8 }}>{goal.icon}</div>
                <h3 style={{ margin: '0 0 4px' }}>{goal.label}</h3>
                <p className="sub">{goal.desc}</p>
              </button>
            ))}
          </div>
          <button 
            className="btn" 
            onClick={handleNext} 
            style={{ width: '100%', marginTop: 16 }}
            disabled={!data.goal}
          >
            Devam Et
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card onboarding-step">
          <h2 style={{ margin: '0 0 16px' }}>Zorluklar</h2>
          <p className="sub" style={{ marginBottom: 24 }}>
            Çoğu kişi 1 haftada bırakıyor ama GFIT ile %84 başarı
          </p>
          <div style={{ background: '#0F172A', borderRadius: '12px', padding: '24px', marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Diğer Uygulamalar</span>
                <span style={{ color: '#EF4444' }}>16%</span>
              </div>
              <div className="animated-progress-bar">
                <div 
                  className="animated-progress-bar-fill" 
                  style={{ '--progress-width': '16%', background: '#EF4444' }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#10B981', fontWeight: 600 }}>GFIT</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>84%</span>
              </div>
              <div className="animated-progress-bar">
                <div 
                  className="animated-progress-bar-fill" 
                  style={{ '--progress-width': '84%', background: '#10B981' }}
                />
              </div>
            </div>
          </div>
          <button className="btn" onClick={handleNext} style={{ width: '100%' }}>
            Devam Et
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="card onboarding-step">
          <h2 style={{ margin: '0 0 16px' }}>Mükemmel Olmana Gerek Yok</h2>
          <p className="sub" style={{ marginBottom: 24 }}>
            İlk zafer: 2 haftada -4 kg
          </p>
          <div style={{ textAlign: 'center', padding: '32px', background: '#0F172A', borderRadius: '12px' }}>
            <div style={{ fontSize: '64px', marginBottom: 16 }}>🏆</div>
            <h3 style={{ color: '#F59E0B', margin: '0 0 8px' }}>İlk Zafer Rozeti</h3>
            <p className="sub">2 haftada -4 kg</p>
          </div>
          <button className="btn" onClick={handleNext} style={{ width: '100%' }}>
            Devam Et
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="card">
          <h2 style={{ margin: '0 0 16px' }}>Cinsiyet</h2>
          <div className="grid grid-2">
            <button
              className="card"
              onClick={() => { handleFieldChange('gender', 'male'); handleNext() }}
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                border: data.gender === 'male' ? '2px solid #F59E0B' : '1px solid #1E293B',
                background: data.gender === 'male' ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: 8 }}>👨</div>
              <h3 style={{ margin: 0 }}>Erkek</h3>
            </button>
            <button
              className="card"
              onClick={() => { handleFieldChange('gender', 'female'); handleNext() }}
              style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                border: data.gender === 'female' ? '2px solid #F59E0B' : '1px solid #1E293B',
                background: data.gender === 'female' ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: 8 }}>👩</div>
              <h3 style={{ margin: 0 }}>Kadın</h3>
            </button>
          </div>
          {data.gender === 'female' && (
            <div className="card" style={{ marginTop: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }}>
              <h4 style={{ margin: '0 0 8px', color: '#F59E0B' }}>Regl Dongusu Senkronizasyonu</h4>
              <p className="sub">
                GFIT regl doneminde odem uyarisi ve tatli krizi icin Magnezyum onerileri sunacak.
              </p>
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="card onboarding-step">
          <h2 style={{ margin: '0 0 16px' }}>Vücut Ölçüleri</h2>
          <div className="field">
            <label>Yas: {data.age} yas</label>
            <input
              className="input"
              type="range"
              min="16"
              max="80"
              value={data.age}
              onChange={(e) => handleFieldChange('age', parseInt(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Boy: {data.height_cm} cm</label>
            <input
              className="input"
              type="range"
              min="140"
              max="220"
              value={data.height_cm}
              onChange={(e) => handleFieldChange('height_cm', parseInt(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Kilo: {data.weight_kg} kg</label>
            <input
              className="input"
              type="range"
              min="40"
              max="150"
              value={data.weight_kg}
              onChange={(e) => handleFieldChange('weight_kg', parseInt(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Dogum Tarihi</label>
            <input
              className="input"
              type="date"
              value={data.birth_date}
              onChange={(e) => handleFieldChange('birth_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="sub" style={{ fontSize: '11px', marginTop: 4 }}>
              Dogum gununde 1 gun ucretsiz PRO kazanicaksin!
            </p>
          </div>
          <button className="btn" onClick={handleNext} style={{ width: '100%' }}>
            Devam Et
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="card">
          <h2 style={{ margin: '0 0 16px' }}>Hedef Hızı</h2>
          <div className="grid grid-2">
            {[
              { id: 'lose_slow', rate: 0.12, emoji: '🐢', label: 'Sakin' },
              { id: 'lose', rate: 0.25, emoji: '🚶', label: 'Dengeli - Onerilen' },
              { id: 'lose_fast', rate: 0.5, emoji: '🐇', label: 'Hizli' },
            ].map((option) => (
              <button
                key={option.id}
                className="card"
                onClick={() => { handleFieldChange('goal_rate', option.id); handleNext() }}
                style={{ 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  border: data.goal_rate === option.id ? '2px solid #F59E0B' : '1px solid #1E293B',
                  background: data.goal_rate === option.id ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: 8 }}>{option.emoji}</div>
                <h3 style={{ margin: '0 0 4px' }}>{option.label}</h3>
                <p className="sub">{option.rate} kg/hafta</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="card">
          <h2 style={{ margin: '0 0 16px' }}>Aktivite Durumu</h2>
          <div className="field">
            <label>Hareket Seviyesi</label>
            <select 
              className="input"
              value={data.activity_level}
              onChange={(e) => handleFieldChange('activity_level', e.target.value)}
            >
              <option value="sedentary">Sedanter (Hareketsiz)</option>
              <option value="light">Hafif Aktif</option>
              <option value="moderate">Orta Aktif</option>
              <option value="active">Cok Aktif</option>
              <option value="very_active">Cok Cok Aktif</option>
            </select>
          </div>
          <p className="sub" style={{ marginBottom: 16 }}>
            {data.activity_level === 'sedentary' && 'Spor yapmiyorsan adim/su takibi one cikiyoruz.'}
            {data.activity_level === 'moderate' && 'Haftada 3-4 gun orta yogunlukta antrenman.'}
            {data.activity_level === 'active' && 'Haftada 5-6 gun yogun antrenman.'}
          </p>
          <button className="btn" onClick={handleNext} style={{ width: '100%' }}>
            Devam Et
          </button>
        </div>
      )}

      {step === 8 && (
        <div className="card">
          <h2 style={{ margin: '0 0 16px' }}>Beslenme & Alerjiler</h2>
          <div className="field">
            <label>Beslenme Tipi</label>
            <select 
              className="input"
              value={data.diet_type}
              onChange={(e) => handleFieldChange('diet_type', e.target.value)}
            >
              <option value="">Seciniz</option>
              <option value="balanced">Dengeli</option>
              <option value="low_carb">Dusuk Karbahidrat</option>
              <option value="high_protein">Yuksek Protein</option>
              <option value="vegetarian">Vejetaryan</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div className="field">
            <label>Alerjiler (Varsa)</label>
            <input
              className="input"
              placeholder="Orn: Findik, Kuruyemis, Gluten..."
              value={data.allergies}
              onChange={(e) => handleFieldChange('allergies', e.target.value)}
            />
          </div>
          <div className="card" style={{ marginTop: 16, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }}>
            <p className="sub" style={{ marginBottom: 8 }}>
              <strong>Veri Guvenligi:</strong> Verileriniz asla reklam amaciyla kullanilmaz.
            </p>
          </div>
          <button className="btn" onClick={handleNext} style={{ width: '100%' }}>
            Devam Et
          </button>
        </div>
      )}

      {step === 9 && (
        <div className="card onboarding-step">
          <h2 style={{ margin: '0 0 16px' }}>Planın Hazırlanıyor...</h2>
          
          {(() => {
            const targets = calculateFinalTargets()
            const goalInfo = getGoalRateDisplay(data.goal)
            
            return (
              <div style={{ textAlign: 'center', padding: '24px', background: '#0F172A', borderRadius: '12px', marginBottom: 24 }}>
                <div style={{ fontSize: '48px', marginBottom: 16 }}>📊</div>
                <h3 style={{ color: '#F59E0B', margin: '0 0 8px' }}>Kişisel Hedeflerin</h3>
                <div className="grid grid-2" style={{ textAlign: 'left', marginBottom: 16 }}>
                  <div>
                    <p className="sub">Kalori Hedefi</p>
                    <strong style={{ fontSize: '20px', color: '#F59E0B' }}>{Math.round(targets.targetCalories)} kcal</strong>
                  </div>
                  <div>
                    <p className="sub">Su Hedefi</p>
                    <strong style={{ fontSize: '20px', color: '#10B981' }}>{targets.waterTarget} ml</strong>
                  </div>
                </div>
                <div className="grid grid-3" style={{ textAlign: 'left', marginBottom: 16 }}>
                  <div>
                    <p className="sub">Protein</p>
                    <strong style={{ fontSize: '18px', color: '#10B981' }}>{targets.macros.protein}g</strong>
                  </div>
                  <div>
                    <p className="sub">Karb</p>
                    <strong style={{ fontSize: '18px', color: '#F59E0B' }}>{targets.macros.carbs}g</strong>
                  </div>
                  <div>
                    <p className="sub">Yag</p>
                    <strong style={{ fontSize: '18px', color: '#64748B' }}>{targets.macros.fat}g</strong>
                  </div>
                </div>
                <p className="sub">
                  Hedef Hizi: {goalInfo.emoji} {goalInfo.label} ({goalInfo.rate} kg/hafta)
                </p>
              </div>
            )
          })()}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Kullanici Adi (@kullaniciadi)</label>
              <input
                className="input"
                placeholder="kullaniciadi"
                value={data.username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
              />
            </div>
            <div className="field">
              <label>E-posta</label>
              <input
                className="input"
                type="email"
                placeholder="ornek@email.com"
                value={data.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Sifre</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••••"
                value={data.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
              />
            </div>

            <div className="row" style={{ marginBottom: 16 }}>
              <button 
                type="button"
                className="btn ghost" 
                onClick={() => {
                  localStorage.setItem('gfit_demo_mode', 'true')
                  localStorage.setItem('gfit_user_profile', JSON.stringify({
                    display_name: data.username || 'Misafir',
                    ...data,
                    ...calculateFinalTargets()
                  }))
                  navigate('/dashboard')
                }}
                style={{ flex: 1 }}
              >
                Simdilik Atla (Misafir)
              </button>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={data.kvkkAccepted}
                  onChange={(e) => handleFieldChange('kvkkAccepted', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span className="sub">KVKK & Gizlilik Sozlesmesini kabul ediyorum</span>
              </label>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={data.healthConsent}
                  onChange={(e) => handleFieldChange('healthConsent', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span className="sub">Sağlık verilerimin işlenmesine açık rıza gösteriyorum</span>
              </label>
            </div>

            {/* Medical Disclaimer */}
            <div className="card" style={{ marginBottom: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }}>
              <h4 style={{ margin: '0 0 8px', color: '#F59E0B' }}>Tıbbi Yasal Uyarı</h4>
              <p className="sub" style={{ lineHeight: 1.6, fontSize: '12px' }}>
                GFIT'te sunulan kalori, TDEE ve diger beslenme tavsiyeleri tıbbi teşhis veya tedavi değildir. 
                Bu bilgiler genel tavsiye niteliğindedir ve kişisel sağlık durumunuza uyarlanmamış olabilir. 
                Herhangi bir sağlık sorunu varsa veya diyet değişikliği yapmayı planlıyorsanız, 
                lutfen önce bir sağlık uzmanına veya diyetisyene danışın.
              </p>
            </div>

            <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Kaydediliyor...' : 'Kayit Ol ve Basla'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
