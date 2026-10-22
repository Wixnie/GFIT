function pct(used, target) {
  if (!target || target === 0) return 0
  return Math.min(100, Math.round((used / target) * 100))
}

export default function MacroBars({ totals, profile }) {
  const items = [
    { key: 'k', label: 'Kalori', used: totals.calories || 0, target: profile.calorie_target || 2400, unit: 'kcal' },
    { key: 'p', label: 'Protein', used: totals.protein || 0, target: profile.protein_target || 150, unit: 'g' },
    { key: 'c', label: 'Karb', used: totals.carbs || 0, target: profile.carb_target || 250, unit: 'g' },
    { key: 'f', label: 'Yağ', used: totals.fat || 0, target: profile.fat_target || 65, unit: 'g' },
  ]
  return (
    <div className="macro-row">
      {items.map((m) => {
        const delta = m.target - m.used
        const deltaText = delta > 0 ? `Kalan: ${Math.round(delta)} ${m.unit}` : `+${Math.round(Math.abs(delta))} ${m.unit} fazla`
        const fillPercent = pct(m.used, m.target)
        return (
          <div className="macro" key={m.key}>
            <div className="macro-top">
              <span>{m.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {Math.round(m.used)} / {m.target} {m.unit}
              </span>
            </div>
            <div className={`bar ${m.key}`} style={{ overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <i style={{ width: `${fillPercent}%` }} />
            </div>
            <div className="macro-delta" style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
              {deltaText}
            </div>
          </div>
        )
      })}
    </div>
  )
}
