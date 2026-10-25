import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const translations = {
  tr: {
    // Navigation
    nav_summary: 'Özet',
    nav_food: 'Yemek',
    nav_workout: 'Antrenman',
    nav_progress: 'İlerleme',
    nav_profile: 'Sen',
    // Dashboard
    dashboard_today: 'Bugünün özeti',
    dashboard_calories: 'Kalori',
    dashboard_protein: 'Protein',
    dashboard_carbs: 'Karb',
    dashboard_fat: 'Yağ',
    dashboard_remaining: 'kalori kaldı',
    dashboard_todays_food: 'Bugünün Yemekleri',
    // Profile
    profile_title: 'Profil & hedefler',
    profile_name: 'Ad',
    profile_age: 'Yaş',
    profile_height: 'Boy (cm)',
    profile_weight: 'Kilo (kg)',
    profile_gender: 'Cinsiyet',
    profile_male: 'Erkek',
    profile_female: 'Kadın',
    profile_calorie_target: 'Kalori hedefi',
    profile_protein_target: 'Protein (g)',
    profile_carb_target: 'Karb (g)',
    profile_fat_target: 'Yağ (g)',
    profile_save: 'Kaydet',
    profile_saving: 'Kaydediliyor...',
    profile_saved: 'Bilgiler güncellendi.',
    // Buttons
    btn_continue: 'Devam Et',
    btn_back: 'Geri',
    btn_save: 'Kaydet',
    btn_cancel: 'İptal',
    btn_delete: 'Sil',
    // Goals
    goal_lose: 'Kilo Vermek',
    goal_gain: 'Kas Yapmak',
    goal_maintain: 'Form Koruma',
    goal_track: 'Sadece Takip',
    // Workout
    workout_title: 'Antrenman',
    workout_sets: 'Set',
    workout_reps: 'Tekrar',
    workout_weight: 'Ağırlık',
    workout_complete: 'Antrenmanı Tamamla',
    // Food
    food_title: 'Yemek & Kalori',
    food_breakfast: 'Kahvaltı',
    food_lunch: 'Öğle Yemeği',
    food_dinner: 'Akşam Yemeği',
    food_snack: 'Ara Öğün',
    food_late: 'Gece Öğünü',
    // Progress
    progress_title: 'İlerleme',
    progress_daily_calories: 'Günlük Kalori',
    progress_daily_protein: 'Günlük Protein',
    progress_weight_trend: 'Kilo Değişim Trendi',
    // Common
    loading: 'Yükleniyor...',
    error: 'Hata oluştu',
    success: 'Başarılı',
    try_again: 'Tekrar dene',
  },
  en: {
    // Navigation
    nav_summary: 'Summary',
    nav_food: 'Food',
    nav_workout: 'Workout',
    nav_progress: 'Progress',
    nav_profile: 'You',
    // Dashboard
    dashboard_today: "Today's Summary",
    dashboard_calories: 'Calories',
    dashboard_protein: 'Protein',
    dashboard_carbs: 'Carbs',
    dashboard_fat: 'Fat',
    dashboard_remaining: 'calories remaining',
    dashboard_todays_food: "Today's Food",
    // Profile
    profile_title: 'Profile & Goals',
    profile_name: 'Name',
    profile_age: 'Age',
    profile_height: 'Height (cm)',
    profile_weight: 'Weight (kg)',
    profile_gender: 'Gender',
    profile_male: 'Male',
    profile_female: 'Female',
    profile_calorie_target: 'Calorie Target',
    profile_protein_target: 'Protein (g)',
    profile_carb_target: 'Carbs (g)',
    profile_fat_target: 'Fat (g)',
    profile_save: 'Save',
    profile_saving: 'Saving...',
    profile_saved: 'Info updated.',
    // Buttons
    btn_continue: 'Continue',
    btn_back: 'Back',
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    btn_delete: 'Delete',
    // Goals
    goal_lose: 'Lose Weight',
    goal_gain: 'Build Muscle',
    goal_maintain: 'Maintain',
    goal_track: 'Track Only',
    // Workout
    workout_title: 'Workout',
    workout_sets: 'Sets',
    workout_reps: 'Reps',
    workout_weight: 'Weight',
    workout_complete: 'Complete Workout',
    // Food
    food_title: 'Food & Calories',
    food_breakfast: 'Breakfast',
    food_lunch: 'Lunch',
    food_dinner: 'Dinner',
    food_snack: 'Snack',
    food_late: 'Late Night',
    // Progress
    progress_title: 'Progress',
    progress_daily_calories: 'Daily Calories',
    progress_daily_protein: 'Daily Protein',
    progress_weight_trend: 'Weight Trend',
    // Common
    loading: 'Loading...',
    error: 'Error occurred',
    success: 'Success',
    try_again: 'Try again',
  },
  de: {
    // Navigation
    nav_summary: 'Übersicht',
    nav_food: 'Essen',
    nav_workout: 'Training',
    nav_progress: 'Fortschritt',
    nav_profile: 'Du',
    // Dashboard
    dashboard_today: 'Heutige Zusammenfassung',
    dashboard_calories: 'Kalorien',
    dashboard_protein: 'Protein',
    dashboard_carbs: 'Kohlenhydrate',
    dashboard_fat: 'Fett',
    dashboard_remaining: 'Kalorien verbleibend',
    dashboard_todays_food: 'Heutiges Essen',
    // Profile
    profile_title: 'Profil & Ziele',
    profile_name: 'Name',
    profile_age: 'Alter',
    profile_height: 'Größe (cm)',
    profile_weight: 'Gewicht (kg)',
    profile_gender: 'Geschlecht',
    profile_male: 'Männlich',
    profile_female: 'Weiblich',
    profile_calorie_target: 'Kalorienziel',
    profile_protein_target: 'Protein (g)',
    profile_carb_target: 'Kohlenhydrate (g)',
    profile_fat_target: 'Fett (g)',
    profile_save: 'Speichern',
    profile_saving: 'Speichert...',
    profile_saved: 'Informationen aktualisiert.',
    // Buttons
    btn_continue: 'Weiter',
    btn_back: 'Zurück',
    btn_save: 'Speichern',
    btn_cancel: 'Abbrechen',
    btn_delete: 'Löschen',
    // Goals
    goal_lose: 'Abnehmen',
    goal_gain: 'Muskelaufbau',
    goal_maintain: 'Erhalten',
    goal_track: 'Nur Verfolgen',
    // Workout
    workout_title: 'Training',
    workout_sets: 'Sätze',
    workout_reps: 'Wiederholungen',
    workout_weight: 'Gewicht',
    workout_complete: 'Training abschließen',
    // Food
    food_title: 'Essen & Kalorien',
    food_breakfast: 'Frühstück',
    food_lunch: 'Mittagessen',
    food_dinner: 'Abendessen',
    food_snack: 'Snack',
    food_late: 'Spät',
    // Progress
    progress_title: 'Fortschritt',
    progress_daily_calories: 'Tägliche Kalorien',
    progress_daily_protein: 'Tägliches Protein',
    progress_weight_trend: 'Gewichtstrend',
    // Common
    loading: 'Laden...',
    error: 'Fehler aufgetreten',
    success: 'Erfolg',
    try_again: 'Nochmal versuchen',
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gfitt_lang') || 'tr'
  })

  useEffect(() => {
    localStorage.setItem('gfitt_lang', language)
  }, [language])

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
