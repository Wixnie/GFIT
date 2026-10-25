import { useState, useEffect } from 'react'
import { Download, Smartphone, Apple as AppleIcon, Globe } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if iOS to show install button in drawer
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (isIOS) {
      setShowInstallButton(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS or manual install
      setShowIOSGuide(true)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  if (!showInstallButton) return null

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#181528] hover:bg-[#221D3B] text-white border border-white/10 text-xs font-semibold transition-all"
      >
        <Download className="w-4 h-4 text-[#FF8A00]" />
        <span>Ana Ekrana Ekle</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181528] border border-white/10 rounded-3xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Ana Ekrana Ekle</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#0B101B] rounded-xl">
                <AppleIcon className="w-8 h-8 text-white" />
                <div>
                  <p className="text-sm font-semibold text-white">iOS Safari</p>
                  <p className="text-xs text-slate-400">iPhone / iPad</p>
                </div>
              </div>

              <ol className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="font-bold text-[#FF8A00]">1.</span>
                  <span>Alttaki Paylaş (⬆️) butonuna bas</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#FF8A00]">2.</span>
                  <span>"Ana Ekrana Ekle (➕)" seçeneğine dokun</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#FF8A00]">3.</span>
                  <span>Ekle'ye bas</span>
                </li>
              </ol>

              <div className="flex items-center gap-3 p-3 bg-[#0B101B] rounded-xl">
                <Globe className="w-8 h-8 text-white" />
                <div>
                  <p className="text-sm font-semibold text-white">Android Chrome</p>
                  <p className="text-xs text-slate-400">Chrome tarayıcısı</p>
                </div>
              </div>

              <ol className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="font-bold text-[#FF8A00]">1.</span>
                  <span>Üstteki "Ana Ekrana Ekle" ikonuna tıkla</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#FF8A00]">2.</span>
                  <span>Yükle'ye bas</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold text-sm"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  )
}
