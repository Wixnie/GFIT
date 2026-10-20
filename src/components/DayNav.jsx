import { formatDay, shiftDay } from '../lib/dates'
import { isToday } from 'date-fns'

export default function DayNav({ date, onChange }) {
  const showTodayBadge = !isToday(date)

  return (
    <div className="row">
      <button className="btn ghost" onClick={() => onChange(shiftDay(date, -1))} aria-label="Önceki gün">‹</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <strong>{formatDay(date)}</strong>
        {showTodayBadge && (
          <button
            className="btn ghost"
            onClick={() => onChange(new Date())}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            Bugün
          </button>
        )}
      </div>
      <button className="btn ghost" onClick={() => onChange(shiftDay(date, 1))} aria-label="Sonraki gün">›</button>
    </div>
  )
}
