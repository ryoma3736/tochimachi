# システムアーキテクチャ設計書

## プロジェクト概要

- **プロジェクト名**: とちまち（Tochimachi）
- **システム種別**: 地域ポータルサイト（栃木県特化）
- **作成日**: 2025-12-02
- **バージョン**: 1.0

---

## アーキテクチャ概要

### システム構成

とちまちは、**Next.js 14 App Router**をベースとしたモダンなフルスタックWebアプリケーションです。Server ComponentsとClient Componentsを適切に使い分け、パフォーマンスとユーザー体験を最適化します。

### 設計原則

1. **Server-First Architecture**: デフォルトでServer Componentsを使用
2. **Progressive Enhancement**: 段階的な機能拡張
3. **Separation of Concerns**: 責務の明確な分離
4. **API-First Design**: 外部統合を見据えたAPI設計
5. **Security by Default**: セキュリティをデフォルトで組み込み

---

## 全体アーキテクチャ図

```mermaid
graph TB
    subgraph "クライアント層"
        Browser[ブラウザ]
        Mobile[モバイルブラウザ]
    end

    subgraph "CDN / Edge"
        Vercel[Vercel Edge Network]
        CloudinaryC[Cloudinary CDN]
    end

    subgraph "Next.js Application"
        subgraph "App Router"
            SC[Server Components]
            CC[Client Components]
            API[API Routes]
            SA[Server Actions]
        end

        subgraph "認証・セッション"
            Auth[NextAuth.js]
            Session[Session Management]
        end

        subgraph "状態管理"
            Zustand[Zustand Store]
            SWR[SWR Cache]
        end
    end

    subgraph "データ層"
        Prisma[Prisma ORM]
        Supabase[(Supabase PostgreSQL)]
        SupaStorage[Supabase Storage]
    end

    subgraph "外部サービス"
        Cloudinary[Cloudinary]
        SendGrid[SendGrid]
        Stripe[Stripe]
        GoogleOAuth[Google OAuth]
        GA[Google Analytics]
    end

    Browser --> Vercel
    Mobile --> Vercel
    Vercel --> SC
    Vercel --> CC
    Vercel --> API

    SC --> Prisma
    CC --> SWR
    API --> Prisma
    SA --> Prisma

    Auth --> GoogleOAuth
    Auth --> Session
    Session --> Supabase

    Prisma --> Supabase
    API --> SupaStorage
    API --> Cloudinary
    API --> SendGrid
    API --> Stripe

    CloudinaryC --> Browser
    CloudinaryC --> Mobile

    SC --> GA

    style Vercel fill:#000000,color:#ffffff
    style Supabase fill:#3ECF8E,color:#ffffff
    style Cloudinary fill:#3448C5,color:#ffffff
    style Stripe fill:#635BFF,color:#ffffff
```

---

## レイヤーアーキテクチャ

```mermaid
graph LR
    subgraph "Presentation Layer"
        A[Pages<br/>app/**]
        B[Components<br/>components/**]
        C[UI Components<br/>shadcn/ui]
    end

    subgraph "Application Layer"
        D[Server Actions<br/>app/actions/**]
        E[API Routes<br/>app/api/**]
        F[Middleware<br/>middleware.ts]
    end

    subgraph "Domain Layer"
        G[Business Logic<br/>lib/services/**]
        H[Validation<br/>lib/validations/**]
        I[Utils<br/>lib/utils/**]
    end

    subgraph "Infrastructure Layer"
        J[Database<br/>Prisma + Supabase]
        K[Authentication<br/>NextAuth.js]
        L[External APIs<br/>Cloudinary, Stripe, etc]
    end

    A --> D
    A --> B
    B --> C
    D --> G
    E --> G
    F --> K
    G --> H
    G --> I
    G --> J
    K --> J
    E --> L

    style A fill:#e3f2fd
    style D fill:#fff3e0
    style G fill:#f3e5f5
    style J fill:#e8f5e9
```

---

## ディレクトリ構造

```
tochimachi/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証関連グループ
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (main)/                   # メインコンテンツグループ
│   │   ├── events/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── shops/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── news/
│   │   └── about/
│   │
│   ├── (admin)/                  # 管理画面グループ
│   │   ├── dashboard/
│   │   ├── events/
│   │   └── layout.tsx
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── events/
│   │   │   └── route.ts
│   │   ├── shops/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   │
│   ├── actions/                  # Server Actions
│   │   ├── events.ts
│   │   ├── shops.ts
│   │   └── auth.ts
│   │
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Home Page
│   ├── not-found.tsx
│   ├── error.tsx
│   └── loading.tsx
│
├── components/                   # Reactコンポーネント
│   ├── ui/                       # shadcn/ui コンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layouts/                  # レイアウトコンポーネント
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   │
│   ├── events/                   # イベント関連
│   │   ├── event-card.tsx
│   │   ├── event-list.tsx
│   │   └── event-form.tsx
│   │
│   ├── shops/                    # お店関連
│   │   ├── shop-card.tsx
│   │   ├── shop-list.tsx
│   │   └── shop-form.tsx
│   │
│   └── common/                   # 共通コンポーネント
│       ├── loading-spinner.tsx
│       ├── error-message.tsx
│       └── pagination.tsx
│
├── lib/                          # ビジネスロジック・ユーティリティ
│   ├── prisma.ts                 # Prismaクライアント
│   ├── auth.ts                   # NextAuth設定
│   │
│   ├── services/                 # ビジネスロジック
│   │   ├── event-service.ts
│   │   ├── shop-service.ts
│   │   └── user-service.ts
│   │
│   ├── validations/              # Zodバリデーション
│   │   ├── event-schema.ts
│   │   ├── shop-schema.ts
│   │   └── user-schema.ts
│   │
│   ├── utils/                    # ユーティリティ関数
│   │   ├── cn.ts                 # Tailwindクラス結合
│   │   ├── format.ts             # 日付・文字列フォーマット
│   │   └── api.ts                # API呼び出しヘルパー
│   │
│   └── constants/                # 定数
│       ├── categories.ts
│       └── regions.ts
│
├── prisma/                       # Prisma関連
│   ├── schema.prisma             # データベーススキーマ
│   ├── migrations/               # マイグレーション履歴
│   └── seed.ts                   # シードデータ
│
├── public/                       # 静的ファイル
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                        # テスト
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                         # ドキュメント
│   ├── architecture/
│   │   ├── TECH_STACK.md
│   │   └── SYSTEM_ARCHITECTURE.md
│   └── api/
│
├── .github/                      # GitHub設定
│   ├── workflows/
│   └── labels.yml
│
├── .env.local                    # 環境変数
├── .env.example
├── next.config.mjs               # Next.js設定
├── tailwind.config.ts            # Tailwind設定
├── tsconfig.json                 # TypeScript設定
├── package.json
└── README.md
```

---

## データベース設計

### ER図

```mermaid
erDiagram
    User ||--o{ Event : creates
    User ||--o{ Shop : owns
    User ||--o{ Favorite : has
    User ||--o{ Review : writes
    User {
        string id PK
        string email UK
        string name
        string image
        enum role
        datetime createdAt
        datetime updatedAt
    }

    Event ||--o{ Favorite : "favorited by"
    Event ||--o{ Review : "has reviews"
    Event {
        string id PK
        string title
        text description
        string imageUrl
        datetime startDate
        datetime endDate
        string location
        string prefecture
        string city
        string categoryId FK
        string createdById FK
        datetime createdAt
        datetime updatedAt
    }

    Shop ||--o{ Favorite : "favorited by"
    Shop ||--o{ Review : "has reviews"
    Shop {
        string id PK
        string name
        text description
        string imageUrl
        string address
        string prefecture
        string city
        string phone
        string website
        string categoryId FK
        string ownerId FK
        datetime createdAt
        datetime updatedAt
    }

    Category ||--o{ Event : categorizes
    Category ||--o{ Shop : categorizes
    Category {
        string id PK
        string name
        string slug UK
        string type
    }

    Favorite {
        string id PK
        string userId FK
        string eventId FK "nullable"
        string shopId FK "nullable"
        datetime createdAt
    }

    Review {
        string id PK
        int rating
        text comment
        string userId FK
        string eventId FK "nullable"
        string shopId FK "nullable"
        datetime createdAt
        datetime updatedAt
    }
```

### Prismaスキーマ例

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          Role      @default(USER)
  events        Event[]
  shops         Shop[]
  favorites     Favorite[]
  reviews       Review[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  SHOP_OWNER
  EVENT_ORGANIZER
  ADMIN
}

model Event {
  id            String    @id @default(cuid())
  title         String
  description   String    @db.Text
  imageUrl      String?
  startDate     DateTime
  endDate       DateTime
  location      String
  prefecture    String
  city          String
  category      Category  @relation(fields: [categoryId], references: [id])
  categoryId    String
  createdBy     User      @relation(fields: [createdById], references: [id])
  createdById   String
  favorites     Favorite[]
  reviews       Review[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Shop {
  id            String    @id @default(cuid())
  name          String
  description   String    @db.Text
  imageUrl      String?
  address       String
  prefecture    String
  city          String
  phone         String?
  website       String?
  category      Category  @relation(fields: [categoryId], references: [id])
  categoryId    String
  owner         User      @relation(fields: [ownerId], references: [id])
  ownerId       String
  favorites     Favorite[]
  reviews       Review[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Category {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  type      String   // "event" or "shop"
  events    Event[]
  shops     Shop[]
}
```

---

## API設計

### API Routes構成

```mermaid
graph TB
    subgraph "Public API"
        A[GET /api/events]
        B[GET /api/events/:id]
        C[GET /api/shops]
        D[GET /api/shops/:id]
    end

    subgraph "Protected API - 認証必須"
        E[POST /api/events]
        F[PUT /api/events/:id]
        G[DELETE /api/events/:id]
        H[POST /api/favorites]
        I[POST /api/reviews]
    end

    subgraph "Admin API - 管理者のみ"
        J[GET /api/admin/users]
        K[DELETE /api/admin/events/:id]
    end

    subgraph "Webhooks"
        L[POST /api/webhooks/stripe]
    end

    subgraph "Authentication"
        M[GET/POST /api/auth/...]
    end

    style A fill:#c8e6c9
    style E fill:#fff9c4
    style J fill:#ffcdd2
    style L fill:#e1bee7
    style M fill:#bbdefb
```

### エンドポイント一覧

#### イベント関連

| メソッド | エンドポイント    | 説明             | 認証           |
| -------- | ----------------- | ---------------- | -------------- |
| GET      | `/api/events`     | イベント一覧取得 | 不要           |
| GET      | `/api/events/:id` | イベント詳細取得 | 不要           |
| POST     | `/api/events`     | イベント作成     | 必要           |
| PUT      | `/api/events/:id` | イベント更新     | 必要（作成者） |
| DELETE   | `/api/events/:id` | イベント削除     | 必要（作成者） |

#### お店関連

| メソッド | エンドポイント   | 説明         | 認証             |
| -------- | ---------------- | ------------ | ---------------- |
| GET      | `/api/shops`     | お店一覧取得 | 不要             |
| GET      | `/api/shops/:id` | お店詳細取得 | 不要             |
| POST     | `/api/shops`     | お店登録     | 必要             |
| PUT      | `/api/shops/:id` | お店情報更新 | 必要（オーナー） |
| DELETE   | `/api/shops/:id` | お店削除     | 必要（オーナー） |

#### お気に入り関連

| メソッド | エンドポイント       | 説明           | 認証 |
| -------- | -------------------- | -------------- | ---- |
| GET      | `/api/favorites`     | お気に入り一覧 | 必要 |
| POST     | `/api/favorites`     | お気に入り追加 | 必要 |
| DELETE   | `/api/favorites/:id` | お気に入り削除 | 必要 |

#### レビュー関連

| メソッド | エンドポイント     | 説明         | 認証           |
| -------- | ------------------ | ------------ | -------------- |
| GET      | `/api/reviews`     | レビュー一覧 | 不要           |
| POST     | `/api/reviews`     | レビュー投稿 | 必要           |
| PUT      | `/api/reviews/:id` | レビュー編集 | 必要（作成者） |
| DELETE   | `/api/reviews/:id` | レビュー削除 | 必要（作成者） |

---

## 認証フロー

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant N as Next.js
    participant NA as NextAuth
    participant G as Google OAuth
    participant DB as Database

    U->>B: ログインボタンクリック
    B->>N: /api/auth/signin
    N->>NA: signIn('google')
    NA->>G: OAuth認証リクエスト
    G->>U: Googleログイン画面表示
    U->>G: 認証情報入力
    G->>NA: 認証トークン返却
    NA->>DB: ユーザー情報取得/作成
    DB-->>NA: ユーザーデータ
    NA->>NA: JWTトークン生成
    NA->>B: Cookieにセッション保存
    B->>U: ダッシュボードへリダイレクト

    Note over B,DB: 以降のリクエスト
    B->>N: 保護されたページ
    N->>NA: セッション検証
    NA->>DB: ユーザー情報取得
    DB-->>NA: ユーザーデータ
    NA-->>N: 認証済み
    N-->>B: ページ表示
```

---

## データフロー

### Server Component データフロー

```mermaid
graph LR
    A[User Request] --> B[Next.js Server]
    B --> C{Server Component?}
    C -->|Yes| D[Prisma Query]
    D --> E[(Database)]
    E --> F[Data Processing]
    F --> G[HTML Generation]
    G --> H[Response to Client]

    C -->|No| I[Client Component]
    I --> J[Hydration]
    J --> K[SWR Fetch]
    K --> L[API Route]
    L --> D

    style D fill:#e3f2fd
    style I fill:#fff3e0
```

### クライアント側データフロー

```mermaid
graph TB
    A[Client Component] --> B{Data in Cache?}
    B -->|Yes| C[Return Cached Data]
    B -->|No| D[SWR Fetch]
    D --> E[API Route]
    E --> F[Prisma Query]
    F --> G[(Database)]
    G --> H[Response]
    H --> I[Update Cache]
    I --> J[Revalidate]
    J --> D

    style C fill:#c8e6c9
    style I fill:#fff9c4
```

---

## デプロイメント構成

```mermaid
graph TB
    subgraph "GitHub"
        A[Git Push]
        B[GitHub Actions]
    end

    subgraph "Vercel"
        C[Build Process]
        D[Preview Environment]
        E[Production Environment]
        F[Edge Network]
    end

    subgraph "Supabase"
        G[(PostgreSQL)]
        H[Storage]
    end

    subgraph "External Services"
        I[Cloudinary]
        J[SendGrid]
        K[Stripe]
    end

    A --> B
    B --> C
    C --> D
    C --> E
    E --> F

    F --> G
    F --> H
    F --> I
    F --> J
    F --> K

    style A fill:#f9f9f9
    style E fill:#000000,color:#ffffff
    style G fill:#3ECF8E,color:#ffffff
```

### デプロイメントフロー

```mermaid
sequenceDiagram
    participant D as Developer
    participant G as GitHub
    participant GA as GitHub Actions
    participant V as Vercel
    participant S as Supabase

    D->>G: git push
    G->>GA: Trigger Workflow

    GA->>GA: npm install
    GA->>GA: npm run lint
    GA->>GA: npm run typecheck
    GA->>GA: npm test

    alt Tests Pass
        GA->>V: Deploy Trigger
        V->>V: Build Next.js
        V->>S: Run Migrations
        S-->>V: Success
        V->>V: Deploy to Edge
        V-->>G: Deployment Success
        G-->>D: Notification
    else Tests Fail
        GA-->>G: Build Failed
        G-->>D: Error Notification
    end
```

---

## セキュリティアーキテクチャ

### セキュリティレイヤー

```mermaid
graph TB
    subgraph "Edge Layer"
        A[Rate Limiting]
        B[DDoS Protection]
    end

    subgraph "Application Layer"
        C[CSRF Protection]
        D[XSS Prevention]
        E[Input Validation]
    end

    subgraph "Authentication Layer"
        F[NextAuth.js]
        G[JWT Tokens]
        H[Session Management]
    end

    subgraph "Data Layer"
        I[Prisma ORM]
        J[SQL Injection Prevention]
        K[Row Level Security]
    end

    subgraph "Transport Layer"
        L[HTTPS/TLS]
        M[Secure Headers]
    end

    A --> C
    B --> C
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    L --> M
    M --> A

    style F fill:#635BFF,color:#ffffff
    style I fill:#2D3748,color:#ffffff
```

### 認可フロー

```mermaid
graph LR
    A[Request] --> B{Authenticated?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Has Permission?}
    D -->|No| E[403 Forbidden]
    D -->|Yes| F{Rate Limit OK?}
    F -->|No| G[429 Too Many Requests]
    F -->|Yes| H[Process Request]

    style C fill:#ffcdd2
    style E fill:#ffcdd2
    style G fill:#fff9c4
    style H fill:#c8e6c9
```

---

## パフォーマンス最適化戦略

### キャッシング戦略

```mermaid
graph TB
    subgraph "Browser Cache"
        A[Static Assets]
        B[Service Worker]
    end

    subgraph "CDN Cache - Vercel Edge"
        C[HTML Pages]
        D[API Responses]
    end

    subgraph "Application Cache"
        E[SWR Cache]
        F[React Query Cache]
    end

    subgraph "Database Cache"
        G[Prisma Query Cache]
        H[PostgreSQL Cache]
    end

    A --> C
    B --> C
    C --> E
    D --> E
    E --> G
    F --> G
    G --> H

    style A fill:#e3f2fd
    style C fill:#000000,color:#ffffff
    style E fill:#fff3e0
    style G fill:#3ECF8E,color:#ffffff
```

### レンダリング戦略

| ページタイプ   | レンダリング方式 | 理由                                       |
| -------------- | ---------------- | ------------------------------------------ |
| ホームページ   | ISR (60秒)       | 新規イベント反映とパフォーマンスのバランス |
| イベント一覧   | SSR              | リアルタイム性重視                         |
| イベント詳細   | SSG (fallback)   | SEO最適化                                  |
| お店一覧       | SSR              | 検索・フィルタ機能                         |
| お店詳細       | SSG (fallback)   | SEO最適化                                  |
| ダッシュボード | CSR              | 認証必須、動的データ                       |
| 管理画面       | CSR              | 認証必須、リアルタイム                     |

---

## モニタリング・ログ

### 監視対象メトリクス

```mermaid
graph TB
    subgraph "Frontend Metrics"
        A[Core Web Vitals]
        B[Page Load Time]
        C[JS Bundle Size]
    end

    subgraph "Backend Metrics"
        D[API Response Time]
        E[Database Query Time]
        F[Error Rate]
    end

    subgraph "Business Metrics"
        G[User Sign-ups]
        H[Event Creations]
        I[Review Submissions]
    end

    subgraph "Infrastructure Metrics"
        J[Server CPU/Memory]
        K[Database Connections]
        L[CDN Bandwidth]
    end

    A --> M[Vercel Analytics]
    B --> M
    C --> M
    D --> N[Custom Logging]
    E --> N
    F --> N
    G --> O[Google Analytics]
    H --> O
    I --> O
    J --> P[Vercel Dashboard]
    K --> P
    L --> P

    style M fill:#000000,color:#ffffff
    style O fill:#4285F4,color:#ffffff
```

---

## スケーラビリティ計画

### 成長段階別アーキテクチャ

#### Phase 1: MVP（0-1,000 MAU）

- **現在のアーキテクチャ**: Vercel + Supabase Free Tier
- **コスト**: $0-50/月
- **パフォーマンス**: 十分

#### Phase 2: 成長期（1,000-10,000 MAU）

- **Supabase**: Pro Tier ($25/月)
- **Vercel**: Pro Tier ($20/月)
- **追加**: Redis Cache（Upstash）
- **コスト**: $50-150/月

#### Phase 3: スケール期（10,000+ MAU）

- **Database**: 読み取りレプリカ追加
- **Cache**: Redis Cluster
- **CDN**: 追加最適化
- **API**: Rate Limiting強化
- **コスト**: $200-500/月

---

## 災害対策・バックアップ

### バックアップ戦略

```mermaid
graph LR
    A[(Production DB)] --> B[Daily Backup]
    B --> C[Supabase Backup]
    C --> D[7日間保持]

    A --> E[Weekly Backup]
    E --> F[External Storage]
    F --> G[30日間保持]

    A --> H[Real-time Replication]
    H --> I[Standby DB]

    style A fill:#3ECF8E,color:#ffffff
    style I fill:#FFA000,color:#ffffff
```

### 復旧時間目標（RTO/RPO）

| サービス            | RTO   | RPO    | 対策                     |
| ------------------- | ----- | ------ | ------------------------ |
| Webアプリケーション | 1時間 | 5分    | Vercel自動復旧           |
| データベース        | 4時間 | 24時間 | Supabase自動バックアップ |
| ファイルストレージ  | 2時間 | 24時間 | Cloudinary冗長化         |

---

## 今後の拡張計画

### Phase 2 機能拡張（6ヶ月以内）

- [ ] モバイルアプリ（React Native）
- [ ] リアルタイム通知（WebSocket）
- [ ] AIレコメンデーション
- [ ] 多言語対応（i18n）

### Phase 3 技術拡張（1年以内）

- [ ] Microservices化
- [ ] GraphQL API
- [ ] Elasticsearch（全文検索）
- [ ] Machine Learning（パーソナライゼーション）

---

## 参考資料

- [Next.js Architecture](https://nextjs.org/docs/architecture)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [Supabase Architecture](https://supabase.com/docs/guides/platform/architecture)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

**作成者**: CodeGenAgent (源)
**作成日**: 2025-12-02
**承認者**: -
**レビュー予定日**: 2025-03-02
