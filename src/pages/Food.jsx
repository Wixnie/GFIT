import { useState } from 'react';
import { Utensils } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import GuestGuard from '../features/auth/GuestGuard';
import FoodLogger from '../features/food/FoodLogger';
import QuickAddPanel from '../features/food/QuickAddPanel';
import VoiceAI from '../features/food/VoiceAI';
import BarcodeScanner from '../features/food/BarcodeScanner';
import AIPhotoAnalysis from '../features/food/AIPhotoAnalysis';
import LoggedModal from '../features/food/LoggedModal';
import foods from '../utils/foods';

export default function Food() {
  const { todayFoodLogs } = useUserData();
  const [panel, setPanel] = useState(null);
  return <div className="mx-auto max-w-7xl p-4 pb-24 pt-20 md:ml-64 md:p-8 md:pt-24"><div className="mb-6 flex items-center gap-3"><div className="rounded-2xl bg-[#7C3AED]/15 p-3 text-[#C4B5FD]"><Utensils /></div><div><p className="text-sm text-white/50">Bugün {todayFoodLogs?.length || 0} kayıt</p><h1 className="text-3xl font-black text-white">Beslenme</h1></div></div><GuestGuard action={() => setPanel('manual')}><button type="button" className="mb-5 w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] py-4 font-bold text-white">+ Öğün ekle</button></GuestGuard><QuickAddPanel onSelect={setPanel} /><div className="mt-6"><FoodLogger onOpenQuickAdd={() => setPanel('manual')} /></div>{panel === 'manual' && <ManualAdd onClose={() => setPanel(null)} />}{panel === 'voice' && <VoiceAI onClose={() => setPanel(null)} />}{panel === 'barcode' && <BarcodeScanner onClose={() => setPanel(null)} />}{panel === 'photo' && <AIPhotoAnalysis onClose={() => setPanel(null)} />}</div>;
}

function ManualAdd({ onClose }) {
  const [foodId, setFoodId] = useState(foods[0].id);
  const [grams, setGrams] = useState(foods[0].default_grams);
  const [confirm, setConfirm] = useState(false);
  const selected = foods.find((food) => food.id === foodId) || foods[0];
  return <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#161326] p-5 text-white"><h2 className="text-lg font-bold">Manuel öğün ekle</h2><label className="mt-5 block text-xs text-white/50" htmlFor="manual-food">Yemek</label><select id="manual-food" value={foodId} onChange={(event) => { const next = foods.find((food) => food.id === event.target.value) || foods[0]; setFoodId(next.id); setGrams(next.default_grams); }} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white"><option value={selected.id}>{selected.name_tr}</option>{foods.filter((food) => food.id !== selected.id).map((food) => <option key={food.id} value={food.id}>{food.name_tr}</option>)}</select><label className="mt-4 block text-xs text-white/50" htmlFor="manual-grams">Gram</label><input id="manual-grams" type="number" min="10" value={grams} onChange={(event) => setGrams(Math.max(10, Number(event.target.value) || 10))} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white" /><div className="mt-5 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/65">Vazgeç</button><button type="button" onClick={() => setConfirm(true)} className="flex-1 rounded-xl bg-[#7C3AED] py-3 text-sm font-bold">Devam</button></div></div>{confirm && <LoggedModal food={{ ...selected, meal: 'snack' }} initialGrams={grams} onClose={onClose} />}</div>;
}
