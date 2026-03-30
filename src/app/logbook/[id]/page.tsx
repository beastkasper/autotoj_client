"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import {
  useGetLogbookPostByIdQuery,
  useGetLogbookCommentsQuery,
  useLikeLogbookPostMutation,
  useUnlikeLogbookPostMutation,
  useAddLogbookCommentMutation,
} from "@/lib/features/logbook/logbookApi";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getCategoryColor, getCategoryColorDesktop } from "@/lib/utils/category-colors";
import { formatDate } from "@/lib/utils/dateFormat";
import { MOCK_POST, MOCK_COMMENTS } from "@/lib/data/mock-logbook";
import { PostAuthorHeader } from "@/components/logbook/post-author-header";
import { PostActions } from "@/components/logbook/post-actions";
import { CommentSection } from "@/components/logbook/comment-section";

export default function LogbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = use(params);
  const router = useRouter();

  const { data: apiPost } = useGetLogbookPostByIdQuery(postId);
  const { data: apiComments } = useGetLogbookCommentsQuery({ postId });
  const [likePost] = useLikeLogbookPostMutation();
  const [unlikePost] = useUnlikeLogbookPostMutation();
  const [addComment] = useAddLogbookCommentMutation();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();

  const [post, setPost] = useState(apiPost ?? MOCK_POST);
  const [comments, setComments] = useState(apiComments?.comments ?? MOCK_COMMENTS);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (apiPost && apiPost.id !== post.id) setPost(apiPost);
  if (apiComments && apiComments.comments.length !== comments.length) setComments(apiComments.comments);

  const handleLikePost = () => {
    requireAuth(async () => {
      const wasLiked = post.is_liked;
      setPost({
        ...post,
        is_liked: !wasLiked,
        likes_count: wasLiked ? post.likes_count - 1 : post.likes_count + 1,
      });
      try {
        if (wasLiked) await unlikePost(postId).unwrap();
        else await likePost(postId).unwrap();
      } catch { /* optimistic update already applied */ }
    });
  };

  const handleSendComment = (text: string) => {
    if (!text.trim()) return;
    requireAuth(async () => {
      const newComment = {
        id: Date.now().toString(),
        author: { id: "current-user", name: "Вы", avatar: null },
        text,
        created_at: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setPost({ ...post, comments_count: post.comments_count + 1 });
      try {
        await addComment({ postId, text: text.trim() }).unwrap();
      } catch { /* optimistic update already applied */ }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.text.substring(0, 100) + "...",
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch { /* ignore */ }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageGallery(true);
  };

  const formattedDate = formatDate(post.created_at);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ── Mobile Version ── */}
      <div className="lg:hidden pb-20 bg-white min-h-screen">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold font-[family-name:var(--font-manrope)]">Бортжурнал</h1>
            <button className="p-2 -mr-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <PostAuthorHeader author={post.author} date={formattedDate} variant="mobile" />
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-3 font-[family-name:var(--font-manrope)]">{post.title}</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">{post.text}</p>

          {post.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.photos.map((photo, idx) => (
                <button key={idx} onClick={() => handleImageClick(idx)} className="aspect-video bg-[#F2F2F7] rounded-lg overflow-hidden hover:scale-105 transition-transform">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <PostActions
            likesCount={post.likes_count}
            commentsCount={post.comments_count}
            isLiked={post.is_liked}
            onLike={handleLikePost}
            onShare={handleShare}
            variant="mobile"
          />
        </div>

        <CommentSection comments={comments} onSendComment={handleSendComment} variant="mobile" />
      </div>

      {/* ── Desktop Version ── */}
      <div className="hidden lg:block min-h-screen bg-[#F5F5F5]">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#8E8E93] hover:text-[#111111] mb-6 transition-colors font-[family-name:var(--font-manrope)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[15px]">Назад к бортжурналу</span>
          </button>

          <div className="bg-white rounded-2xl border border-[#E5E5E7] overflow-hidden">
            <div className="p-8 border-b border-[#E5E5E7]">
              <div className="flex items-center justify-between mb-6">
                <PostAuthorHeader author={post.author} date={formattedDate} variant="desktop" />
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-lg text-[14px] font-medium border ${getCategoryColorDesktop(post.category)}`}>
                    {post.category}
                  </span>
                  <button className="p-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#8E8E93]" />
                  </button>
                </div>
              </div>

              <h1 className="text-[28px] font-bold text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">{post.title}</h1>
              <p className="text-[16px] leading-relaxed text-[#111111] whitespace-pre-wrap font-[family-name:var(--font-manrope)]">{post.text}</p>

              {post.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {post.photos.map((photo, idx) => (
                    <button key={idx} onClick={() => handleImageClick(idx)} className="aspect-video bg-[#F5F5F5] rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <PostActions
                likesCount={post.likes_count}
                commentsCount={post.comments_count}
                isLiked={post.is_liked}
                onLike={handleLikePost}
                onShare={handleShare}
                variant="desktop"
              />
            </div>

            <CommentSection comments={comments} onSendComment={handleSendComment} variant="desktop" />
          </div>
        </div>
      </div>

      {/* ── Image Gallery Modal ── */}
      <Dialog open={showImageGallery} onOpenChange={(v) => { if (!v) setShowImageGallery(false); }}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black [&>button]:hidden">
          <button
            onClick={() => setShowImageGallery(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={post.photos[selectedImageIndex]}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
          {post.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {post.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === selectedImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </div>
  );
}
