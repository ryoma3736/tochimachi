'use client';

import Link from 'next/link';
import { Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import CartDrawer, { CartButton } from '@/components/cart/CartDrawer';

interface HeaderProps {
  phoneNumber?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Header({
  phoneNumber = '028-XXX-XXXX',
  ctaText = '無料相談',
  ctaLink = '/contact',
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCartStore();

  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/vendors', label: '業者一覧' },
    { href: '/categories', label: 'カテゴリ' },
    { href: '/about', label: 'とちまちについて' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary md:text-3xl">とちまち</span>
              <span className="ml-2 hidden text-sm text-muted-foreground md:block">
                栃木のお店・サービスポータル
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Phone & CTA & Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <CartButton itemCount={getItemCount()} onClick={() => setIsCartOpen(true)} />

            {/* Phone Number */}
            <a
              href={`tel:${phoneNumber.replace(/-/g, '')}`}
              className="hidden items-center space-x-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:flex"
            >
              <Phone className="h-4 w-4" />
              <span>{phoneNumber}</span>
            </a>

            {/* CTA Button */}
            <Link
              href={ctaLink}
              className="hidden rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:block"
            >
              {ctaText}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
              aria-label="メニュー"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t py-4 lg:hidden">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${phoneNumber.replace(/-/g, '')}`}
                className="flex items-center space-x-2 text-sm font-medium text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <Link
                href={ctaLink}
                className="rounded-lg bg-primary px-6 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaText}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
