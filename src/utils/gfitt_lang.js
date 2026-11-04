export const translations = {
  tr: {
    nav: { home: 'Ana Sayfa', food: 'Beslenme', workout: 'Antrenman', progress: 'İlerleme', profile: 'Profil' },
    dashboard: { greeting: 'Merhaba', today: 'Bugün', calories: 'Kalori', protein: 'Protein', water: 'Su', steps: 'Adım', quickActions: 'Hızlı İşlemler', addFood: 'Öğün Ekle', startWorkout: 'Antrenmana Başla', dailyGoal: 'Günlük Hedef', streak: 'Gün Serisi' },
    food: { title: 'Beslenme', search: 'Yemek ara', breakfast: 'Kahvaltı', lunch: 'Öğle Yemeği', dinner: 'Akşam Yemeği', snack: 'Ara Öğün', add: 'Ekle', grams: 'gram', portion: 'Porsiyon', macros: 'Makrolar', noResults: 'Yemek bulunamadı' },
    workout: { title: 'Antrenman', programs: 'Programlar', todayWorkout: 'Bugünün Antrenmanı', sets: 'Set', reps: 'Tekrar', rest: 'Dinlenme', seconds: 'saniye', start: 'Başlat', pause: 'Duraklat', finish: 'Bitir', restDay: 'Dinlenme günü', formTip: 'Form ipucu' },
    profile: { title: 'Profil', name: 'Ad', age: 'Yaş', height: 'Boy', weight: 'Kilo', gender: 'Cinsiyet', activity: 'Aktivite seviyesi', goal: 'Hedef', save: 'Kaydet', logout: 'Çıkış yap' },
    errors: { generic: 'Bir hata oluştu.', network: 'Bağlantı kurulamadı.', required: 'Bu alan zorunludur.', invalidEmail: 'Geçerli bir e-posta girin.', saveFailed: 'Kaydedilemedi.' },
  },
  en: {
    nav: { home: 'Home', food: 'Food', workout: 'Workout', progress: 'Progress', profile: 'Profile' },
    dashboard: { greeting: 'Hello', today: 'Today', calories: 'Calories', protein: 'Protein', water: 'Water', steps: 'Steps', quickActions: 'Quick Actions', addFood: 'Add Food', startWorkout: 'Start Workout', dailyGoal: 'Daily Goal', streak: 'Day Streak' },
    food: { title: 'Nutrition', search: 'Search food', breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', add: 'Add', grams: 'grams', portion: 'Portion', macros: 'Macros', noResults: 'No food found' },
    workout: { title: 'Workout', programs: 'Programs', todayWorkout: "Today's Workout", sets: 'Sets', reps: 'Reps', rest: 'Rest', seconds: 'seconds', start: 'Start', pause: 'Pause', finish: 'Finish', restDay: 'Rest day', formTip: 'Form tip' },
    profile: { title: 'Profile', name: 'Name', age: 'Age', height: 'Height', weight: 'Weight', gender: 'Gender', activity: 'Activity level', goal: 'Goal', save: 'Save', logout: 'Log out' },
    errors: { generic: 'Something went wrong.', network: 'Unable to connect.', required: 'This field is required.', invalidEmail: 'Enter a valid email.', saveFailed: 'Could not save.' },
  },
  de: {
    nav: { home: 'Startseite', food: 'Ernährung', workout: 'Training', progress: 'Fortschritt', profile: 'Profil' },
    dashboard: { greeting: 'Hallo', today: 'Heute', calories: 'Kalorien', protein: 'Protein', water: 'Wasser', steps: 'Schritte', quickActions: 'Schnellaktionen', addFood: 'Essen hinzufügen', startWorkout: 'Training starten', dailyGoal: 'Tagesziel', streak: 'Tages-Serie' },
    food: { title: 'Ernährung', search: 'Essen suchen', breakfast: 'Frühstück', lunch: 'Mittagessen', dinner: 'Abendessen', snack: 'Snack', add: 'Hinzufügen', grams: 'Gramm', portion: 'Portion', macros: 'Makros', noResults: 'Kein Essen gefunden' },
    workout: { title: 'Training', programs: 'Programme', todayWorkout: 'Heutiges Training', sets: 'Sätze', reps: 'Wiederholungen', rest: 'Pause', seconds: 'Sekunden', start: 'Starten', pause: 'Pausieren', finish: 'Beenden', restDay: 'Ruhetag', formTip: 'Form-Tipp' },
    profile: { title: 'Profil', name: 'Name', age: 'Alter', height: 'Größe', weight: 'Gewicht', gender: 'Geschlecht', activity: 'Aktivitätsniveau', goal: 'Ziel', save: 'Speichern', logout: 'Abmelden' },
    errors: { generic: 'Ein Fehler ist aufgetreten.', network: 'Keine Verbindung möglich.', required: 'Dieses Feld ist erforderlich.', invalidEmail: 'Gib eine gültige E-Mail ein.', saveFailed: 'Speichern fehlgeschlagen.' },
  },
};

export const t = (language = 'tr', path) => path.split('.').reduce((value, key) => value?.[key], translations[language] || translations.tr) || path;
export default translations;
