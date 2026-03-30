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

function MobileCard({ post, onClick }: Omit<LogbookPostCardProps, "variant">) {
  return (
    <button
      onClick={() => onClick(post.id)}
      className="w-full bg-white border border-[#E5E5E7] rounded-xl p-4 hover:bg-[#F9F9F9] transition-colors text-left"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#111111]/10 flex items-center justify-center flex-shrink-0">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-[#111111]">
              {post.author.name[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#111111] font-[family-name:var(--font-manrope)]">{post.author.name}</p>
          <p className="text-xs text-[#8E8E93] font-[family-name:var(--font-manrope)]">{formatDate(post.created_at)}</p>
        </div>
      </div>
      <h3 className="font-semibold mb-2 text-[#111111] font-[family-name:var(--font-manrope)]">{post.title}</h3>
      <div className="mb-3">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
          {post.category}
        </span>
      </div>
      <p className="text-sm text-[#8E8E93] line-clamp-2 mb-3 font-[family-name:var(--font-manrope)]">{post.excerpt}</p>
      {post.photos.length > 0 && (
        <div className="w-full h-48 bg-[#F2F2F7] rounded-lg overflow-hidden">
          <img src={post.photos[0]} alt={post.title} className="w-full h-full object-cover" />
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
