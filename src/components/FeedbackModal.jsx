import { useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function FeedbackModal({ isOpen, onClose }) {
  const [category, setCategory] = useState('bug')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Lutfen mesajinizi girin.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('feedback')
          .insert({
            category,
            message,
            created_at: new Date().toISOString()
          })
        
        if (error) throw error
      } else {
        // Fallback to localStorage for demo mode
        const feedbacks = JSON.parse(localStorage.getItem('gfit_feedback') || '[]')
        feedbacks.push({
          category,
          message,
          created_at: new Date().toISOString()
        })
        localStorage.setItem('gfit_feedback', JSON.stringify(feedbacks))
      }

      setSuccess(true)
      setMessage('')
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Feedback error:', err)
      setError('Bildirim gonderilirken hata olustu.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16
      }}>
        <div className="card" style={{ maxWidth: 500, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Geri Bildirim</h3>
            <button className="btn ghost" onClick={onClose}>✕</button>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: 16 }}>✅</div>
              <h4 style={{ margin: '0 0 8px', color: '#10B981' }}>Teşekkürler!</h4>
              <p className="sub">Bildiriminiz alındı.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Kategori</label>
                <select
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="bug">🐛 Hata Bildirimi</option>
                  <option value="feature">💡 Özellik İsteği</option>
                  <option value="suggestion">✨ Genel Öneri</option>
                </select>
              </div>

              <div className="field">
                <label>Mesajınız</label>
                <textarea
                  className="input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Lutfen detaylı bir sekilde aciklayin..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {error && (
                <div style={{ marginBottom: 12, padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', color: '#EF4444', fontSize: '12px' }}>
                  {error}
                </div>
              )}

              <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Gonderiliyor...' : 'Gonder'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
