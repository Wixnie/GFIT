import WaterTracker from '../features/water_fast/WaterTracker';
import FastingTimer from '../features/water_fast/FastingTimer';

export default function WaterFasting() { return <div className="mx-auto max-w-3xl space-y-5 p-4 pb-24 pt-20 md:ml-64 md:p-8 md:pt-24"><div><p className="text-sm text-white/50">Hidrasyon ve ritim</p><h1 className="mt-1 text-3xl font-black text-white">Su & Oruç</h1></div><WaterTracker /><FastingTimer /></div>; }
