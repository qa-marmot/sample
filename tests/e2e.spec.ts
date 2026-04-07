import { test, expect, type Page } from '@playwright/test';

// ── ヘルパー ──────────────────────────────────────────────────
async function gotoAndWait(page: Page) {
  await page.goto('/');
  // アニメーション・遅延読み込みが終わるまで待機
  await page.waitForLoadState('networkidle');
  // スクロールアニメーション用クラスをすべて即時付与
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  });
}

// ── セクション存在確認 ────────────────────────────────────────
test.describe('セクションのレンダリング', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('Hero セクションが表示される', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toContainText('Café');
  });

  test('Concept セクションが表示される', async ({ page }) => {
    const concept = page.locator('#concept');
    await expect(concept).toBeVisible();
    await expect(concept.locator('h2')).toBeVisible();
  });

  test('Menu セクションが表示される', async ({ page }) => {
    const menu = page.locator('#menu');
    await expect(menu).toBeVisible();
    await expect(menu.locator('h2')).toContainText('メニュー');
  });

  test('Hours セクションが表示される', async ({ page }) => {
    const hours = page.locator('#hours');
    await expect(hours).toBeVisible();
    await expect(hours.locator('h2')).toContainText('営業時間');
  });

  test('Access セクションが表示される', async ({ page }) => {
    const access = page.locator('#access');
    await expect(access).toBeVisible();
    await expect(access.locator('h2')).toContainText('アクセス');
  });

  test('Footer が表示される', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Café');
  });
});

// ── ナビゲーション ────────────────────────────────────────────
test.describe('ナビゲーション', () => {
  test('Header に Menu・Hours・Access リンクがある', async ({ page }) => {
    await gotoAndWait(page);
    const header = page.locator('header');
    await expect(header.locator('a[href="#menu"]').first()).toBeVisible();
    await expect(header.locator('a[href="#hours"]').first()).toBeVisible();
    await expect(header.locator('a[href="#access"]').first()).toBeVisible();
  });

  test('Hero の CTA ボタン「メニューを見る」が機能する', async ({ page }) => {
    await gotoAndWait(page);
    // Hero セクション内の CTA に限定（Header の "Menu" リンクと区別）
    const cta = page.locator('#hero a[href="#menu"]');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/メニューを見る/);
  });
});

// ── メニューコンテンツ ────────────────────────────────────────
test.describe('メニューコンテンツ', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('Coffee カテゴリが表示される', async ({ page }) => {
    await expect(page.locator('#menu').getByText('Coffee').first()).toBeVisible();
  });

  test('Tea & Others カテゴリが表示される', async ({ page }) => {
    await expect(page.locator('#menu').getByText('Tea & Others').first()).toBeVisible();
  });

  test('Food カテゴリが表示される', async ({ page }) => {
    await expect(page.locator('#menu').getByText('Food').first()).toBeVisible();
  });

  test('価格が ¥ 表記で表示される', async ({ page }) => {
    const prices = page.locator('#menu').getByText(/^¥\d+$/);
    await expect(prices.first()).toBeVisible();
    const count = await prices.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ── アクセシビリティ ──────────────────────────────────────────
test.describe('アクセシビリティ', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('全ての <img> に alt 属性がある', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `img[${i}] に alt がない`).not.toBeNull();
    }
  });

  test('ハンバーガーボタンに aria-label がある', async ({ page }) => {
    const hamburger = page.locator('button#menu-toggle');
    if ((await hamburger.count()) > 0) {
      const label = await hamburger.getAttribute('aria-label');
      expect(label).not.toBeNull();
      expect(label!.length).toBeGreaterThan(0);
    }
  });

  test('Hero の CTA ボタンが視認可能なテキストを持つ', async ({ page }) => {
    const ctas = page.locator('#hero a');
    const count = await ctas.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = (await ctas.nth(i).innerText()).trim();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('ページタイトルが設定されている', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toContain('Café');
  });

  test('<html> に lang 属性がある', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).not.toBeNull();
    expect(lang!.length).toBeGreaterThan(0);
  });
});

// ── VRT: 視覚的リグレッションテスト ──────────────────────────
test.describe('VRT (Visual Regression)', () => {
  test('Hero セクション — デスクトップ', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoAndWait(page);
    await expect(page.locator('#hero')).toHaveScreenshot('hero-desktop.png');
  });

  test('Menu セクション — デスクトップ', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoAndWait(page);
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(page.locator('#menu')).toHaveScreenshot('menu-desktop.png');
  });

  test('全ページ — モバイル (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoAndWait(page);
    await expect(page).toHaveScreenshot('full-page-mobile.png', {
      fullPage: true,
      // 外部画像の読み込みに猶予を与える
      animations: 'disabled',
    });
  });
});
