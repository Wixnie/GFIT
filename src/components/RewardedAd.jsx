import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function RewardedAd({ onReward, rewardType = 'scan' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setCountdown(5)
    setRewardClaimed(false)
  }

  useEffect(() => {
    let interval
    if (isOpen && countdown > 0 && !rewardClaimed) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0 && !rewardClaimed) {
      setRewardClaimed(true)
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    return () => clearInterval(interval)
  }, [isOpen, countdown, rewardClaimed])

  const handleClaimReward = () => {
    if (onReward) {
      onReward(rewardType)
    }
    setIsOpen(false)
  }

  return (
    <>
      <button className="btn ghost" onClick={handleOpen} style={{ fontSize: '13px' }}>
        🎺 Reklam İzle +Ödül
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Reklam İzleniyor</h3>

            {!rewardClaimed ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '4px solid #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '24px auto',
                  fontSize: '32px',
                  fontWeight: 700
                }}>
                  {countdown}
                </div>
                <p className="sub">
                  Lütfen bekleyin, reklam tamamlanıyor...
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: '#10B981', marginBottom: 8 }}>Ödül Kazandın!</h3>
                <p className="sub" style={{ marginBottom: 24 }}>
                  {rewardType === 'scan' ? '+3 Barkod Tarama Hakkı' : '+1 AI Soru Hakkı'}
                </p>
                <button className="btn" onClick={handleClaimReward} style={{ width: '100%' }}>
                  Ödülü Al
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
