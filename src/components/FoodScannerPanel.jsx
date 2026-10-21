import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useAuth } from '../context/AuthContext'
import { addFood } from '../lib/api'
import { todayISO } from '../lib/dates'
import { X } from 'lucide-react'

export default function FoodScannerPanel({ isOpen, onClose }) {
  const { session, profile } = useAuth()
  const [scanMode, setScanMode] = useState('barcode')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [scanCount, setScanCount] = useState(0)
  const [manualBarcode, setManualBarcode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef(null)
  const [cameraError, setCameraError] = useState(null)

  useEffect(() => {
    const count = localStorage.getItem('gfitt_scan_count')
    setScanCount(count ? parseInt(count) : 0)
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [])

  const startCamera = async () => {
    setCameraError(null)
    setIsScanning(true)
    
    try {
      const html5QrCode = new Html5Qrcode("reader")
      scannerRef.current = html5QrCode
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } }
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          await handleBarcodeScan(decodedText)
          await html5QrCode.stop()
          setIsScanning(false)
        },
        (errorMessage) => {
          // Scan errors are normal, ignore
        }
      )
    } catch (err) {
      console.error('Kamera başlatma hatası:', err)
      setCameraError('Kamera izni reddedildi veya kamera bulunamadı.')
      setIsScanning(false)
    }
  }

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch (err) {
        console.error('Kamera durdurma hatası:', err)
      }
    }
    setIsScanning(false)
  }

  const handleBarcodeScan = async (decodedText) => {
    if (scanCount >= 3 && !profile?.is_pro) {
      setError('Ücretsiz kullanıcılar günde 3 barkod tarama hakkına sahiptir. Reklam izleyerek +3 hak kazanabilirsiniz.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const cached = JSON.parse(localStorage.getItem('gfitt_food_cache') || '[]')
      const cachedProduct = cached.find(item => item.barcode === decodedText)
      
      if (cachedProduct) {
        setScanResult(cachedProduct)
        return
      }

      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${decodedText}.json`)
      const data = await response.json()
      
      if (data.status === 1 && data.product) {
        const product = data.product
        const nutrition = product.nutriments || {}
        
        const scanData = {
          barcode: decodedText,
          name: product.product_name || 'Ürün',
          calories: nutrition['energy-kcal_100g'] || nutrition['energy-kcal'] || 0,
          protein: nutrition.proteins_100g || 0,
          carbs: nutrition.carbohydrates_100g || 0,
          fat: nutrition.fat_100g || 0,
          sugar: nutrition.sugars_100g || 0,
          sodium: nutrition.sodium_100g || 0,
          healthScore: nutrition.nutriscore_score ? 100 - nutrition.nutriscore_score * 10 : 70,
          allergens: product.allergens_tags || []
        }

        setScanResult(scanData)
        
        cached.push({
          ...scanData,
          cached_at: new Date().toISOString()
        })
        localStorage.setItem('gfitt_food_cache', JSON.stringify(cached))
        
        const newCount = scanCount + 1
        setScanCount(newCount)
        localStorage.setItem('gfitt_scan_count', newCount.toString())
      } else {
        setError('Ürün bulunamadı. Lütfen barkodu kontrol edin veya manuel girin.')
      }
    } catch (err) {
      console.error('Barkod taranırken hata:', err)
      setError('Barkod taranırken hata oluştu. İnternet bağlantınızı kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualBarcode = async (e) => {
    e.preventDefault()
    if (!manualBarcode.trim()) return
    await handleBarcodeScan(manualBarcode.trim())
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
      await new Promise(resolve => setTimeout(resolve, 2000))

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
      localStorage.setItem('gfitt_scan_count', newCount.toString())

      const cached = JSON.parse(localStorage.getItem('gfitt_food_cache') || '[]')
      cached.push({
        id: Date.now().toString(),
        ...mockData,
        cached_at: new Date().toISOString()
      })
      localStorage.setItem('gfitt_food_cache', JSON.stringify(cached))
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
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '450px',
          height: '100%',
          background: '#181528',
          zIndex: 101,
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
          padding: '1.5rem',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Etiket Okuyucu</h2>
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

        {error && (
          <div style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '6px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: '8px' }}>
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

        <div style={{ marginBottom: 16 }}>
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
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Barkod Tara</h3>
            
            {cameraError && (
              <div style={{ marginBottom: 16, background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', padding: '12px', borderRadius: '8px' }}>
                <p className="sub">{cameraError}</p>
              </div>
            )}

            {!isScanning ? (
              <div style={{ textAlign: 'center', padding: '32px', background: '#0B101B', borderRadius: '12px' }}>
                <div style={{ fontSize: '48px', marginBottom: 16 }}>📷</div>
                <p className="sub" style={{ marginBottom: 16 }}>
                  Kamerayı barkoda yönlendirin
                </p>
                <button className="btn" onClick={startCamera} disabled={loading}>
                  {loading ? 'Başlatılıyor...' : 'Kamerayı Aç'}
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div id="reader" style={{ width: '100%', minHeight: '300px', background: '#000', borderRadius: '12px', overflow: 'hidden' }}></div>
                <button 
                  className="btn danger" 
                  onClick={stopCamera}
                  style={{ marginTop: 16, width: '100%' }}
                >
                  Durdur
                </button>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <p className="sub" style={{ marginBottom: 8 }}>Barkod manuel girin:</p>
              <form onSubmit={handleManualBarcode} style={{ display: 'flex', gap: '8px' }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  placeholder="Örn: 8000500206784"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                />
                <button className="btn" type="submit" disabled={loading}>
                  Ara
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
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

        {scanResult && (
          <div style={{ marginBottom: 16, borderColor: '#F59E0B', borderWidth: '1px', borderStyle: 'solid', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>{scanResult.name}</h3>

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
      </div>
    </>
  )
}
