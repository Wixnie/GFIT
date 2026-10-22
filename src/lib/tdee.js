// TDEE Hesaplama Motoru - Mifflin-St Jeor Denklemi

export function calculateBMR(weightKg, heightCm, age, gender) {
  // Sanitize inputs with safe defaults
  const w = Number(weightKg) > 30 ? Number(weightKg) : 75
  const h = Number(heightCm) > 100 ? Number(heightCm) : 175
  const a = Number(age) > 10 ? Number(age) : 22
  
  // Mifflin-St Jeor denklemi (METRIC units)
  // Erkek: (10 × kg) + (6.25 × cm) - (5 × yaş) + 5
  // Kadın: (10 × kg) + (6.25 × cm) - (5 × yaş) - 161
  
  let rawBMR
  if (gender === 'male') {
    rawBMR = (10 * w) + (6.25 * h) - (5 * a) + 5
  } else {
    rawBMR = (10 * w) + (6.25 * h) - (5 * a) - 161
  }
  
  // Strict minimum clamp: never below 1200 kcal
  return Math.max(Math.round(rawBMR), 1200)
}

export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }
  const rawTDEE = bmr * (multipliers[activityLevel] || 1.2)
  // Strict minimum clamp: never below 1550 kcal
  return Math.max(Math.round(rawTDEE), 1550)
}

export function calculateTargetCalories(tdee, goal, gender) {
  let target = tdee
  
  if (goal === 'lose') {
    target = tdee - 500 // Dengeli kilo verme
  } else if (goal === 'lose_fast') {
    target = tdee - 750 // Hızlı kilo verme
  } else if (goal === 'lose_slow') {
    target = tdee - 250 // Sakin kilo verme
  } else if (goal === 'gain') {
    target = tdee + 300 // Kas yapma
  }
  
  // Strict minimum clamp: never below 1200 kcal
  return Math.max(Math.round(target), 1200)
}

export function calculateMacros(weightKg, targetCalories, goal = 'maintain') {
  let protein = Math.round(weightKg * 2) // g/kg baseline
  let fat = Math.round(weightKg * 0.9) // g/kg baseline
  
  // Goal-based adjustments
  if (goal === 'lose' || goal === 'lose_fast' || goal === 'lose_slow') {
    // Weight loss: Higher protein to preserve muscle, lower fat
    protein = Math.round(weightKg * 2.2)
    fat = Math.round(weightKg * 0.7)
  } else if (goal === 'gain') {
    // Muscle gain: Higher protein, moderate fat
    protein = Math.round(weightKg * 2.4)
    fat = Math.round(weightKg * 1.0)
  }
  // maintain: baseline values
  
  const fatCalories = fat * 9
  const proteinCalories = protein * 4
  const remainingCalories = targetCalories - fatCalories - proteinCalories
  const carbs = Math.max(0, Math.round(remainingCalories / 4))
  
  return {
    protein,
    fat,
    carbs
  }
}

export function calculateWaterTarget(weightKg) {
  return Math.round(weightKg * 35) // ml/kg
}

export function getGoalRateDisplay(goal) {
  const rates = {
    lose_slow: { label: 'Sakin', rate: 0.12, emoji: '🐢' },
    lose: { label: 'Dengeli', rate: 0.25, emoji: '🚶' },
    lose_fast: { label: 'Hızlı', rate: 0.5, emoji: '🐇' },
    maintain: { label: 'Korumak', rate: 0, emoji: '⚖️' },
    gain: { label: 'Kas Yap', rate: 0.1, emoji: '💪' }
  }
  return rates[goal] || rates.maintain
}

export function calculateProjectedWeight(currentWeight, targetWeight, dailyCalorieDeficit) {
  if (dailyCalorieDeficit <= 0) return null
  
  const kgToLose = currentWeight - targetWeight
  const caloriesPerKg = 7700
  const daysNeeded = (kgToLose * caloriesPerKg) / dailyCalorieDeficit
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + Math.ceil(daysNeeded))
  
  return {
    daysNeeded: Math.ceil(daysNeeded),
    targetDate: targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }
}
