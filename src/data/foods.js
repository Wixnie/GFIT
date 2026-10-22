/**
 * GFitt Besin Veritabanı (100g veya belirtilen porsiyon bazlı)
 * p: Protein (g), c: Karbonhidrat (g), f: Yağ (g), fiber: Lif (g)
 */
export const FOODS = [
  // --- GERÇEK HAYAT & SOKAK LEZZETLERİ (LOGMA & FITIA STANDARDI) ---
  { 
    id: 'double-smash-burger', 
    name: 'Double Smash Burger & Patates', 
    name_tr: 'Double Smash Burger & Patates', 
    name_en: 'Double Smash Burger & Fries', 
    name_de: 'Double Smash Burger & Pommes', 
    kcal: 1100, p: 52, c: 85, f: 62, fiber: 5, 
    cat: 'yemek', emoji: '🍔', 
    portion: 'Double köfte, cheddar, patates kızartması ile' 
  },
  { 
    id: 'tavuk-doner-durum-ayran', 
    name: 'Tavuk Döner Dürüm & Köpüklü Ayran', 
    name_tr: 'Tavuk Döner Dürüm & Köpüklü Ayran', 
    name_en: 'Chicken Doner Wrap & Ayran', 
    name_de: 'Hähnchen Döner Dürüm & Ayran', 
    kcal: 680, p: 42, c: 64, f: 26, fiber: 4, 
    cat: 'yemek', emoji: '🌯', 
    portion: '1 tam lavaş dürüm ve 1 bakır tas ayran' 
  },
  { 
    id: 'chicken-burrito', 
    name: 'Chicken Burrito', 
    name_tr: 'Chicken Burrito', 
    name_en: 'Chicken Burrito', 
    name_de: 'Hähnchen Burrito', 
    kcal: 420, p: 32, c: 45, f: 12, fiber: 6, 
    cat: 'yemek', emoji: '🌯', 
    portion: '1 dürüm, tavuk, pirinç, fasulye, sos' 
  },
  { 
    id: 'gece-pizza', 
    name: 'Gece Pizzası (2 Dilim)', 
    name_tr: 'Gece Pizzası (2 Dilim)', 
    name_en: 'Late Night Pizza (2 Slices)', 
    name_de: 'Nachtpizza (2 Stücke)', 
    kcal: 580, p: 24, c: 66, f: 24, fiber: 3, 
    cat: 'yemek', emoji: '🍕', 
    portion: '2 orta dilim karışık/margherita' 
  },
  { 
    id: 'ramen-kase', 
    name: 'Ramen Kasesi', 
    name_tr: 'Ramen Kasesi', 
    name_en: 'Ramen Bowl', 
    name_de: 'Ramen Schüssel', 
    kcal: 550, p: 35, c: 58, f: 18, fiber: 4, 
    cat: 'yemek', emoji: '🍜', 
    portion: '1 kase, erişte, et suyu, yumurta, tavuk/et' 
  },
  { 
    id: 'coke-zero', 
    name: 'Coke Zero / Şekersiz Kola', 
    name_tr: 'Coke Zero / Şekersiz Kola', 
    name_en: 'Coke Zero / Diet Soda', 
    name_de: 'Cola Zero / Diät Limo', 
    kcal: 0, p: 0, c: 0, f: 0, fiber: 0, 
    cat: 'icecek', emoji: '🥤', 
    portion: '1 kutu, 330ml' 
  },

  // --- TEMEL PROTEİN VE SPORCU BESİNLERİ ---
  { id: 'tavuk-gogsu', name: 'Tavuk göğsü (ızgara)', kcal: 165, p: 31, c: 0, f: 3.6, fiber: 0, cat: 'protein', emoji: '🍗', portion: '100g ızgara porsiyon' },
  { id: 'tavuk-but', name: 'Tavuk but (derisiz)', kcal: 177, p: 24, c: 0, f: 8.1, fiber: 0, cat: 'protein', emoji: '🍗', portion: '100g porsiyon' },
  { id: 'dana-kiyma', name: 'Dana kıyma (%10 yağ)', kcal: 176, p: 20, c: 0, f: 10, fiber: 0, cat: 'protein', emoji: '🥩', portion: '100g porsiyon' },
  { id: 'kofte', name: 'Izgara köfte', kcal: 240, p: 22, c: 4, f: 15, fiber: 0.5, cat: 'protein', emoji: '🍖', portion: '100g (~3 köfte)' },
  { id: 'somon', name: 'Somon fileto', kcal: 208, p: 20, c: 0, f: 13, fiber: 0, cat: 'protein', emoji: '🐟', portion: '100g fırınlanmış' },
  { id: 'ton', name: 'Ton balığı (suda süzülmüş)', kcal: 116, p: 26, c: 0, f: 1, fiber: 0, cat: 'protein', emoji: '🐟', portion: '100g porsiyon' },
  { id: 'yumurta', name: 'Yumurta (haşlanmış)', kcal: 155, p: 13, c: 1.1, f: 11, fiber: 0, cat: 'protein', emoji: '🥚', portion: '2 adet orta boy (~100g)' },
  { id: 'yumurta-ak', name: 'Yumurta akı', kcal: 52, p: 11, c: 0.7, f: 0.2, fiber: 0, cat: 'protein', emoji: '🥚', portion: '100g (~3 yumurta akı)' },
  { id: 'whey', name: 'Whey protein tozu', kcal: 380, p: 80, c: 7, f: 4, fiber: 1, cat: 'protein', emoji: '💪', portion: '1 ölçek (~30g)' },
  { id: 'lor', name: 'Lor peyniri', kcal: 90, p: 16, c: 2, f: 1.5, fiber: 0, cat: 'protein', emoji: '🧀', portion: '100g porsiyon' },
  { id: 'yogurt', name: 'Süzme yoğurt', kcal: 97, p: 9, c: 4, f: 5, fiber: 0, cat: 'protein', emoji: '🥛', portion: '100g porsiyon' },
  { id: 'hindi', name: 'Hindi göğsü', kcal: 135, p: 30, c: 0, f: 1, fiber: 0, cat: 'protein', emoji: '🦃', portion: '100g ızgara' },

  // --- KARBONHİDRAT VE TAHILLAR ---
  { id: 'yulaf', name: 'Yulaf ezmesi', kcal: 389, p: 17, c: 66, f: 7, fiber: 10.6, cat: 'karb', emoji: '🥣', portion: '100g kuru' },
  { id: 'pilav', name: 'Pirinç pilavı', kcal: 140, p: 2.6, c: 28, f: 2.2, fiber: 0.4, cat: 'karb', emoji: '🍚', portion: '100g pişmiş' },
  { id: 'bulgur', name: 'Bulgur pilavı', kcal: 130, p: 4, c: 26, f: 1.2, fiber: 4.5, cat: 'karb', emoji: '🍚', portion: '100g pişmiş' },
  { id: 'makarna', name: 'Makarna (haşlanmış)', kcal: 157, p: 5.8, c: 30, f: 0.9, fiber: 1.8, cat: 'karb', emoji: '🍝', portion: '100g haşlanmış' },
  { id: 'patates-firin', name: 'Fırın patates', kcal: 120, p: 2.5, c: 22, f: 3, fiber: 2.2, cat: 'karb', emoji: '🥔', portion: '100g fırınlanmış' },
  { id: 'patates', name: 'Haşlanmış patates', kcal: 87, p: 2, c: 20, f: 0.1, fiber: 1.8, cat: 'karb', emoji: '🥔', portion: '100g haşlanmış' },
  { id: 'ekmek-tam', name: 'Tam buğday ekmek', kcal: 247, p: 13, c: 41, f: 3.4, fiber: 7, cat: 'karb', emoji: '🍞', portion: '1 dilim (~40g)' },
  { id: 'ekmek-beyaz', name: 'Beyaz ekmek', kcal: 265, p: 9, c: 49, f: 3.2, fiber: 2.7, cat: 'karb', emoji: '🍞', portion: '1 dilim (~35g)' },
  { id: 'lavas', name: 'Lavaş', kcal: 272, p: 8, c: 55, f: 1.2, fiber: 2.5, cat: 'karb', emoji: '🫓', portion: '1 adet (~60g)' },

  // --- TÜRK MUTFAĞI VE EV YEMEKLERİ ---
  { id: 'menemen', name: 'Menemen', kcal: 120, p: 6.5, c: 5, f: 8, fiber: 1.5, cat: 'yemek', emoji: '🍳', portion: '2 yumurta, domates, biber' },
  { id: 'mercimek-corba', name: 'Mercimek çorbası', kcal: 72, p: 4.5, c: 10, f: 1.5, fiber: 2.5, cat: 'yemek', emoji: '🍲', portion: '1 kase (~250ml)' },
  { id: 'ezogelin', name: 'Ezogelin çorba', kcal: 68, p: 3.2, c: 10, f: 1.6, fiber: 2, cat: 'yemek', emoji: '🍲', portion: '1 kase (~250ml)' },
  { id: 'kuru-fasulye', name: 'Kuru fasulye', kcal: 140, p: 8.7, c: 20, f: 3.2, fiber: 6.5, cat: 'yemek', emoji: '🫘', portion: '1 porsiyon (~200g)' },
  { id: 'nohut', name: 'Nohut yemeği', kcal: 145, p: 7.5, c: 22, f: 3, fiber: 6, cat: 'yemek', emoji: '🫘', portion: '1 porsiyon (~200g)' },
  { id: 'lahmacun', name: 'Lahmacun', kcal: 210, p: 8, c: 26, f: 8, fiber: 2, cat: 'yemek', emoji: '🥙', portion: '1 adet (~80g)' },
  { id: 'tavuk-pilav', name: 'Tavuklu pilav', kcal: 280, p: 18, c: 32, f: 8, fiber: 1, cat: 'yemek', emoji: '🍚', portion: '1 tam porsiyon' },

  // --- SAĞLIKLI YAĞLAR VE KURUYEMİŞLER ---
  { id: 'avokado', name: 'Avokado', kcal: 160, p: 2, c: 9, f: 15, fiber: 6.7, cat: 'yag', emoji: '🥑', portion: 'Yarım avokado (~75g)' },
  { id: 'zeytinyagi', name: 'Zeytinyağı', kcal: 884, p: 0, c: 0, f: 100, fiber: 0, cat: 'yag', emoji: '🫒', portion: '1 yemek kaşığı (~10g)' },
  { id: 'ceviz', name: 'Ceviz içi', kcal: 654, p: 15, c: 14, f: 65, fiber: 6.7, cat: 'yag', emoji: '🌰', portion: '1 avuç (~30g)' },
  { id: 'badem', name: 'Çiğ badem', kcal: 579, p: 21, c: 22, f: 50, fiber: 12.5, cat: 'yag', emoji: '🥜', portion: '1 avuç (~30g)' },
  { id: 'peanut-butter', name: 'Fıstık ezmesi (%100 fıstık)', kcal: 588, p: 25, c: 20, f: 50, fiber: 8, cat: 'yag', emoji: '🥜', portion: '1 tatlı kaşığı (~15g)' },

  // --- SEBZE VE MEYVELER ---
  { id: 'muz', name: 'Muz', kcal: 89, p: 1.1, c: 23, f: 0.3, fiber: 2.6, cat: 'meyve', emoji: '🍌', portion: '1 adet orta boy' },
  { id: 'elma', name: 'Elma', kcal: 52, p: 0.3, c: 14, f: 0.2, fiber: 2.4, cat: 'meyve', emoji: '🍎', portion: '1 adet orta boy' },
  { id: 'brokoli', name: 'Brokoli (haşlanmış)', kcal: 34, p: 2.8, c: 7, f: 0.4, fiber: 2.6, cat: 'sebze', emoji: '🥦', portion: '100g porsiyon' },
  { id: 'domates', name: 'Domates', kcal: 18, p: 0.9, c: 3.9, f: 0.2, fiber: 1.2, cat: 'sebze', emoji: '🍅', portion: '1 adet orta boy' },
  { id: 'salatalik', name: 'Salatalık', kcal: 15, p: 0.7, c: 3.6, f: 0.1, fiber: 0.5, cat: 'sebze', emoji: '🥒', portion: '1 adet orta boy' },
  { id: 'coban', name: 'Çoban salata', kcal: 55, p: 1.2, c: 5, f: 3.5, fiber: 1.8, cat: 'sebze', emoji: '🥗', portion: '1 kase' },

  // --- İÇECEKLER VE DİĞER ---
  { id: 'ayran', name: 'Ayran', kcal: 35, p: 1.7, c: 2.5, f: 1.8, fiber: 0, cat: 'icecek', emoji: '🥛', portion: '1 kutu (200ml)' },
  { id: 'sut', name: 'Yarım yağlı süt (%1.5)', kcal: 47, p: 3.3, c: 4.8, f: 1.5, fiber: 0, cat: 'icecek', emoji: '🥛', portion: '1 su bardağı (200ml)' },
  { id: 'kahve-filtre', name: 'Filtre kahve (sade)', kcal: 2, p: 0.3, c: 0, f: 0, fiber: 0, cat: 'icecek', emoji: '☕', portion: '1 kupa (~200ml)' }
];

/**
 * Gramaja göre kalori ve makro hesaplama fonksiyonu (Lif dahil)
 */
export function macrosForGrams(food, grams) {
  if (!food) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const numericGrams = Number(grams) || 0;
  const multiplier = numericGrams / 100;

  return {
    calories: Math.round(((food.kcal || 0) * multiplier) * 10) / 10,
    protein: Math.round(((food.p || 0) * multiplier) * 10) / 10,
    carbs: Math.round(((food.c || 0) * multiplier) * 10) / 10,
    fat: Math.round(((food.f || 0) * multiplier) * 10) / 10,
    fiber: Math.round(((food.fiber || 0) * multiplier) * 10) / 10,
  };
}