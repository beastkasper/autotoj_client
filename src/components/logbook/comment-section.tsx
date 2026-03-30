"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { formatTimestamp } from "@/lib/data/mock-logbook";

interface CommentSectionProps {
  comments: Array<{
    id: string;
    author: { name: string; avatar: string | null };
    text: string;
    created_at: string;
  }>;
  onSendComment: (text: string) => void;
  variant: "mobile" | "desktop";
}

export function CommentSection({ comments, onSendComment, variant }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");

  const handleSend = () => {
    if (!commentText.trim()) return;
    onSendComment(commentText);
    setCommentText("");
  };

  if (variant === "mobile") {
    return (
      <>
        {/* Comments list */}
        <div className="bg-[#F5F5F7]/50 min-h-[200px] p-4">
          <h3 className="font-semibold mb-4 font-[family-name:var(--font-manrope)]">
            Комментарии ({comments.length})
          </h3>
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#111111]/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#111111]">{comment.author.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm font-[family-name:var(--font-manrope)]">{comment.author.name}</span>
                    <span className="text-xs text-[#8E8E93] ml-2">{formatTimestamp(comment.created_at)}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-[family-name:var(--font-manrope)]">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky comment input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E7] p-4 max-w-md mx-auto z-10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Написать комментарий..."
              className="flex-1 px-4 py-2 bg-[#F2F2F7] border border-[#E5E5EA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#111111] text-sm font-[family-name:var(--font-manrope)]"
            />
            <button
              onClick={handleSend}
              disabled={!commentText.trim()}
              className="p-2 bg-[#111111] text-white rounded-full disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="p-8">
      <h3 className="text-[20px] font-bold text-[#111111] mb-6 font-[family-name:var(--font-manrope)]">
        Комментарии ({comments.length})
      </h3>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
              <span className="text-[15px] font-semibold text-[#E53935]">{comment.author.name[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[15px] text-[#111111] font-[family-name:var(--font-manrope)]">{comment.author.name}</span>
                <span className="text-[13px] text-[#8E8E93]">{formatTimestamp(comment.created_at)}</span>
              </div>
              <p className="text-[15px] text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment input */}
      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#E5E5E7]">
        <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
          <span className="text-[15px] font-semibold text-[#E53935]">В</span>
        </div>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Написать комментарий..."
          className="flex-1 px-4 py-3 bg-[#F5F5F5] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#E53935] font-[family-name:var(--font-manrope)]"
        />
        <button
          onClick={handleSend}
          disabled={!commentText.trim()}
          className="px-6 py-3 bg-[#E53935] text-white rounded-xl hover:bg-[#D32F2F] disabled:opacity-50 transition-colors font-medium text-[15px] font-[family-name:var(--font-manrope)]"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
