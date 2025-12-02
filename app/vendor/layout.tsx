import { LayoutDashboard, User, Package, MessageSquare, Instagram, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

const navigation = [
  { name: 'ダッシュボード', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'プロフィール管理', href: '/vendor/profile', icon: User },
  { name: 'サービス管理', href: '/vendor/services', icon: Package },
  { name: '問い合わせ管理', href: '/vendor/inquiries', icon: MessageSquare },
  { name: 'Instagram連携', href: '/vendor/instagram', icon: Instagram },
  { name: '課金管理', href: '/vendor/billing', icon: CreditCard },
];

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-200 px-6 py-5">
            <Link href="/vendor/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600" />
              <span className="text-xl font-bold text-gray-900">とちまち</span>
            </Link>
            <p className="mt-1 text-xs text-gray-500">業者管理画面</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">業者名</p>
                <p className="text-xs text-gray-500 truncate">vendor@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
