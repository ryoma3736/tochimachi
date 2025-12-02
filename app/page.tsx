import {
  HeroSection,
  IndustryTabsSection,
  PopularBusinessesSection,
  ServiceFeaturesSection,
  PricingSection,
} from './components/home';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - メインビジュアル・CTA */}
      <HeroSection />

      {/* Industry Tabs Section - 業種タブと検索 */}
      <IndustryTabsSection />

      {/* Popular Businesses Section - 人気業者カード */}
      <PopularBusinessesSection />

      {/* Service Features Section - サービス特徴・3ステップ */}
      <ServiceFeaturesSection />

      {/* Pricing Section - 料金相場 */}
      <PricingSection />
    </main>
  );
}
