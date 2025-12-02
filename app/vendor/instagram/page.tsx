'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Instagram, Link2, Unlink, RefreshCw, ExternalLink, Heart, MessageCircle } from 'lucide-react';

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  postedAt: string;
}

const mockPosts: InstagramPost[] = [
  {
    id: '1',
    imageUrl: 'https://placehold.co/600x600/orange/white?text=Post+1',
    caption: '外壁塗装の施工事例です。築20年の一戸建て、美しく生まれ変わりました！',
    likes: 245,
    comments: 12,
    postedAt: '2025-12-01',
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/600x600/blue/white?text=Post+2',
    caption: '屋根工事完了しました。お客様にも大変喜んでいただけました。',
    likes: 189,
    comments: 8,
    postedAt: '2025-11-28',
  },
  {
    id: '3',
    imageUrl: 'https://placehold.co/600x600/green/white?text=Post+3',
    caption: 'リフォーム前後の比較です。劇的な変化をご覧ください！',
    likes: 312,
    comments: 24,
    postedAt: '2025-11-25',
  },
  {
    id: '4',
    imageUrl: 'https://placehold.co/600x600/purple/white?text=Post+4',
    caption: '職人の技術をご覧ください。細部までこだわっています。',
    likes: 167,
    comments: 6,
    postedAt: '2025-11-22',
  },
];

export default function VendorInstagram() {
  const [isConnected, setIsConnected] = useState(true);
  const [username, setUsername] = useState('@sample_koumuten');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    // TODO: Implement Instagram OAuth
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    if (confirm('Instagram連携を解除してもよろしいですか?')) {
      setIsConnected(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    // TODO: Implement sync logic
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instagram連携</h1>
        <p className="mt-2 text-gray-600">Instagramの投稿を自動的にプロフィールに表示できます</p>
      </div>

      {/* Connection Status */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-3">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Instagram連携</h2>
                {isConnected ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-green-100 text-green-800">連携済み</Badge>
                    <span className="text-sm text-gray-600">{username}</span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-600">まだ連携されていません</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <>
                  <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? '同期中...' : '今すぐ同期'}
                  </Button>
                  <Button variant="outline" onClick={handleDisconnect}>
                    <Unlink className="mr-2 h-4 w-4" />
                    連携解除
                  </Button>
                </>
              ) : (
                <Button onClick={handleConnect}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Instagramと連携
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {isConnected ? (
        <>
          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">同期済み投稿</p>
                    <p className="text-3xl font-bold text-gray-900">{mockPosts.length}</p>
                  </div>
                  <Instagram className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総いいね数</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {mockPosts.reduce((sum, post) => sum + post.likes, 0)}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">最終同期</p>
                    <p className="text-lg font-semibold text-gray-900">2時間前</p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Settings */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">連携設定</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">自動同期</p>
                    <p className="text-sm text-gray-600">新しい投稿を自動的に取得します</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">プロフィールに表示</p>
                    <p className="text-sm text-gray-600">
                      Instagram投稿をプロフィールページに表示します
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示する投稿数
                  </label>
                  <select className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2">
                    <option value="6">6投稿</option>
                    <option value="9" selected>
                      9投稿
                    </option>
                    <option value="12">12投稿</option>
                    <option value="15">15投稿</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">最近の投稿</h3>
              <Button variant="ghost" size="sm" asChild>
                <a href={`https://instagram.com/${username.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Instagramで見る
                </a>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mockPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{post.caption}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{post.postedAt}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card>
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Instagramと連携しましょう</h3>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Instagramアカウントを連携すると、投稿が自動的にプロフィールに表示されます。
              実績写真を効果的にアピールできます。
            </p>
            <Button className="mt-6" onClick={handleConnect}>
              <Link2 className="mr-2 h-4 w-4" />
              Instagramと連携する
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
