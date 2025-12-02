'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: LucideIcon;
  count?: number;
}

interface CategoryTabProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  variant?: 'tabs' | 'pills' | 'cards';
}

export default function CategoryTab({
  categories,
  activeCategory,
  onCategoryChange,
  variant = 'tabs',
}: CategoryTabProps) {
  if (variant === 'tabs') {
    return (
      <div className="border-b">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" role="tablist">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.id)}
                className={cn(
                  'flex items-center space-x-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
                role="tab"
                aria-selected={isActive}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{category.name}</span>
                {category.count !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {category.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.id)}
              className={cn(
                'flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{category.name}</span>
              {category.count !== undefined && (
                <span className="ml-1 text-xs">({category.count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Cards variant
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            className={cn(
              'group flex flex-col items-center space-y-2 rounded-lg border p-4 transition-all hover:shadow-md',
              isActive
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            {Icon && (
              <div
                className={cn(
                  'rounded-full p-3 transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div className="text-center">
              <p
                className={cn('text-sm font-medium', isActive ? 'text-primary' : 'text-foreground')}
              >
                {category.name}
              </p>
              {category.count !== undefined && (
                <p className="text-xs text-muted-foreground">{category.count}件</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
