# Café Ouka — カフェサイト制作デモ

代々木上原の架空カフェを題材にした、ポートフォリオ用の1ページサイトです。実在する店舗・住所・電話番号・サービスとは関係ありません。検索結果で実店舗と誤認されないよう、画面上のデモ表示、`noindex`、`robots.txt`を設定しています。

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
| 住所・電話番号 | `src/components/Access.astro` |
| 色・余白・モーション | `src/styles/global.css` |
| Tailwind alias | `tailwind.config.mjs` |

## 画像素材

既存サイトで使用していたUnsplash写真を、外部通信とレイアウトシフトを減らすためローカル化しています。

- Hero: `photo-1509042239860-f550ce710b93`
- 店内: `photo-1521017432531-fbd92d768814`
- Menu: `photo-1495474472287-4d71bcdd2085`

Astroの画像処理を通し、Heroだけをeager、その他をlazyで読み込みます。実店舗へ転用する際は、これらを実際の店舗・商品写真へ差し替えてください。

## 本番転用時の確認事項

このリポジトリのままでは架空店舗デモとして公開されます。実店舗向けに転用する場合は、次を実在情報へ置き換えたうえで、`noindex`と`public/robots.txt`を見直してください。

- title、description、公開URL、OGP
- 店名、住所、電話番号、営業時間、メニュー
- 写真と代替テキスト
- 地図プレースホルダー
- 法的表示や必要な問い合わせ導線

架空のLocalBusiness構造化データは追加しません。

## デプロイ

`astro.config.mjs` と `wrangler.jsonc` はCloudflare向けに設定されています。公開前に `npm run build` を実行し、Cloudflare previewでHeader、アンカー、画像、404、モバイルメニューを確認してください。公開URLはリポジトリ内に固定していません。

本番画像はCloudflare Image Transformations（`/cdn-cgi/image`）を使用します。デプロイ先で画像変換を利用できることをpreviewで確認してください。ローカル開発ではAstroのSharpサービスが同じresponsive image指定を処理します。
