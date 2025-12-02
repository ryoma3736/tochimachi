import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

// 管理者認証チェック（仮実装）
async function getAdminUser() {
  // TODO: セッション管理実装
  // 本番では Next-Auth または独自セッション実装
  return {
    id: 'admin-1',
    name: '管理者',
    email: 'admin@tochimachi.jp',
    role: 'SUPER_ADMIN',
  };
}

const navItems = [
  {
    href: '/admin',
    label: 'ダッシュボード',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/vendors',
    label: '業者管理',
    icon: Building2,
  },
  {
    href: '/admin/billing',
    label: '課金管理',
    icon: CreditCard,
  },
  {
    href: '/admin/waitlist',
    label: 'ウェイトリスト',
    icon: ClipboardList,
  },
  {
    href: '/admin/settings',
    label: 'システム設定',
    icon: Settings,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* ロゴ・ヘッダー */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">と</span>
            </div>
            <span className="font-bold text-lg text-gray-900">管理画面</span>
          </Link>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* フッター */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {admin.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
