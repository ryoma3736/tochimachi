# Issue #6 デザインシステム構築 - 実装完了報告

## 実装概要

とちまち（栃木県ポータルサイト）のデザインシステムを構築しました。
rehome-navi.comのUI/UXを参考に、オレンジ系の温かみのあるカラーパレットとTailwind CSS + shadcn/uiによる統一されたデザインシステムを実装しています。

## 実装完了項目

### 1. ✅ カラーパレット（オレンジ系・温かみ）

**オレンジ系（温かみ）** - メインカラー
```css
--tochimachi-orange-50: #fff7ed   (24 100% 97%)
--tochimachi-orange-100: #ffedd5  (24 100% 93%)
--tochimachi-orange-500: #f97316  (25 95% 53%)  /* プライマリカラー */
--tochimachi-orange-600: #ea580c  (21 90% 48%)
```

**ブラウン系（落ち着き）** - サブカラー
```css
--tochimachi-brown-50: #fef3e2   (30 67% 94%)
--tochimachi-brown-500: #d97706  (25 75% 47%)
--tochimachi-brown-600: #78350f  (30 60% 30%)
--tochimachi-brown-700: #451a03  (30 70% 15%)
```

### 2. ✅ タイポグラフィ

**フォント**: Noto Sans JP（Google Fonts）
- Weights: 400, 500, 600, 700
- Variable font: `--font-noto-sans-jp`
- 日本語最適化: `font-feature-settings: "palt" 1`

**見出しサイズ**:
- `text-display-lg`: 3.5rem (56px) - ヒーロー見出し
- `text-display-md`: 3rem (48px) - ページタイトル
- `text-display-sm`: 2.5rem (40px) - セクションタイトル
- `text-heading-xl`: 2rem (32px) - 主要見出し
- `text-heading-lg`: 1.75rem (28px) - サブ見出し
- `text-heading-md`: 1.5rem (24px) - 小見出し
- `text-heading-sm`: 1.25rem (20px) - 最小見出し

**本文・ラベルサイズ**:
- `text-body-lg`: 1.125rem (18px) - リード文
- `text-body-md`: 1rem (16px) - 標準本文
- `text-body-sm`: 0.875rem (14px) - 注釈
- `text-label-lg`: 0.875rem (14px) - フォームラベル
- `text-label-md`: 0.75rem (12px) - バッジ
- `text-label-sm`: 0.6875rem (11px) - 小ラベル

### 3. ✅ Tailwind CSS設定

**ファイル**: `tailwind.config.ts`

**レスポンシブブレークポイント**:
```typescript
screens: {
  xs: '360px',   // 小型スマホ
  sm: '640px',   // スマホ
  md: '768px',   // タブレット
  lg: '1024px',  // ノートPC
  xl: '1280px',  // デスクトップ
  '2xl': '1536px' // 大型デスクトップ
}
```

**カスタム影**:
- `shadow-soft`: 柔らかい影
- `shadow-soft-lg`: 柔らかい影（大）
- `shadow-warm`: 温かみのある影（オレンジ）

**カスタムアニメーション**:
- `animate-fade-in`: フェードイン
- `animate-slide-in-right`: 右からスライドイン
- `animation-delay-200/400/600`: アニメーション遅延

### 4. ✅ globals.css

**ファイル**: `app/globals.css`

**実装内容**:
- CSS変数（ライトモード・ダークモード対応）
- グローバルスタイル（body, heading, link, focus, scrollbar）
- カスタムコンポーネントクラス（`.btn-warm`, `.card-warm`, `.section-spacing`）
- ユーティリティクラス（アニメーション遅延）

**カスタムクラス**:
```css
.btn-warm       /* 温かみのあるボタン */
.card-warm      /* 温かみのあるカード */
.section-spacing /* セクションスペーシング (py-12 px-4 md:py-16 lg:py-20) */
.container-narrow /* ナローコンテナ (max-w-4xl) */
```

### 5. ✅ shadcn/ui コンポーネント

**インストール済みコンポーネント**:
- ✅ Button (`components/ui/button.tsx`)
- ✅ Card (`components/ui/card.tsx`)
- ✅ Input (`components/ui/input.tsx`)
- ✅ Select (`components/ui/select.tsx`)
- ✅ Dialog (`components/ui/dialog.tsx`)
- ✅ Tabs (`components/ui/tabs.tsx`)
- ✅ Badge (`components/ui/badge.tsx`)
- ✅ Toast (`components/ui/toast.tsx`, `components/ui/toaster.tsx`)

**追加機能**:
- `hooks/use-toast.ts` - Toastフック

## 成果物

### 📁 ファイル構成

```
tochimachi/
├── tailwind.config.ts              # Tailwind設定（カスタムカラー、タイポグラフィ）
├── app/
│   ├── globals.css                 # グローバルスタイル、CSS変数
│   ├── layout.tsx                  # Noto Sans JP設定、Toaster追加
│   └── design-system/
│       └── page.tsx                # デザインシステムサンプルページ
├── components/ui/                  # shadcn/uiコンポーネント
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── toast.tsx
│   └── toaster.tsx
├── hooks/
│   └── use-toast.ts               # Toastフック
└── docs/
    ├── design-system.md           # デザインシステムドキュメント
    └── issue-6-implementation.md  # この実装報告書
```

### 📚 ドキュメント

1. **design-system.md** - 完全なデザインシステムドキュメント
   - カラーパレット
   - タイポグラフィ
   - レスポンシブデザイン
   - コンポーネント使用例
   - ベストプラクティス

2. **デザインシステムサンプルページ** - `/design-system`
   - すべてのコンポーネントの実装例
   - インタラクティブなデモ
   - レスポンシブデザインの確認

## 動作確認

### ビルド確認

```bash
npm run build
```

**結果**: ✅ ビルド成功
- TypeScript型チェック: 合格
- 静的生成: 成功
- ページ数: 3ページ（/, /_not-found, /design-system）

### アクセス方法

```bash
npm run dev
```

**デザインシステムページ**: http://localhost:3000/design-system

## 技術詳細

### Tailwind CSS設定

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        tochimachi: {
          orange: { /* 50-900 */ },
          brown: { /* 50-900 */ }
        }
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        // ... 他のサイズ
      },
      screens: {
        xs: '360px',
        // ... 他のブレークポイント
      }
    }
  }
}
```

### CSS変数（HSL形式）

```css
:root {
  --tochimachi-orange-500: 25 95% 53%;  /* HSL形式 */
  --primary: 25 95% 53%;                 /* オレンジをプライマリに */
  --secondary: 24 100% 93%;              /* 淡いオレンジをセカンダリに */
}
```

**利点**:
- HSL形式により不透明度調整が容易（`bg-primary/90`）
- ライト/ダークモード対応が簡単
- shadcn/ui標準形式との互換性

### Noto Sans JP設定

```typescript
// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});
```

**最適化**:
- `display: 'swap'` - FOUT対策
- 必要なweightのみロード
- CSS変数化による柔軟性

## 参考サイトとの比較

### rehome-navi.com（参考サイト）

**採用した要素**:
- ✅ オレンジ系メインカラー
- ✅ 温かみのある角丸（`rounded-2xl`, `rounded-3xl`）
- ✅ 柔らかい影（`shadow-soft`, `shadow-warm`）
- ✅ モバイルファースト設計
- ✅ レスポンシブブレークポイント（360px, 768px, 1024px）

**とちまち独自の改良**:
- ✅ より体系的なカラーパレット（50-900の10段階）
- ✅ 詳細なタイポグラフィシステム
- ✅ shadcn/ui統合によるアクセシビリティ向上
- ✅ ダークモード対応
- ✅ アニメーションシステム

## 今後の拡張性

### 追加可能なコンポーネント

```bash
# 必要に応じて追加
npx shadcn@latest add accordion
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add avatar
npx shadcn@latest add calendar
```

### カスタマイズポイント

1. **カラーバリエーション追加**
   ```typescript
   // tailwind.config.ts
   colors: {
     tochimachi: {
       green: { /* 追加色 */ },
       blue: { /* 追加色 */ }
     }
   }
   ```

2. **カスタムコンポーネント追加**
   ```css
   /* app/globals.css */
   .hero-section { /* カスタムスタイル */ }
   .feature-card { /* カスタムスタイル */ }
   ```

3. **アニメーション追加**
   ```typescript
   // tailwind.config.ts
   keyframes: {
     'custom-animation': { /* キーフレーム */ }
   }
   ```

## 使用例

### 基本的な使用

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Example() {
  return (
    <Card className="card-warm">
      <CardHeader>
        <CardTitle className="text-heading-md text-tochimachi-brown-700">
          栃木の企業
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body-md mb-4">企業の説明文...</p>
        <Button className="btn-warm">詳細を見る</Button>
      </CardContent>
    </Card>
  );
}
```

### レスポンシブレイアウト

```tsx
<div className="
  grid
  grid-cols-1      // モバイル: 1カラム
  md:grid-cols-2   // タブレット: 2カラム
  lg:grid-cols-3   // デスクトップ: 3カラム
  gap-4
">
  {/* カード */}
</div>
```

### カスタムカラー使用

```tsx
<div className="bg-tochimachi-orange-50 border-tochimachi-orange-200">
  <h2 className="text-tochimachi-brown-700">見出し</h2>
  <p className="text-tochimachi-brown-600">本文</p>
  <Button className="bg-tochimachi-orange-500 hover:bg-tochimachi-orange-600">
    アクション
  </Button>
</div>
```

## まとめ

### 達成したこと

✅ オレンジ系カラーパレット（50-900、10段階）
✅ ブラウン系カラーパレット（50-900、10段階）
✅ Noto Sans JP フォント設定
✅ 体系的なタイポグラフィシステム
✅ レスポンシブブレークポイント（xs-2xl）
✅ shadcn/ui コンポーネント8種類
✅ カスタムコンポーネントクラス（btn-warm, card-warm等）
✅ ライト・ダークモード対応
✅ アニメーションシステム
✅ デザインシステムドキュメント
✅ インタラクティブなサンプルページ
✅ TypeScript型安全性
✅ ビルド成功確認

### 品質指標

- **TypeScript**: 型エラー0件
- **ビルド**: 成功
- **ページ数**: 3ページ生成
- **コンポーネント数**: 8コンポーネント
- **カスタムクラス数**: 4クラス
- **ドキュメント**: 完全

### 参考

- デザインシステムドキュメント: `/docs/design-system.md`
- サンプルページ: http://localhost:3000/design-system
- 参考サイト: https://rehome-navi.com/
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/

---

**実装日**: 2025-12-02
**実装者**: Claude Code (CodeGenAgent - 源 💻)
**Issue**: #6 デザインシステム構築
