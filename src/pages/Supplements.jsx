import React, { useState } from 'react';
import { Pill, CheckCircle2, Copy, ExternalLink, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Supplements() {
  const [copied, setCopied] = useState(false);
  const [activeSupps, setActiveSupps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gfitt_active_supplements')) || ['creatine', 'whey', 'omega3'];
    } catch {
      return ['creatine', 'whey', 'omega3'];
    }
  });

  const toggleSupp = (id) => {
    const updated = activeSupps.includes(id) 
      ? activeSupps.filter(s => s !== id) 
      : [...activeSupps, id];
    setActiveSupps(updated);
    localStorage.setItem('gfitt_active_supplements', JSON.stringify(updated));
  };

  const copyCode = () => {
    navigator.clipboard.writeText('GFIT10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const supplementsList = [
    { id: 'creatine', name: 'Kreatin Monohidrat', time: 'Antrenman Sonrası (5g)', note: 'Günde en az +500ml ekstra su iç' },
    { id: 'whey', name: 'Whey Protein Tozu', time: 'İdman Sonrası veya Sabah', note: 'Hızlı sindirilen protein kaynağı' },
    { id: 'omega3', name: 'Omega-3 Balık Yağı', time: 'Öğünle Beraber (Sabah)', note: 'EPA & DHA kalp ve eklem sağlığı' },
    { id: 'd3k2', name: 'Vitamin D3 + K2', time: 'Yağlı Öğünle Beraber', note: 'Bağışıklık ve kemik mineralizasyonu' },
    { id: 'zma', name: 'ZMA / Magnezyum Bisglisinat', time: 'Yatmadan 45 Dk Önce', note: 'Kas gevşemesi ve derin uyku' },
    { id: 'preworkout', name: 'Pre-Workout (Kafein & Sitrülin)', time: 'İdmandan 30 Dk Önce', note: 'Saat 17:00 sonrası uykuyu bölebilir' }
  ];

  const storeProducts = [
    {
      brand: 'Proteinocean',
      name: 'Creatine Monohydrate (300g)',
      marketPrice: 429,
      discountPrice: 386,
      link: 'https://proteinocean.com',
      badge: 'En Popüler'
    },
    {
      brand: 'Supplementler.com',
      name: 'Whey Protein (1000g)',
      marketPrice: 899,
      discountPrice: 809,
      link: 'https://www.supplementler.com',
      badge: 'Yüksek BCAA'
    },
    {
      brand: 'HIQ Nutrition',
      name: 'Smash Pre-Workout (300g)',
      marketPrice: 649,
      discountPrice: 584,
      link: 'https://takehiq.com',
      badge: 'Yüksek Pompalama'
    },
    {
      brand: 'BigJoy Sports',
      name: 'ZMA + Magnesium (120 Kapsül)',
      marketPrice: 389,
      discountPrice: 350,
      link: 'https://www.bigjoy.com.tr',
      badge: 'Derin Uyku'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900/60 via-[#18152B] to-[#120F20] border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-2 text-[#FF8A00] font-black text-xs tracking-wider uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Özel İndirim Kodu</span>
        </div>
        <h1 className="text-xl font-black text-white">Supplement & Mağaza</h1>
        <p className="text-xs text-slate-300 mt-1">
          Kullandığın supplementleri takip et ve anlaşmalı markalardan %10 indirimle temin et.
        </p>

        {/* Copy GFIT10 Box */}
        <div className="mt-4 p-3.5 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">TÜM ALIŞVERİŞLERDE GEÇERLİ:</span>
            <span className="text-lg font-black text-[#FF8A00] tracking-wider">GFIT10</span>
          </div>
          <button
            onClick={copyCode}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              copied 
                ? 'bg-emerald-500 text-slate-950 font-black' 
                : 'bg-white text-slate-950 hover:bg-slate-200'
            }`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala (%10)'}</span>
          </button>
        </div>
      </div>

      {/* Kişisel Supplement Takibi */}
      <div className="bg-[#18152B] border border-white/10 rounded-3xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Pill className="w-4 h-4 text-purple-400" />
          Günlük Supplement Protokolün
        </h2>
        <div className="space-y-2">
          {supplementsList.map((supp) => {
            const isChecked = activeSupps.includes(supp.id);
            return (
              <div
                key={supp.id}
                onClick={() => toggleSupp(supp.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isChecked 
                    ? 'bg-purple-600/15 border-purple-500/40 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-white">{supp.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{supp.time} · {supp.note}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                  isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/20'
                }`}>
                  {isChecked && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GFIT10 Vitrini */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          En Çok Tercih Edilen Ürünler
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {storeProducts.map((p, idx) => (
            <div key={idx} className="bg-[#18152B] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{p.brand}</span>
                <p className="text-xs font-bold text-white mt-0.5">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 line-through">₺{p.marketPrice}</span>
                  <span className="text-sm font-black text-emerald-400">₺{p.discountPrice}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    GFIT10 ile
                  </span>
                </div>
              </div>

              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
                title="Mağazaya Git"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}