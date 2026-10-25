import { useState, useEffect } from 'react'
import { Play, Crown, Zap } from 'lucide-react'

export default function RewardedAd({ onUnlock, featureName }) {
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [adWatched, setAdWatched] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const dailyLimit = 3
  const watchedToday = parseInt(localStorage.getItem(`gfitt_ad_count_${today}`) || '0')

  const canWatchAd = watchedToday < dailyLimit

  const handleWatchAd = () => {
    if (!canWatchAd) return
    setShowModal(true)
    setCountdown(5)
    setAdWatched(false)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setAdWatched(true)
          const newCount = watchedToday + 1
          localStorage.setItem(`gfitt_ad_count_${today}`, newCount.toString())
          setTimeout(() => {
            onUnlock?.()
            setShowModal(false)
          }, 1000)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF8A00] text-slate-950 font-bold text-xs transition-all hover:scale-105 active:scale-95"
      >
        <Play className="w-4 h-4" />
        <span>� Reklam İzle (+1 Hak)</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181528] border border-white/10 rounded-3xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Özellik Kilidi Aç</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!adWatched && countdown > 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl font-black text-[#FF8A00] mb-4">{countdown}</div>
                <p className="text-sm text-slate-400">Reklam izleniyor...</p>
              </div>
            ) : adWatched ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-sm font-bold text-green-400 mb-2">Reklam tamamlandı!</p>
                <p className="text-xs text-slate-400">Erişim açıldı ve +25 XP kazandın.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleWatchAd}
                  disabled={!canWatchAd}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    canWatchAd
                      ? 'bg-[#FF8A00] text-slate-950 hover:scale-105'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  🎬 Kısa Reklam İzle (+1 Hak & +25 XP)
                </button>
                <p className="text-xs text-center text-slate-400">
                  Günlük Kalan: {dailyLimit - watchedToday}/{dailyLimit}
                </p>

                <div className="border-t border-white/10 pt-3 mt-3">
                  <button
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold text-sm hover:scale-105 transition-all"
                    onClick={() => {
                      setShowModal(false)
                      window.location.href = '/premium'
                    }}
                  >
                    👑 GFitt PRO'ya Geç (3 Gün Ücretsiz Dene)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
