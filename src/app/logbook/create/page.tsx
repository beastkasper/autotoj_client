"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Image as ImageIcon, Video, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLogbookPostMutation } from "@/lib/features/logbook/logbookApi";

const CATEGORIES = [
  "Без темы", "Автоматика", "Прошу совета", "Автопутешествия", "Поломка",
  "ТО", "Ремонт", "Тюнинг", "Покупка", "Гаджеты",
];

export default function LogbookCreatePage() {
  const router = useRouter();
  const [createPost] = useCreateLogbookPostMutation();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Без темы");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      alert("Заполните заголовок и текст");
      return;
    }
    setSubmitError(null);
    try {
      await createPost({ title: title.trim(), text: text.trim(), category: selectedCategory }).unwrap();
      router.back();
    } catch {
      setSubmitError("Не удалось опубликовать запись. Попробуйте ещё раз.");
    }
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
              disabled={!title.trim() || !text.trim()}
              className="text-[#111111] font-medium disabled:opacity-50 transition-opacity font-[family-name:var(--font-manrope)]"
            >
              Опубликовать
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

            {/* Media buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E5E5EA] rounded-lg hover:bg-[#F9F9F9] transition-colors">
                <ImageIcon className="w-5 h-5 text-[#8E8E93]" />
                <span className="text-sm font-medium font-[family-name:var(--font-manrope)]">Фото</span>
                <span className="text-xs text-[#8E8E93]">(до 10)</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E5E5EA] rounded-lg hover:bg-[#F9F9F9] transition-colors">
                <Video className="w-5 h-5 text-[#8E8E93]" />
                <span className="text-sm font-medium font-[family-name:var(--font-manrope)]">Видео</span>
              </button>
            </div>

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
    </>
  );
}
