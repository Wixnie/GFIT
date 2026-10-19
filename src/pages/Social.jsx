import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Social() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('friends') // 'friends', 'messages', 'discover'
  const [searchQuery, setSearchQuery] = useState('')
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Mock data - In production, this would come from Supabase
  const mockUsers = [
    { id: 1, username: 'fit_ahmet', display_name: 'Ahmet Yılmaz', streak: 45, xp: 1200, isFollowing: false },
    { id: 2, username: 'strong_elif', display_name: 'Elif Demir', streak: 32, xp: 890, isFollowing: true },
    { id: 3, username: 'power_kaan', display_name: 'Kaan Öztürk', streak: 18, xp: 650, isFollowing: false },
  ]

  const mockMessages = [
    { id: 1, from: 'strong_elif', text: 'Selam! Seri için ortalıkta mıyız?', time: '10:30' },
    { id: 2, from: 'power_kaan', text: 'Dün antrenman harikaydı! 💪', time: 'Dün' },
  ]

  const filteredUsers = mockUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFollow = (userId) => {
    // In production, this would call Supabase
    console.log('Follow user:', userId)
  }

  const handleSendMessage = (user) => {
    setSelectedUser(user)
    setMessageModalOpen(true)
  }

  const handleShareMeal = () => {
    // WhatsApp nudge for streak
    const message = 'Kanka serimiz yanmak üzere! GFIT\'e girip suyunu veya yemeğini ekle, seriyi bozan hesabı öder: https://g-fitt.vercel.app'
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">Sosyal</p>
          <h1>Takipçiler & Mesajlar</h1>
        </div>
      </div>

      {/* Username Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>@{profile?.display_name || 'kullanici'}</h3>
            <p className="sub">Profil bilgileri</p>
          </div>
          <div className="row">
            <span className="chip" style={{ background: '#F59E0B', color: '#111', border: 'none' }}>
              {profile?.is_pro ? 'PRO ELITE 👑' : 'BRONZE'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row">
          <button
            className={`btn ${activeTab === 'friends' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('friends')}
            style={{ flex: 1 }}
          >
            Arkadaşlar
          </button>
          <button
            className={`btn ${activeTab === 'messages' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('messages')}
            style={{ flex: 1 }}
          >
            Mesajlar
          </button>
          <button
            className={`btn ${activeTab === 'discover' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('discover')}
            style={{ flex: 1 }}
          >
            Keşfet
          </button>
        </div>
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <input
              className="input"
              placeholder="@kullaniciadi ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((user) => (
              <div key={user.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>@{user.username}</strong>
                  <p className="sub">{user.display_name}</p>
                  <div className="row" style={{ marginTop: 4 }}>
                    <span className="sub">🔥 {user.streak} gün</span>
                    <span className="sub" style={{ marginLeft: 8 }}>XP: {user.xp}</span>
                  </div>
                </div>
                <div className="row">
                  <button
                    className="btn ghost"
                    onClick={() => handleSendMessage(user)}
                    style={{ fontSize: '20px' }}
                  >
                    💬
                  </button>
                  {user.isFollowing ? (
                    <button className="btn ghost" style={{ fontSize: '12px' }}>
                      Takip Ediliyor
                    </button>
                  ) : (
                    <button
                      className="btn"
                      onClick={() => handleFollow(user.id)}
                      style={{ fontSize: '12px' }}
                    >
                      Takip Et
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Duo Streak Card */}
          <div className="card" style={{ marginTop: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }}>
            <h3 style={{ margin: '0 0 8px', color: '#F59E0B' }}>⚡ Duo Streak</h3>
            <p className="sub" style={{ marginBottom: 12 }}>
              Arkadaşınla ortak seri tut! Seri tehlikedeyken WhatsApp dürtmesi gönder.
            </p>
            <button className="btn" onClick={handleShareMeal} style={{ width: '100%' }}>
              Arkadaşını Dürt
            </button>
          </div>

          {/* Invite Card */}
          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ margin: '0 0 8px' }}>3 Arkadaşını Davet Et</h3>
            <p className="sub" style={{ marginBottom: 12 }}>
              İkiniz de 7 gün ücretsiz PRO kazanın!
            </p>
            <button 
              className="btn ghost" 
              onClick={() => {
                const link = 'https://g-fitt.vercel.app?ref=' + (profile?.display_name || 'user')
                navigator.clipboard.writeText(link)
                alert('Davet linki kopyalandı!')
              }}
              style={{ width: '100%' }}
            >
              Linki Kopyala
            </button>
          </div>
        </>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockMessages.map((msg) => (
            <div key={msg.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>@{msg.from}</strong>
                <span className="sub">{msg.time}</span>
              </div>
              <p className="sub">{msg.text}</p>
            </div>
          ))}
          {mockMessages.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <p className="sub">Henüz mesaj yok</p>
            </div>
          )}
        </div>
      )}

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Öne Çıkanlar</h3>
          <p className="sub" style={{ marginBottom: 16 }}>
            En yüksek XP ve seriye sahip kullanıcılar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockUsers
              .sort((a, b) => b.xp - a.xp)
              .map((user, index) => (
                <div key={user.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
                  #{index + 1}
                </span>
                <div>
                  <strong>@{user.username}</strong>
                  <p className="sub">{user.display_name}</p>
                </div>
              </div>
                  <div className="row">
                    <span className="sub">🔥 {user.streak}</span>
                    <span className="sub" style={{ marginLeft: 8 }}>{user.xp} XP</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModalOpen && selectedUser && (
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
            <div className="card" style={{ maxWidth: 400, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>@{selectedUser.username}</h3>
                <button className="btn ghost" onClick={() => setMessageModalOpen(false)}>✕</button>
              </div>
              <div style={{ background: '#0B101B', borderRadius: '8px', padding: '16px', marginBottom: 16, minHeight: '150px' }}>
                <p className="sub">Mesaj geçmişi...</p>
              </div>
              <div className="row">
                <input className="input" style={{ flex: 1 }} placeholder="Mesaj yaz..." />
                <button className="btn">Gönder</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
