import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'とちまち - 写真で見て選べる、栃木の優良企業',
  description:
    '栃木県の優良企業を写真や実績から簡単検索。建設・飲食・小売など幅広い業種に対応。完全無料で複数業者へ一括問い合わせが可能。Instagram連携で実際の施工例もチェックできます。',
  keywords: [
    '栃木',
    '栃木県',
    '業者検索',
    'リフォーム',
    '建設業',
    '飲食店',
    '小売',
    '見積もり',
    '一括問い合わせ',
    '宇都宮',
  ],
  openGraph: {
    title: 'とちまち - 写真で見て選べる、栃木の優良企業',
    description: '栃木県の優良企業を写真や実績から簡単検索。完全無料で複数業者へ一括問い合わせ。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'とちまち - 写真で見て選べる、栃木の優良企業',
    description: '栃木県の優良企業を写真や実績から簡単検索。完全無料で複数業者へ一括問い合わせ。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
