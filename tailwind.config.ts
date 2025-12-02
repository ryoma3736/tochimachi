import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      // とちまちカスタムカラーパレット（オレンジ系・温かみ）
      colors: {
        // カスタムブランドカラー
        tochimachi: {
          orange: {
            50: 'hsl(var(--tochimachi-orange-50))',
            100: 'hsl(var(--tochimachi-orange-100))',
            200: 'hsl(var(--tochimachi-orange-200))',
            300: 'hsl(var(--tochimachi-orange-300))',
            400: 'hsl(var(--tochimachi-orange-400))',
            500: 'hsl(var(--tochimachi-orange-500))',
            600: 'hsl(var(--tochimachi-orange-600))',
            700: 'hsl(var(--tochimachi-orange-700))',
            800: 'hsl(var(--tochimachi-orange-800))',
            900: 'hsl(var(--tochimachi-orange-900))',
          },
          brown: {
            50: 'hsl(var(--tochimachi-brown-50))',
            100: 'hsl(var(--tochimachi-brown-100))',
            200: 'hsl(var(--tochimachi-brown-200))',
            300: 'hsl(var(--tochimachi-brown-300))',
            400: 'hsl(var(--tochimachi-brown-400))',
            500: 'hsl(var(--tochimachi-brown-500))',
            600: 'hsl(var(--tochimachi-brown-600))',
            700: 'hsl(var(--tochimachi-brown-700))',
            800: 'hsl(var(--tochimachi-brown-800))',
            900: 'hsl(var(--tochimachi-brown-900))',
          },
        },
        // shadcn/ui デフォルトカラー
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      // レスポンシブブレークポイント拡張
      screens: {
        xs: '360px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      // タイポグラフィ
      fontFamily: {
        sans: [
          'var(--font-noto-sans-jp)',
          'Noto Sans JP',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        // 見出しサイズ
        'display-lg': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-xl': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        // 本文サイズ
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        // ラベルサイズ
        'label-lg': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      // ボーダー半径（温かみのある角丸）
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // 影（柔らかい影）
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
        warm: '0 4px 12px rgba(249, 115, 22, 0.15)',
      },
      // スペーシング拡張
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
      // アニメーション
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      // 最大幅設定
      maxWidth: {
        360: '360px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
