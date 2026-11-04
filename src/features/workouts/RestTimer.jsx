import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const playBell = () => { try { const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 880; gain.gain.value = 0.18; oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.25); } catch { /* Audio is optional. */ } };

export default function RestTimer({ initialSeconds = 60, onClose }) {
  const [seconds, setSeconds] = useState(initialSeconds); const [running, setRunning] = useState(true); const finished = useRef(false);
  useEffect(() => { if (!running || seconds <= 0) return undefined; const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [running, seconds]);
  useEffect(() => { if (seconds === 0 && !finished.current) { finished.current = true; setRunning(false); playBell(); } }, [seconds]);
  const reset = (value = initialSeconds) => { finished.current = false; setSeconds(value); setRunning(true); };
  return <div className="fixed bottom-5 right-5 z-50 w-72 rounded-2xl border border-white/10 bg-[#161326]/95 p-4 shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-white/60">Dinlenme</span><button type="button" onClick={onClose} className="text-xs text-white/40">Kapat</button></div><div className="my-4 text-center text-5xl font-black tabular-nums text-white">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div><div className="mb-4 flex justify-center gap-2">{[60, 90, 120].map((value) => <button type="button" key={value} onClick={() => reset(value)} className={`rounded-lg px-2 py-1 text-xs ${Math.ceil(seconds) === value ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-white/55'}`}>{value}s</button>)}</div><div className="flex justify-center gap-2"><button type="button" onClick={() => setRunning((value) => !value)} className="rounded-xl bg-[#7C3AED] p-3 text-white">{running ? <Pause size={18} /> : <Play size={18} />}</button><button type="button" onClick={() => reset()} className="rounded-xl bg-white/10 p-3 text-white/70"><RotateCcw size={18} /></button></div></div>;
}
