'use client';

/**
 * 業種別問い合わせ分布グラフ
 * Chart.js を使用した円グラフ
 */

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
}

const COLORS = [
  'rgba(59, 130, 246, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(251, 191, 36, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(168, 85, 247, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(14, 165, 233, 0.8)',
  'rgba(132, 204, 22, 0.8)',
  'rgba(249, 115, 22, 0.8)',
  'rgba(139, 92, 246, 0.8)',
];

export function CategoryDistributionChart({
  data,
}: CategoryDistributionChartProps) {
  const chartData = {
    labels: data.map((d) => `${d.category} (${d.count}件)`),
    datasets: [
      {
        label: '問い合わせ数',
        data: data.map((d) => d.count),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: COLORS.slice(0, data.length).map((color) =>
          color.replace('0.8', '1')
        ),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '業種別問い合わせ分布',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (sum: number, val) => sum + (val as number),
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Pie data={chartData} options={options} />
    </div>
  );
}
