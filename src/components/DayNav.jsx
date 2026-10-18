import { formatDay, shiftDay } from '../lib/dates'

export default function DayNav({ date, onChange }) {
  return (
    <div className="row">
      <button className="btn ghost" onClick={() => onChange(shiftDay(date, -1))}>‹</button>
      <strong>{formatDay(date)}</strong>
      <button className="btn ghost" onClick={() => onChange(shiftDay(date, 1))}>›</button>
    </div>
  )
}
