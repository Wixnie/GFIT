import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useAuth } from '../context/AuthContext'
import { addFood } from '../lib/api'
import { todayISO } from '../lib/dates'

export default function FoodScanner() {
  const { session, profile } = useAuth()
  const [scanMode, setScanMode] = useState('barcode') // 'barcode' or 'photo'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [scanCount, setScanCount] = useState(0)
  const scannerRef = useRef(null)

  useEffect(() => {
    const count = localStorage.getItem('gfit_scan_count')
    setScanCount(count ? parseInt(count) : 0)
  }, [])

  const handleBarcodeScan = async (decodedText) => {
    if (scanCount >= 3 && !profile?.is_pro) {
      setError('Ücretsiz kullanıcılar günde 3 barkod tarama hakkına sahiptir. Reklam izleyerek +3 hak kazanabilirsiniz.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Mock OpenFoodFacts API call - In production, this would call the real API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock response - In production, this would be from OpenFoodFacts
      const mockData = {
        name: 'Ürün Bulundu (Mock)',
        calories: 250,
        protein: 15,
        carbs: 30,
        fat: 8,
        sugar: 12,
        sodium: 500,
        healthScore: 75,
        allergens: []
      }

      setScanResult(mockData)
      const newCount = scanCount + 1
      setScanCount(newCount)
      localStorage.setItem('gfit_scan_count', newCount.toString())
    } catch (err) {
      console.error('Barkod taranırken hata:', err)
      setError('Barkod taranırken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (scanCount >= 3 && !profile?.is_pro) {
      setError('Ücretsiz kullanıcılar günde 3 AI tarama hakkına sahiptir. Reklam izleyerek +3 hak kazanabilirsiniz.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Mock Gemini Vision API call - In production, this would call the real API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock response - In production, this would be from Gemini
      const mockData = {
        name: 'Yemek Analizi (Mock)',
        calories: 350,
        protein: 20,
        carbs: 45,
        fat: 12,
        sugar: 8,
        sodium: 600,
        healthScore: 68,
        allergens: ['Gluten', 'Süt']
      }

      setScanResult(mockData)
      const newCount = scanCount + 1
      setScanCount(newCount)
      localStorage.setItem('gfit_scan_count', newCount.toString())

      // Cache the result in Supabase food_cache (mock)
      const cached = JSON.parse(localStorage.getItem('gfit_food_cache') || '[]')
      cached.push({
        id: Date.now().toString(),
        ...mockData,
        cached_at: new Date().toISOString()
      })
      localStorage.setItem('gfit_food_cache', JSON.stringify(cached))
    } catch (err) {
      console.error('Fotoğraf analiz edilirken hata:', err)
      setError('Fotoğraf analiz edilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToLog = async () => {
    if (!scanResult) return
    setLoading(true)
    setError(null)
    try {
      await addFood(session.id, {
        food_name: scanResult.name,
        amount_g: 100,
        logged_on: todayISO(),
        calories: scanResult.calories,
        protein: scanResult.protein,
        carbs: scanResult.carbs,
        fat: scanResult.fat
      })
      setScanResult(null)
      alert('Yemek günlüğe eklendi!')
    } catch (err) {
      console.error('Yemek eklenirken hata:', err)
      setError('Yemek eklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">AI Destekli Analiz</p>
          <h1>Etiket Okuyucu</h1>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Scan Mode Toggle */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row">
          <button
            className={`btn ${scanMode === 'barcode' ? '' : 'ghost'}`}
            onClick={() => setScanMode('barcode')}
            style={{ flex: 1 }}
          >
            Barkod Tara
          </button>
          <button
            className={`btn ${scanMode === 'photo' ? '' : 'ghost'}`}
            onClick={() => setScanMode('photo')}
            style={{ flex: 1 }}
          >
            Fotoğraf Yükle
          </button>
        </div>
      </div>

      {/* Usage Counter */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="sub">Günlük Kullanım: {scanCount}/3 {profile?.is_pro ? '(PRO: Sınırsız)' : ''}</p>
          {!profile?.is_pro && scanCount >= 3 && (
            <button className="btn ghost" style={{ fontSize: '13px' }}>
              Reklam İzle +3 Hak
            </button>
          )}
        </div>
      </div>

      {scanMode === 'barcode' ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Barkod Tara</h3>
          <div style={{ textAlign: 'center', padding: '32px', background: '#0B101B', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>📷</div>
            <p className="sub" style={{ marginBottom: 16 }}>
              Kamerayı barkoda yönlendirin
            </p>
            <button className="btn" onClick={() => handleBarcodeScan('mock-barcode')} disabled={loading}>
              {loading ? 'Taranıyor...' : 'Demo Tarama Başlat'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Fotoğraf Yükle</h3>
          <div style={{ textAlign: 'center', padding: '32px', background: '#0B101B', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>🍽️</div>
            <p className="sub" style={{ marginBottom: 16 }}>
              Etiket fotoğrafını yükleyin
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={loading}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="btn" style={{ cursor: 'pointer' }}>
              {loading ? 'Analiz Ediliyor...' : 'Fotoğraf Seç'}
            </label>
          </div>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="card" style={{ marginBottom: 16, borderColor: '#F59E0B' }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>{scanResult.name}</h3>

          {/* Health Score */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="sub">Sağlık Skoru</span>
              <span style={{ fontWeight: 700, color: scanResult.healthScore >= 70 ? '#10B981' : scanResult.healthScore >= 50 ? '#F59E0B' : '#EF4444' }}>
                {scanResult.healthScore}/100
              </span>
            </div>
            <div style={{ background: '#0B101B', borderRadius: '12px', padding: '8px' }}>
              <div
                style={{
                  height: '24px',
                  background: scanResult.healthScore >= 70 ? '#10B981' : scanResult.healthScore >= 50 ? '#F59E0B' : '#EF4444',
                  borderRadius: '8px',
                  width: `${scanResult.healthScore}%`,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>

          {/* Macro Values */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: 16 }}>
            <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
              <div className="sub">Kalori</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{scanResult.calories} kcal</div>
            </div>
            <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
              <div className="sub">Protein</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{scanResult.protein}g</div>
            </div>
            <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
              <div className="sub">Karb</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{scanResult.carbs}g</div>
            </div>
            <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
              <div className="sub">Yağ</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{scanResult.fat}g</div>
            </div>
          </div>

          {/* Warnings */}
          {scanResult.sugar > 50 && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: 12 }}>
              <strong style={{ color: '#EF4444' }}>⚠️ Şeker Uyarısı</strong>
              <p className="sub">Bu ürün yüksek şeker içeriyor (&gt;50g)</p>
            </div>
          )}

          {scanResult.sodium > 600 && (
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', marginBottom: 12 }}>
              <strong style={{ color: '#F59E0B' }}>⚠️ Sodyum Uyarısı</strong>
              <p className="sub">Bu ürün yüksek sodyum içeriyor (&gt;600mg)</p>
            </div>
          )}

          {scanResult.allergens.length > 0 && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: 16 }}>
              <strong style={{ color: '#EF4444' }}>🚨 Alerjen Uyarısı</strong>
              <p className="sub">Bu ürün şunları içerebilir: {scanResult.allergens.join(', ')}</p>
            </div>
          )}

          <button className="btn" onClick={handleAddToLog} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Ekleniyor...' : 'Günlüğe Ekle'}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Nasıl Çalışır?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong>Barkod Tarama</strong>
            <p className="sub" style={{ marginTop: 4 }}>Ürün barkodunu tarayarak OpenFoodFacts veritabanından besin değerlerini alın.</p>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong>Fotoğraf Analizi</strong>
            <p className="sub" style={{ marginTop: 4 }}>Etiket fotoğrafını yükleyerek Gemini AI ile otomatik analiz yapın.</p>
          </div>
          <div style={{ padding: '12px', background: '#0B101B', borderRadius: '8px' }}>
            <strong>Önbellekleme</strong>
            <p className="sub" style={{ marginTop: 4 }}>Analiz edilen ürünler otomatik olarak önbelleğe alınır, daha hızlı erişim sağlar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
