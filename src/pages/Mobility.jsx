import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Sparkles, Clock, Target } from 'lucide-react';

export default function Mobility() {
  const [activeRoutine, setActiveRoutine] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState([]);

  const routines = [
    {
      id: 'morning',
      title: '☀️ Sabah 8 Dk Eklem Açma & Enerji',
      badge: 'Güne Başlarken',
      desc: 'Omurga, boyun ve kalça eklemlerini uyandırır.',
      exercises: [
        { name: 'Kedi - Deve (Cat-Cow)', duration: 45, tip: 'Nefes alırken göğsü aç, nefes verirken sırtı kamburlaştır.' },
        { name: 'Göğüs Kafesi Rotasyonu', duration: 45, tip: 'Dört ayak üzerinde tek kolu yukarı uzatıp omurgayı çevir.' },
        { name: 'Derin Squat Bekleme', duration: 45, tip: 'Topuklar yerde, dirseklerle dizleri hafifçe dışa it.' },
        { name: 'Çocuk Pozu (Child\'s Pose)', duration: 45, tip: 'Kolları öne uzat, derin diyafram nefesi al.' }
      ]
    },
    {
      id: 'posture',
      title: '💻 Masa Başı, Boyun & Postür Düzeltme',
      badge: 'Kamburluk & Boyun Ağrısı',
      desc: 'Sürekli ekrana bakanlar ve masa başı çalışanlar için.',
      exercises: [
        { name: 'Duvarda Melek (Wall Angels)', duration: 45, tip: 'Sırt ve kolları duvara yaslayarak yavaşça yukarı kaydır.' },
        { name: 'Çene Geriye (Chin Tuck)', duration: 30, tip: 'Başını geriye doğru çift çene yapacak gibi çek.' },
        { name: 'Kapı Eşiğinde Göğüs Germe', duration: 45, tip: 'Kolunu 90 derece kapı pervazına koyup gövdeni öne kaydır.' },
        { name: 'Skapular Şınav (Diz Üstü)', duration: 45, tip: 'Kolları bükmeden sadece kürek kemiklerini birbirine yaklaştır.' }
      ]
    },
    {
      id: 'hips',
      title: '🍑 Kalça, Pelvis & Alt Bel Rahatlatma',
      badge: 'Kadın & Erkek Kalça Açıcı',
      desc: 'Bacak/squat günleri öncesi veya bel ağrısını hafifletmek için.',
      exercises: [
        { name: '90/90 Kalça Geçişi (Hip Switch)', duration: 45, tip: 'Yerde oturup dizleri sağa ve sola sırayla devir.' },
        { name: 'Güvercin Pozu (Pigeon Pose)', duration: 45, tip: 'Öndeki bacağı kır, arkadaki bacağı düz uzatarak kalçayı esnet.' },
        { name: 'Kurbağa Esnemesi (Frog Stretch)', duration: 45, tip: 'Dizleri iki yana açıp kalçayı geriye doğru it.' },
        { name: 'Lunge Hip Flexor Germe', duration: 45, tip: 'Öne lunge pozisyonunda arkadaki kalçayı sıkarak öne kaykıl.' }
      ]
    },
    {
      id: 'night',
      title: '🌙 Uyku Öncesi Gevşeme & Sinir Sistemi',
      badge: 'Derin Uyku İçin',
      desc: 'Kortizolü düşürür, parasempatik sistemi devreye sokar.',
      exercises: [
        { name: 'Bacaklar Duvarda (Legs Up Wall)', duration: 60, tip: 'Bacakları duvara dik uzatarak sırt üstü yat.' },
        { name: 'Yatarak Omurga Bükme (Spinal Twist)', duration: 45, tip: 'Dizleri göğse çekip bir yana devir, başı ters yöne çevir.' },
        { name: 'Mutlu Bebek Pozu (Happy Baby)', duration: 45, tip: 'Ayak tabanlarından tutup dizleri koltuk altına doğru çek.' },
        { name: '4-7-8 Diyafram Nefesi', duration: 60, tip: '4 sn burundan al, 7 sn tut, 8 sn ağızdan yavaşça ver.' }
      ]
    }
  ];

  const currentRoutine = routines[activeRoutine];

  useEffect(() => {
    let interval = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = (duration = 45) => {
    setIsRunning(false);
    setTimerSeconds(duration);
  };

  const toggleComplete = (idx) => {
    setCompleted(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Üst Başlık */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/60 via-[#18152B] to-[#120F20] border border-indigo-500/30">
        <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Evde Ekipmansız</span>
        </div>
        <h1 className="text-xl font-black text-white">Mobilite & Esneme Rehberi</h1>
        <p className="text-xs text-slate-300 mt-1">
          Günde 8-10 dakika ayırarak eklem sağlığını koru, ağrıları gider ve antrenman performansını artır.
        </p>

        {/* Sayaç Kartı */}
        <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">EGZERSİZ SAYACI</span>
            <span className="text-3xl font-black text-white font-mono">{timerSeconds}s</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className={`p-3 rounded-xl font-bold flex items-center justify-center transition-transform active:scale-90 ${
                isRunning ? 'bg-amber-500 text-slate-950' : 'bg-purple-600 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={() => resetTimer(45)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-90"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Rutin Seçici Butonları */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {routines.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => {
              setActiveRoutine(idx);
              setCompleted([]);
              resetTimer(r.exercises[0].duration);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeRoutine === idx 
                ? 'bg-purple-600 text-white border-purple-500' 
                : 'bg-[#18152B] text-slate-300 border-white/5 hover:border-white/20'
            }`}
          >
            {r.title.split(' ')[0]} {r.title.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Aktif Rutin Kartı */}
      <div className="bg-[#18152B] border border-white/10 rounded-3xl p-5 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
            {currentRoutine.badge}
          </span>
          <h2 className="text-base font-black text-white mt-2">{currentRoutine.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentRoutine.desc}</p>
        </div>

        {/* Egzersiz Listesi */}
        <div className="space-y-2.5">
          {currentRoutine.exercises.map((ex, idx) => {
            const isDone = completed.includes(idx);
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {ex.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ex.tip}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => resetTimer(ex.duration)}
                      className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white"
                    >
                      {ex.duration}s
                    </button>
                    <button
                      onClick={() => toggleComplete(idx)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-white/20 text-slate-400'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}