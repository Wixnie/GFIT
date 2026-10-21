import { useState } from 'react'
import { ScanLine, Mic, PenTool, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { addFood } from '../lib/api'
import { todayISO } from '../lib/dates'
import { FOODS, macrosForGrams } from '../data/foods'

export default function QuickActionSheet({ isOpen, onClose, onOpenScanner }) {
  const { session } = useAuth()
  const [voiceMode, setVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [parsedFood, setParsedFood] = useState(null)

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'tr-TR'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
        setVoiceText('')
        setError(null)
      }

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript
        setVoiceText(transcript)
        setIsListening(false)
        
        // Send to Groq AI for parsing
        await parseWithGroq(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError('Ses tanıma hatası oluştu')
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      setError('Tarayıcınız sesli girişi desteklemiyor')
    }
  }

  const parseWithGroq = async (transcript) => {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      setError('Groq API key yapılandırılmamış')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Sen bir yemek besin değeri analizcisisin. Kullanıcının söylediği yemek adını ve gramajını Türkçe olarak anla. Sadece JSON formatında {food: string, grams: number} döndür. Örn: "Tavuk 200 gram" -> {"food": "Tavuk", "grams": 200}. Eğer gramaj belirtilmemişse varsayılan 100 gram kullan.',
            },
            {
              role: 'user',
              content: transcript,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      })

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.status}`)
      }

      const data = await res.json()
      const parsed = JSON.parse(data.choices[0].message.content)
      
      // Find matching food in database
      const matchingFood = FOODS.find(f => 
        f.name.toLocaleLowerCase('tr').includes(parsed.food.toLocaleLowerCase('tr'))
      )

      if (matchingFood) {
        const macros = macrosForGrams(matchingFood, parsed.grams || 100)
        setParsedFood({
          name: matchingFood.name,
          grams: parsed.grams || 100,
          ...macros
        })
      } else {
        setError('Yemek veritabanında bulunamadı: ' + parsed.food)
      }
    } catch (err) {
      console.error('Groq AI error:', err)
      setError('AI analizi başarısız oldu. Lütfen manuel deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVoiceFood = async () => {
    if (!parsedFood) return
    
    setLoading(true)
    try {
      await addFood(session.id, {
        food_name: parsedFood.name,
        amount_g: parsedFood.grams,
        logged_on: todayISO(),
        calories: parsedFood.calories,
        protein: parsedFood.protein,
        carbs: parsedFood.carbs,
        fat: parsedFood.fat
      })
      onClose()
    } catch (err) {
      console.error('Yemek eklenirken hata:', err)
      setError('Yemek eklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#181528',
          zIndex: 101,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>Hızlı Ekle</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {!voiceMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => {
                onClose()
                onOpenScanner()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#0B101B',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#F1F5F9',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF8A00'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <ScanLine size={24} color="#FF8A00" />
              <span>📷 Etiket Tara</span>
            </button>

            <button
              onClick={() => setVoiceMode(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#0B101B',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#F1F5F9',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF8A00'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <Mic size={24} color="#FF8A00" />
              <span>🎤 Sesli Yemek Ekle</span>
            </button>

            <button
              onClick={() => {
                onClose()
                window.location.href = '/yemek'
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#0B101B',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#F1F5F9',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF8A00'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <PenTool size={24} color="#FF8A00" />
              <span>✍️ Manuel Ekle</span>
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setVoiceMode(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Geri
            </button>

            {error && (
              <div style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            {!parsedFood ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: 16 }}>🎤</div>
                <p className="sub" style={{ marginBottom: 16 }}>
                  "Tavuk 200 gram" gibi söyleyin
                </p>
                <button
                  className="btn"
                  onClick={handleVoiceInput}
                  disabled={isListening || loading}
                  style={{ width: '100%' }}
                >
                  {isListening ? 'Dinleniyor...' : loading ? 'Analiz Ediliyor...' : 'Mikrofonu Aç'}
                </button>
                {voiceText && (
                  <div style={{ marginTop: 16, padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
                    <p className="sub" style={{ margin: 0 }}>Alınan: "{voiceText}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '16px', background: '#0B101B', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 12px' }}>{parsedFood.name}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: 16 }}>
                  <div style={{ padding: '8px', background: '#181528', borderRadius: '8px' }}>
                    <div className="sub">Gram</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{parsedFood.grams}g</div>
                  </div>
                  <div style={{ padding: '8px', background: '#181528', borderRadius: '8px' }}>
                    <div className="sub">Kalori</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{Math.round(parsedFood.calories)} kcal</div>
                  </div>
                  <div style={{ padding: '8px', background: '#181528', borderRadius: '8px' }}>
                    <div className="sub">Protein</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{Math.round(parsedFood.protein)}g</div>
                  </div>
                  <div style={{ padding: '8px', background: '#181528', borderRadius: '8px' }}>
                    <div className="sub">Karb</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{Math.round(parsedFood.carbs)}g</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setParsedFood(null)
                      setVoiceText('')
                    }}
                    style={{ flex: 1 }}
                  >
                    İptal
                  </button>
                  <button
                    className="btn"
                    onClick={handleAddVoiceFood}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? 'Ekleniyor...' : 'Ekle'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
