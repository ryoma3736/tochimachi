'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function DesignSystemPage() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      {/* ヒーローセクション */}
      <section className="section-spacing bg-gradient-to-b from-tochimachi-orange-50 to-background">
        <div className="container-narrow">
          <h1 className="mb-4 animate-fade-in text-center text-display-lg text-tochimachi-brown-900">
            とちまち デザインシステム
          </h1>
          <p className="animation-delay-200 animate-fade-in text-center text-body-lg text-muted-foreground">
            温かみと使いやすさを兼ね備えたUIコンポーネント集
          </p>
        </div>
      </section>

      {/* カラーパレット */}
      <section className="section-spacing">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">カラーパレット</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* オレンジ系 */}
            <div>
              <h3 className="mb-4 text-heading-md">オレンジ系（温かみ）</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="flex items-center gap-4 rounded-lg border p-3">
                    <div
                      className={`h-16 w-16 rounded-md shadow-soft bg-tochimachi-orange-${shade}`}
                    />
                    <div>
                      <p className="text-label-lg font-medium">orange-{shade}</p>
                      <p className="text-label-sm text-muted-foreground">
                        bg-tochimachi-orange-{shade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ブラウン系 */}
            <div>
              <h3 className="mb-4 text-heading-md">ブラウン系（落ち着き）</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="flex items-center gap-4 rounded-lg border p-3">
                    <div
                      className={`h-16 w-16 rounded-md shadow-soft bg-tochimachi-brown-${shade}`}
                    />
                    <div>
                      <p className="text-label-lg font-medium">brown-{shade}</p>
                      <p className="text-label-sm text-muted-foreground">
                        bg-tochimachi-brown-{shade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* タイポグラフィ */}
      <section className="section-spacing bg-tochimachi-orange-50">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">タイポグラフィ</h2>

          <div className="space-y-6">
            <div className="card-warm p-6">
              <h3 className="mb-4 text-heading-md">見出しサイズ</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-display-lg">Display Large (3.5rem)</p>
                  <code className="text-label-sm">text-display-lg</code>
                </div>
                <div>
                  <p className="text-display-md">Display Medium (3rem)</p>
                  <code className="text-label-sm">text-display-md</code>
                </div>
                <div>
                  <p className="text-display-sm">Display Small (2.5rem)</p>
                  <code className="text-label-sm">text-display-sm</code>
                </div>
                <div>
                  <p className="text-heading-xl">Heading XL (2rem)</p>
                  <code className="text-label-sm">text-heading-xl</code>
                </div>
                <div>
                  <p className="text-heading-lg">Heading Large (1.75rem)</p>
                  <code className="text-label-sm">text-heading-lg</code>
                </div>
                <div>
                  <p className="text-heading-md">Heading Medium (1.5rem)</p>
                  <code className="text-label-sm">text-heading-md</code>
                </div>
                <div>
                  <p className="text-heading-sm">Heading Small (1.25rem)</p>
                  <code className="text-label-sm">text-heading-sm</code>
                </div>
              </div>
            </div>

            <div className="card-warm p-6">
              <h3 className="mb-4 text-heading-md">本文・ラベルサイズ</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-body-lg">
                    Body Large - 大きな本文やリード文に使用します (1.125rem)
                  </p>
                  <code className="text-label-sm">text-body-lg</code>
                </div>
                <div>
                  <p className="text-body-md">Body Medium - 標準的な本文に使用します (1rem)</p>
                  <code className="text-label-sm">text-body-md</code>
                </div>
                <div>
                  <p className="text-body-sm">Body Small - 注釈や補足情報に使用します (0.875rem)</p>
                  <code className="text-label-sm">text-body-sm</code>
                </div>
                <div>
                  <p className="text-label-lg">Label Large - フォームラベルに使用 (0.875rem)</p>
                  <code className="text-label-sm">text-label-lg</code>
                </div>
                <div>
                  <p className="text-label-md">Label Medium - バッジやタグに使用 (0.75rem)</p>
                  <code className="text-label-sm">text-label-md</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ボタン */}
      <section className="section-spacing">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">ボタン</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="card-warm p-6">
              <h3 className="mb-4 text-heading-sm">プライマリボタン</h3>
              <div className="space-y-3">
                <Button className="btn-warm w-full">お問い合わせ</Button>
                <Button className="w-full" size="lg">
                  大きなボタン
                </Button>
                <Button className="w-full" size="sm">
                  小さなボタン
                </Button>
              </div>
            </div>

            <div className="card-warm p-6">
              <h3 className="mb-4 text-heading-sm">セカンダリボタン</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  詳しく見る
                </Button>
                <Button variant="outline" className="w-full">
                  キャンセル
                </Button>
                <Button variant="ghost" className="w-full">
                  戻る
                </Button>
              </div>
            </div>

            <div className="card-warm p-6">
              <h3 className="mb-4 text-heading-sm">状態</h3>
              <div className="space-y-3">
                <Button className="w-full" disabled>
                  無効状態
                </Button>
                <Button
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: 'ボタンがクリックされました',
                      description: 'Toastコンポーネントのテストです。',
                    })
                  }
                >
                  Toast表示
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* カード */}
      <section className="section-spacing bg-tochimachi-orange-50">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">カード</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-heading-md">株式会社サンプル建設</CardTitle>
                <CardDescription>栃木県宇都宮市</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-md">
                  創業50年の実績を持つ地域密着型の建設会社です。住宅リフォームから大型建築まで幅広く対応しています。
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge className="bg-tochimachi-orange-100 text-tochimachi-orange-700">
                    おすすめ
                  </Badge>
                  <Badge variant="secondary">建設業</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="btn-warm w-full">詳細を見る</Button>
              </CardFooter>
            </Card>

            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-heading-md">カフェ栃木</CardTitle>
                <CardDescription>栃木県日光市</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-md">
                  地元食材を使った料理とこだわりのコーヒーが自慢のカフェ。観光客にも人気のスポットです。
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline">新着</Badge>
                  <Badge variant="secondary">飲食店</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  詳細を見る
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-heading-md">とちまち商店</CardTitle>
                <CardDescription>栃木県足利市</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-md">
                  栃木の特産品を扱う老舗商店。いちごやかんぴょうなど、地域の魅力を全国に発信しています。
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge className="bg-tochimachi-orange-100 text-tochimachi-orange-700">
                    人気
                  </Badge>
                  <Badge variant="secondary">小売業</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="btn-warm w-full">詳細を見る</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* フォーム要素 */}
      <section className="section-spacing">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">フォーム要素</h2>

          <div className="max-w-2xl">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-heading-md">お問い合わせフォーム</CardTitle>
                <CardDescription>必要事項をご入力ください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-label-lg font-medium">会社名</label>
                  <Input
                    type="text"
                    placeholder="株式会社〇〇"
                    className="border-tochimachi-brown-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-label-lg font-medium">業種</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="業種を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">建設業</SelectItem>
                      <SelectItem value="restaurant">飲食店</SelectItem>
                      <SelectItem value="retail">小売業</SelectItem>
                      <SelectItem value="service">サービス業</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-label-lg font-medium">お問い合わせ内容</label>
                  <Input
                    type="text"
                    placeholder="お問い合わせ内容を入力してください"
                    className="border-tochimachi-brown-200"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  キャンセル
                </Button>
                <Button className="btn-warm flex-1">送信</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* タブとダイアログ */}
      <section className="section-spacing bg-tochimachi-orange-50">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">タブとダイアログ</h2>

          <div className="space-y-8">
            {/* タブ */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-heading-md">業種別企業一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">すべて</TabsTrigger>
                    <TabsTrigger value="construction">建設業</TabsTrigger>
                    <TabsTrigger value="restaurant">飲食店</TabsTrigger>
                    <TabsTrigger value="retail">小売業</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <p className="text-body-md">すべての業種の企業を表示しています。</p>
                  </TabsContent>
                  <TabsContent value="construction" className="mt-4">
                    <p className="text-body-md">建設業の企業を表示しています。</p>
                  </TabsContent>
                  <TabsContent value="restaurant" className="mt-4">
                    <p className="text-body-md">飲食店を表示しています。</p>
                  </TabsContent>
                  <TabsContent value="retail" className="mt-4">
                    <p className="text-body-md">小売業の企業を表示しています。</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* ダイアログ */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-heading-md">ダイアログ</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-warm">お問い合わせダイアログ</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-heading-md">お問い合わせ</DialogTitle>
                      <DialogDescription>お問い合わせ内容を入力してください。</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-label-lg font-medium">お名前</label>
                        <Input placeholder="山田 太郎" className="border-tochimachi-brown-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-label-lg font-medium">メールアドレス</label>
                        <Input
                          type="email"
                          placeholder="example@example.com"
                          className="border-tochimachi-brown-200"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        キャンセル
                      </Button>
                      <Button className="btn-warm flex-1">送信</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* バッジ */}
      <section className="section-spacing">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">バッジ</h2>

          <Card className="card-warm">
            <CardHeader>
              <CardTitle className="text-heading-md">各種バッジ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-tochimachi-orange-100 text-tochimachi-orange-700">
                  おすすめ
                </Badge>
                <Badge className="bg-tochimachi-orange-500 text-white">人気</Badge>
                <Badge variant="secondary">新着</Badge>
                <Badge variant="outline">期間限定</Badge>
                <Badge variant="destructive">売切</Badge>
                <Badge className="bg-tochimachi-brown-600 text-white">地域密着</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* レスポンシブグリッド */}
      <section className="section-spacing bg-tochimachi-orange-50">
        <div className="container">
          <h2 className="mb-8 text-heading-xl text-tochimachi-brown-700">レスポンシブグリッド</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="card-warm animate-fade-in p-6 text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-heading-sm">グリッド {i + 1}</p>
                <p className="text-body-sm text-muted-foreground">レスポンシブに対応</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
