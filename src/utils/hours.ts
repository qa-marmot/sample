export type HoursEntry = {
  day: string;
  time: string;
  closed: boolean;
};

/** 営業時間マスターデータ (index 0 = 月曜日) */
export const HOURS: HoursEntry[] = [
  { day: '月曜日',     time: '定休日',         closed: true  },
  { day: '火曜日',     time: '10:00 – 20:00', closed: false },
  { day: '水曜日',     time: '10:00 – 20:00', closed: false },
  { day: '木曜日',     time: '10:00 – 20:00', closed: false },
  { day: '金曜日',     time: '10:00 – 21:00', closed: false },
  { day: '土曜日',     time: '9:00 – 21:00',  closed: false },
  { day: '日曜日・祝日', time: '9:00 – 19:00',  closed: false },
];

/**
 * JS の getDay() (0=日〜6=土) を HOURS 配列のインデックスに変換する
 * HOURS[0]=月, HOURS[6]=日
 */
export function getTodayIndex(jsDay: number): number {
  if (jsDay < 0 || jsDay > 6) throw new RangeError(`Invalid day: ${jsDay}`);
  // JS: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  // OUR: 0=Mon 1=Tue 2=Wed 3=Thu 4=Fri 5=Sat 6=Sun
  const map: Record<number, number> = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
  return map[jsDay];
}

/**
 * 指定した曜日・時刻が営業中かどうかを返す
 * @param jsDay  JS の getDay() 値 (0=日〜6=土)
 * @param hour   時 (0-23)
 * @param minute 分 (0-59)
 */
export function isOpenAt(jsDay: number, hour: number, minute: number): boolean {
  const idx = getTodayIndex(jsDay);
  const entry = HOURS[idx];
  if (entry.closed) return false;

  // "10:00 – 20:00" or "9:00 – 21:00" 形式をパース
  const match = entry.time.match(/^(\d+):(\d+)\s*[–\-]\s*(\d+):(\d+)$/);
  if (!match) return false;

  const openTotal  = parseInt(match[1]) * 60 + parseInt(match[2]);
  const closeTotal = parseInt(match[3]) * 60 + parseInt(match[4]);
  const nowTotal   = hour * 60 + minute;

  return nowTotal >= openTotal && nowTotal < closeTotal;
}

/** ラストオーダーは閉店30分前 */
export function isLastOrderAt(jsDay: number, hour: number, minute: number): boolean {
  const idx = getTodayIndex(jsDay);
  const entry = HOURS[idx];
  if (entry.closed) return false;

  const match = entry.time.match(/^(\d+):(\d+)\s*[–\-]\s*(\d+):(\d+)$/);
  if (!match) return false;

  const closeTotal     = parseInt(match[3]) * 60 + parseInt(match[4]);
  const lastOrderTotal = closeTotal - 30;
  const nowTotal       = hour * 60 + minute;

  return nowTotal >= lastOrderTotal && nowTotal < closeTotal;
}
