const MAX_DAILY_ADS = 3;
const keyForToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `gfitt_ad_count_${year}-${month}-${day}`;
};

export function getAdCount() {
  if (typeof window === 'undefined' || !window.localStorage) return 0;
  const count = Number.parseInt(window.localStorage.getItem(keyForToday()) || '0', 10);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function incrementAd() {
  const next = Math.min(MAX_DAILY_ADS, getAdCount() + 1);
  if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(keyForToday(), String(next));
  return next;
}

export function canWatchAd() {
  return getAdCount() < MAX_DAILY_ADS;
}

export { MAX_DAILY_ADS };
