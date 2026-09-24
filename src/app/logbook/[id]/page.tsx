"use client";

import { mediaUrl } from "@/lib/utils/mediaUrl";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import {
  useGetLogbookPostByIdQuery,
  useGetLogbookCommentsQuery,
  useLikeLogbookPostMutation,
  useUnlikeLogbookPostMutation,
  useAddLogbookCommentMutation,
  useDeleteLogbookPostMutation,
} from "@/lib/features/logbook/logbookApi";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getCategoryColor, getCategoryColorDesktop } from "@/lib/utils/category-colors";
import { formatDate } from "@/lib/utils/dateFormat";
import { label, LOGBOOK_CATEGORY_LABELS } from "@/lib/utils/dict-labels";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { PostAuthorHeader } from "@/components/logbook/post-author-header";
import { PostActions } from "@/components/logbook/post-actions";
import { CommentSection } from "@/components/logbook/comment-section";

export default function LogbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = use(params);
  const router = useRouter();

  const {
    data: apiPost,
    isLoading: isLoadingPost,
    error: postError,
    refetch: refetchPost,
  } = useGetLogbookPostByIdQuery(postId);
  const { data: apiComments } = useGetLogbookCommentsQuery({ postId });
  const [likePost] = useLikeLogbookPostMutation();
  const [unlikePost] = useUnlikeLogbookPostMutation();
  const [addComment] = useAddLogbookCommentMutation();
  const [deletePost] = useDeleteLogbookPostMutation();
  const { requireAuth, showAuthModal, closeAuthModal, userId } = useAuth();

  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // Оптимистичный лайк поверх серверных данных. Раньше весь пост держался в
  // useState с MOCK_POST в начальном значении, из-за чего при ошибке API
  // пользователю показывалась выдуманная запись как настоящая.
  const [likeOverride, setLikeOverride] = useState<{ is_liked: boolean; likes_count: number } | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeletePost = async () => {
    setConfirmDelete(false);
    setMenuOpen(false);
    try {
      await deletePost(postId).unwrap();
      router.push("/logbook");
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Не удалось удалить запись"));
    }
  };

  const handleLikePost = () => {
    if (!apiPost) return;
    requireAuth(async () => {
      const wasLiked = likeOverride?.is_liked ?? apiPost.is_liked;
      const count = likeOverride?.likes_count ?? apiPost.likes_count;
      setLikeOverride({ is_liked: !wasLiked, likes_count: wasLiked ? count - 1 : count + 1 });
      try {
        if (wasLiked) await unlikePost(postId).unwrap();
        else await likePost(postId).unwrap();
      } catch {
        // Откатываем: иначе счётчик врёт до перезагрузки страницы.
        setLikeOverride(null);
      }
    });
  };

  const handleSendComment = (text: string) => {
    if (!text.trim()) return;
    setCommentError(null);
    requireAuth(async () => {
      try {
        // Список перечитается сам — мутация инвалидирует тег LogbookComments.
        await addComment({ postId, text: text.trim() }).unwrap();
      } catch (err) {
        setCommentError(getApiErrorMessage(err, "Не удалось отправить комментарий"));
      }
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

  if (isLoadingPost) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </div>
    );
  }

  if (postError || !apiPost) {
    const notFound =
      typeof postError === "object" &&
      postError !== null &&
      "status" in postError &&
      (postError as { status?: number }).status === 404;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-[17px] font-semibold font-[family-name:var(--font-manrope)]">
          {notFound ? "Запись не найдена" : "Не удалось загрузить запись"}
        </p>
        <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          {notFound
            ? "Возможно, автор удалил её."
            : getApiErrorMessage(postError)}
        </p>
        <div className="flex gap-3">
          {!notFound && (
            <button
              type="button"
              onClick={() => refetchPost()}
              className="h-11 rounded-xl bg-[#111111] px-5 text-[15px] font-medium text-white"
            >
              Повторить
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/logbook")}
            className="h-11 rounded-xl bg-[#F2F2F7] px-5 text-[15px] font-medium text-[#111111]"
          >
            К бортжурналу
          </button>
        </div>
      </div>
    );
  }

  const post = { ...apiPost, ...(likeOverride ?? {}) };
  // Меню действий показываем только автору записи.
  const isOwnPost = !!userId && post.author?.id === userId;
  const comments = apiComments?.comments ?? [];
  const categoryLabel = label(post.category, LOGBOOK_CATEGORY_LABELS);
  const formattedDate = formatDate(post.created_at);

  return (
    <div className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      {/* ── Mobile + Tablet Version ── */}
      <div className="lg:hidden pb-20 md:pb-12 bg-white min-h-screen md:max-w-3xl md:mx-auto">
        <div className="blur-surface hairline sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold font-[family-name:var(--font-manrope)]">Бортжурнал</h1>
            {isOwnPost ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Действия с записью"
                  aria-expanded={menuOpen}
                  className="p-2 -mr-2 hover:bg-[#F2F2F7] rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[#E5E5EA] bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                      className="w-full px-4 py-3 text-left text-[15px] text-[#D32F2F] hover:bg-[#F9F9F9]"
                    >
                      Удалить запись
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-9" />
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <PostAuthorHeader author={post.author} date={formattedDate} variant="mobile" />
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {categoryLabel}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-3 font-[family-name:var(--font-manrope)]">{post.title}</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">{post.text}</p>

          {post.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.photos.map((photo, idx) => (
                <button key={idx} onClick={() => handleImageClick(idx)} className="aspect-video bg-[#F2F2F7] rounded-lg overflow-hidden hover:scale-105 transition-transform">
                  <img src={mediaUrl(photo)} alt="" className="w-full h-full object-cover" />
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

        {commentError && (
          <p className="px-4 pb-2 text-[13px] text-[#D32F2F] font-[family-name:var(--font-manrope)]">
            {commentError}
          </p>
        )}
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
                    {categoryLabel}
                  </span>
                  {isOwnPost && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Действия с записью"
                        aria-expanded={menuOpen}
                        className="p-2 hover:bg-[#F2F2F7] rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-[#8E8E93]" />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[#E5E5EA] bg-white shadow-lg">
                          <button
                            type="button"
                            onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                            className="w-full px-4 py-3 text-left text-[15px] text-[#D32F2F] hover:bg-[#F9F9F9]"
                          >
                            Удалить запись
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-[28px] font-bold text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">{post.title}</h1>
              <p className="text-[16px] leading-relaxed text-[#111111] whitespace-pre-wrap font-[family-name:var(--font-manrope)]">{post.text}</p>

              {post.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {post.photos.map((photo, idx) => (
                    <button key={idx} onClick={() => handleImageClick(idx)} className="aspect-video bg-[#F5F5F5] rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img src={mediaUrl(photo)} alt="" className="w-full h-full object-cover" />
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
            src={mediaUrl(post.photos[selectedImageIndex])}
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

      {deleteError && (
        <p className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-[420px] rounded-xl bg-[#FFECEC] px-4 py-3 text-center text-[14px] text-[#D32F2F]">
          {deleteError}
        </p>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Удалить запись?"
          description="Запись и комментарии к ней будут удалены безвозвратно."
          confirmLabel="Удалить"
          destructive
          onConfirm={handleDeletePost}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </div>
  );
}
