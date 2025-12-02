import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Instagram, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl: string;
  instagramHandle?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  priceRange?: string;
  tags?: string[];
  featured?: boolean;
}

export default function VendorCard({
  id,
  name,
  category,
  description,
  imageUrl,
  instagramHandle,
  rating = 0,
  reviewCount = 0,
  location,
  priceRange,
  tags = [],
  featured = false,
}: VendorCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg',
        featured && 'ring-2 ring-primary'
      )}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute left-0 top-4 z-10 rounded-r-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          おすすめ
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all hover:bg-white"
        aria-label="お気に入り"
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-colors',
            isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          )}
        />
      </button>

      <Link href={`/vendors/${id}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Category & Instagram */}
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {category}
            </span>
            {instagramHandle && (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          )}

          {/* Rating & Location */}
          <div className="flex items-center justify-between text-sm">
            {rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </div>
            )}
            {location && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Price Range */}
          {priceRange && <div className="text-sm font-medium text-primary">{priceRange}</div>}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
