import Image from 'next/image';
import { Heart, MessageCircle, Bookmark, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InstagramPostData {
  id: string;
  imageUrl: string;
  caption?: string;
  likes?: number;
  comments?: number;
  postUrl?: string;
  timestamp?: string;
}

interface InstagramPostProps extends InstagramPostData {
  showActions?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export default function InstagramPost({
  id,
  imageUrl,
  caption,
  likes,
  comments,
  postUrl,
  timestamp,
  showActions = true,
  aspectRatio = 'square',
}: InstagramPostProps) {
  const aspectRatioClass = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[16/9]',
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}秒前`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}日前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}週間前`;
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      {/* Image */}
      <div className={cn('relative overflow-hidden bg-muted', aspectRatioClass[aspectRatio])}>
        <Image
          src={imageUrl}
          alt={caption || 'Instagram post'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay on hover */}
        {showActions && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex space-x-6 text-white">
              {likes !== undefined && (
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 fill-white" />
                  <span className="font-semibold">{formatNumber(likes)}</span>
                </div>
              )}
              {comments !== undefined && (
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 fill-white" />
                  <span className="font-semibold">{formatNumber(comments)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* External link button */}
        {postUrl && (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2 top-2 rounded-full bg-white/80 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            aria-label="Instagramで開く"
          >
            <ExternalLink className="h-4 w-4 text-foreground" />
          </a>
        )}
      </div>

      {/* Content */}
      {(caption || timestamp) && (
        <div className="space-y-2 p-3">
          {caption && <p className="line-clamp-2 text-sm text-foreground">{caption}</p>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {timestamp && <span>{formatDate(timestamp)}</span>}
            {showActions && (
              <div className="flex items-center space-x-3">
                {likes !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{formatNumber(likes)}</span>
                  </div>
                )}
                {comments !== undefined && (
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{formatNumber(comments)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
