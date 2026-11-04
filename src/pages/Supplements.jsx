import { useState } from 'react';
import { Star } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import Checklist from '../features/supplements/Checklist';
import Store from '../features/supplements/Store';

const recommendations = { muscle: [['Whey Protein', 4.8], ['Kreatin Monohidrat', 4.9], ['Omega-3', 4.7]], fatLoss: [['Protein Tozu', 4.7], ['L-Karnitin', 4.4], ['Omega-3', 4.8]], energy: [['B12 Vitamini', 4.8], ['Magnezyum', 4.9], ['D Vitamini', 4.8]] };

export default function Supplements() {
  const { addWater } = useUserData(); const [goal, setGoal] = useState('muscle'); const [waterAlert, setWaterAlert] = useState(false); const list = recommendations[goal];
  const alertWater = (amount) => { addWater(amount); setWaterAlert(true); window.setTimeout(() => setWaterAlert(false), 3500); };
  return <div className="mx-auto max-w-7xl space-y-6 p-4 pb-24 pt-20 md:ml-64 md:p-8 md:pt-24"><div><p className="text-sm text-white/50">Günlük rutinini düzenle</p><h1 className="mt-1 text-3xl font-black text-white">Takviyeler</h1></div><section className="rounded-2xl border border-white/10 bg-[#161326] p-5"><h2 className="font-bold text-white">Hedefine göre öneriler</h2><div className="mt-4 flex gap-2"><button type="button" onClick={() => setGoal('muscle')} className={`rounded-full px-4 py-2 text-xs ${goal === 'muscle' ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-white/55'}`}>Kas</button><button type="button" onClick={() => setGoal('fatLoss')} className={`rounded-full px-4 py-2 text-xs ${goal === 'fatLoss' ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-white/55'}`}>Yağ Yakımı</button><button type="button" onClick={() => setGoal('energy')} className={`rounded-full px-4 py-2 text-xs ${goal === 'energy' ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-white/55'}`}>Enerji</button></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{list.map(([name, rating]) => <div key={name} className="rounded-xl bg-white/5 p-4"><h3 className="text-sm font-semibold text-white">{name}</h3><div className="mt-2 flex items-center gap-1 text-xs text-[#FFB454]"><Star size={13} fill="currentColor" />{rating} / 5</div></div>)}</div></section><section className="rounded-2xl border border-white/10 bg-[#161326] p-5"><h2 className="mb-4 text-lg font-bold text-white">Günlük kontrol listesi</h2><Checklist onWaterAlert={alertWater} /></section><Store />{waterAlert && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950">💧 +500 ml su eklendi</div>}</div>;
}
