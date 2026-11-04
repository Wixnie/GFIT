import { Droplets } from 'lucide-react';
import { useMemo } from 'react';
import { useUserData } from '../../context/UserDataContext';

const buttons = [100, 200, 250, 330, 500, 750];
export default function WaterTracker({ creatineLogged = false, workoutLogged = false }) {
  const { profile = {}, water, addWater } = useUserData();
  const weight = Number(profile.weight) > 0 ? Number(profile.weight) : 75;
  const goal = Math.round(weight * 0.033 * 1000);
  const current = Math.max(0, Number(water) || 0);
  const percent = Math.min(100, (current / Math.max(goal, 1)) * 100);
  const alert = useMemo(() => creatineLogged ? '+500ml su hedefine eklendi' : workoutLogged ? '+750ml su önerilir' : '', [creatineLogged, workoutLogged]);
  return <section className="rounded-2xl border border-white/10 bg-[#161326] p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Droplets className="text-cyan-300" size={20} /><h2 className="font-bold text-white">Su Takibi</h2></div><span className="text-sm text-white/55">{current} / {goal} ml</span></div><div className="mt-5 h-4 overflow-hidden rounded-full bg-[#2A2438]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-xs text-white/45">Günlük hedef: kilo × 0.033 L</p>{alert && <p className="mt-3 rounded-xl bg-cyan-500/10 p-3 text-xs text-cyan-200">💧 {alert}</p>}<div className="mt-5 grid grid-cols-3 gap-2">{buttons.map((amount) => <button type="button" key={amount} onClick={() => addWater(amount)} className="rounded-xl bg-white/5 py-2 text-xs font-semibold text-white/70 hover:bg-cyan-500/15 hover:text-cyan-200">+{amount} ml</button>)}</div></section>;
}
