import { useState, useEffect } from 'react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    )

    // Check if iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)

    // Listen for beforeinstallprompt (Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Show iOS prompt after delay if not standalone
    if (isIOS && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isIOS, isStandalone])

  if (isStandalone || !showPrompt) return null

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('PWA installed')
      }
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Store that user dismissed to not show again
    localStorage.setItem('gfitt_pwa_dismissed', Date.now().toString())
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '5rem',
      left: '1rem',
      right: '1rem',
      background: 'rgba(24, 21, 40, 0.95)',
      backdropFilter: 'blur(1rem)',
      border: '1px solid rgba(255, 138, 0, 0.3)',
      borderRadius: '1rem',
      padding: '1rem',
      zIndex: 100,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '32px' }}>📱</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px', color: '#FF8A00' }}>Ana Ekrana Ekle</h4>
          {isIOS ? (
            <p className="sub" style={{ margin: 0, fontSize: '12px' }}>
              Safari paylaşım menüsünden "Ana Ekrana Ekle"yi seçin
            </p>
          ) : (
            <p className="sub" style={{ margin: 0, fontSize: '12px' }}>
              GFitt'i uygulama olarak yükleyin
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn ghost"
            onClick={handleDismiss}
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
          >
            Sonra
          </button>
          {deferredPrompt && (
            <button
              className="btn"
              onClick={handleInstall}
              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
            >
              Yükle
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
