"use client";

import { ThumbsUp, MessageCircle, Upload, Share2 } from "lucide-react";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  variant: "mobile" | "desktop";
}

export function PostActions({ likesCount, commentsCount, isLiked, onLike, onShare, variant }: PostActionsProps) {
  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-4 pt-2 border-t border-[#E5E5E7]">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#F2F2F7] transition-colors ${
            isLiked ? "text-[#111111]" : "text-[#8E8E93]"
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium font-[family-name:var(--font-manrope)]">{likesCount}</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-2 text-[#8E8E93]">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium font-[family-name:var(--font-manrope)]">{commentsCount}</span>
        </div>
        <button onClick={onShare} className="ml-auto p-2 text-[#8E8E93] hover:bg-[#F2F2F7] rounded-lg transition-colors">
          <Upload className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#E5E5E7]">
      <button
        onClick={onLike}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
          isLiked
            ? "bg-[#E53935] text-white"
            : "bg-[#F5F5F5] text-[#111111] hover:bg-[#E5E5E7]"
        }`}
      >
        <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">{likesCount}</span>
      </button>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F5] text-[#111111]">
        <MessageCircle className="w-5 h-5" />
        <span className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">{commentsCount}</span>
      </div>
      <button onClick={onShare} className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F5] text-[#111111] hover:bg-[#E5E5E7] transition-colors">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}
