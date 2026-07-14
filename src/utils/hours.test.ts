import { describe, it, expect } from 'vitest';
import {
  HOURS,
  getTodayIndex,
  getTodayIndexForTimeZone,
  isOpenAt,
  isLastOrderAt,
} from './hours';

// ── HOURS データ整合性 ───────────────────────────────────────
describe('HOURS master data', () => {
  it('7件のエントリを持つ', () => {
    expect(HOURS).toHaveLength(7);
  });

  it('index 0 (月曜日) は定休日', () => {
    expect(HOURS[0].closed).toBe(true);
    expect(HOURS[0].day).toBe('月曜日');
  });

  it('火〜日曜日はすべて営業日', () => {
    HOURS.slice(1).forEach((entry) => {
      expect(entry.closed).toBe(false);
    });
  });

  it('営業日の time は "H:MM – H:MM" 形式', () => {
    const re = /^\d+:\d{2}\s*[–\-]\s*\d+:\d{2}$/;
    HOURS.filter((e) => !e.closed).forEach((entry) => {
      expect(entry.time).toMatch(re);
    });
  });

  it('定休日の time は "定休日"', () => {
    HOURS.filter((e) => e.closed).forEach((entry) => {
      expect(entry.time).toBe('定休日');
    });
  });

  it('金曜日(index 4)は21:00まで営業', () => {
    expect(HOURS[4].day).toBe('金曜日');
    expect(HOURS[4].time).toContain('21:00');
  });

  it('土曜日(index 5)は9:00開店', () => {
    expect(HOURS[5].day).toBe('土曜日');
    expect(HOURS[5].time).toMatch(/^9:00/);
  });
});

// ── getTodayIndex ────────────────────────────────────────────
describe('getTodayIndex', () => {
  it('日曜日(JS=0) → index 6', () => {
    expect(getTodayIndex(0)).toBe(6);
  });

  it('月曜日(JS=1) → index 0', () => {
    expect(getTodayIndex(1)).toBe(0);
  });

  it('火曜日(JS=2) → index 1', () => {
    expect(getTodayIndex(2)).toBe(1);
  });

  it('土曜日(JS=6) → index 5', () => {
    expect(getTodayIndex(6)).toBe(5);
  });

  it('無効な値はエラーをスロー', () => {
    expect(() => getTodayIndex(-1)).toThrow(RangeError);
    expect(() => getTodayIndex(7)).toThrow(RangeError);
  });
});

// ── getTodayIndexForTimeZone ─────────────────────────────────
describe('getTodayIndexForTimeZone', () => {
  it('UTCでは月曜でも、日本時間で火曜ならindex 1を返す', () => {
    const date = new Date('2026-07-13T15:30:00.000Z');
    expect(getTodayIndexForTimeZone(date, 'Asia/Tokyo')).toBe(1);
  });

  it('UTCでは日曜でも、日本時間で月曜ならindex 0を返す', () => {
    const date = new Date('2026-07-12T15:30:00.000Z');
    expect(getTodayIndexForTimeZone(date, 'Asia/Tokyo')).toBe(0);
  });

  it('無効な日付はエラーをスロー', () => {
    expect(() => getTodayIndexForTimeZone(new Date('invalid'))).toThrow(RangeError);
  });
});

// ── isOpenAt ─────────────────────────────────────────────────
describe('isOpenAt', () => {
  it('月曜日(定休日)は常に false', () => {
    // JS 1 = Monday
    expect(isOpenAt(1, 12, 0)).toBe(false);
    expect(isOpenAt(1, 10, 0)).toBe(false);
  });

  it('火曜日 10:00 は営業中', () => {
    expect(isOpenAt(2, 10, 0)).toBe(true);
  });

  it('火曜日 9:59 は営業前', () => {
    expect(isOpenAt(2, 9, 59)).toBe(false);
  });

  it('火曜日 20:00 は営業終了', () => {
    // 閉店時刻は含まない (< closeTotal)
    expect(isOpenAt(2, 20, 0)).toBe(false);
  });

  it('火曜日 19:59 は営業中', () => {
    expect(isOpenAt(2, 19, 59)).toBe(true);
  });

  it('金曜日 20:30 は営業中 (21:00閉店)', () => {
    // JS 5 = Friday
    expect(isOpenAt(5, 20, 30)).toBe(true);
  });

  it('土曜日 9:00 は営業中 (9:00開店)', () => {
    // JS 6 = Saturday
    expect(isOpenAt(6, 9, 0)).toBe(true);
  });

  it('日曜日 8:59 は営業前', () => {
    // JS 0 = Sunday
    expect(isOpenAt(0, 8, 59)).toBe(false);
  });
});

// ── isLastOrderAt ────────────────────────────────────────────
describe('isLastOrderAt', () => {
  it('火曜日 19:30 はラストオーダー時間内 (LO=19:30)', () => {
    expect(isLastOrderAt(2, 19, 30)).toBe(true);
  });

  it('火曜日 19:29 はラストオーダー前', () => {
    expect(isLastOrderAt(2, 19, 29)).toBe(false);
  });

  it('火曜日 20:00 は閉店後なのでラストオーダーでない', () => {
    expect(isLastOrderAt(2, 20, 0)).toBe(false);
  });

  it('月曜日(定休日)はラストオーダーなし', () => {
    expect(isLastOrderAt(1, 19, 30)).toBe(false);
  });
});
