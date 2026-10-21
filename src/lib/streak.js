/**
 * Calculate and update meal logging streak
 * Streak = consecutive days with at least one meal logged
 */

export function calculateStreak(foodLogs) {
  if (!foodLogs || foodLogs.length === 0) return 0

  // Group logs by date
  const logsByDate = {}
  foodLogs.forEach(log => {
    const date = log.logged_on?.split('T')[0] || log.logged_on
    if (!logsByDate[date]) {
      logsByDate[date] = []
    }
    logsByDate[date].push(log)
  })

  // Get unique dates with meals
  const datesWithMeals = Object.keys(logsByDate).sort().reverse()
  
  if (datesWithMeals.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  // Check if there's a meal logged today
  const today = currentDate.toISOString().split('T')[0]
  const hasTodayMeal = datesWithMeals.includes(today)

  // If no meal today, check yesterday
  if (!hasTodayMeal) {
    currentDate.setDate(currentDate.getDate() - 1)
  }

  // Count consecutive days backwards
  for (let i = 0; i < 365; i++) {
    const checkDate = currentDate.toISOString().split('T')[0]
    
    if (datesWithMeals.includes(checkDate)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function updateStreak(foodLogs) {
  const streak = calculateStreak(foodLogs)
  localStorage.setItem('gfitt_streak', streak.toString())
  return streak
}

export function getStreak() {
  const saved = localStorage.getItem('gfitt_streak')
  return saved ? parseInt(saved) : 0
}
