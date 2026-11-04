import { Footprints, Moon, Plus, Droplets, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import CircularProgress from '../features/dashboard/CircularProgress';
import MacroBars from '../features/dashboard/MacroBars';
import MealList from '../features/dashboard/MealList';
import TipCard from '../features/dashboard/TipCard';
import BMRCard from '../features/dashboard/BMRCard';
import AICoachMessage from '../features/dashboard/AICoachMessage';
import { useUserData } from '../context/UserDataContext';

const kcalOf = (meal) => (Number(meal.kcal_per_100g) || 0) * (Number(meal.grams || meal.default_grams || 100) / 100);
const proteinOf = (meal) => (Number(meal.protein) || 0) * (Number(meal.grams || meal.default_grams || 100) / 100);
const macrosOf = (meals) => meals.reduce(
  (total, meal) => ({
    protein: total.protein + proteinOf(meal),
    carbs: total.carbs + (Number(meal.carbs) || 0) * (Number(meal.grams || meal.default_grams || 100) / 100),
    fat: total.fat + (Number(meal.fat) || 0) * (Number(meal.grams || meal.default_grams || 100) / 100),
    fiber: total.fiber + (Number(meal.fiber) || 0) * (Number(meal.grams || meal.default_grams || 100) / 100),
  }),
  { protein: 0, carbs: 0, fat: 0, fiber: 0 },
);

export default function Dashboard() {
  const { profile = {}, todayFoodLogs, water, steps, sleep, streak, removeFoodLog } = useUserData();
  const meals = todayFoodLogs || [];
  const logged = macrosOf(meals);
  const calories = Math.round(meals.reduce((total, meal) => total + kcalOf(meal), 0));
  const targetCalories = Math.max(1200, Number(profile.tdee || profile.calorieTarget) || 2000);
  const weight = Math.max(1, Number(profile.weight) || 75);
  const proteinTarget = Math.round(weight * 1.8);
  const proteinProgress = Math.min(100, Math.max(0, (logged.protein / proteinTarget) * 100));
  const summary = [
    { label: 'Su', value: `${Math.round(Number(water) || 0)} ml`, icon: Droplets, to: '/food', color: 'text-cyan-300' },
    { label: 'Adım', value: `${Math.round(Number(steps) || 0)}`, icon: Footprints, to: '/progress', color: 'text-emerald-300' },
    { label: 'Uyku', value: `${Number(sleep) || 0} saat`, icon: Moon, to: '/progress', color: 'text-indigo-300' },
    { label: 'Kalori', value: `${calories} kcal`, icon: Flame, to: '/food', color: 'text-orange-300' },
  ];
  return <div className="mx-auto max-w-7xl p-4 pt-20 md:ml-64 md:p-8 md:pt-24"><div className="mb-6 flex items-end justify-between"><div><p className="text-sm text-white/50">Günaydın{profile.name ? `, ${profile.name}` : ''} 👋</p><h1 className="mt-1 text-3xl font-black text-white">Bugünkü özetin</h1></div><div className="text-right text-xs text-white/45">🔥 {streak} gün seri</div></div><div className="mb-5 rounded-2xl border border-[#7C3AED]/20 bg-[#161326] p-5"><div className="flex flex-col items-center gap-5 sm:flex-row"><CircularProgress value={calories} target={targetCalories} color="#7C3AED" /><div className="flex-1"><p className="text-sm text-white/50">Günlük enerji</p><h2 className="mt-1 text-2xl font-bold text-white">{calories} / {targetCalories} kcal</h2><p className="mt-2 text-xs text-white/45">Hedefine dengeli adımlarla ilerle.</p></div></div></div><div className="mb-5 grid grid-cols-2 gap-3">{summary.map(({ label, value, icon: Icon, to, color }) => <Link key={label} to={to} className="rounded-2xl border border-white/10 bg-[#161326] p-4 transition hover:border-white/20"><Icon size={19} className={color} /><div className="mt-3 text-sm font-bold text-white">{value}</div><div className="mt-1 text-xs text-white/45">{label}</div></Link>)}</div><div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-white/10 bg-[#161326] p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-white">Makrolar</h2><Link to="/food" className="text-xs text-[#A78BFA]">Detaylar</Link></div><MacroBars macros={logged} targets={{ protein: proteinTarget, carbs: 250, fat: 70, fiber: 30 }} /></section><BMRCard /></div><section className="mt-5 rounded-2xl border border-white/10 bg-[#161326] p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-white">Protein hedefi</h2><p className="mt-1 text-xs text-white/45">Bilimsel aralık: 1.6–2.2 g/kg</p></div><span className="text-sm font-semibold text-emerald-300">{Math.round(logged.protein)} / {proteinTarget} g</span></div><div className="h-3 overflow-hidden rounded-full bg-[#2A2438]"><div className="h-full rounded-full bg-[#22C55E]" style={{ width: `${proteinProgress}%` }} /></div>{logged.protein === 0 && <p className="mt-3 text-xs text-white/45">Henüz protein girilmedi</p>}</section><div className="mt-5"><AICoachMessage calories={calories} targetCalories={targetCalories} protein={logged.protein} targetProtein={proteinTarget} /></div><div className="mt-5 rounded-2xl border border-[#FF8A00]/20 bg-[#FF8A00]/10 p-4"><div className="flex items-center gap-3"><span className="text-2xl">⏰</span><div className="flex-1"><h2 className="text-sm font-bold text-white">Bir öğün eklemeyi unutma</h2><p className="mt-1 text-xs text-white/55">Öğünlerini kaydetmek hedeflerini daha doğru takip etmeni sağlar.</p></div><Link to="/food" className="rounded-xl bg-[#FF8A00] px-3 py-2 text-xs font-bold text-slate-950">Ekle</Link></div></div><section className="mt-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-white">Bugünün öğünleri</h2><Link to="/food" className="flex items-center gap-1 text-xs text-[#A78BFA]"><Plus size={14} />Ekle</Link></div><MealList meals={meals} onDelete={removeFoodLog} /></section><div className="mt-5 grid gap-5 lg:grid-cols-2"><TipCard /><div className="rounded-2xl border border-white/10 bg-[#161326] p-5"><h2 className="font-bold text-white">Pazartesi özeti</h2><p className="mt-2 text-sm text-white/55">Haftaya {streak > 0 ? `${streak} günlük serinle` : 'küçük bir adımla'} başladın. Bugünkü kayıtlarını tamamla ve trendini takip et.</p><Link to="/progress" className="mt-4 inline-block text-xs font-semibold text-[#A78BFA]">İlerlemeyi gör →</Link></div></div></div>;
}
