import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export default function Footer({
  companyName = '株式会社とちまち',
  companyAddress = '栃木県宇都宮市○○町1-2-3',
  companyPhone = '028-XXX-XXXX',
  companyEmail = 'info@tochimachi.jp',
}: FooterProps) {
  const footerSections: FooterSection[] = [
    {
      title: 'サービス',
      links: [
        { href: '/vendors', label: '業者一覧' },
        { href: '/categories', label: 'カテゴリから探す' },
        { href: '/area', label: 'エリアから探す' },
        { href: '/price', label: '予算から探す' },
      ],
    },
    {
      title: 'ご利用案内',
      links: [
        { href: '/how-to-use', label: 'ご利用方法' },
        { href: '/faq', label: 'よくある質問' },
        { href: '/contact', label: 'お問い合わせ' },
        { href: '/register', label: '業者登録' },
      ],
    },
    {
      title: '会社情報',
      links: [
        { href: '/about', label: '会社概要' },
        { href: '/privacy', label: 'プライバシーポリシー' },
        { href: '/terms', label: '利用規約' },
        { href: '/law', label: '特定商取引法' },
      ],
    },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  ];

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">とちまち</h3>
            <p className="text-sm text-muted-foreground">
              栃木県のお店・サービスを探せる地域ポータルサイト
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{companyName}</p>
              <p>{companyAddress}</p>
              <p>TEL: {companyPhone}</p>
              <p>
                <a
                  href={`mailto:${companyEmail}`}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  <span>{companyEmail}</span>
                </a>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t pt-8 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
