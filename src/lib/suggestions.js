import { FOODS } from '../data/foods'

function remaining(totals, targets) {
  return {
    calories: targets.calorie_target - totals.calories,
    protein: targets.protein_target - totals.protein,
    carbs: targets.carb_target - totals.carbs,
    fat: targets.fat_target - totals.fat,
  }
}

function score(food, rem) {
  const kcal = Math.max(food.kcal, 1)
  const pDen = food.p / kcal
  const cDen = food.c / kcal
  const fDen = food.f / kcal
  let s = 0
  if (rem.protein > 20) s += pDen * 80
  if (rem.carbs > 30) s += cDen * 40
  if (rem.fat > 15) s += fDen * 25
  if (rem.calories < 250 && rem.protein > 15) s += pDen * 40 - food.c * 0.05
  if (rem.calories < 0) s -= food.kcal * 0.02
  return s
}

export function suggestFoods(totals, targets, limit = 4) {
  const rem = remaining(totals, targets)
  const reason = suggestionReason(rem)
  const ranked = [...FOODS]
    .filter((f) => !['tatli'].includes(f.cat) || rem.calories > 400)
    .sort((a, b) => score(b, rem) - score(a, rem))
    .slice(0, limit)
  return { remaining: rem, reason, foods: ranked }
}

export function suggestionReason(rem) {
  if (rem.calories <= 80 && rem.protein <= 10) return 'Hedeflere yaklaştın. Küçük bir atıştırmalık yeterli.'
  if (rem.protein > 40) return `Proteinde ${Math.round(rem.protein)}g açık var. Yağsız et, yumurta veya whey önerilir.`
  if (rem.carbs > 60 && rem.protein < 25) return `Karb açık: ${Math.round(rem.carbs)}g. Pilav, yulaf veya meyve ekle.`
  if (rem.fat > 20) return `Yağ hedefi için ${Math.round(rem.fat)}g kaldı. Zeytinyağı, ceviz veya avokado uyumlu.`
  if (rem.calories > 400) return `Hâlâ ~${Math.round(rem.calories)} kcal var. Dengeli bir öğün ekleyebilirsin.`
  return 'Makrolar dengeli gidiyor. Eksik kalanı küçük porsiyonlarla kapat.'
}

export function sumLogs(logs) {
  return logs.reduce(
    (acc, row) => ({
      calories: acc.calories + Number(row.calories),
      protein: acc.protein + Number(row.protein),
      carbs: acc.carbs + Number(row.carbs),
      fat: acc.fat + Number(row.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}
