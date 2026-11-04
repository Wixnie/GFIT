import { ArrowLeft, Check, Dumbbell, HeartPulse, Scale, Utensils, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { calculateMacros, calculateTDEE } from '../../utils/tdee';
import { supabase } from '../../services/supabaseClient';

const steps = ['Hareket', 'Hedef', 'Cinsiyet', 'Vücut', 'Tempo'];
const defaults = { activity: 'moderately_active', goal: 'lose', gender: 'male', age: 22, height: 175, weight: 75, pace: 'steady' };
const choices = {
  activity: [['sedentary', 'Masa başı', 'Masa başı iş, çoğu zaman oturuyorum'], ['lightly_active', 'Az hareketli', 'Ara ara ayaktayım, hafif yürüyüş'], ['moderately_active', 'Orta hareketli', 'Günün çoğu ayaktayım'], ['very_active', 'Çok hareketli', 'Fiziksel iş, sürekli hareket']],
  goal: [['lose', 'Kilo vermek'], ['maintain', 'Kilomu korumak'], ['gain', 'Kas yapmak'], ['track', 'Sadece ne yediğimi görmek']],
  gender: [['male', 'Erkek'], ['female', 'Kadın']],
  pace: [['gentle', 'Sakin', '0.12 kg / hafta'], ['steady', 'Dengeli', '0.25 kg / hafta'], ['fast', 'Hızlı', '0.5 kg / hafta']],
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, enterGuestMode } = useAuth();
  const { setProfile } = useUserData();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const tdee = useMemo(() => calculateTDEE(form), [form]);
  const macros = useMemo(() => calculateMacros({ calories: tdee, weight: form.weight, goal: form.goal }), [tdee, form.weight, form.goal]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const finish = async () => {
    setSaving(true);
    const profile = { ...form, tdee, macros, onboardingCompletedAt: new Date().toISOString() };
    setProfile(profile);
    localStorage.setItem('gfitt_onboarding_done', 'true');
    if (user) await supabase.from('profiles').upsert({ id: user.id, ...profile });
    else enterGuestMode();
    setSaving(false);
    navigate('/dashboard');
  };
  return <main className="min-h-screen bg-[#080B14] px-5 pb-8 pt-8 text-white"><div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[560px] flex-col"><div className="flex items-center gap-4"><button type="button" onClick={() => step > 0 ? setStep((value) => value - 1) : navigate('/auth')} aria-label="Geri" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#171B29] text-white/80"><ArrowLeft size={22} /></button><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2A3042]"><div className="h-full rounded-full bg-[#FFE500] transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div></div><div className="flex-1 pt-28 sm:pt-36"><p className="mb-3 text-sm font-semibold text-[#FFE500]">GFitt'e hoş geldin</p><h1 className="max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">{step === 0 ? 'Gün içinde ne kadar hareketlisin?' : step === 1 ? 'Seni Logma’ya getiren ne?' : step === 2 ? 'Metabolizmanı hangi cinsiyete göre hesaplayalım?' : step === 3 ? 'Vücudunu tanıyalım.' : 'Hedefine hangi hızda gitmek istersin?'}</h1><p className="mt-4 max-w-lg text-base leading-6 text-white/50">{step === 0 ? 'Antrenmanlar hariç. Onları birazdan soracağız.' : step === 1 ? 'Sana uygun planı birlikte oluşturalım.' : step === 2 ? 'Kalori ve protein matematiği buna dayanıyor.' : step === 3 ? 'Bu bilgiler günlük hedeflerini kişiselleştirmek için kullanılır.' : 'Hız arttıkça kalori hedefi sıkılaşır.'}</p>{step < steps.length - 1 && <ChoiceList value={form[step === 0 ? 'activity' : step === 1 ? 'goal' : 'gender']} choices={choices[step === 0 ? 'activity' : step === 1 ? 'goal' : 'gender']} onChange={(value) => update(step === 0 ? 'activity' : step === 1 ? 'goal' : 'gender', value)} />}{step === 3 && <BodyForm form={form} update={update} />}{step === 4 && <PaceSelector value={form.pace} onChange={(value) => update('pace', value)} />}</div>{step < steps.length - 1 ? <button type="button" onClick={() => setStep((value) => value + 1)} className="mt-10 flex h-16 w-full items-center justify-center rounded-2xl bg-[#FFE500] text-lg font-bold text-[#080B14]">Devam</button> : <FinalPlan tdee={tdee} macros={macros} saving={saving} onFinish={finish} />}</div></main>;
}

function ChoiceList({ value, choices: items, onChange }) { return <div className="mt-10 space-y-3">{items.map(([key, title, detail]) => <button type="button" key={key} onClick={() => onChange(key)} className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${value === key ? 'border-[#FFE500] bg-[#FFE500]/10' : 'border-white/10 bg-[#171B29] hover:border-white/20'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${value === key ? 'border-[#FFE500] bg-[#FFE500] text-[#080B14]' : 'border-white/20'}`}>{value === key && <Check size={15} />}</span><span><strong className="block text-lg text-white">{title}</strong>{detail && <small className="mt-1 block text-sm text-white/45">{detail}</small>}</span></button>)}</div>; }
function BodyForm({ form, update }) { return <div className="mt-10 grid grid-cols-3 gap-3"><Field icon={Scale} label="Yaş" value={form.age} onChange={(value) => update('age', Number(value))} suffix="" /><Field icon={Waves} label="Boy" value={form.height} onChange={(value) => update('height', Number(value))} suffix="cm" /><Field icon={HeartPulse} label="Kilo" value={form.weight} onChange={(value) => update('weight', Number(value))} suffix="kg" /></div>; }
function Field({ icon: Icon, label, value, onChange, suffix }) { return <label className="rounded-2xl border border-white/10 bg-[#171B29] p-4 text-xs text-white/45"><Icon size={18} className="mb-5 text-[#FFE500]" />{label}<div className="mt-2 flex items-end gap-1"><input type="number" value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-2xl font-bold text-white outline-none" />{suffix && <span>{suffix}</span>}</div></label>; }
function PaceSelector({ value, onChange }) { return <div className="mt-10"><div className="mb-5 flex items-end justify-between"><div><div className="text-3xl font-black text-white">{choices.pace.find(([key]) => key === value)?.[1]}</div><div className="mt-1 text-sm text-[#FFE500]">{choices.pace.find(([key]) => key === value)?.[2]} · Önerilen</div></div><span className="text-4xl">{value === 'gentle' ? '🐢' : value === 'fast' ? '🐇' : '🚶'}</span></div><input type="range" min="0" max="2" value={choices.pace.findIndex(([key]) => key === value)} onChange={(event) => onChange(choices.pace[Number(event.target.value)][0])} className="w-full accent-[#FFE500]" /><div className="mt-3 flex justify-between text-xs text-white/45"><span>Sakin</span><span>Dengeli</span><span>Hızlı</span></div></div>; }
function FinalPlan({ tdee, macros, saving, onFinish }) { return <div className="mt-12 rounded-3xl border border-white/10 bg-[#171B29] p-6 text-center"><div className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-white/45">Planın hazır</div><div className="text-5xl font-black text-[#FFE500]">{Math.round(tdee)} <span className="text-lg text-white/45">kcal / gün</span></div><div className="mt-6 grid grid-cols-3 divide-x divide-white/10"><Stat value={`${macros.protein}g`} label="Protein" /><Stat value={`${macros.carbs}g`} label="Karb" /><Stat value={`${macros.fat}g`} label="Yağ" /></div><button type="button" disabled={saving} onClick={onFinish} className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FFE500] text-base font-bold text-[#080B14] disabled:opacity-50"><Dumbbell size={18} />{saving ? 'Plan hazırlanıyor...' : 'Planımı gör'}</button></div>; }
function Stat({ value, label }) { return <div><div className="text-xl font-black text-white">{value}</div><div className="mt-1 text-xs text-white/45">{label}</div></div>; }
