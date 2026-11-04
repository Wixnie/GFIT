import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import programs from '../utils/programs';
import WorkoutList from '../features/workouts/WorkoutList';
import ExerciseDetail from '../features/workouts/ExerciseDetail';
import RestTimer from '../features/workouts/RestTimer';
import PRTracker from '../features/workouts/PRTracker';

const dayNames = [['Mon', 'Pazartesi'], ['Tue', 'Salı'], ['Wed', 'Çarşamba'], ['Thu', 'Perşembe'], ['Fri', 'Cuma'], ['Sat', 'Cumartesi'], ['Sun', 'Pazar']];

export default function Workout() {
  const [program, setProgram] = useState(null); const [day, setDay] = useState('Mon'); const [timer, setTimer] = useState(null); const [prExercise, setPrExercise] = useState(null);
  const active = program?.days?.[day];
  if (!program) return <div className="mx-auto max-w-7xl p-4 pb-24 pt-20 md:ml-64 md:p-8 md:pt-24"><div className="mb-6 flex items-center gap-3"><Dumbbell className="text-[#A78BFA]" /><div><p className="text-sm text-white/50">Sana uygun programı seç</p><h1 className="text-3xl font-black text-white">Antrenman</h1></div></div><WorkoutList onSelect={(selected) => { setProgram(selected); setDay('Mon'); }} /></div>;
  return <div className="mx-auto max-w-7xl p-4 pb-24 pt-20 md:ml-64 md:p-8 md:pt-24"><button type="button" onClick={() => setProgram(null)} className="mb-5 text-sm text-[#C4B5FD]">← Programlara dön</button><div className="mb-6 flex items-start justify-between"><div><p className="text-sm text-white/50">7 günlük plan</p><h1 className="text-3xl font-black text-white">{program.name_tr}</h1></div><span className="text-3xl">🏋️</span></div><div className="mb-5 flex gap-2 overflow-x-auto pb-2">{dayNames.map(([key, label]) => <button type="button" key={key} onClick={() => setDay(key)} className={`min-w-20 rounded-xl px-3 py-2 text-xs ${day === key ? 'bg-[#7C3AED] text-white' : 'bg-[#161326] text-white/50'}`}>{label.slice(0, 3)}</button>)}</div><section className="rounded-2xl border border-white/10 bg-[#161326] p-5"><h2 className="text-lg font-bold text-white">{active?.name_tr}</h2>{active?.exercises?.length ? <div className="mt-4 space-y-3">{active.exercises.map((exercise, index) => <div key={`${exercise.name_tr}-${index}`}><ExerciseDetail exercise={exercise} isNewPR={false} onStartRest={(seconds) => setTimer(seconds)} /><button type="button" onClick={() => setPrExercise(exercise.name_tr)} className="mt-2 text-xs text-[#A78BFA]">PR kaydını aç</button></div>)}</div> : <p className="mt-4 text-sm text-white/50">Bugün dinlenme günü. Hafif bir yürüyüş ve mobilite iyi gelebilir.</p>}</section>{prExercise && <div className="mt-5"><PRTracker exerciseName={prExercise} current={0} /></div>}{timer && <RestTimer initialSeconds={timer} onClose={() => setTimer(null)} />}</div>;
}
