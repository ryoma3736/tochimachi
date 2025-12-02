# Instagram API Endpoints - Quick Reference

## 概要

とちまちプロジェクトで実装されたInstagram連携APIの一覧です。

---

## 実装済みエンドポイント

### 1. 業者向けAPI（認証必須）

| エンドポイント | メソッド | 説明 | ファイルパス |
|--------------|---------|------|-------------|
| `/api/vendor/instagram/connect` | POST | Instagram連携開始（OAuth URL生成） | `app/api/vendor/instagram/connect/route.ts` |
| `/api/vendor/instagram/disconnect` | DELETE | Instagram連携解除 | `app/api/vendor/instagram/disconnect/route.ts` |
| `/api/vendor/instagram/status` | GET | Instagram連携ステータス取得 | `app/api/vendor/instagram/status/route.ts` |

### 2. 認証コールバック（公開）

| エンドポイント | メソッド | 説明 | ファイルパス |
|--------------|---------|------|-------------|
| `/api/auth/instagram/callback` | GET | Instagram OAuth認証コールバック | `app/api/auth/instagram/callback/route.ts` |

### 3. 一般公開API（認証不要）

| エンドポイント | メソッド | 説明 | ファイルパス |
|--------------|---------|------|-------------|
| `/api/vendors/[id]/instagram/posts` | GET | 業者のInstagram投稿取得 | `app/api/vendors/[id]/instagram/posts/route.ts` |

---

## ライブラリ・ユーティリティ

| ファイル | 説明 |
|---------|------|
| `lib/instagram.ts` | Instagram API ユーティリティライブラリ |
| `lib/utils/encryption.ts` | AES-256-GCM暗号化ユーティリティ |

---

## 使用例

### 1. Instagram連携開始（業者）

```typescript
// POST /api/vendor/instagram/connect
const response = await fetch('/api/vendor/instagram/connect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // セッションCookie送信
});

const { authUrl } = await response.json();

// Instagram認証画面にリダイレクト
window.location.href = authUrl;
```

### 2. Instagram連携ステータス確認（業者）

```typescript
// GET /api/vendor/instagram/status
const response = await fetch('/api/vendor/instagram/status', {
  credentials: 'include',
});

const { data } = await response.json();

if (data.isConnected) {
  console.log(`Connected: @${data.username}`);
  console.log(`Posts: ${data.postsCount}`);
  console.log(`Last sync: ${data.lastSyncAt}`);
}
```

### 3. Instagram投稿取得（一般ユーザー）

```typescript
// GET /api/vendors/[id]/instagram/posts?sync=true
const vendorId = 'vendor123';
const response = await fetch(`/api/vendors/${vendorId}/instagram/posts?sync=true&limit=50`);

const { data } = await response.json();

if (data.isConnected) {
  console.log(`@${data.username}'s posts:`);
  data.posts.forEach(post => {
    console.log(`- ${post.caption}`);
    console.log(`  ${post.media_url}`);
  });
}
```

### 4. Instagram連携解除（業者）

```typescript
// DELETE /api/vendor/instagram/disconnect
const response = await fetch('/api/vendor/instagram/disconnect', {
  method: 'DELETE',
  credentials: 'include',
});

const { message } = await response.json();
console.log(message); // "Instagram account disconnected successfully"
```

---

## React/Next.js統合例

### カスタムフック: useInstagramStatus

```typescript
// hooks/useInstagramStatus.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

export function useInstagramStatus() {
  const { data, error, mutate } = useSWR('/api/vendor/instagram/status', fetcher);

  return {
    status: data?.data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
```

### Instagram連携ボタンコンポーネント

```typescript
// components/InstagramConnectButton.tsx
'use client';

import { useState } from 'react';
import { useInstagramStatus } from '@/hooks/useInstagramStatus';

export function InstagramConnectButton() {
  const { status, refresh } = useInstagramStatus();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vendor/instagram/connect', {
        method: 'POST',
        credentials: 'include',
      });
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect Instagram:', error);
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Instagram連携を解除しますか?')) return;

    setIsLoading(true);
    try {
      await fetch('/api/vendor/instagram/disconnect', {
        method: 'DELETE',
        credentials: 'include',
      });
      refresh(); // ステータス再取得
    } catch (error) {
      console.error('Failed to disconnect Instagram:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!status) return <div>Loading...</div>;

  if (status.isConnected) {
    return (
      <div>
        <p>Connected: @{status.username}</p>
        <p>Posts: {status.postsCount}</p>
        <button onClick={handleDisconnect} disabled={isLoading}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleConnect} disabled={isLoading}>
      Connect Instagram
    </button>
  );
}
```

---

## セキュリティ要件

### 認証必須エンドポイント

以下のエンドポイントは `vendor` ロールの認証が必須です:

- `POST /api/vendor/instagram/connect`
- `DELETE /api/vendor/instagram/disconnect`
- `GET /api/vendor/instagram/status`

認証チェック実装:

```typescript
const session = await getServerSession(authOptions);

if (!session?.user || session.user.role !== 'vendor') {
  return NextResponse.json(
    { error: 'Unauthorized. Vendor authentication required.' },
    { status: 401 }
  );
}
```

### CSRF対策

OAuth認証時、`state` パラメータにvendorIdを埋め込むことでCSRF攻撃を防ぎます:

```typescript
const authUrl = getInstagramAuthUrl(vendorId);
// → https://api.instagram.com/oauth/authorize?state=vendor123&...
```

---

## エラーハンドリング

### クライアント側

```typescript
try {
  const response = await fetch('/api/vendor/instagram/connect', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const { authUrl } = await response.json();
  window.location.href = authUrl;
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    alert('ログインが必要です');
  } else if (error.message.includes('not configured')) {
    alert('Instagram APIが設定されていません');
  } else {
    alert('エラーが発生しました');
  }
}
```

---

## まとめ

| 機能 | エンドポイント数 | 実装ファイル数 | 状態 |
|------|----------------|--------------|------|
| Instagram連携 | 5 | 7 | 完了 |

実装日: 2025-12-02
担当: CodeGenAgent (源 💻)
Issue: #16

詳細ドキュメント: `docs/instagram-integration.md`
