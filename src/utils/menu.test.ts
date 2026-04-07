import { describe, it, expect } from 'vitest';
import { MENU, isValidPrice, getCategoryNames, getTotalItemCount } from './menu';

// ── MENU データ整合性 ─────────────────────────────────────────
describe('MENU master data', () => {
  it('3カテゴリを持つ', () => {
    expect(MENU).toHaveLength(3);
  });

  it('カテゴリ名は Coffee / Tea & Others / Food', () => {
    expect(getCategoryNames()).toEqual(['Coffee', 'Tea & Others', 'Food']);
  });

  it('全アイテムは name が空でない', () => {
    MENU.forEach((cat) => {
      cat.items.forEach((item) => {
        expect(item.name.trim()).not.toBe('');
      });
    });
  });

  it('全アイテムは desc が空でない', () => {
    MENU.forEach((cat) => {
      cat.items.forEach((item) => {
        expect(item.desc.trim()).not.toBe('');
      });
    });
  });

  it('全アイテムの price は "¥数字" 形式', () => {
    MENU.forEach((cat) => {
      cat.items.forEach((item) => {
        expect(isValidPrice(item.price)).toBe(true);
      });
    });
  });

  it('Coffee カテゴリは 5 アイテム', () => {
    const coffee = MENU.find((c) => c.name === 'Coffee');
    expect(coffee?.items).toHaveLength(5);
  });

  it('Tea & Others カテゴリは 4 アイテム', () => {
    const tea = MENU.find((c) => c.name === 'Tea & Others');
    expect(tea?.items).toHaveLength(4);
  });

  it('Food カテゴリは 4 アイテム', () => {
    const food = MENU.find((c) => c.name === 'Food');
    expect(food?.items).toHaveLength(4);
  });

  it('全アイテム数は 13', () => {
    expect(getTotalItemCount()).toBe(13);
  });

  it('価格は ¥300〜¥1000 の範囲内', () => {
    MENU.forEach((cat) => {
      cat.items.forEach((item) => {
        const amount = parseInt(item.price.replace('¥', ''));
        expect(amount).toBeGreaterThanOrEqual(300);
        expect(amount).toBeLessThanOrEqual(1000);
      });
    });
  });

  it('アイテム名の重複なし (同カテゴリ内)', () => {
    MENU.forEach((cat) => {
      const names = cat.items.map((i) => i.name);
      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
    });
  });
});

// ── isValidPrice ─────────────────────────────────────────────
describe('isValidPrice', () => {
  it('¥500 は有効', () => expect(isValidPrice('¥500')).toBe(true));
  it('¥1000 は有効', () => expect(isValidPrice('¥1000')).toBe(true));
  it('500 は無効 (¥なし)', () => expect(isValidPrice('500')).toBe(false));
  it('¥500円 は無効', () => expect(isValidPrice('¥500円')).toBe(false));
  it('空文字は無効', () => expect(isValidPrice('')).toBe(false));
  it('¥ だけは無効', () => expect(isValidPrice('¥')).toBe(false));
});

// ── getCategoryNames ──────────────────────────────────────────
describe('getCategoryNames', () => {
  it('カテゴリ名の配列を返す', () => {
    const names = getCategoryNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names).toContain('Coffee');
  });
});

// ── getTotalItemCount ─────────────────────────────────────────
describe('getTotalItemCount', () => {
  it('数値を返す', () => {
    expect(typeof getTotalItemCount()).toBe('number');
  });

  it('各カテゴリの items.length の合計と一致', () => {
    const manual = MENU.reduce((s, c) => s + c.items.length, 0);
    expect(getTotalItemCount()).toBe(manual);
  });
});
