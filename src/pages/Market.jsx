import { useState } from 'react'

const affiliateProducts = [
  {
    id: 'hiq-whey-2kg',
    name: 'HIQ Whey Protein 2kg',
    brand: 'HIQ Nutrition',
    price: 899,
    originalPrice: 1200,
    image: '🥛',
    rating: 4.8,
    reviews: 234,
    discountCode: 'GFIT10',
    category: 'protein',
    description: 'Yüksek kaliteli whey protein izolat ve konsantre karışımı. Hızlı emilim ve sindirim.'
  },
  {
    id: 'bigjoy-creatine',
    name: 'Bigjoy Creatine Monohydrate 500g',
    brand: 'Bigjoy',
    price: 299,
    originalPrice: 350,
    image: '💪',
    rating: 4.9,
    reviews: 567,
    discountCode: 'GFIT10',
    category: 'creatine',
    description: 'Saf kreatin monohidrat. Güç ve performans artışı için ideal.'
  },
  {
    id: 'ocean-magnesium',
    name: 'Ocean Magnesium Bisglycinate 120 kapsül',
    brand: 'Ocean',
    price: 199,
    originalPrice: 250,
    image: '💊',
    rating: 4.7,
    reviews: 189,
    discountCode: 'GFIT10',
    category: 'minerals',
    description: 'Yüksek biyoyararlanım oranlı magnezyum. Kas gevşemesi ve uyku kalitesi için.'
  },
  {
    id: 'omega-3-1000',
    name: 'Omega-3 Fish Oil 1000mg 180 kapsül',
    brand: 'Various',
    price: 249,
    originalPrice: 300,
    image: '🐟',
    rating: 4.6,
    reviews: 423,
    discountCode: 'GFIT10',
    category: 'omega',
    description: 'Yüksek EPA/DHA içeriği. Kalp ve beyin sağlığı için essansiyel yağ asitleri.'
  },
  {
    id: 'vitamin-d3',
    name: 'Vitamin D3 5000IU 120 kapsül',
    brand: 'Various',
    price: 149,
    originalPrice: 180,
    image: '☀️',
    rating: 4.8,
    reviews: 312,
    discountCode: 'GFIT10',
    category: 'vitamins',
    description: 'Yüksek doz D3 vitamini. Bağışıklık sistemi ve kemik sağlığı için.'
  },
  {
    id: 'zma-complex',
    name: 'ZMA Complex 90 kapsül',
    brand: 'Various',
    price: 179,
    originalPrice: 220,
    image: '🌙',
    rating: 4.5,
    reviews: 156,
    discountCode: 'GFIT10',
    category: 'recovery',
    description: 'Çinko, magnezyum ve B6 vitamini kompleksi. İyileşme ve uyku kalitesi için.'
  }
]

export default function Market() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showRecipeBook, setShowRecipeBook] = useState(false)

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'protein', name: 'Protein' },
    { id: 'creatine', name: 'Kreatin' },
    { id: 'minerals', name: 'Mineraller' },
    { id: 'omega', name: 'Omega' },
    { id: 'vitamins', name: 'Vitaminler' },
    { id: 'recovery', name: 'İyileşme' }
  ]

  const filteredProducts = selectedCategory === 'all'
    ? affiliateProducts
    : affiliateProducts.filter(p => p.category === selectedCategory)

  return (
    <div className="app-container">
      <div className="page-head">
        <div>
          <p className="sub">GFIT Onaylı Ürünler</p>
          <h1>Pazar Yeri</h1>
        </div>
      </div>

      {/* Recipe Book Promo */}
      <div className="card" style={{ marginBottom: 16, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 8px', color: '#F59E0B' }}>📖 Fit Tarifler Kitabı</h3>
            <p className="sub">50+ sağlıklı tarif, makro hesaplamaları ve alışveriş listeleri</p>
          </div>
          <button className="btn" onClick={() => setShowRecipeBook(true)}>
            ₺99 Satın Al
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? '#F59E0B' : '#1E293B',
                color: selectedCategory === cat.id ? '#111' : '#94A3B8',
                border: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-3" style={{ gap: '16px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="card" style={{ position: 'relative' }}>
            {/* GFIT Approved Badge */}
            <div style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: '#F59E0B',
              color: '#111',
              fontSize: '10px',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              GFIT ONAYLI
            </div>

            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: 16 }}>
              {product.image}
            </div>

            <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{product.name}</h3>
            <p className="sub" style={{ marginBottom: 8 }}>{product.brand}</p>
            <p className="sub" style={{ marginBottom: 12, fontSize: '13px' }}>{product.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', fontSize: '14px', color: '#F59E0B' }}>
                {'★'.repeat(Math.floor(product.rating))}
                <span style={{ color: '#64748B', marginLeft: 4 }}>
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B' }}>
                  ₺{product.price}
                </span>
                <span style={{ fontSize: '14px', color: '#64748B', textDecoration: 'line-through', marginLeft: 8 }}>
                  ₺{product.originalPrice}
                </span>
              </div>
              <div className="chip" style={{ background: '#10B981', color: '#111', border: 'none' }}>
                %{Math.round((1 - product.price / product.originalPrice) * 100)} İNDİRİM
              </div>
            </div>

            <div style={{ padding: '8px', background: '#0B101B', borderRadius: '8px', marginBottom: 12 }}>
              <p className="sub" style={{ margin: 0, fontSize: '12px' }}>
                İndirim Kodu: <strong style={{ color: '#F59E0B' }}>{product.discountCode}</strong>
              </p>
            </div>

            <button className="btn" style={{ width: '100%' }}>
              Satın Al
            </button>
          </div>
        ))}
      </div>

      {/* Recipe Book Modal */}
      {showRecipeBook && (
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
          <div className="card" style={{ maxWidth: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Fit Tarifler Kitabı</h3>
              <button className="btn ghost" onClick={() => setShowRecipeBook(false)}>✕</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '64px', marginBottom: 16 }}>📖</div>
              <h2 style={{ color: '#F59E0B', marginBottom: 8 }}>₺99</h2>
              <p className="sub">Tek seferlik ödeme</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 12 }}>İçerik:</h4>
              <ul style={{ color: '#94A3B8', lineHeight: 2, paddingLeft: '18px' }}>
                <li>50+ sağlıklı tarif</li>
                <li>Makro hesaplamaları</li>
                <li>Alışveriş listeleri</li>
                <li>Adım adım tarifler</li>
                <li>Fotoğraflı anlatım</li>
                <li>Vegan ve gluten-free seçenekler</li>
              </ul>
            </div>

            <button className="btn" style={{ width: '100%', marginBottom: 12 }}>
              Satın Al
            </button>
            <button className="btn ghost" onClick={() => setShowRecipeBook(false)} style={{ width: '100%' }}>
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
