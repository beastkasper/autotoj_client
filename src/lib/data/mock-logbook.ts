import { formatDate } from "@/lib/utils/dateFormat";

export const MOCK_POST = {
  id: "1",
  author: { id: "user1", name: "Алишер", avatar: null },
  title: "Замена тормозных колодок",
  text: "Сегодня решил самостоятельно заменить передние тормозные колодки. Весь процесс занял около 2 часов. Купил оригинальные колодки в автомагазине на Рудаки. Все инструменты были под рукой.\n\nПроцесс оказался проще, чем я думал. Главное - правильно зафиксировать машину и соблюдать технику безопасности.",
  category: "Ремонт",
  photos: [
    "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop",
  ],
  likes_count: 15,
  comments_count: 2,
  is_liked: false,
  created_at: "2026-01-10T10:00:00Z",
  updated_at: "2026-01-10T10:00:00Z",
};

export const MOCK_COMMENTS = [
  {
    id: "1",
    author: { id: "user2", name: "Farrukh", avatar: null },
    text: "Отличная работа! Сколько стоили колодки?",
    created_at: "2026-01-10T11:00:00Z",
  },
  {
    id: "2",
    author: { id: "user3", name: "Davron", avatar: null },
    text: "А проточку дисков делал?",
    created_at: "2026-01-10T11:30:00Z",
  },
];

export const formatTimestamp = (dateStr: string): string => {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Только что";
  if (diffMin < 60) return `${diffMin} мин. назад`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} час. назад`;
  return formatDate(dateStr);
};
