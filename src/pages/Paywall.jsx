import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Paywall() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleRestorePurchases() {
    setLoading(true)
    setMessage(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setMessage('Satın alımlarınız kontrol edildi. Aktif abonelikleriniz yenilendi.')
    } catch (err) {
      console.error('Hata:', err)
      setMessage('Satın alımlar kontrol edilirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="chip" style={{ color: '#F59E0B', borderColor: '#F59E0B', display: 'inline-block', marginBottom: '12px' }}>
          GFIT PRO
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', margin: '0 0 8px' }}>
          Potansiyelini Açığa Çıkar
        </h1>
        <p className="sub" style={{ fontSize: '15px' }}>
          Yapay zeka analizleri ve sınırsız besin kütüphanesi ile hedeflerine iki kat hızlı ulaş.
        </p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'stretch', marginBottom: '24px' }}>
        {/* Aylık Plan */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>Aylık Plan</h3>
            <p className="sub" style={{ marginBottom: '18px' }}>Esnek ve dilediğin zaman iptal et</p>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', marginBottom: '18px' }}>
              ₺149 <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400 }}>/ ay</span>
            </div>
            <ul style={{ color: 'var(--muted)', lineHeight: '2', paddingLeft: '18px', margin: '0 0 24px' }}>
              <li>Sınırsız Barkod & Besin Tarama</li>
              <li>Yapay Zeka Destekli Öğün Analizi</li>
              <li>Kişiselleştirilmiş Antrenman Programı</li>
            </ul>
          </div>
          <button className="btn ghost" style={{ width: '100%' }}>Aylık Başla</button>
        </div>

        {/* Yıllık Pro Plan */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid #F59E0B', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '18px', background: '#F59E0B', color: '#111', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '99px' }}>
            %45 İNDİRİM
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', color: '#F59E0B' }}>Yıllık Pro</h3>
            <p className="sub" style={{ marginBottom: '18px' }}>En popüler seçim, tam erişim</p>
            <div style={{ fontSize: '30px', fontWeight: 800, color: '#F59E0B', marginBottom: '18px' }}>
              ₺500 <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400, textDecoration: 'line-through' }}>₺720</span> / yıl
            </div>
            <p className="sub" style={{ marginBottom: '18px', color: '#F59E0B' }}>≈₺9,60/hafta</p>
            <ul style={{ color: 'var(--text)', lineHeight: '2', paddingLeft: '18px', margin: '0 0 24px' }}>
              <li>Tüm Aylık Plan Özellikleri</li>
              <li>Öncelikli Gemini 1.5 Flash Erişimi</li>
              <li>Akıllı Supplement Stack Önerileri</li>
              <li>Öncelikli Müşteri Desteği</li>
              <li>1 Hafta Ücretsiz Deneme</li>
            </ul>
          </div>
          <button className="btn" style={{ width: '100%' }}>Yıllık Avantajı Seç</button>
        </div>
      </div>

      {/* Diyetisyen Karşılaştırma Tablosu */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', textAlign: 'center' }}>Diyetisyen Fiyat Karşılaştırması</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#0B101B', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#94A3B8' }}>Diyetisyen</h4>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#94A3B8', marginBottom: '8px' }}>₺2,500 - ₺5,000</p>
            <p className="sub">/ ay</p>
            <ul style={{ color: '#64748B', fontSize: '13px', marginTop: '12px', paddingLeft: '18px' }}>
              <li>Haftalık takip</li>
              <li>Sınırlı iletişim</li>
              <li>Sabit program</li>
            </ul>
          </div>
          <div style={{ padding: '16px', background: '#F59E0B', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#111' }}>GFIT PRO</h4>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>₺1,3</p>
            <p className="sub" style={{ color: '#111' }}>/ gün</p>
            <ul style={{ color: '#111', fontSize: '13px', marginTop: '12px', paddingLeft: '18px' }}>
              <li>7/24 AI destek</li>
              <li>Sınırsız özellikler</li>
              <li>Kişiselleştirilmiş program</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Duo PRO */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px' }}>Duo PRO - Çift Üyelik</h3>
        <p className="sub" style={{ marginBottom: '16px' }}>Partnerinizle birlikte GFIT PRO kullanın</p>
        <button className="btn ghost" style={{ width: '100%' }}>Duo PRO Başla - ₺750/yıl</button>
      </div>

      {/* VIP Koçluk */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px' }}>VIP Koçluk</h3>
        <p className="sub" style={{ marginBottom: '16px' }}>Birebir WhatsApp koçluk desteği</p>
        <a 
          href="https://wa.me/905555555555" 
          rel="noopener noreferrer" 
          target="_blank"
          className="btn" 
          style={{ display: 'inline-block', textDecoration: 'none', background: '#25D366' }}
        >
          WhatsApp ile Başvur
        </a>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '18px' }}>
        <button 
          className="btn ghost" 
          onClick={handleRestorePurchases}
          disabled={loading}
          style={{ fontSize: '13px', padding: '8px 18px' }}
        >
          {loading ? 'Kontrol Ediliyor...' : 'Satın Alımları Geri Yükle'}
        </button>
        {message && (
          <p style={{ marginTop: '12px', color: '#F59E0B', fontSize: '13px' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}