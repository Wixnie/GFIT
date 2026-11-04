import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const UserDataContext = createContext(null);
const STORAGE_PREFIX = 'gfitt_user_data_';
const dateKey = (date = new Date()) => date.toISOString().slice(0, 10);
const emptyData = () => ({ profile: {}, foodLogs: {}, water: 0, steps: 0, sleep: 0, activityDates: [] });

export function UserDataProvider({ children }) {
  const { user } = useAuth();
  const storageKey = `${STORAGE_PREFIX}${user?.id || 'guest'}`;
  const [data, setData] = useState(() => {
    try { return { ...emptyData(), ...JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}guest`) || '{}') }; } catch { return emptyData(); }
  });
  const today = dateKey();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setData({ ...emptyData(), ...stored });
    } catch {
      setData(emptyData());
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [storageKey, data]);

  const update = useCallback((changes) => setData((current) => ({ ...current, ...changes })), []);
  const setProfile = useCallback((profile) => update({ profile: { ...data.profile, ...profile } }), [data.profile, update]);
  const addFoodLog = useCallback((food, grams = food.default_grams || 100, meal = 'snack') => {
    const entry = { ...food, grams, meal, loggedAt: new Date().toISOString() };
    setData((current) => ({ ...current, foodLogs: { ...current.foodLogs, [today]: [...(current.foodLogs[today] || []), entry] }, activityDates: [...new Set([...current.activityDates, today])] }));
    return entry;
  }, [today]);
  const removeFoodLog = useCallback((index) => setData((current) => ({ ...current, foodLogs: { ...current.foodLogs, [today]: (current.foodLogs[today] || []).filter((_, i) => i !== index) } })), [today]);
  const addWater = useCallback((amount = 250) => setData((current) => ({ ...current, water: current.water + Number(amount) })), []);
  const setWater = useCallback((amount) => update({ water: Math.max(0, Number(amount) || 0) }), [update]);
  const setSteps = useCallback((amount) => update({ steps: Math.max(0, Number(amount) || 0) }), [update]);
  const setSleep = useCallback((hours) => update({ sleep: Math.max(0, Number(hours) || 0) }), [update]);
  const todayFoodLogs = data.foodLogs[today] || [];
  const streak = useMemo(() => {
    const dates = new Set(data.activityDates || []);
    let count = 0;
    const cursor = new Date();
    while (dates.has(dateKey(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); }
    return count;
  }, [data.activityDates]);

  const value = useMemo(() => ({ profile: data.profile, foodLogs: data.foodLogs, todayFoodLogs, water: data.water, steps: data.steps, sleep: data.sleep, streak, setProfile, addFoodLog, removeFoodLog, addWater, setWater, setSteps, setSleep }), [data, todayFoodLogs, streak, setProfile, addFoodLog, removeFoodLog, addWater, setWater, setSteps, setSleep]);
  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) throw new Error('useUserData must be used inside UserDataProvider');
  return context;
}

export default UserDataContext;
