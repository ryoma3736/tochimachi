'use client';

/**
 * コンバージョンファネルチャート
 * 問い合わせから成約までの推移を可視化
 */

import React from 'react';

interface FunnelData {
  draft: number;
  submitted: number;
  replied: number;
  closed: number;
}

interface ConversionFunnelChartProps {
  data: FunnelData;
}

export function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const stages = [
    { label: 'カート追加', count: data.draft, color: 'bg-gray-400' },
    { label: '問い合わせ送信', count: data.submitted, color: 'bg-blue-500' },
    { label: '業者返信', count: data.replied, color: 'bg-green-500' },
    { label: '完了', count: data.closed, color: 'bg-purple-500' },
  ];

  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-6">コンバージョンファネル</h3>
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const conversionRate =
            index > 0 && stages[index - 1].count > 0
              ? ((stage.count / stages[index - 1].count) * 100).toFixed(1)
              : '100.0';

          return (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {stage.label}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {stage.count.toLocaleString()}件
                  </span>
                  {index > 0 && (
                    <span className="text-xs text-gray-400">
                      ({conversionRate}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-3`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-white text-xs font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
