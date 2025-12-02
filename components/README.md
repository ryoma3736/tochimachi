# とちまち - 共通UIコンポーネント

rehome-navi.comを参考にした、栃木県ポータルサイト「とちまち」の共通UIコンポーネント集です。

## 📦 コンポーネント一覧

### 1. レイアウトコンポーネント (`/layout`)

#### Header

ロゴ、ナビゲーション、電話番号、CTAボタンを含むヘッダーコンポーネント

```tsx
import { Header } from '@/components/layout';

<Header phoneNumber="028-XXX-XXXX" ctaText="無料相談" ctaLink="/contact" />;
```

**Props:**

- `phoneNumber?: string` - 電話番号（デフォルト: "028-XXX-XXXX"）
- `ctaText?: string` - CTAボタンテキスト（デフォルト: "無料相談"）
- `ctaLink?: string` - CTAリンク先（デフォルト: "/contact"）

#### Footer

フッターコンポーネント（リンク集、会社情報、SNS）

```tsx
import { Footer } from '@/components/layout';

<Footer
  companyName="株式会社とちまち"
  companyAddress="栃木県宇都宮市○○町1-2-3"
  companyPhone="028-XXX-XXXX"
  companyEmail="info@tochimachi.jp"
/>;
```

#### Container

レスポンシブなmax-width制御コンテナ

```tsx
import { Container } from '@/components/layout';

<Container maxWidth="xl" padding>
  {/* コンテンツ */}
</Container>;
```

**Props:**

- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` - 最大幅
- `padding?: boolean` - パディング有効化

---

### 2. 業者表示コンポーネント (`/vendor`)

#### VendorCard

業者カード（写真、名前、カテゴリ、Instagram連携）

```tsx
import { VendorCard } from '@/components/vendor';

<VendorCard
  id="vendor-1"
  name="○○建設"
  category="リフォーム"
  description="高品質な施工とアフターサポート"
  imageUrl="/images/vendor1.jpg"
  instagramHandle="example_vendor"
  rating={4.8}
  reviewCount={127}
  location="宇都宮市"
  priceRange="50万円〜"
  tags={['リフォーム', '新築', 'エクステリア']}
  featured
/>;
```

#### ServiceCard

サービス・料金カード

```tsx
import { ServiceCard } from '@/components/vendor';

<ServiceCard
  id="service-1"
  title="基本プラン"
  description="初めての方におすすめのプラン"
  price={300000}
  duration="約2週間"
  features={['現地調査', 'プラン提案', '施工', 'アフターサポート']}
  popular
  onAddToCart={(id) => console.log('Added:', id)}
/>;
```

#### PriceRange

価格帯表示コンポーネント

```tsx
import { PriceRange, PriceRangeFilter } from '@/components/vendor';

{
  /* 単純表示 */
}
<PriceRange min={300000} max={500000} variant="badge" />;

{
  /* フィルター */
}
<PriceRangeFilter selectedRange="3" onRangeChange={(id) => console.log('Selected:', id)} />;
```

#### CategoryTab

業種タブ切り替え

```tsx
import { CategoryTab } from '@/components/vendor';
import { Home, Utensils, ShoppingBag } from 'lucide-react';

const categories = [
  { id: '1', name: '建設・リフォーム', icon: Home, count: 45 },
  { id: '2', name: '飲食店', icon: Utensils, count: 32 },
  { id: '3', name: '小売店', icon: ShoppingBag, count: 28 },
];

<CategoryTab
  categories={categories}
  activeCategory="1"
  onCategoryChange={(id) => console.log('Category:', id)}
  variant="tabs" // 'tabs' | 'pills' | 'cards'
/>;
```

---

### 3. Instagram連携コンポーネント (`/instagram`)

#### InstagramGallery

Instagram投稿ギャラリー

```tsx
import { InstagramGallery } from '@/components/instagram';

const posts = [
  {
    id: '1',
    imageUrl: '/images/post1.jpg',
    caption: '施工事例：リビングリフォーム',
    likes: 324,
    comments: 12,
    postUrl: 'https://instagram.com/p/xxx',
    timestamp: '2024-12-01T10:00:00Z',
  },
  // ...
];

<InstagramGallery
  posts={posts}
  vendorName="○○建設"
  instagramHandle="example_vendor"
  layout="grid" // 'grid' | 'carousel'
  columns={3} // 2 | 3 | 4
/>;
```

#### InstagramPost

単一投稿表示

```tsx
import { InstagramPost } from '@/components/instagram';

<InstagramPost
  id="1"
  imageUrl="/images/post1.jpg"
  caption="施工事例"
  likes={324}
  comments={12}
  postUrl="https://instagram.com/p/xxx"
  timestamp="2024-12-01T10:00:00Z"
  showActions
  aspectRatio="square" // 'square' | 'portrait' | 'landscape'
/>;
```

---

### 4. フォームコンポーネント (`/form`)

#### SearchBar

検索バー（キーワード＋エリア）

```tsx
import { SearchBar } from '@/components/form';

<SearchBar
  placeholder="サービスや業者を検索..."
  onSearch={(query, location) => {
    console.log('Search:', query, location);
  }}
  showLocationFilter
  defaultQuery="リフォーム"
  defaultLocation="宇都宮市"
/>;
```

#### CompactSearchBar

コンパクト版検索バー

```tsx
import { CompactSearchBar } from '@/components/form';

<CompactSearchBar placeholder="検索..." onSearch={(query) => console.log(query)} />;
```

#### PhoneButton

電話発信ボタン

```tsx
import { PhoneButton, FloatingPhoneButton, PhoneNumberDisplay } from '@/components/form';

{
  /* 通常ボタン */
}
<PhoneButton
  phoneNumber="028-XXX-XXXX"
  label="電話で問い合わせ"
  variant="primary" // 'default' | 'primary' | 'outline' | 'ghost'
  size="md" // 'sm' | 'md' | 'lg'
  showIcon
/>;

{
  /* フローティングボタン */
}
<FloatingPhoneButton
  phoneNumber="028-XXX-XXXX"
  label="電話する"
  position="bottom-right" // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
/>;

{
  /* 番号表示（クリックで発信） */
}
<PhoneNumberDisplay phoneNumber="028-XXX-XXXX" showIcon />;
```

---

### 5. カートコンポーネント (`/cart`)

#### CartDrawer

カートサイドパネル

```tsx
import { CartDrawer, CartButton } from '@/components/cart';

const [isCartOpen, setIsCartOpen] = useState(false);
const [cartItems, setCartItems] = useState([]);

<>
  {/* カートボタン */}
  <CartButton itemCount={cartItems.length} onClick={() => setIsCartOpen(true)} />

  {/* カートドロワー */}
  <CartDrawer
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    items={cartItems}
    onUpdateQuantity={(id, quantity) => {
      // 数量更新処理
    }}
    onRemoveItem={(id) => {
      // アイテム削除処理
    }}
    onCheckout={() => {
      // お問い合わせページへ遷移
    }}
  />
</>;
```

#### CartItem

カート内アイテム

```tsx
import { CartItem } from '@/components/cart';

<CartItem
  id="item-1"
  name="基本プラン"
  vendorName="○○建設"
  price={300000}
  quantity={1}
  imageUrl="/images/service1.jpg"
  duration="約2週間"
  onUpdateQuantity={(quantity) => console.log(quantity)}
  onRemove={() => console.log('Removed')}
/>;
```

---

## 🎨 デザインシステム

### カラー

Tailwind CSSのカスタムカラーを使用：

- `primary`: プライマリカラー
- `secondary`: セカンダリカラー
- `accent`: アクセントカラー
- `muted`: ミュートカラー
- `destructive`: 削除・警告カラー

### フォント

- Noto Sans JP（Google Fonts）

### レスポンシブブレークポイント

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🛠 開発

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### 型チェック

```bash
npm run typecheck
```

### フォーマット

```bash
npm run format
```

---

## 📖 使用例

### 基本的なページレイアウト

```tsx
import { Header, Footer, Container } from '@/components/layout';
import { SearchBar } from '@/components/form';
import { VendorCard } from '@/components/vendor';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Container maxWidth="xl">
          <div className="space-y-8 py-8">
            <SearchBar onSearch={(q, l) => console.log(q, l)} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
```

---

## 📝 ライセンス

MIT License
