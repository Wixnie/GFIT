import { Lightbulb } from 'lucide-react';

const scientificTips = [
  'Kas protein sentezini desteklemek için proteini gün içine 3–4 öğüne böl.',
  'Her ana öğünde lifli karbonhidrat seçmek tokluk süresini uzatır.',
  'Düzenli uyku, iştah hormonlarının dengelenmesine yardımcı olur.',
  'Antrenmandan önce hafif karbonhidrat performansını destekleyebilir.',
  'Günlük adım sayısını artırmak enerji harcamasına küçük ama kalıcı katkı sağlar.',
  'Su ihtiyacı terleme, hava sıcaklığı ve aktiviteye göre değişir.',
  'Ağırlık antrenmanında kontrollü tekrarlar hareket kalitesini artırır.',
  'Sebze çeşitliliği farklı vitamin, mineral ve fitobesinleri bir araya getirir.',
  'Kilo değişimini tek gün yerine haftalık ortalamalarla değerlendir.',
  'Antrenman sonrası protein ve karbonhidrat toparlanmayı destekler.',
  'İlerlemeyi takip ederken bel çevresi ve güç değerlerini de kaydet.',
  'Kafeini yatmadan birkaç saat önce sınırlamak uyku kalitesini koruyabilir.',
  'Yavaş yemek, tokluk sinyallerinin fark edilmesine zaman tanır.',
  'Güç gelişimi için haftalık yükü küçük adımlarla artır.',
  'Dengeli bir tabak protein, sebze, karbonhidrat ve sağlıklı yağ içerebilir.',
  'Esneme tek başına ısınmanın yerini tutmaz; önce hafif hareket et.',
  'Kas ağrısı ilerleme ölçütü değildir; performans ve süreklilik daha değerlidir.',
  'Günlük lif hedefi için baklagil, sebze, meyve ve tam tahıl tüket.',
  'Dinlenme günleri adaptasyon ve toparlanmanın önemli bir parçasıdır.',
  'Antrenman sırasında nefesini tutmak yerine ritmik nefes al.',
  'Porsiyonları ölçmek kalori tahminindeki belirsizliği azaltır.',
  'Açlık ve susuzluk sinyalleri bazen birbirine benzeyebilir.',
  'Düzenli direnç egzersizi kemik ve kas sağlığını destekler.',
  'Renkli sebze ve meyveler antioksidan çeşitliliği sağlar.',
  'Sürdürülebilir hedefler kısa süreli katı kısıtlamalardan daha kalıcıdır.',
  'Antrenman öncesi eklem hareketliliği güvenli hareket açıklığını artırır.',
  'Uyku öncesi ekran ışığını azaltmak uykuya geçişi kolaylaştırabilir.',
  'Ağırlıklar arasında yeterli dinlenme, sonraki sette kaliteyi korur.',
  'Her hafta aynı koşullarda ölçüm yapmak trendleri daha anlaşılır kılar.',
  'Küçük alışkanlıkları düzenli tekrarlamak uzun vadeli sonuçları güçlendirir.',
];

export default function TipCard() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000);
  const tip = scientificTips[dayOfYear % scientificTips.length];
  return <aside className="flex gap-3 rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/20 text-[#C4B5FD]"><Lightbulb size={19} /></div><div><p className="text-xs font-bold uppercase tracking-wide text-[#C4B5FD]">Günün bilimsel ipucu</p><p className="mt-1 text-sm leading-5 text-white/75">{tip}</p></div></aside>;
}

export { scientificTips };
