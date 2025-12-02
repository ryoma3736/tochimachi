'use client';

import { useState } from 'react';
import { Instagram, ExternalLink, Heart } from 'lucide-react';
import type { InstagramPost } from '@/lib/types/vendor';

interface InstagramGalleryProps {
  username: string;
  posts: InstagramPost[];
}

export function InstagramGallery({ username, posts }: InstagramGalleryProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  const displayPosts = posts.slice(0, 6); // Show max 6 posts
  const instagramUrl = `https://www.instagram.com/${username}`;

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
            <div className="rounded-full bg-white p-2">
              <Instagram className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Instagram</h3>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600"
            >
              @{username}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Instagramで見る
        </a>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {displayPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200"
          >
            <img
              src={post.mediaUrl}
              alt={post.caption || 'Instagram post'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 fill-white" />
                <span className="font-semibold">{formatNumber(post.likeCount)}</span>
              </div>
            </div>

            {/* Video Indicator */}
            {post.mediaType === 'VIDEO' && (
              <div className="absolute right-2 top-2 rounded-full bg-black/70 p-1">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

            {/* Carousel Indicator */}
            {post.mediaType === 'CAROUSEL_ALBUM' && (
              <div className="absolute right-2 top-2 rounded-full bg-black/70 p-1">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* More Posts Link */}
      {posts.length > 6 && (
        <div className="mt-4 text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            他の投稿を見る
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Post Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-900 backdrop-blur-sm transition-colors hover:bg-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="relative bg-black">
              <img
                src={selectedPost.mediaUrl}
                alt={selectedPost.caption || 'Instagram post'}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            {/* Caption */}
            {selectedPost.caption && (
              <div className="p-6">
                <p className="whitespace-pre-line text-gray-900">{selectedPost.caption}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{formatNumber(selectedPost.likeCount)}</span>
                  </div>
                  <a
                    href={selectedPost.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700"
                  >
                    Instagramで見る
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
