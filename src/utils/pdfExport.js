const printDocument = (title, body) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) return false;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>
    @page{margin:18mm}body{font-family:Arial,sans-serif;color:#161326;line-height:1.5}h1{color:#4F46E5;border-bottom:2px solid #7C3AED;padding-bottom:8px}h2{margin-top:24px;color:#7C3AED}.card{border:1px solid #ddd;border-radius:8px;padding:12px;margin:10px 0}.muted{color:#666}@media print{.no-print{display:none}}
  </style></head><body><h1>${title}</h1>${body}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
};

export function exportDietPlan(plan = {}) {
  const meals = Array.isArray(plan.meals) ? plan.meals : [];
  const body = `<p class="muted">Günlük kalori: ${plan.calories || '-'} kcal</p>${meals.map((meal) => `<div class="card"><h2>${meal.name || meal.type || 'Öğün'}</h2><p>${meal.foods?.map((food) => `${food.name || food.name_tr || food} (${food.grams || food.default_grams || ''} g)`).join(', ') || meal.description || ''}</p></div>`).join('')}`;
  return printDocument('GFitt Beslenme Planı', body);
}

export function exportWorkout(workout = {}) {
  const exercises = workout.exercises || [];
  const body = `<p class="muted">${workout.name || 'Antrenman'}</p>${exercises.map((exercise) => `<div class="card"><h2>${exercise.name_tr || exercise.name}</h2><p>${exercise.sets} set × ${exercise.reps} tekrar · ${exercise.rest_seconds || 0} saniye dinlenme</p><p>${exercise.form_tip_tr || ''}</p></div>`).join('')}`;
  return printDocument('GFitt Antrenman Planı', body);
}

export function exportProgress(progress = {}) {
  const entries = Object.entries(progress.metrics || progress);
  const body = `<div class="card">${entries.map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`).join('')}</div>`;
  return printDocument('GFitt İlerleme Raporu', body);
}
