# 技術スタック選定書

## プロジェクト情報

- **プロジェクト名**: とちまち（Tochimachi）
- **概要**: 栃木県特化型地域ポータルサイト
- **作成日**: 2025-12-02
- **バージョン**: 1.0

---

## 選定方針

### 基本原則

1. **モダンで実績のある技術**: 安定性と最新性のバランス
2. **開発生産性の最大化**: 開発者体験(DX)の向上
3. **スケーラビリティ**: 将来的な機能拡張に対応
4. **コスト効率**: 適切な運用コストの維持
5. **保守性**: 長期的なメンテナンス容易性

---

## フロントエンド

### フレームワーク

#### Next.js 14 (App Router)

**選定理由**:

- React 18の最新機能をフルサポート（Server Components、Streaming SSR）
- App Routerによる直感的なルーティング設計
- ゼロコンフィグでのTypeScript、ESLint、Tailwind CSS統合
- 優れたSEO対策（SSR/SSG/ISR）
- Vercelによる最適化された本番環境
- 大規模プロジェクトでの実績多数

**バージョン**: `^14.2.0`

**主要機能**:

- Server Components（デフォルト）
- Client Components（`'use client'`）
- Server Actions（フォーム処理）
- Streaming（部分的なページ読み込み）
- Metadata API（SEO最適化）
- Image Optimization（自動画像最適化）
- Route Handlers（API Routes）

### 言語

#### TypeScript 5.x

**選定理由**:

- 型安全性によるバグの早期発見
- IDEの強力な補完機能
- リファクタリングの安全性向上
- チーム開発での明確な契約定義
- Next.js、React、Node.jsとの完全な統合

**バージョン**: `^5.8.3`

**設定方針**:

- `strict: true`（厳格な型チェック）
- `esModuleInterop: true`
- `jsx: "preserve"`（Next.jsが処理）
- `incremental: true`（ビルド高速化）

### UIライブラリ

#### React 18

**選定理由**:

- 業界標準のUIライブラリ
- Server Componentsによるパフォーマンス最適化
- Suspenseによる宣言的なローディング状態管理
- Concurrent Renderingによる優れたUX

**バージョン**: `^18.3.0`

#### shadcn/ui

**選定理由**:

- Radix UIベースのアクセシブルなコンポーネント
- カスタマイズ性が高い（コピー&ペースト方式）
- Tailwind CSSとの完璧な統合
- ゼロランタイムコスト
- ダークモード対応
- TypeScript完全対応

**主要コンポーネント**:

- Button, Card, Dialog, Form, Input, Select
- Table, Tabs, Toast, Dropdown Menu
- Command, Popover, Sheet, Skeleton

### スタイリング

#### Tailwind CSS 3.x

**選定理由**:

- ユーティリティファーストによる高速開発
- デザインシステムの一貫性確保
- PurgeCSS統合による最小バンドルサイズ
- JITコンパイラによる高速ビルド
- カスタムテーマの柔軟性
- shadcn/uiとの完璧な統合

**バージョン**: `^3.4.0`

**プラグイン**:

- `@tailwindcss/typography`（記事コンテンツのスタイリング）
- `@tailwindcss/forms`（フォーム要素のスタイリング）
- `tailwindcss-animate`（アニメーション）

### 状態管理

#### Zustand

**選定理由**:

- シンプルで学習コストが低い
- TypeScript完全対応
- React 18のServer Componentsと互換性
- バンドルサイズが小さい（1.5KB）
- ミドルウェアによる拡張性
- Reduxよりもボイラープレートが少ない

**バージョン**: `^4.5.0`

**使用場面**:

- グローバルなUI状態（モーダル、サイドバー）
- ユーザー認証状態
- ショッピングカート
- お気に入りリスト

### データフェッチング

#### SWR (stale-while-revalidate)

**選定理由**:

- Vercel公式のデータフェッチングライブラリ
- キャッシュ戦略が優れている
- リアルタイムデータの自動再検証
- 楽観的UI更新
- エラーリトライ機能
- TypeScript完全対応

**バージョン**: `^2.2.0`

**補完**:

- Next.js App Router: `fetch()`（Server Components）
- React Query: 考慮したが、SWRのシンプルさを優先

---

## バックエンド

### ランタイム

#### Next.js API Routes (App Router)

**選定理由**:

- フロントエンドとの統合が容易
- サーバーレスデプロイに最適
- TypeScript共有による型安全性
- Route Handlersによるモダンな設計
- Middleware対応

**実装方式**:

- `app/api/*/route.ts`（Route Handlers）
- Server Actions（フォーム処理）
- Middleware（認証、ログ）

### データベース

#### PostgreSQL (Supabase)

**選定理由**:

- リレーショナルデータベースの信頼性
- Supabaseによるマネージドサービス
- リアルタイム機能（Subscriptions）
- Row Level Security（RLS）
- Storage API（ファイルアップロード）
- 無料枠が充実（500MB DB、1GB Storage）

**バージョン**: PostgreSQL 15+

**接続方式**:

- Prisma ORM（型安全なクエリ）
- Supabase JS Client（認証、リアルタイム）

#### Prisma ORM

**選定理由**:

- TypeScript完全対応
- 直感的なスキーマ定義
- マイグレーション管理
- 型安全なクエリビルダー
- Next.jsとの統合が容易
- PostgreSQL最適化

**バージョン**: `^5.20.0`

**主要機能**:

- `prisma.schema`（スキーマ定義）
- `prisma migrate`（マイグレーション）
- `prisma generate`（TypeScript型生成）
- `prisma studio`（データブラウザ）

### 認証

#### NextAuth.js v5 (Auth.js)

**選定理由**:

- Next.js App Router完全対応
- 多様な認証プロバイダー（Google、GitHub、Email）
- JWT/Session両対応
- TypeScript完全サポート
- セキュリティベストプラクティス準拠
- Prisma Adapter対応

**バージョン**: `^5.0.0-beta`

**認証プロバイダー**:

- Google OAuth（メイン）
- Email/Password（サブ）
- Magic Link（将来的）

### ファイルストレージ

#### Cloudinary

**選定理由**:

- 画像最適化の自動化
- CDN統合
- 変換API（リサイズ、圧縮、フォーマット変換）
- 無料枠が充実（25クレジット/月）
- Next.js Image Componentとの統合

**バージョン**: SDK `^2.0.0`

**使用場面**:

- イベント画像
- お店のロゴ・写真
- ユーザープロフィール画像
- 観光スポット画像

**代替案**: Supabase Storage（シンプルなファイル保存）

---

## インフラ・ホスティング

### ホスティング

#### Vercel

**選定理由**:

- Next.js開発元による最適化
- ゼロコンフィグデプロイ
- グローバルCDN
- プレビュー環境自動生成
- 無料枠が充実（個人プロジェクト）
- Edge Functions対応
- 自動HTTPS、カスタムドメイン

**プラン**: Free（初期）→ Pro（スケール時）

### データベースホスティング

#### Supabase

**選定理由**:

- PostgreSQL完全管理
- リアルタイム機能
- 認証統合
- Storage統合
- 無料枠が充実
- 日本リージョン対応

**プラン**: Free（初期）→ Pro（$25/月）

### CI/CD

#### GitHub Actions

**選定理由**:

- GitHub統合
- 無料枠が充実（2000分/月）
- Next.jsビルド最適化
- Vercelデプロイ統合
- 自動テスト実行

**ワークフロー**:

- `ci.yml`（テスト、Lint、型チェック）
- `deploy.yml`（Vercelデプロイ）
- `pr-preview.yml`（プレビュー環境）

---

## 開発ツール

### パッケージマネージャー

#### npm

**選定理由**:

- Node.js標準
- Next.jsとの統合が容易
- 広範なエコシステム

**バージョン**: `^10.0.0`

### リンター・フォーマッター

#### ESLint

**バージョン**: `^8.57.0`

**設定**:

- `eslint-config-next`（Next.js公式）
- `@typescript-eslint`（TypeScript）
- `eslint-plugin-react-hooks`（Reactフック）

#### Prettier

**バージョン**: `^3.2.0`

**設定**:

- `printWidth: 100`
- `semi: true`
- `singleQuote: true`
- `trailingComma: 'es5'`
- `tailwindcss-plugin`（Tailwindクラスソート）

### テスト

#### Vitest

**選定理由**:

- Vite基盤（高速）
- Jest互換API
- TypeScript完全対応
- カバレッジレポート
- Next.jsとの統合

**バージョン**: `^2.0.0`

#### React Testing Library

**バージョン**: `^14.0.0`

#### Playwright（E2Eテスト）

**バージョン**: `^1.40.0`

**使用場面**:

- クリティカルなユーザーフロー
- 認証フロー
- 決済フロー

---

## 外部サービス統合

### 決済

#### Stripe

**選定理由**:

- 業界標準の決済プラットフォーム
- 日本対応（コンビニ決済、銀行振込）
- Next.jsとの統合が容易
- テストモード充実
- サブスクリプション対応

**バージョン**: SDK `^14.0.0`

**使用場面**:

- プレミアムプラン課金
- 広告掲載料
- イベント有料チケット

### メール送信

#### SendGrid

**選定理由**:

- 信頼性の高い配信率
- 無料枠が充実（100通/日）
- テンプレート機能
- 配信ログ・分析
- Next.js統合が容易

**バージョン**: SDK `^8.0.0`

**使用場面**:

- ユーザー登録確認
- パスワードリセット
- お知らせ通知
- イベントリマインダー

**代替案**: Resend（モダンなAPI、Next.js推奨）

### アナリティクス

#### Google Analytics 4

**選定理由**:

- 無料
- 標準的なアクセス解析
- Next.jsとの統合（`next/script`）

#### Vercel Analytics

**選定理由**:

- Web Vitals計測
- パフォーマンス監視
- プライバシー重視（GDPR準拠）

---

## 開発環境

### エディタ

推奨: Visual Studio Code

**拡張機能**:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript

### Node.js

**バージョン**: `>=20.0.0 LTS`

### 環境変数管理

#### `.env.local`

**必須変数**:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# SendGrid
SENDGRID_API_KEY="..."

# Stripe
STRIPE_SECRET_KEY="..."
STRIPE_PUBLISHABLE_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
```

---

## セキュリティ

### 対策項目

1. **認証・認可**: NextAuth.js、JWT、Session
2. **CSRF対策**: Next.js標準対応
3. **XSS対策**: Reactの自動エスケープ
4. **SQLインジェクション**: Prisma ORM（パラメータ化）
5. **環境変数**: `.env.local`（Gitignore）
6. **HTTPS**: Vercel自動対応
7. **Rate Limiting**: Vercel Edge Middleware
8. **Content Security Policy**: Next.js Middleware

---

## パフォーマンス最適化

### 戦略

1. **Server Components**: デフォルトで使用
2. **Image Optimization**: `next/image`
3. **Code Splitting**: 自動（Next.js）
4. **Lazy Loading**: `React.lazy()`、`dynamic()`
5. **CDN**: Vercel、Cloudinary
6. **Database Indexing**: Prisma schema
7. **Caching**: SWR、Next.js Cache

### 目標値

- **Lighthouse Score**: 90+
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.0s
- **Core Web Vitals**: すべてGreen

---

## 依存関係一覧

### プロダクション依存

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.8.3",

  "@prisma/client": "^5.20.0",
  "next-auth": "^5.0.0-beta",
  "zustand": "^4.5.0",
  "swr": "^2.2.0",

  "@radix-ui/react-*": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.300.0",

  "cloudinary": "^2.0.0",
  "@sendgrid/mail": "^8.0.0",
  "stripe": "^14.0.0"
}
```

### 開発依存

```json
{
  "@types/node": "^20.10.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",

  "prisma": "^5.20.0",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",

  "eslint": "^8.57.0",
  "eslint-config-next": "^14.2.0",
  "prettier": "^3.2.0",
  "prettier-plugin-tailwindcss": "^0.5.0",

  "vitest": "^2.0.0",
  "@testing-library/react": "^14.0.0",
  "@playwright/test": "^1.40.0"
}
```

---

## マイグレーションパス

### 既存プロジェクトからの移行

1. **Phase 1**: Next.js 14セットアップ
2. **Phase 2**: Tailwind CSS + shadcn/ui導入
3. **Phase 3**: Prisma + Supabase接続
4. **Phase 4**: NextAuth.js認証実装
5. **Phase 5**: 外部サービス統合

---

## 意思決定記録

### なぜNext.js App Routerを選んだか

- **Server Componentsによるパフォーマンス**: デフォルトでサーバーサイドレンダリング
- **Streamingによる段階的読み込み**: ユーザー体験の向上
- **ルーティングの直感性**: ファイルシステムベース
- **将来性**: Reactの進化に追従

### なぜPrisma + Supabaseを選んだか

- **型安全性**: TypeScript完全統合
- **開発生産性**: 直感的なスキーマ定義
- **マネージドサービス**: 運用コスト削減
- **リアルタイム機能**: Supabaseの強み

### なぜshadcn/uiを選んだか

- **カスタマイズ性**: コピー&ペースト方式
- **アクセシビリティ**: Radix UIベース
- **ゼロランタイムコスト**: ビルド時にバンドル
- **TypeScript対応**: 完全な型サポート

---

## 今後の検討事項

### 中期的（6ヶ月以内）

- [ ] Microservices化の検討（スケール時）
- [ ] GraphQL導入の検討（API複雑化時）
- [ ] Redisキャッシュ導入（パフォーマンス要求増加時）
- [ ] Elasticsearch導入（検索機能強化）

### 長期的（1年以内）

- [ ] モバイルアプリ化（React Native）
- [ ] PWA対応（オフライン機能）
- [ ] WebSocket導入（リアルタイム通知）
- [ ] AI機能統合（レコメンデーション）

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Documentation](https://vercel.com/docs)

---

**承認者**: CodeGenAgent (源)
**承認日**: 2025-12-02
**レビュー予定日**: 2025-03-02（3ヶ月後）
