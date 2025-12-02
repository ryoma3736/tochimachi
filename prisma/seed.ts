/**
 * Prisma Database Seed Script
 * とちまち初期データ投入
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ========================================
  // 1. Categories（業種カテゴリ）
  // ========================================
  console.log('📂 Creating categories...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'construction' },
      update: {},
      create: {
        name: '建設業',
        slug: 'construction',
        description: '住宅建築、リフォーム、土木工事など建設関連サービス',
        displayOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'restaurant' },
      update: {},
      create: {
        name: '飲食業',
        slug: 'restaurant',
        description: 'レストラン、カフェ、居酒屋、ケータリングサービス',
        displayOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'retail' },
      update: {},
      create: {
        name: '小売業',
        slug: 'retail',
        description: '商店、専門店、ECショップなど物販関連',
        displayOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'professional' },
      update: {},
      create: {
        name: '専門サービス',
        slug: 'professional',
        description: '士業、コンサルティング、IT支援など専門サービス',
        displayOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: {
        name: '美容・健康',
        slug: 'beauty',
        description: '美容院、エステ、整体、フィットネスなど',
        displayOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'education' },
      update: {},
      create: {
        name: '教育・習い事',
        slug: 'education',
        description: '学習塾、音楽教室、スポーツ教室など',
        displayOrder: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ========================================
  // 2. Admin（管理者）
  // ========================================
  console.log('👤 Creating admin users...');

  // Note: パスワードハッシュ化は実際にはbcryptなどを使用
  // ここではデモ用の仮ハッシュ
  const adminUser = await prisma.admin.upsert({
    where: { email: 'admin@tochimachi.jp' },
    update: {},
    create: {
      email: 'admin@tochimachi.jp',
      passwordHash: '$2a$12$demoHashForSeedData', // 本番ではbcrypt使用
      name: '管理者',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log(`✅ Created admin: ${adminUser.email}`);

  // ========================================
  // 3. Sample Vendors（サンプル業者）
  // ========================================
  console.log('🏢 Creating sample vendors...');

  const constructionCategory = categories.find((c) => c.slug === 'construction')!;
  const restaurantCategory = categories.find((c) => c.slug === 'restaurant')!;
  const retailCategory = categories.find((c) => c.slug === 'retail')!;

  const vendor1 = await prisma.vendor.upsert({
    where: { email: 'contact@tochigi-construction.jp' },
    update: {},
    create: {
      email: 'contact@tochigi-construction.jp',
      passwordHash: '$2a$12$demoHashForSeedData',
      companyName: '栃木建設株式会社',
      categoryId: constructionCategory.id,
      isActive: true,
      approvedAt: new Date(),
      displayOrder: 1,
    },
  });

  await prisma.vendorProfile.upsert({
    where: { vendorId: vendor1.id },
    update: {},
    create: {
      vendorId: vendor1.id,
      description:
        '栃木県で50年の実績を持つ総合建設会社です。住宅建築からリフォームまで幅広く対応いたします。',
      address: '栃木県宇都宮市桜通り1-2-3',
      contactPhone: '028-123-4567',
      businessHours: {
        mon: '9:00-18:00',
        tue: '9:00-18:00',
        wed: '9:00-18:00',
        thu: '9:00-18:00',
        fri: '9:00-18:00',
        sat: '9:00-17:00',
        sun: '休業',
      },
      websiteUrl: 'https://example.com/tochigi-construction',
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { email: 'info@gyoza-ya.jp' },
    update: {},
    create: {
      email: 'info@gyoza-ya.jp',
      passwordHash: '$2a$12$demoHashForSeedData',
      companyName: '餃子屋まんぷく',
      categoryId: restaurantCategory.id,
      isActive: true,
      approvedAt: new Date(),
      displayOrder: 2,
    },
  });

  await prisma.vendorProfile.upsert({
    where: { vendorId: vendor2.id },
    update: {},
    create: {
      vendorId: vendor2.id,
      description:
        '宇都宮名物の焼き餃子専門店。自家製皮と地元野菜にこだわった絶品餃子をご提供します。',
      address: '栃木県宇都宮市餃子通り5-6-7',
      contactPhone: '028-234-5678',
      businessHours: {
        mon: '休業',
        tue: '11:00-14:00, 17:00-22:00',
        wed: '11:00-14:00, 17:00-22:00',
        thu: '11:00-14:00, 17:00-22:00',
        fri: '11:00-14:00, 17:00-22:00',
        sat: '11:00-22:00',
        sun: '11:00-21:00',
      },
      websiteUrl: 'https://example.com/gyoza-ya',
    },
  });

  const vendor3 = await prisma.vendor.upsert({
    where: { email: 'shop@ichigo-farm.jp' },
    update: {},
    create: {
      email: 'shop@ichigo-farm.jp',
      passwordHash: '$2a$12$demoHashForSeedData',
      companyName: '栃木いちご農園',
      categoryId: retailCategory.id,
      isActive: true,
      approvedAt: new Date(),
      displayOrder: 3,
    },
  });

  await prisma.vendorProfile.upsert({
    where: { vendorId: vendor3.id },
    update: {},
    create: {
      vendorId: vendor3.id,
      description: 'とちおとめを中心とした高品質いちごの生産・販売。いちご狩り体験も実施中です。',
      address: '栃木県真岡市いちご街道1-1-1',
      contactPhone: '0285-345-6789',
      businessHours: {
        mon: '9:00-17:00',
        tue: '9:00-17:00',
        wed: '9:00-17:00',
        thu: '9:00-17:00',
        fri: '9:00-17:00',
        sat: '9:00-18:00',
        sun: '9:00-18:00',
      },
      websiteUrl: 'https://example.com/ichigo-farm',
    },
  });

  console.log('✅ Created 3 sample vendors with profiles');

  // ========================================
  // 4. Services（サンプルサービス）
  // ========================================
  console.log('💼 Creating sample services...');

  await prisma.service.createMany({
    data: [
      // 建設業者のサービス
      {
        vendorId: vendor1.id,
        name: '新築住宅設計・施工',
        description: 'お客様の理想の住まいを設計から施工まで一貫対応',
        price: 25000000,
        unit: '一式',
        isActive: true,
      },
      {
        vendorId: vendor1.id,
        name: 'リフォーム工事',
        description: 'キッチン、バス、トイレなど水回りリフォーム',
        price: 800000,
        unit: '一式',
        duration: 10080, // 7日間（分単位）
        isActive: true,
      },
      // 飲食店のサービス
      {
        vendorId: vendor2.id,
        name: '焼き餃子（6個）',
        description: '自家製皮のジューシー焼き餃子',
        price: 450,
        unit: '1皿',
        isActive: true,
      },
      {
        vendorId: vendor2.id,
        name: 'ケータリングセット',
        description: '餃子100個+サイドメニュー（パーティー向け）',
        price: 15000,
        unit: 'セット',
        isActive: true,
      },
      // 農園のサービス
      {
        vendorId: vendor3.id,
        name: 'いちご狩り体験（30分食べ放題）',
        description: 'とちおとめ食べ放題+パック1個お土産付き',
        price: 2000,
        unit: '1名',
        duration: 30,
        isActive: true,
      },
      {
        vendorId: vendor3.id,
        name: 'いちごギフトボックス',
        description: '高級とちおとめ20粒入り化粧箱',
        price: 3500,
        unit: '1箱',
        isActive: true,
      },
    ],
  });

  console.log('✅ Created sample services');

  // ========================================
  // 5. Subscriptions（課金情報）
  // ========================================
  console.log('💳 Creating sample subscriptions...');

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  await Promise.all([
    prisma.subscription.upsert({
      where: { vendorId: vendor1.id },
      update: {},
      create: {
        vendorId: vendor1.id,
        plan: 'STANDARD',
        monthlyFee: 120000,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        nextBillingDate: nextMonth,
      },
    }),
    prisma.subscription.upsert({
      where: { vendorId: vendor2.id },
      update: {},
      create: {
        vendorId: vendor2.id,
        plan: 'STANDARD',
        monthlyFee: 120000,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        nextBillingDate: nextMonth,
      },
    }),
    prisma.subscription.upsert({
      where: { vendorId: vendor3.id },
      update: {},
      create: {
        vendorId: vendor3.id,
        plan: 'STANDARD',
        monthlyFee: 120000,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        nextBillingDate: nextMonth,
      },
    }),
  ]);

  console.log('✅ Created subscriptions for all vendors');

  // ========================================
  // 6. Sample User（テストユーザー）
  // ========================================
  console.log('👥 Creating sample users...');

  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: '$2a$12$demoHashForSeedData',
      name: 'テストユーザー',
      phone: '090-1234-5678',
      prefecture: '宇都宮市',
      isActive: true,
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);

  console.log('');
  console.log('✨ Seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${categories.length}`);
  console.log('   - Vendors: 3');
  console.log('   - Services: 6');
  console.log('   - Subscriptions: 3');
  console.log('   - Admin users: 1');
  console.log('   - Test users: 1');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
