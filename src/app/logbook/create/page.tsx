"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateLogbookPostMutation,
  useUploadLogbookPhotosMutation,
} from "@/lib/features/logbook/logbookApi";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import {
  LOGBOOK_CATEGORY_LABELS,
  LOGBOOK_CATEGORY_SLUGS,
} from "@/lib/utils/dict-labels";

// В шите показываем русские названия, а в API уходит слаг: бэкенд принимает
// только no_topic/automatics/advice/... и на русское название отвечает 422.
const CATEGORIES = Object.values(LOGBOOK_CATEGORY_LABELS);

function LogbookCreatePageContent() {
  const router = useRouter();
  const [createPost] = useCreateLogbookPostMutation();
  const [uploadPhotos] = useUploadLogbookPhotosMutation();
  const { showAuthModal, requireAuth, closeAuthModal } = useAuth();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Без темы");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const handlePickPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files;
    if (!picked) return;
    const images = Array.from(picked).filter((f) => f.type.startsWith("image/"));
    if (images.length !== picked.length) {
      setSubmitError("Можно прикладывать только изображения");
    }
    const room = 10 - photos.length;
    const toAdd = images.slice(0, room);
    setPhotos((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => {
      const u = prev[i];
      if (u) URL.revokeObjectURL(u);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setSubmitError("Укажите заголовок записи");
      return;
    }
    if (title.trim().length < 5) {
      setSubmitError("Заголовок должен быть не короче 5 символов");
      return;
    }
    if (text.trim().length < 20) {
      setSubmitError("Текст записи должен быть не короче 20 символов");
      return;
    }
    setSubmitError(null);

    requireAuth(async () => {
      setIsSubmitting(true);
      try {
        const created = await createPost({
          title: title.trim(),
          text: text.trim(),
          category: LOGBOOK_CATEGORY_SLUGS[selectedCategory] ?? "no_topic",
        }).unwrap();
        if (photos.length > 0) {
          try {
            await uploadPhotos({ id: created.id, photos }).unwrap();
          } catch (err) {
            // Запись уже создана — не теряем её из-за фотографий.
            setSubmitError(`Запись опубликована, но фото не загрузились: ${getApiErrorMessage(err)}`);
            return;
          }
        }
        router.back();
      } catch (err) {
        setSubmitError(getApiErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={handleClose}>
        <div
          className="w-full max-w-md mx-auto bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 bg-[#E5E5EA] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E5EA]">
            <button onClick={handleClose} className="p-2 -ml-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-semibold font-[family-name:var(--font-manrope)]">
              Новая запись
            </h2>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !text.trim() || isSubmitting}
              className="text-[#111111] font-medium disabled:opacity-50 transition-opacity font-[family-name:var(--font-manrope)]"
            >
              {isSubmitting ? "Публикуем…" : "Опубликовать"}
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {submitError && (
              <p className="text-[13px] text-[#D32F2F] text-center bg-red-50 rounded-xl py-2 font-[family-name:var(--font-manrope)]">
                {submitError}
              </p>
            )}
            <div>
              <label
                className="block text-sm font-medium mb-2 font-[family-name:var(--font-manrope)]"
              >
                Заголовок
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="О чём вы хотите рассказать?"
                className="w-full px-4 py-3 bg-white border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111] text-[15px] font-[family-name:var(--font-manrope)]"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 font-[family-name:var(--font-manrope)]"
              >
                Тема
              </label>
              <button
                onClick={() => setShowCategorySheet(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E5E5EA] rounded-lg hover:bg-[#F9F9F9] transition-colors"
              >
                <span
                  className={`font-[family-name:var(--font-manrope)] ${selectedCategory === "Без темы" ? "text-[#8E8E93]" : "text-[#111111]"}`}
                >
                  {selectedCategory}
                </span>
                <ChevronRight className="w-5 h-5 text-[#8E8E93]" />
              </button>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 font-[family-name:var(--font-manrope)]"
              >
                Текст
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Расскажите подробнее..."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111] resize-none text-[15px] font-[family-name:var(--font-manrope)]"
              />
            </div>

            {/* Фото. Кнопка «Видео» убрана: эндпоинта для видео в бортжурнале нет. */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-[#F2F2F7]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label="Убрать фото"
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60"
                    >
                      <X className="size-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePickPhotos}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={photos.length >= 10}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E5EA] bg-white px-4 py-3 transition-colors hover:bg-[#F9F9F9] disabled:opacity-50"
            >
              <ImageIcon className="size-5 text-[#8E8E93]" />
              <span className="text-sm font-medium font-[family-name:var(--font-manrope)]">Фото</span>
              <span className="text-xs text-[#8E8E93]">{photos.length}/10</span>
            </button>

            <p className="text-xs text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Пожалуйста, соблюдайте правила сообщества и будьте вежливы к другим пользователям.
            </p>
          </div>
        </div>
      </div>

      {/* Category Sheet */}
      {showCategorySheet && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-end"
          onClick={() => setShowCategorySheet(false)}
        >
          <div
            className="w-full max-w-md mx-auto bg-white rounded-t-3xl max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-[#E5E5EA] rounded-full" />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-[#E5E5EA]">
              <h2 className="font-semibold font-[family-name:var(--font-manrope)]">
                Выберите тему
              </h2>
              <button
                onClick={() => setShowCategorySheet(false)}
                className="p-2 -mr-2 hover:bg-[#F2F2F7] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowCategorySheet(false);
                  }}
                  className={`w-full text-left px-4 py-4 border-b border-[#E5E5EA] hover:bg-[#F9F9F9] transition-colors font-[family-name:var(--font-manrope)] ${
                    selectedCategory === category ? "bg-[#111111]/5 text-[#111111] font-medium" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}

export default function LogbookCreatePage() {
  return (
    <RequireAuth description="Записи в бортжурнал публикуются от имени аккаунта">
      <LogbookCreatePageContent />
    </RequireAuth>
  );
}
