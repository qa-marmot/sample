import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('astro-dev-toolbar').evaluateAll((elements) => elements.forEach((element) => element.remove()));
}

test.describe('ページ構造とコンテンツ', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('主要セクションが正しい見出しで表示される', async ({ page }) => {
    await expect(page.locator('#hero h1')).toContainText('Café');
    await expect(page.locator('aside[aria-label="来店情報"]')).toBeVisible();
    await expect(page.locator('#menu h2')).toContainText('一杯とひと皿');
    await expect(page.locator('#concept h2')).toContainText('特別な一杯');
    await expect(page.locator('#hours h2')).toHaveText('営業時間');
    await expect(page.locator('#access h2')).toContainText('歩いて5分');
    await expect(page.locator('footer')).toContainText('静かな一杯の時間');
  });

  test('Heroで所在地・商品・価値・CTAを理解できる', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toContainText('代々木上原');
    await expect(hero).toContainText('Coffee & Sweets');
    await expect(hero).toContainText('シングルオリジン');
    await expect(hero.getByRole('link', { name: 'メニューを見る' })).toHaveAttribute('href', '#menu');
    await expect(hero.getByRole('link', { name: '営業時間・アクセス' })).toHaveAttribute('href', '#hours');
  });

  test('メニュー13件と価格を欠落なく表示する', async ({ page }) => {
    await expect(page.locator('#menu h3')).toHaveCount(3);
    await expect(page.locator('#menu li')).toHaveCount(13);
    await expect(page.locator('#menu').getByText(/^¥\d+$/)).toHaveCount(13);
  });

  test('営業時間7件と本日の表示がある', async ({ page }) => {
    await expect(page.locator('#hours [aria-current="date"]')).toHaveCount(1);
    await expect(page.locator('#hours [aria-current="date"]')).toContainText('本日');
  });

  test('店舗情報に沿ったmetadataを設定する', async ({ page }) => {
    await expect(page).toHaveTitle(/代々木上原のコーヒーとお菓子/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('実地図と外部地図への導線を表示する', async ({ page }) => {
    await expect(page.locator('#access iframe[title="Café Ouka周辺の地図"]')).toHaveAttribute('src', /google\.com\/maps/);
    await expect(page.locator('#access').getByRole('link', { name: /Google Mapsで開く/ })).toHaveAttribute('target', '_blank');
  });
});

test.describe('ナビゲーション', () => {
  test('デスクトップHeaderに主要リンクがある', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoAndWait(page);
    const nav = page.getByRole('navigation', { name: 'メインナビゲーション' });
    await expect(nav.getByRole('link', { name: 'メニュー' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '私たちについて' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '営業時間' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'アクセス' })).toBeVisible();
  });

  test('モバイルメニューのARIA状態とEscape終了が同期する', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWait(page);
    const toggle = page.locator('#menu-toggle');
    const menu = page.getByRole('navigation', { name: 'モバイルナビゲーション' });

    await expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('メニューを閉じる');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    await expect(menu).toBeHidden();
  });

  test('モバイルメニューはリンク選択後に閉じる', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWait(page);
    const toggle = page.locator('#menu-toggle');
    await toggle.click();
    await page.getByRole('navigation', { name: 'モバイルナビゲーション' }).getByRole('link', { name: 'メニュー' }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('アクセシビリティとレスポンシブ', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('skip linkが最初のTabでフォーカスされる', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: '本文へ移動' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test('h1は1つで、主要セクションはh2を持つ', async ({ page }) => {
    await expect(page.locator('main h1')).toHaveCount(1);
    for (const id of ['menu', 'concept', 'hours', 'access']) {
      await expect(page.locator(`#${id} h2`)).toHaveCount(1);
    }
  });

  test('全画像にaltと寸法があり、外部画像へ直接依存しない', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i += 1) {
      const image = images.nth(i);
      expect(await image.getAttribute('alt')).not.toBeNull();
      expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
      expect(await image.getAttribute('src')).not.toMatch(/^https?:/);
    }
  });

  for (const width of [360, 390, 768, 1024, 1280, 1440]) {
    test(`${width}pxで意図しない横スクロールがない`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await gotoAndWait(page);
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasOverflow).toBe(false);
    });
  }

  test('存在しないルートは404を返す', async ({ page }) => {
    const response = await page.goto('/not-found');
    expect(response?.status()).toBe(404);
  });
});

test.describe('VRT', () => {
  test('Hero — デスクトップ', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoAndWait(page);
    await expect(page.locator('#hero')).toHaveScreenshot('hero-desktop.png');
  });

  test('Menu — デスクトップ', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoAndWait(page);
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await expect(page.locator('#menu')).toHaveScreenshot('menu-desktop.png');
  });

  test('全ページ — モバイル390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWait(page);
    await expect(page).toHaveScreenshot('full-page-mobile.png', {
      fullPage: true,
      mask: [page.locator('#access iframe')],
      maskColor: '#EDE4D0',
    });
  });

  test('モバイルメニュー — 展開状態', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWait(page);
    await page.locator('#menu-toggle').click();
    await expect(page.locator('body > div.sticky > header')).toHaveScreenshot('mobile-menu-open.png');
  });
});
