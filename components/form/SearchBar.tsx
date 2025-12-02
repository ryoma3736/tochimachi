'use client';

import { Search, MapPin, X } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, location?: string) => void;
  showLocationFilter?: boolean;
  defaultQuery?: string;
  defaultLocation?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = 'サービスや業者を検索...',
  onSearch,
  showLocationFilter = true,
  defaultQuery = '',
  defaultLocation = '',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query, location);
  };

  const handleClear = () => {
    setQuery('');
    setLocation('');
    onSearch?.('', '');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex w-full flex-col gap-2 rounded-lg border bg-white p-2 shadow-lg md:flex-row md:items-center',
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md bg-transparent py-2 pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="クリア"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Location Filter */}
      {showLocationFilter && (
        <>
          <div className="hidden h-8 w-px bg-border md:block" />
          <div className="relative flex items-center md:w-48">
            <MapPin className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="エリア"
              className="w-full rounded-md bg-transparent py-2 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {(query || location) && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            クリア
          </button>
        )}
        <button
          type="submit"
          className="flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Search className="h-4 w-4" />
          <span>検索</span>
        </button>
      </div>
    </form>
  );
}

// Compact variant for in-page search
interface CompactSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export function CompactSearchBar({
  placeholder = '検索...',
  onSearch,
  defaultValue = '',
  className,
}: CompactSearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-center rounded-lg border bg-white', className)}
    >
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-transparent py-2 pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onSearch?.('');
          }}
          className="absolute right-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="クリア"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
