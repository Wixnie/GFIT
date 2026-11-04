const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const DEFAULTS = { weight: 75, height: 175, age: 22 };

export function calculateBMR({ weight = DEFAULTS.weight, height = DEFAULTS.height, age = DEFAULTS.age, gender = 'male' } = {}) {
  const safeWeight = Number(weight) > 0 ? Number(weight) : DEFAULTS.weight;
  const safeHeight = Number(height) > 0 ? Number(height) : DEFAULTS.height;
  const safeAge = Number(age) > 0 ? Number(age) : DEFAULTS.age;
  const base = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge;
  return Math.round(gender === 'female' ? base - 161 : base + 5);
}

export function calculateTDEE({ weight, height, age, gender = 'male', activity = 'moderately_active' } = {}) {
  const bmr = calculateBMR({ weight, height, age, gender });
  const multiplier = typeof activity === 'number' ? activity : ACTIVITY_MULTIPLIERS[activity] || ACTIVITY_MULTIPLIERS.moderately_active;
  return Math.round(Math.max(bmr, 1200) * multiplier);
}

export function calculateMacros({ calories, weight = DEFAULTS.weight, goal = 'maintain' } = {}) {
  const safeWeight = Number(weight) > 0 ? Number(weight) : DEFAULTS.weight;
  const tdee = Number(calories) > 0 ? Number(calories) : calculateTDEE({ weight: safeWeight });
  const calorieTarget = Math.round(tdee * ({ lose: 0.8, fat_loss: 0.8, gain: 1.1, muscle_gain: 1.1 }[goal] || 1));
  const protein = Math.round(safeWeight * (goal === 'gain' || goal === 'muscle_gain' || goal === 'lose' || goal === 'fat_loss' ? 2 : 1.6));
  const fat = Math.round(safeWeight * 0.8);
  const carbs = Math.max(0, Math.round((calorieTarget - protein * 4 - fat * 9) / 4));
  return { calories: calorieTarget, protein, carbs, fat, fiber: Math.round((calorieTarget / 1000) * 14) };
}

export { ACTIVITY_MULTIPLIERS };
