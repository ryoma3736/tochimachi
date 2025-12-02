'use client';

import { useState } from 'react';
import InstagramPost, { InstagramPostData } from './InstagramPost';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstagramGalleryProps {
  posts: InstagramPostData[];
  vendorName?: string;
  instagramHandle?: string;
  layout?: 'grid' | 'carousel';
  columns?: 2 | 3 | 4;
}

export default function InstagramGallery({
  posts,
  vendorName,
  instagramHandle,
  layout = 'grid',
  columns = 3,
}: InstagramGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <Instagram className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Instagram投稿はまだありません</p>
      </div>
    );
  }

  if (layout === 'carousel') {
    return (
      <div className="space-y-4">
        {/* Header */}
        {instagramHandle && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-pink-600" />
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary"
              >
                @{instagramHandle}
              </a>
            </div>
            {vendorName && (
              <span className="text-sm text-muted-foreground">{vendorName}の投稿</span>
            )}
          </div>
        )}

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {posts.map((post, index) => (
                <div key={post.id} className="w-full flex-shrink-0">
                  <InstagramPost {...post} showActions={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {posts.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                aria-label="前へ"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                aria-label="次へ"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Indicators */}
          <div className="mt-4 flex justify-center space-x-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                )}
                aria-label={`スライド ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {instagramHandle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-pink-600" />
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary"
            >
              @{instagramHandle}
            </a>
          </div>
          {vendorName && <span className="text-sm text-muted-foreground">{vendorName}の投稿</span>}
        </div>
      )}

      {/* Grid */}
      <div className={cn('grid gap-4', gridColsClass[columns])}>
        {posts.map((post) => (
          <InstagramPost key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
