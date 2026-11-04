import { Flame } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';
import { calculateBMR, calculateTDEE } from '../../utils/tdee';

export default function BMRCard() {
  const { profile = {} } = useUserData();
  const input = { weight: Number(profile.weight) > 0 ? profile.weight : 75, height: Number(profile.height) > 0 ? profile.height : 175, age: Number(profile.age) > 0 ? profile.age : 22, gender: profile.gender || 'male', activity: profile.activity || 'moderately_active' };
  const bmr = Math.max(1200, Number(calculateBMR(input)) || 1200);
  const tdee = Math.max(bmr, Number(calculateTDEE(input)) || bmr);
  return <div className="rounded-2xl border border-white/10 bg-[#161326] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-white"><Flame size={17} className="text-[#FF8A00]" />Metabolizma</div><div className="mt-4 grid grid-cols-2 gap-3"><div><div className="text-2xl font-black text-white">{Math.round(bmr)}</div><div className="text-xs text-white/45">BMR kcal</div></div><div><div className="text-2xl font-black text-[#A78BFA]">{Math.round(tdee)}</div><div className="text-xs text-white/45">TDEE kcal</div></div></div></div>;
}
