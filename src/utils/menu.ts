export type MenuItem = {
  name: string;
  desc: string;
  price: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

/** メニューマスターデータ */
export const MENU: MenuCategory[] = [
  {
    name: 'Coffee',
    items: [
      { name: 'エスプレッソ',     desc: 'シングルオリジン豆使用',           price: '¥500' },
      { name: 'カフェラテ',       desc: '濃厚なエスプレッソとスチームミルク', price: '¥650' },
      { name: 'カプチーノ',       desc: 'きめ細かいフォームミルク',          price: '¥680' },
      { name: 'ドリップコーヒー', desc: '季節のブレンド・本日の一杯',         price: '¥550' },
      { name: 'アイスコーヒー',   desc: '水出し12時間抽出',                 price: '¥600' },
    ],
  },
  {
    name: 'Tea & Others',
    items: [
      { name: 'アールグレイ', desc: 'ベルガモット香るリーフティー', price: '¥580' },
      { name: '抹茶ラテ',     desc: '宇治抹茶使用、豆乳変更可',   price: '¥680' },
      { name: 'チャイ',       desc: 'スパイス香るインドチャイ',   price: '¥650' },
      { name: 'レモネード',   desc: '国産レモン生搾り',           price: '¥620' },
    ],
  },
  {
    name: 'Food',
    items: [
      { name: 'クロワッサン',          desc: '毎朝焼きたて・バター香る',  price: '¥380' },
      { name: 'チーズトースト',        desc: '厚切りパンにゴーダチーズ',  price: '¥550' },
      { name: '本日のスコーン',        desc: '季節のジャム添え',          price: '¥450' },
      { name: 'プリン・ア・ラ・モード', desc: '昔ながらの固めプリン',      price: '¥580' },
    ],
  },
];

/** 価格文字列が "¥数字" 形式かチェック */
export function isValidPrice(price: string): boolean {
  return /^¥\d+$/.test(price);
}

/** カテゴリ名の一覧を返す */
export function getCategoryNames(): string[] {
  return MENU.map((c) => c.name);
}

/** 全アイテム数を返す */
export function getTotalItemCount(): number {
  return MENU.reduce((sum, cat) => sum + cat.items.length, 0);
}
