function pct(used, target) {
  if (!target) return 0
  return Math.min(100, Math.round((used / target) * 100))
}

export default function MacroBars({ totals, profile }) {
  const items = [
    { key: 'k', label: 'Kalori', used: totals.calories, target: profile.calorie_target, unit: 'kcal' },
    { key: 'p', label: 'Protein', used: totals.protein, target: profile.protein_target, unit: 'g' },
    { key: 'c', label: 'Karb', used: totals.carbs, target: profile.carb_target, unit: 'g' },
    { key: 'f', label: 'Yağ', used: totals.fat, target: profile.fat_target, unit: 'g' },
  ]
  return (
    <div className="macro-row">
      {items.map((m) => (
        <div className="macro" key={m.key}>
          <div className="macro-top">
            <span>{m.label}</span>
            <span>
              {Math.round(m.used)} / {m.target} {m.unit}
            </span>
          </div>
          <div className={`bar ${m.key}`}>
            <i style={{ width: `${pct(m.used, m.target)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
