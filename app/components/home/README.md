# トップページ コンポーネント

## 概要

「とちまち」トップページを構成するReactコンポーネント群です。
https://rehome-navi.com/ のUI/UXを参考に、栃木県の優良企業を検索できるポータルサイトを実装しています。

## コンポーネント一覧

### 1. HeroSection

メインビジュアルとCTAボタンを配置するヒーローセクション。

**機能:**

- キャッチコピー「写真で見て選べる、栃木の優良企業」
- 業者検索ボタン（メインCTA）
- 電話番号表示（サブCTA）
- 信頼性指標（登録企業数、審査済み、無料利用）

**デザイン:**

- オレンジ/アンバーのグラデーション背景
- レスポンシブ対応（モバイル/タブレット/デスクトップ）
- アニメーション付きホバーエフェクト

### 2. IndustryTabsSection

業種タブと各業種のサブカテゴリを表示するセクション。

**機能:**

- 3つの主要業種タブ（建設業/飲食業/小売業）
- 各業種ごとに6つのサブカテゴリ表示
- タブ切り替えによる動的コンテンツ変更
- 各サブカテゴリへのリンク

**業種構成:**

#### 建設業

- リフォーム、新築、外構、塗装、解体、内装

#### 飲食業

- 居酒屋、カフェ、レストラン、ラーメン、焼肉、和食

#### 小売業

- 家具、衣料、食品、雑貨、電化製品、書籍

**デザイン:**

- アクティブタブの強調表示
- アイコン付きカテゴリカード
- グリッドレイアウト（PC: 6列、モバイル: 2列）

### 3. PopularBusinessesSection

人気の業者を表示するセクション。

**機能:**

- 業者カードグリッド表示
- 評価スコア（星評価）とレビュー数
- 所在地情報
- 特徴タグ（実績豊富、相談無料など）
- Instagram連携バッジ
- 「もっと見る」ボタン

**カード情報:**

- 業者名、カテゴリ
- 評価（星5段階）、レビュー件数
- 所在地（市区町村）
- 特徴タグ（最大3つ）
- 人気バッジ（featured業者のみ）

**デザイン:**

- グリッドレイアウト（PC: 3列、モバイル: 1列）
- ホバー時の拡大・影効果
- グラデーション背景

### 4. ServiceFeaturesSection

サービスの利用方法と特徴を説明するセクション。

**機能:**

#### 3ステップ説明

1. 業者を探す - 写真や実績から検索
2. カートに追加 - 複数業者を比較
3. 一括問い合わせ - まとめて見積もり依頼

#### メリット訴求

- 完全無料 - 登録・利用無料
- 一括問い合わせ - 複数業者へ一度で完了
- Instagram連携 - 実際の施工例確認可能

**デザイン:**

- ステップ間の矢印接続（デスクトップのみ）
- ステップ番号バッジ
- メリットカードにアイコン付き

### 5. PricingSection

業種別の料金相場を表示するセクション。

**機能:**

- 6業種の価格帯表示
- 最小価格〜最大価格の範囲
- 注意事項・備考
- 人気カテゴリのバッジ表示
- 見積もり依頼CTA

**料金相場:**

- リフォーム: 10万円〜500万円
- 新築: 2,000万円〜5,000万円
- 塗装: 50万円〜200万円
- 外構: 30万円〜300万円
- 飲食店改装: 100万円〜1,000万円
- オフィス改装: 50万円〜500万円

**デザイン:**

- 価格帯を目立たせるグラデーションボックス
- 人気カテゴリの枠線強調
- トレンドアイコン付きバッジ

## 技術仕様

### フレームワーク

- Next.js 16 (App Router)
- React 19
- TypeScript

### スタイリング

- Tailwind CSS
- カスタムカラーパレット（オレンジ/アンバー）
- レスポンシブデザイン

### アイコン

- lucide-react（Phone, Building2, Utensils, ShoppingBag, Star, MapPin, Instagram, Search, ShoppingCart, Send, Shield, Zap, TrendingUp）

### 状態管理

- React Hooks（useState）
- クライアントコンポーネント（'use client'）

## ファイル構成

```
app/components/home/
├── HeroSection.tsx               # ヒーローセクション
├── IndustryTabsSection.tsx       # 業種タブセクション
├── PopularBusinessesSection.tsx  # 人気業者セクション
├── ServiceFeaturesSection.tsx    # サービス特徴セクション
├── PricingSection.tsx            # 料金相場セクション
├── index.ts                      # エクスポート定義
└── README.md                     # このファイル
```

## 使用方法

```tsx
import {
  HeroSection,
  IndustryTabsSection,
  PopularBusinessesSection,
  ServiceFeaturesSection,
  PricingSection,
} from './components/home';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <IndustryTabsSection />
      <PopularBusinessesSection />
      <ServiceFeaturesSection />
      <PricingSection />
    </main>
  );
}
```

## レスポンシブブレークポイント

- モバイル: デフォルト（〜640px）
- タブレット: sm（640px〜）、md（768px〜）
- デスクトップ: lg（1024px〜）、xl（1280px〜）

## カラーパレット

- Primary: オレンジ（#FF6B35系）
- Secondary: アンバー（#FFA500系）
- Accent: グレー（#F3F4F6系）
- Text: ダークグレー（#111827）

## 今後の拡張予定

- [ ] 実際の業者データをAPIから取得
- [ ] 画像の最適化とLazy Loading
- [ ] アニメーション追加（スクロールトリガー）
- [ ] A/Bテスト対応
- [ ] アクセシビリティ改善（ARIA属性）

## 参考サイト

- https://rehome-navi.com/
  - リフォーム業者検索サイトのUI/UX
  - タブUI、カードグリッド、ステップ説明の参考

## 注意事項

- 現在はモックデータを使用（PopularBusinessesSection）
- 実際の画像はプレースホルダー
- リンク先（/search、/business/:id）は未実装
- 電話番号は仮のもの（0120-000-000）
