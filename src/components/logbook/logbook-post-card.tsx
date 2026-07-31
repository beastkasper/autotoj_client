"use client";

import React from "react";
import { getCategoryColor, getCategoryColorDesktop } from "@/lib/utils/category-colors";
import { formatDate } from "@/lib/utils/dateFormat";

interface LogbookPostCardProps {
  post: {
    id: string;
    author: { id: string; name: string; avatar: string | null };
    title: string;
    category: string;
    excerpt: string;
    photos: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
  };
  variant: "mobile" | "desktop";
  onClick: (id: string) => void;
}

/** Карточка записи бортжурнала (DESIGN.md §10.17): r12 + border, padding 16. */
function MobileCard({ post, onClick }: Omit<LogbookPostCardProps, "variant">) {
  return (
    <button
      onClick={() => onClick(post.id)}
      className="press-card w-full rounded-xl border border-border bg-card p-4 text-left transition-transform"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground/10">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-[14px] font-semibold text-foreground">
              {post.author.name[0]}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-1 block text-[14px] font-medium text-foreground">
            {post.author.name}
          </span>
          <span className="block text-[12px] text-muted-foreground">
            {formatDate(post.created_at)}
          </span>
        </span>
      </div>
      <h3 className="mb-2 text-[16px] font-semibold text-foreground">{post.title}</h3>
      <div className="mb-3">
        <span
          className={`inline-block rounded-full px-2 py-1 text-[12px] font-medium ${getCategoryColor(post.category)}`}
        >
          {post.category}
        </span>
      </div>
      <p className="line-2 mb-3 text-[14px] text-muted-foreground">{post.excerpt}</p>
      {post.photos.length > 0 && (
        <div className="h-48 w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={post.photos[0]}
            alt={post.title}
            className="size-full object-cover"
          />
        </div>
      )}
    </button>
  );
}

function DesktopCard({ post, onClick }: Omit<LogbookPostCardProps, "variant">) {
  return (
    <button
      onClick={() => onClick(post.id)}
      className="bg-white rounded-2xl p-6 border border-[#E5E5E7] hover:border-[#111111] hover:shadow-lg transition-all text-left group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-[17px] font-semibold text-[#E53935]">
              {post.author.name[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] text-[#111111] font-[family-name:var(--font-manrope)]">{post.author.name}</p>
          <p className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">{formatDate(post.created_at)}</p>
        </div>
      </div>
      <h3 className="font-bold text-[17px] text-[#111111] group-hover:text-[#E53935] transition-colors mb-2 font-[family-name:var(--font-manrope)]">
        {post.title}
      </h3>
      <div className="mb-3">
        <span className={`inline-block px-3 py-1.5 rounded-lg text-[13px] font-medium border ${getCategoryColorDesktop(post.category)}`}>
          {post.category}
        </span>
      </div>
      <p className="text-[15px] text-[#8E8E93] line-clamp-3 font-[family-name:var(--font-manrope)]">{post.excerpt}</p>
    </button>
  );
}

export const LogbookPostCard = React.memo(function LogbookPostCard({ post, variant, onClick }: LogbookPostCardProps) {
  if (variant === "mobile") {
    return <MobileCard post={post} onClick={onClick} />;
  }
  return <DesktopCard post={post} onClick={onClick} />;
});
