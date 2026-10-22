/**
 * Bilimsel BMR & TDEE Hesaplayıcı (Mifflin-St Jeor Standardı)
 * Clamp: BMR asla 1200 kcal altına düşemez.
 */
export function calculateBMR(profile = {}) {
  const weight = Number(profile?.weight_kg || profile?.weight) > 30 ? Number(profile.weight_kg || profile.weight) : 75;
  const height = Number(profile?.height_cm || profile?.height) > 100 ? Number(profile.height_cm || profile.height) : 175;
  const age = Number(profile?.age) > 10 ? Number(profile.age) : 22;
  const gender = profile?.gender || 'male';

  // Mifflin-St Jeor Formülü
  let rawBmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'female') {
    rawBmr -= 161;
  } else {
    rawBmr += 5;
  }

  // Minimum güvenli clamp: BMR asla 1200 kcal altına düşmez
  return Math.max(Math.round(rawBmr), 1200);
}

export function calculateTDEE(profile = {}) {
  const bmr = calculateBMR(profile);
  const activityMap = {
    sedentary: 1.2,      // Masa başı / Hareketsiz
    light: 1.375,        // Haftada 1-3 gün hafif spor
    moderate: 1.55,      // Haftada 3-5 gün orta spor
    active: 1.725,       // Haftada 6-7 gün ağır spor
    very_active: 1.9     // Günde çift idman / beden işi
  };

  const multiplier = activityMap[profile?.activity_level] || 1.375;
  const rawTdee = bmr * multiplier;

  return Math.max(Math.round(rawTdee), 1550);
}

export function calculateTargetCalories(profile = {}) {
  const tdee = calculateTDEE(profile);
  const goal = profile?.goal || 'maintain'; // 'lose', 'gain', 'maintain'

  let targetKcal = tdee;
  if (goal === 'lose' || goal === 'fat_loss') {
    targetKcal = Math.max(tdee - 450, 1200);
  } else if (goal === 'gain' || goal === 'muscle_gain') {
    targetKcal = tdee + 350;
  }

  return Math.max(Math.round(targetKcal), 1200);
}

export function calculateMacros(calories, profile = {}) {
  const targetKcal = Number(calories) || calculateTargetCalories(profile);
  const weight = Number(profile?.weight_kg || profile?.weight) > 30 ? Number(profile.weight_kg || profile.weight) : 75;

  const protein = Math.round(weight * 1.8);
  const fat = Math.round((targetKcal * 0.25) / 9);
  const remainingKcal = targetKcal - (protein * 4 + fat * 9);
  const carbs = Math.max(Math.round(remainingKcal / 4), 50);

  return { protein, carbs, fat };
}

export function calculateWaterTarget(weight) {
  const w = Number(weight) > 30 ? Number(weight) : 75;
  return Math.round(w * 33); // 33ml / kg
}

export function getGoalRateDisplay(goalSpeed) {
  switch (goalSpeed) {
    case 'slow':
      return '0.25 kg / hafta (Kas Koruyucu)';
    case 'fast':
      return '0.8 kg / hafta (Hızlı Sonuç)';
    case 'moderate':
    default:
      return '0.5 kg / hafta (Önerilen & Dengeli)';
  }
}

export function calculateMacroBudget(profile = {}) {
  const targetKcal = calculateTargetCalories(profile);
  const { protein, carbs, fat } = calculateMacros(targetKcal, profile);
  const fiberGrams = Math.round((targetKcal / 1000) * 14);

  return {
    targetKcal,
    bmr: calculateBMR(profile),
    tdee: calculateTDEE(profile),
    proteinGrams: protein,
    carbGrams: carbs,
    fatGrams: fat,
    fiberGrams
  };
}

export function calculateProjectedWeight(currentWeight, dailyDeficit = 500, weeks = 4) {
  const w = typeof currentWeight === 'object' 
    ? Number(currentWeight?.weight_kg || currentWeight?.weight || 75) 
    : (Number(currentWeight) || 75);
  const deficit = Number(dailyDeficit) || 500;
  const numWeeks = Number(weeks) || 4;
  const weeklyChange = (deficit * 7) / 7700;
  return Math.max(Math.round((w - (weeklyChange * numWeeks)) * 10) / 10, 35);
}