// TDEE Hesaplama Motoru - Mifflin-St Jeor Denklemi

export function calculateBMR(weightKg, heightCm, age, gender) {
  // Mifflin-St Jeor denklemi
  const weightLbs = weightKg * 2.20462
  const heightInches = heightCm * 0.393701
  
  if (gender === 'male') {
    return (10 * weightLbs) + (6.25 * heightInches) - (5 * age) + 5
  } else {
    return (10 * weightLbs) + (6.25 * heightInches) - (5 * age) - 161
  }
}

export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }
  return bmr * (multipliers[activityLevel] || 1.2)
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
  
  // Minimum kalori sınırları
  const minCalories = gender === 'male' ? 1500 : 1200
  return Math.max(target, minCalories)
}

export function calculateMacros(weightKg, targetCalories) {
  const protein = Math.round(weightKg * 2) // g/kg
  const fat = Math.round(weightKg * 0.9) // g/kg
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
