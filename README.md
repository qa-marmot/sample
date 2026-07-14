# Café Ouka

代々木上原のCoffee & Sweets「Café Ouka」の1ページサイトです。メニュー、コンセプト、営業時間、アクセスを、地域誌のような落ち着いたトーンで構成しています。公開URLが確定するまでは`noindex`と`robots.txt`で検索登録を抑止します。

## 技術スタック

- Astro 4
- Tailwind CSS 3
- Cloudflare adapter / Wrangler
- Vitest / Playwright
- Playfair Display（英字ロゴのみ）＋日本語システムフォント

## セットアップ

```bash
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

開発サーバーは既定で `http://localhost:4321` に起動します。Visual Regressionの基準画像を意図的に更新する場合のみ、レビュー後に次を実行します。

```bash
npm run test:e2e:update
```

## 構成

```text
src/
├── assets/             # ローカル化した写真素材
├── components/         # セクションと共通UI
│   ├── ActionLink.astro
│   ├── SectionHeading.astro
│   └── VisitSummary.astro
├── layouts/
│   └── Layout.astro    # metadata、skip link、共通head
├── pages/
│   └── index.astro     # 唯一の公開ルート
├── styles/
│   └── global.css      # Semantic Tokenと共通状態
└── utils/              # メニュー・営業時間データとロジック
```

ページ順はHeader、Hero、来店情報、Menu、Concept、Hours、Access、Footerです。フォーム、CMS、API、予約、購入機能はありません。

## デザインシステム

色、余白、コンテンツ幅、モーションは `src/styles/global.css` のCSS Custom Propertiesで定義し、`tailwind.config.mjs` のsemantic aliasから利用します。重要な本文色をopacityで薄くせず、通常文字はWCAG 2.2 AA相当のコントラストを維持してください。

共通UIは以下の責務に限定しています。

- `ActionLink.astro`: primary / secondary / text CTA
- `SectionHeading.astro`: light / darkの見出し
- `VisitSummary.astro`: 来店判断に必要な要点

## コンテンツの変更場所

| 内容 | ファイル |
|---|---|
| 店名・Heroコピー | `src/components/Hero.astro` |
| メニュー・価格 | `src/utils/menu.ts` |
| 営業時間 | `src/utils/hours.ts` |
| 住所・地図 | `src/components/Access.astro` |
| 色・余白・モーション | `src/styles/global.css` |
| Tailwind alias | `tailwind.config.mjs` |

## 画像素材

サイトの静かなトーンと、コーヒー・焼き菓子・店内の役割が重ならないことを基準にPexelsで選定し、外部通信とレイアウトシフトを減らすためローカル化しています。各素材は選定時点でPexels上の「Free to use」表示を確認しています。

- Hero: [東京のハンドドリップ（Gu Ko）](https://www.pexels.com/photo/31986825/)
- Menu: [コーヒーと焼き菓子（Andrew Neel）](https://www.pexels.com/photo/31906765/)
- Concept: [自然光と木の家具がある店内（Maria Orlova）](https://www.pexels.com/photo/4940753/)

Astroの画像処理を通し、Heroだけをeager、その他をlazyで読み込みます。アクセス欄の地図はGoogle Mapsの埋め込み表示を使用します。

## 公開前の確認事項

公開時は次の情報を確認したうえで、`noindex`と`public/robots.txt`を見直してください。

- title、description、公開URL、OGP
- 店名、住所、電話番号、営業時間、メニュー
- 写真と代替テキスト
- 地図の位置とアクセス経路
- 法的表示や必要な問い合わせ導線

## デプロイ

`astro.config.mjs` と `wrangler.jsonc` はCloudflare向けに設定されています。公開前に `npm run build` を実行し、Cloudflare previewでHeader、アンカー、画像、404、モバイルメニューを確認してください。公開URLはリポジトリ内に固定していません。

本番画像はCloudflare Image Transformations（`/cdn-cgi/image`）を使用します。デプロイ先で画像変換を利用できることをpreviewで確認してください。ローカル開発ではAstroのSharpサービスが同じresponsive image指定を処理します。
