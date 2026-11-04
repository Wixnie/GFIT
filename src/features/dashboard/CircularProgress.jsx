export default function CircularProgress({ value = 0, target = 1, color = '#7C3AED', size = 150, strokeWidth = 12 }) {
  const safeValue = Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0;
  const safeTarget = Number.isFinite(Number(target)) && Number(target) > 0 ? Number(target) : 1;
  const percent = Math.min(100, Math.max(0, (safeValue / safeTarget) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);
  return <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={`${safeValue} / ${safeTarget} kcal`}><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2A2438" strokeWidth={strokeWidth} /><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={percent === 0 ? '#2A2438' : color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} /></svg><div className="absolute text-center"><div className="text-2xl font-black text-white">{Math.round(safeValue)}</div><div className="text-xs text-white/45">/ {Math.round(safeTarget)} kcal</div></div></div>;
}
