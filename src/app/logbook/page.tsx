"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, BookOpen } from "lucide-react";
import { useGetLogbookPostsQuery } from "@/lib/features/logbook/logbookApi";
import { EmptyState } from "@/components/states/EmptyState";
import { LogbookPostCard } from "@/components/logbook/logbook-post-card";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";

// Mock data for development
const MOCK_POSTS = [
  {
    id: "1",
    author: { id: "user1", name: "Алишер", avatar: null },
    title: "Первое ТО на новой Камри",
    category: "ТО",
    excerpt: "Сегодня сделал первое техническое обслуживание. Всё прошло отлично, никаких проблем не выявлено...",
    photos: ["https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=300&fit=crop"],
    likes_count: 12,
    comments_count: 5,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "2",
    author: { id: "user2", name: "Farrukh", avatar: null },
    title: "Посоветуйте хорошую автомойку в Душанбе",
    category: "Прошу совета",
    excerpt: "Ищу качественную автомойку с детейлингом. Кто может посоветовать проверенное место?",
    photos: [],
    likes_count: 3,
    comments_count: 8,
    created_at: "2026-01-09T10:00:00Z",
  },
  {
    id: "3",
    author: { id: "user3", name: "Davron", avatar: null },
    title: "Установил новую магнитолу",
    category: "Тюнинг",
    excerpt: "Решил обновить мультимедийную систему. Выбрал модель с Android Auto и Apple CarPlay...",
    photos: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop"],
    likes_count: 20,
    comments_count: 4,
    created_at: "2026-01-08T10:00:00Z",
  },
  {
    id: "4",
    author: { id: "user4", name: "Шохруз", avatar: null },
    title: "Замена тормозных колодок",
    category: "Ремонт",
    excerpt: "Появился скрип при торможении, решил заменить колодки. Выбрал оригинальные запчасти, хоть и дороже, но качество того стоит...",
    photos: [],
    likes_count: 7,
    comments_count: 2,
    created_at: "2026-01-07T10:00:00Z",
  },
  {
    id: "5",
    author: { id: "user5", name: "Рустам", avatar: null },
    title: "Поездка в горы - впечатления",
    category: "Автопутешествия",
    excerpt: "Решили на выходных съездить в горы. Дорога была непростой, но машина справилась отлично. Полный привод показал себя на все 100%...",
    photos: [],
    likes_count: 15,
    comments_count: 6,
    created_at: "2026-01-06T10:00:00Z",
  },
];

export default function LogbookPage() {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const { data, isLoading } = useGetLogbookPostsQuery();

  const posts = data?.posts ?? MOCK_POSTS;

  const handlePostClick = (id: string) => router.push(`/logbook/${id}`);

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#111111]" />
            </button>
            <h1 className="text-xl font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Бортжурнал
            </h1>
          </div>
          <button
            onClick={() => requireAuth(() => router.push("/logbook/create"))}
            className="flex items-center gap-1 px-3 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#111111]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium font-[family-name:var(--font-manrope)]">Создать</span>
          </button>
        </div>
      </div>

      {/* Desktop Title */}
      <div className="hidden lg:block max-w-[1200px] mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
              Бортжурнал
            </h1>
            <p className="text-[15px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
              Записи автовладельцев о ремонте, тюнинге и путешествиях
            </p>
          </div>
          <button
            onClick={() => requireAuth(() => router.push("/logbook/create"))}
            className="flex items-center gap-2 px-6 py-3 bg-[#E53935] text-white rounded-xl hover:bg-[#D32F2F] transition-colors font-medium text-[15px] font-[family-name:var(--font-manrope)]"
          >
            <Plus className="w-5 h-5" />
            Создать запись
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <>
          <div className="lg:hidden p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#E5E5E7] rounded-xl p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F2F2F7]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#F2F2F7] rounded w-1/3" />
                    <div className="h-3 bg-[#F2F2F7] rounded w-1/4" />
                    <div className="h-5 bg-[#F2F2F7] rounded w-2/3 mt-3" />
                    <div className="h-3 bg-[#F2F2F7] rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:block max-w-[1200px] mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5E5E7] animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F2F2F7]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#F2F2F7] rounded w-1/3" />
                      <div className="h-3 bg-[#F2F2F7] rounded w-1/4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-5 bg-[#F2F2F7] rounded w-3/4" />
                    <div className="h-3 bg-[#F2F2F7] rounded w-full" />
                    <div className="h-3 bg-[#F2F2F7] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Нет записей"
          description="Здесь будут отображаться записи бортжурнала"
          action={{ label: "Создать запись", onClick: () => requireAuth(() => router.push("/logbook/create")) }}
        />
      )}

      {/* Mobile Posts */}
      {!isLoading && posts.length > 0 && (
        <div className="lg:hidden p-4 space-y-3">
          {posts.map((post) => (
            <LogbookPostCard key={post.id} post={post} variant="mobile" onClick={handlePostClick} />
          ))}
        </div>
      )}

      {/* Desktop Posts */}
      {!isLoading && posts.length > 0 && (
        <div className="hidden lg:block max-w-[1200px] mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <LogbookPostCard key={post.id} post={post} variant="desktop" onClick={handlePostClick} />
            ))}
          </div>

          {(data?.has_more ?? false) && (
            <div className="flex justify-center mt-8">
              <button
                className="px-8 py-3 bg-white text-[#111111] border border-[#E5E5E7] rounded-xl hover:bg-[#F5F5F5] transition-colors font-medium text-[15px] font-[family-name:var(--font-manrope)]"
              >
                Загрузить ещё
              </button>
            </div>
          )}
        </div>
      )}
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}
