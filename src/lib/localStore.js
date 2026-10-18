const KEY = 'fitapp.v1'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { users: {}, session: null }
  } catch {
    return { users: {}, session: null }
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function uid() {
  return crypto.randomUUID()
}

function ensureUser(db, userId) {
  if (!db.users[userId]) {
    db.users[userId] = {
      profile: {},
      food: [],
      workouts: [],
      supplements: [],
      weight: [],
    }
  }
  return db.users[userId]
}

export const localAuth = {
  getSession() {
    const db = read()
    if (!db.session) return null
    return db.session
  },
  signUp({ email, password, display_name }) {
    const db = read()
    const exists = Object.values(db.users).find((u) => u.email === email)
    if (exists) throw new Error('Bu e-posta zaten kayıtlı.')
    const id = uid()
    db.users[id] = {
      email,
      password,
      profile: {
        id,
        display_name: display_name || email.split('@')[0],
        age: 22,
        height_cm: 185,
        weight_kg: 90,
        calorie_target: 2600,
        protein_target: 170,
        carb_target: 310,
        fat_target: 75,
      },
      food: [],
      workouts: [],
      supplements: [],
      weight: [],
    }
    db.session = { id, email }
    write(db)
    return db.session
  },
  signIn({ email, password }) {
    const db = read()
    const entry = Object.entries(db.users).find(([, u]) => u.email === email)
    if (!entry) throw new Error('Hesap bulunamadı.')
    const [id, u] = entry
    if (u.password !== password) throw new Error('Şifre hatalı.')
    db.session = { id, email }
    write(db)
    return db.session
  },
  signOut() {
    const db = read()
    db.session = null
    write(db)
  },
}

export const localDb = {
  getProfile(userId) {
    return ensureUser(read(), userId).profile
  },
  updateProfile(userId, patch) {
    const db = read()
    const u = ensureUser(db, userId)
    u.profile = { ...u.profile, ...patch, id: userId }
    write(db)
    return u.profile
  },
  listFood(userId, date) {
    return ensureUser(read(), userId).food.filter((f) => f.logged_on === date)
  },
  addFood(userId, row) {
    const db = read()
    const u = ensureUser(db, userId)
    const item = { id: uid(), user_id: userId, ...row }
    u.food.push(item)
    write(db)
    return item
  },
  deleteFood(userId, id) {
    const db = read()
    const u = ensureUser(db, userId)
    u.food = u.food.filter((f) => f.id !== id)
    write(db)
  },
  listWorkouts(userId, date) {
    return ensureUser(read(), userId).workouts.filter((w) => w.logged_on === date)
  },
  saveWorkout(userId, workout) {
    const db = read()
    const u = ensureUser(db, userId)
    const item = { id: uid(), user_id: userId, ...workout }
    u.workouts.push(item)
    write(db)
    return item
  },
  listSupplements(userId, date) {
    return ensureUser(read(), userId).supplements.filter((s) => s.logged_on === date)
  },
  toggleSupplement(userId, supplement_id, date) {
    const db = read()
    const u = ensureUser(db, userId)
    const i = u.supplements.findIndex(
      (s) => s.supplement_id === supplement_id && s.logged_on === date,
    )
    if (i >= 0) {
      u.supplements.splice(i, 1)
      write(db)
      return false
    }
    u.supplements.push({ id: uid(), user_id: userId, supplement_id, logged_on: date, taken: true })
    write(db)
    return true
  },
  listWeight(userId) {
    return [...ensureUser(read(), userId).weight].sort((a, b) => a.logged_on.localeCompare(b.logged_on))
  },
  upsertWeight(userId, weight_kg, logged_on) {
    const db = read()
    const u = ensureUser(db, userId)
    const i = u.weight.findIndex((w) => w.logged_on === logged_on)
    const row = { id: i >= 0 ? u.weight[i].id : uid(), user_id: userId, weight_kg, logged_on }
    if (i >= 0) u.weight[i] = row
    else u.weight.push(row)
    write(db)
    return row
  },
}
