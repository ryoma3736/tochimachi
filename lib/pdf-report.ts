/**
 * PDF Report Generation
 * jsPDFを使用したレポート生成ユーティリティ
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MonthlyReport } from './analytics';

/**
 * 月次レポートPDF生成
 */
export function generateMonthlyReportPDF(report: MonthlyReport): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // タイトル
  doc.setFontSize(20);
  doc.text('月次分析レポート', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`期間: ${report.period}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // 概要セクション
  doc.setFontSize(14);
  doc.text('概要', 20, yPosition);
  yPosition += 10;

  const overviewData = [
    ['登録業者数', `${report.overview.totalVendors}社`],
    ['アクティブ業者数', `${report.overview.activeVendors}社`],
    ['総問い合わせ数', `${report.overview.totalInquiries}件`],
    ['総ユーザー数', `${report.overview.totalUsers}人`],
    ['月次売上', `¥${report.overview.monthlyRevenue.toLocaleString()}`],
    ['コンバージョン率', `${report.overview.conversionRate}%`],
    [
      '平均返信時間',
      `${report.overview.averageResponseTime.toFixed(1)}時間`,
    ],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['項目', '値']],
    body: overviewData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 売上分析セクション
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text('売上分析', 20, yPosition);
  yPosition += 10;

  const revenueOverview = [
    ['当月売上', `¥${report.revenueAnalytics.currentMonthRevenue.toLocaleString()}`],
    [
      '前月売上',
      `¥${report.revenueAnalytics.previousMonthRevenue.toLocaleString()}`,
    ],
    ['成長率', `${report.revenueAnalytics.growthRate}%`],
    [
      '業者あたり平均売上',
      `¥${report.revenueAnalytics.averageRevenuePerVendor.toLocaleString()}`,
    ],
    [
      '年間予測売上',
      `¥${report.revenueAnalytics.projectedAnnualRevenue.toLocaleString()}`,
    ],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['項目', '金額']],
    body: revenueOverview,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 業者ランキングセクション
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text('業者ランキング（Top 10）', 20, yPosition);
  yPosition += 10;

  const vendorTableData = report.topVendors.map((vendor, index) => [
    `#${index + 1}`,
    vendor.companyName,
    vendor.category,
    `${vendor.inquiryCount}件`,
    `${vendor.responseRate}%`,
    `${vendor.averageResponseTime.toFixed(1)}h`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['順位', '会社名', 'カテゴリ', '問い合わせ', '返信率', '返信時間']],
    body: vendorTableData,
    theme: 'striped',
    headStyles: { fillColor: [168, 85, 247] },
    styles: { fontSize: 8 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 問い合わせ分析セクション
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text('問い合わせ分析', 20, yPosition);
  yPosition += 10;

  const inquiryStatusData = [
    ['カート追加', `${report.inquiryAnalytics.byStatus.draft}件`],
    ['送信済み', `${report.inquiryAnalytics.byStatus.submitted}件`],
    ['返信済み', `${report.inquiryAnalytics.byStatus.replied}件`],
    ['完了', `${report.inquiryAnalytics.byStatus.closed}件`],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['ステータス', '件数']],
    body: inquiryStatusData,
    theme: 'grid',
    headStyles: { fillColor: [251, 191, 36] },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // カテゴリ別問い合わせ
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(12);
  doc.text('業種別問い合わせ分布', 20, yPosition);
  yPosition += 10;

  const categoryData = report.inquiryAnalytics.byCategory
    .slice(0, 10)
    .map((cat) => [
      cat.category,
      `${cat.count}件`,
      `${cat.percentage.toFixed(1)}%`,
    ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['業種', '件数', '割合']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [239, 68, 68] },
  });

  // フッター
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `生成日時: ${new Date(report.generatedAt).toLocaleString('ja-JP')}`,
      20,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc.output('blob');
}

/**
 * 業者パフォーマンスレポートPDF生成
 */
export function generateVendorPerformancePDF(
  vendors: Array<{
    vendorId: string;
    companyName: string;
    category: string;
    inquiryCount: number;
    responseRate: number;
    averageResponseTime: number;
    revenue: number;
    isActive: boolean;
  }>,
  title = '業者パフォーマンスレポート'
): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // タイトル
  doc.setFontSize(18);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });

  // データテーブル
  const tableData = vendors.map((vendor, index) => [
    `#${index + 1}`,
    vendor.companyName,
    vendor.category,
    `${vendor.inquiryCount}件`,
    `${vendor.responseRate}%`,
    `${vendor.averageResponseTime.toFixed(1)}時間`,
    `¥${vendor.revenue.toLocaleString()}`,
    vendor.isActive ? 'アクティブ' : '非アクティブ',
  ]);

  autoTable(doc, {
    startY: 30,
    head: [
      [
        '順位',
        '会社名',
        'カテゴリ',
        '問い合わせ',
        '返信率',
        '平均返信時間',
        '月額収益',
        'ステータス',
      ],
    ],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 18 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
      7: { cellWidth: 22 },
    },
  });

  // フッター
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `生成日時: ${new Date().toLocaleString('ja-JP')}`,
      20,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc.output('blob');
}
