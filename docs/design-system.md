# とちまち デザインシステム

## 概要

とちまちのデザインシステムは、栃木県ポータルサイトとして温かみと親しみやすさを重視したデザインを提供します。
rehome-navi.comのUI/UXを参考に、オレンジ系の温かいカラーパレットと使いやすいコンポーネントで構成されています。

## カラーパレット

### メインカラー（オレンジ系）

温かみと親しみやすさを演出するオレンジ系カラーです。

```css
/* ライト */
--tochimachi-orange-50: #fff7ed /* 背景・セクション */ --tochimachi-orange-100: #ffedd5
  /* 副次的な背景 */ --tochimachi-orange-200: #fed7aa /* ホバー状態 */
  --tochimachi-orange-300: #fdba74 /* アクセント軽 */ --tochimachi-orange-400: #fb923c
  /* アクセント中 */ --tochimachi-orange-500: #f97316 /* プライマリカラー */
  --tochimachi-orange-600: #ea580c /* プライマリホバー */ /* ダーク */
  --tochimachi-orange-700: #c2410c /* ダークアクセント */ --tochimachi-orange-800: #9a3412
  /* 濃いアクセント */ --tochimachi-orange-900: #7c2d12 /* 最も濃いオレンジ */;
```

### サブカラー（ブラウン系）

落ち着きと信頼感を演出するブラウン系カラーです。

```css
/* ライト */
--tochimachi-brown-50: #fef3e2 /* 柔らかい背景 */ --tochimachi-brown-100: #fde8c7 /* 副次的な背景 */
  --tochimachi-brown-200: #f9d7a1 /* ボーダー */ --tochimachi-brown-300: #f4b772 /* アクセント軽 */
  --tochimachi-brown-400: #ea9a3e /* アクセント中 */ --tochimachi-brown-500: #d97706
  /* セカンダリカラー */ --tochimachi-brown-600: #78350f /* テキスト・ボーダー */ /* ダーク */
  --tochimachi-brown-700: #451a03 /* ダークテキスト */ --tochimachi-brown-800: #3e2723
  /* ダーク背景 */ --tochimachi-brown-900: #2d1b13 /* 最も濃いブラウン */;
```

### 使用例

```tsx
// プライマリボタン
<button className="bg-tochimachi-orange-500 hover:bg-tochimachi-orange-600">
  お問い合わせ
</button>

// セクション背景
<section className="bg-tochimachi-orange-50">
  <h2 className="text-tochimachi-brown-700">栃木の優良企業</h2>
</section>

// カード
<div className="bg-white border border-tochimachi-brown-200 rounded-2xl">
  {/* content */}
</div>
```

## タイポグラフィ

### フォントファミリー

```css
font-family:
  'Noto Sans JP',
  system-ui,
  -apple-system,
  sans-serif;
```

### 見出しサイズ

| クラス            | サイズ         | 用途               | 例                       |
| ----------------- | -------------- | ------------------ | ------------------------ |
| `text-display-lg` | 3.5rem (56px)  | ヒーローセクション | トップページメイン見出し |
| `text-display-md` | 3rem (48px)    | ページタイトル     | LP見出し                 |
| `text-display-sm` | 2.5rem (40px)  | セクションタイトル | 大きなセクション         |
| `text-heading-xl` | 2rem (32px)    | 主要見出し         | 記事タイトル             |
| `text-heading-lg` | 1.75rem (28px) | サブ見出し         | セクション見出し         |
| `text-heading-md` | 1.5rem (24px)  | 小見出し           | カード見出し             |
| `text-heading-sm` | 1.25rem (20px) | 最小見出し         | リスト見出し             |

### 本文サイズ

| クラス         | サイズ          | 用途                 |
| -------------- | --------------- | -------------------- |
| `text-body-lg` | 1.125rem (18px) | 大きな本文・リード文 |
| `text-body-md` | 1rem (16px)     | 標準本文             |
| `text-body-sm` | 0.875rem (14px) | 注釈・補足           |

### ラベルサイズ

| クラス          | サイズ           | 用途           |
| --------------- | ---------------- | -------------- |
| `text-label-lg` | 0.875rem (14px)  | フォームラベル |
| `text-label-md` | 0.75rem (12px)   | バッジ・タグ   |
| `text-label-sm` | 0.6875rem (11px) | 小さなラベル   |

### 使用例

```tsx
// ヒーローセクション
<h1 className="text-display-lg font-bold text-tochimachi-brown-900">
  とちまち
</h1>

// セクション見出し
<h2 className="text-heading-lg font-semibold text-tochimachi-brown-700">
  栃木の優良企業を探す
</h2>

// 本文
<p className="text-body-md text-foreground leading-relaxed">
  写真で見て選べる、栃木県の優良企業ポータルサイトです。
</p>
```

## レスポンシブデザイン

### ブレークポイント

| 名前  | サイズ | デバイス           |
| ----- | ------ | ------------------ |
| `xs`  | 360px  | 小型スマートフォン |
| `sm`  | 640px  | スマートフォン     |
| `md`  | 768px  | タブレット         |
| `lg`  | 1024px | ノートPC           |
| `xl`  | 1280px | デスクトップ       |
| `2xl` | 1536px | 大型デスクトップ   |

### 使用例

```tsx
// モバイルファースト
<div className="// モバイル: 16px padding // タブレット: 24px padding // デスクトップ: 32px padding // モバイル: 1カラム // タブレット: 2カラム // デスクトップ: 3カラム grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:px-6 lg:grid-cols-3 lg:px-8">
  {/* カード */}
</div>
```

## コンポーネント

### Button

```tsx
import { Button } from '@/components/ui/button';

// プライマリボタン（温かみ）
<Button className="btn-warm">
  お問い合わせ
</Button>

// セカンダリボタン
<Button variant="secondary">
  詳しく見る
</Button>

// アウトラインボタン
<Button variant="outline">
  キャンセル
</Button>

// ゴーストボタン
<Button variant="ghost">
  戻る
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// 温かみのあるカード
<Card className="card-warm">
  <CardHeader>
    <CardTitle className="text-heading-md">企業名</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-body-md">企業の説明文...</p>
  </CardContent>
</Card>;
```

### Input

```tsx
import { Input } from '@/components/ui/input';

<div className="space-y-2">
  <label className="text-label-lg font-medium">会社名</label>
  <Input type="text" placeholder="株式会社〇〇" className="border-tochimachi-brown-200" />
</div>;
```

### Select

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="業種を選択" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="construction">建設業</SelectItem>
    <SelectItem value="restaurant">飲食店</SelectItem>
    <SelectItem value="retail">小売業</SelectItem>
  </SelectContent>
</Select>;
```

### Dialog

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>お問い合わせ</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-heading-md">お問い合わせフォーム</DialogTitle>
    </DialogHeader>
    {/* フォームコンテンツ */}
  </DialogContent>
</Dialog>;
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">すべて</TabsTrigger>
    <TabsTrigger value="construction">建設業</TabsTrigger>
    <TabsTrigger value="restaurant">飲食店</TabsTrigger>
  </TabsList>
  <TabsContent value="all">{/* コンテンツ */}</TabsContent>
</Tabs>;
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge className="bg-tochimachi-orange-100 text-tochimachi-orange-700">
  おすすめ
</Badge>

<Badge variant="secondary">新着</Badge>
<Badge variant="outline">人気</Badge>
```

### Toast

```tsx
import { useToast } from '@/hooks/use-toast';

function Component() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: '送信完了',
          description: 'お問い合わせを受け付けました。',
        });
      }}
    >
      送信
    </Button>
  );
}
```

## スペーシング

### コンテナ

```tsx
// 標準コンテナ
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* コンテンツ */}
</div>

// ナローコンテナ（読みやすさ重視）
<div className="container-narrow">
  {/* コンテンツ */}
</div>
```

### セクション

```tsx
// 標準セクションスペーシング
<section className="section-spacing">{/* py-12 px-4 md:py-16 lg:py-20 */}</section>
```

## 影（Shadow）

```tsx
// 柔らかい影
<div className="shadow-soft">...</div>

// 柔らかい影（大）
<div className="shadow-soft-lg">...</div>

// 温かみのある影（オレンジ）
<div className="shadow-warm">...</div>
```

## ボーダー半径

```tsx
// 小
<div className="rounded-sm">...</div>

// 中
<div className="rounded-md">...</div>

// 大
<div className="rounded-lg">...</div>

// 特大（温かみのあるカード）
<div className="rounded-2xl">...</div>
<div className="rounded-3xl">...</div>
```

## アニメーション

```tsx
// フェードイン
<div className="animate-fade-in">...</div>

// スライドイン（右から）
<div className="animate-slide-in-right">...</div>

// アニメーション遅延
<div className="animate-fade-in animation-delay-200">...</div>
<div className="animate-fade-in animation-delay-400">...</div>
<div className="animate-fade-in animation-delay-600">...</div>
```

## ダークモード

とちまちはダークモードをサポートしています。ダークモードでもオレンジ・ブラウン系の温かみを保ちます。

```tsx
// 自動的にライト/ダークモードに対応
<div className="bg-background text-foreground">
  <h1 className="text-primary">見出し</h1>
  <p className="text-muted-foreground">本文</p>
</div>
```

## ベストプラクティス

### 1. カラー使用

- **プライマリカラー**: アクションボタン、重要なリンク
- **セカンダリカラー**: 補助的な要素、背景
- **ブラウン**: テキスト、ボーダー

### 2. タイポグラフィ

- 見出しは`font-semibold`または`font-bold`
- 本文は`font-normal`
- 行間は`leading-relaxed`（1.7）を推奨

### 3. スペーシング

- コンポーネント間: `space-y-4`または`gap-4`
- セクション間: `py-12 md:py-16 lg:py-20`
- 左右パディング: `px-4 md:px-6 lg:px-8`

### 4. レスポンシブデザイン

- モバイルファーストで実装
- タッチターゲットは最低44px×44px
- テキストは16px以上（`text-body-md`以上）

### 5. アクセシビリティ

- コントラスト比: WCAG AA準拠（4.5:1以上）
- フォーカスインジケーター: `focus-visible:ring-2`
- セマンティックHTML使用

## 参考

- [rehome-navi.com](https://rehome-navi.com/) - デザイン参考サイト
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネントライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
