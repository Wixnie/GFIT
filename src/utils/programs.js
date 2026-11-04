const E = (name_tr, sets, reps, rest_seconds, target_muscle, form_tip_tr, kcal_estimate) => ({ name_tr, sets, reps, rest_seconds, target_muscle, form_tip_tr, kcal_estimate });
const day = (name_tr, exercises = []) => ({ name_tr, exercises });
const rest = () => day('Dinlenme', []);
const weeks = (days) => ({ Mon: days[0], Tue: days[1], Wed: days[2], Thu: days[3], Fri: days[4], Sat: days[5], Sun: days[6] });

const upper = day('Üst Vücut', [E('Şınav', 4, '8-12', 60, 'Göğüs', 'Vücudu düz tut, dirsekleri yaklaşık 45 derece açıyla indir.', 45), E('Dumbbell Row', 4, '10-12', 60, 'Sırt', 'Kürek kemiklerini sık ve omuzunu kulağına çekme.', 42), E('Omuz Press', 3, '10-12', 60, 'Omuz', 'Ağırlıkları kontrollü indir, belini aşırı çukurlaştırma.', 35)]);
const lower = day('Alt Vücut', [E('Goblet Squat', 4, '10-15', 75, 'Bacak', 'Dizleri ayak parmaklarıyla aynı hizada tut.', 55), E('Romanian Deadlift', 3, '10-12', 75, 'Arka bacak', 'Kalçayı geriye gönder, sırtını nötr koru.', 50), E('Walking Lunge', 3, '12/12', 60, 'Kalça', 'Ön topuktan güç al ve dizini içeri düşürme.', 48)]);
const full = day('Tüm Vücut', [E('Squat', 4, '12', 60, 'Bacak', 'Göğsü açık tut ve kontrollü çömel.', 50), E('Şınav', 3, '10', 60, 'Göğüs', 'Karnı sık, kalçayı düşürme.', 40), E('Kettlebell Swing', 4, '15', 60, 'Kalça', 'Hareketi kollarla değil kalça itişiyle başlat.', 60), E('Plank', 3, '30-45 sn', 45, 'Core', 'Kaburgaları içeri al ve nefesini tutma.', 25)]);
const cardio = day('Kardiyo', [E('Tempolu Yürüyüş', 1, '30 dk', 30, 'Kardiyo', 'Konuşabilecek ama nefesini hissedecek tempoyu koru.', 180), E('Mountain Climber', 4, '30 sn', 30, 'Core', 'Omuzları bileklerin üzerinde tut, kalçayı sabit tut.', 35), E('Jumping Jack', 3, '45 sn', 30, 'Kardiyo', 'Yumuşak iniş yap ve ritmi koru.', 30)]);
const core = day('Core', [E('Plank', 4, '40 sn', 45, 'Karın', 'Başından topuğuna düz çizgi oluştur.', 25), E('Dead Bug', 3, '12/12', 45, 'Core', 'Bel boşluğunu zemine yaklaştır.', 24), E('Russian Twist', 3, '16', 45, 'Yan karın', 'Dönüşü belden değil gövdeden yap.', 30)]);

const programs = [
  { id: 'beginner', name_tr: 'Başlangıç', name_en: 'Beginner', level: 'beginner', days: weeks([full, rest(), lower, rest(), upper, cardio, rest()]) },
  { id: 'fat-loss', name_tr: 'Yağ Yakımı', name_en: 'Fat Loss', level: 'intermediate', days: weeks([upper, cardio, lower, cardio, full, cardio, rest()]) },
  { id: 'muscle-gain', name_tr: 'Kas Geliştirme', name_en: 'Muscle Gain', level: 'intermediate', days: weeks([upper, lower, rest(), upper, lower, full, rest()]) },
  { id: 'home-no-equipment', name_tr: 'Evde Ekipmansız', name_en: 'Home No Equipment', level: 'beginner', days: weeks([full, core, lower, rest(), upper, cardio, rest()]) },
  { id: 'home-dumbbell', name_tr: 'Evde Dambıl', name_en: 'Home Dumbbell', level: 'intermediate', days: weeks([upper, lower, cardio, rest(), upper, lower, rest()]) },
  { id: 'gym-strength', name_tr: 'Salon Kuvvet', name_en: 'Gym Strength', level: 'advanced', days: weeks([upper, lower, rest(), upper, lower, core, rest()]) },
  { id: 'hypertrophy', name_tr: 'Hipertrofi', name_en: 'Hypertrophy', level: 'advanced', days: weeks([upper, lower, upper, rest(), lower, full, rest()]) },
  { id: 'functional', name_tr: 'Fonksiyonel Fitness', name_en: 'Functional Fitness', level: 'intermediate', days: weeks([full, cardio, lower, core, upper, cardio, rest()]) },
  { id: 'running-support', name_tr: 'Koşucu Destek', name_en: 'Runner Support', level: 'intermediate', days: weeks([lower, cardio, core, rest(), lower, cardio, rest()]) },
  { id: 'quick-20', name_tr: '20 Dakika Hızlı', name_en: 'Quick 20 Minutes', level: 'beginner', days: weeks([full, cardio, full, rest(), full, core, rest()]) },
];

export default programs;
export { programs };
