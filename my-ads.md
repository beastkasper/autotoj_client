# Мои объявления (My Ads) — Документация

## Обзор

Страница "Мои объявления" позволяет пользователю управлять своими размещёнными объявлениями: просматривать, редактировать, ставить на паузу, публиковать и удалять. Реализована в мобильной и десктопной версиях. Требует авторизации.

---

## Файловая структура

| Файл | Назначение |
|------|-----------|
| `src/components/pages/MyAdsPage.tsx` | Мобильная страница |
| `src/components/desktop/DesktopMyAdsPage.tsx` | Десктопная страница |
| `src/services/api/myads.ts` | API-сервис и интерфейсы |
| `src/components/desktop/DesktopHeader.tsx` | Кнопка входа (десктоп хедер) |
| `src/components/pages/MenuPage.tsx` | Кнопка входа (мобильное меню) |
| `src/components/EmptyState.tsx` | Компонент пустого состояния |
| `src/App.tsx` | Маршрутизация (`'myads'`) |

---

## Навигация / Кнопка входа на страницу

### Десктоп — кнопка в хедере

**Файл:** `src/components/desktop/DesktopHeader.tsx`

Иконка `Package` (lucide-react) в правой части хедера. **Показывается только авторизованным пользователям.**

```tsx
<button
  onClick={() => onNavigate('myads')}
  className={`p-2 rounded-lg transition-all ${
    activeTab === 'myads'
      ? 'bg-[#111111] text-white'
      : 'text-[#8E8E93] hover:bg-[#F5F5F5] hover:text-[#111111]'
  }`}
  title="Мои объявления"
>
  <Package className="w-5 h-5" />
</button>
```

**Стили:**
- Padding: `p-2` (8px)
- Border-radius: `rounded-lg` (8px)
- Иконка по умолчанию: `#8E8E93` (серый)
- Активная вкладка: фон `#111111`, иконка белая
- Hover: фон `#F5F5F5`, иконка `#111111`
- Размер иконки: `w-5 h-5` (20x20)
- Видимость: только при `isAuthenticated === true`

### Мобильная версия — иконка в меню

**Файл:** `src/components/pages/MenuPage.tsx`

Первая карточка-иконка в iOS-стиле в сетке меню. **Требует авторизации.**

```tsx
<button
  onClick={() => handleProtectedAction(() => onNavigate('myads'))}
  disabled={!isAuthenticated}
  className={`bg-white rounded-[14px] p-2 flex flex-col items-center justify-center transition-all duration-[120ms] ${
    isAuthenticated
      ? 'active:scale-[0.96] active:bg-[#FAFAFA]'
      : 'opacity-50 cursor-not-allowed'
  }`}
  style={{
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
    aspectRatio: '1/1'
  }}
>
```

**Стили:**
- Квадратная карточка (`aspectRatio: 1/1`)
- Фон белый с тенью
- Border-radius: `14px`
- Контейнер иконки: `40x40`, круглый фон `#F7F7F9`
- Иконка Package: `w-5 h-5`, цвет `#111111`, strokeWidth 1.5
- Текст: `11px`, Manrope, цвет `#000000`
- Нажатие: `scale-[0.96]`, `120ms`
- Неактивно: `opacity-50`, `cursor-not-allowed`

---

## Интерфейсы и типы

### AdStatus

```typescript
type AdStatus = 'active' | 'paused'
```

### MyAd (расширяет Ad)

```typescript
interface MyAd extends Ad {
  status: AdStatus
  createdAt: string    // ISO дата создания
  publishedDate: string // ISO дата публикации
  views?: number        // Количество просмотров (только десктоп)
}
```

### Фильтры API

```typescript
interface MyAdsFilters {
  status?: 'active' | 'moderation' | 'rejected' | 'archived'
  page?: number
  limit?: number
}
```

### AdFormData (данные формы создания/редактирования)

```typescript
interface AdFormData {
  vehicle_type?: string       // Шаг 1: тип ТС
  brand_id?: string           // Шаг 2: марка
  model_id?: string           // Шаг 3: модель
  generation_id?: string      // Шаг 4: поколение
  year?: number               // Шаг 5: год
  body?: string               // Шаг 6: кузов
  condition?: string          // Шаг 7: состояние
  mileage?: number            // Шаг 8: пробег
  fuel?: string               // Шаг 9: топливо
  transmission?: string       // Шаг 10: КПП
  drive?: string              // Шаг 11: привод
  engine_volume?: number      // Шаг 12: объём двигателя
  power?: number              // Шаг 13: мощность
  price?: number              // Шаг 14: цена
  city_id?: string            // Шаг 15: город
  color?: string              // Шаг 16: цвет
  vin?: string                // Шаг 17: VIN
  options?: string[]          // Шаг 18: опции
  description?: string        // Шаг 22: описание
  contact_name?: string       // Шаг 23: имя контакта
  contact_phone?: string      // Шаг 24: телефон
  contact_additional?: string // Шаг 25: доп. контакт
}
```

---

## Состояние компонентов

### Мобильная версия

```typescript
const [activeTab, setActiveTab] = useState<AdStatus>('active')
const [favorites, setFavorites] = useState<Set<string>>(new Set())
const [showMenu, setShowMenu] = useState<string | null>(null)
const [showConfirmModal, setShowConfirmModal] = useState<{
  type: 'pause' | 'publish'
  adId: string
} | null>(null)
```

### Десктопная версия

```typescript
const [activeTab, setActiveTab] = useState<'active' | 'paused'>('active')
```

---

## Вкладки (Табы)

Две вкладки для фильтрации по статусу:

| Вкладка | Текст | Статус |
|---------|-------|--------|
| Активные | "Активные" + badge с кол-вом | `'active'` |
| Пауза | "Пауза" / "На паузе" + badge | `'paused'` |

### Стили табов — мобильная

- Активная: `border-primary text-primary` (нижняя граница)
- Неактивная: `border-transparent text-muted-foreground`
- Горизонтальный скролл при переполнении

### Стили табов — десктоп

- Активная: `bg-[#111111] text-white`
- Неактивная: `bg-white text-[#8E8E93] hover:bg-[#F5F5F5] hover:text-[#111111] border border-[#E5E5E7]`
- Padding: `px-6 py-3`, `rounded-xl`

---

## Страница — Мобильная версия

**Файл:** `src/components/pages/MyAdsPage.tsx`

### Макет

- Фон: `bg-background min-h-screen`
- Padding снизу: `pb-20` (для таб-бара)

### Заголовок (sticky)

- Позиция: `sticky top-0 z-10`
- Фон: `bg-card border-b border-border`
- Кнопка "Назад" (если `onBack` передан)
- Текст: "Мои объявления"
- Табы с подсчётом

### Карточка объявления (list-вариант)

Горизонтальный layout: изображение (128x128) | контент.

```
┌──────────┬────────────────────────────┐
│          │ Toyota Camry 2.5 AT    [⋮] │
│  Image   │ 2022 • 25 000 км          │
│ 128x128  │ Душанбе                    │
│ [Статус] │ 350 000 сомони            │
│          │ 15 марта 2024             │
└──────────┴────────────────────────────┘
```

**Стили карточки:**
- Контейнер: `bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow`
- Изображение: `w-32 h-32 flex-shrink-0`, `object-cover`
- Контент: `flex-1 p-3 flex flex-col justify-between`
- Заголовок: `font-semibold text-sm line-clamp-2 mb-1`
- Цена: `text-lg font-semibold text-foreground mb-1`
- Дата: формат `ru-RU` locale

### Бейдж статуса (на изображении, top-left)

| Статус | Фон | Текст | Текст бейджа |
|--------|-----|-------|-------------|
| Активно | `bg-[#EAF7EE]` | `text-[#2E7D32]` | "Активно" |
| Пауза | `bg-gray-100` | `text-gray-700` | "Пауза" |

### Меню действий (MoreVertical)

Кнопка `⋮` в правом верхнем углу карточки. Открывает выпадающее меню:

**Стили меню:**
- Фон: белый
- Граница: `#E5E5EA`
- Border-radius: `rounded-[16px]`
- Тень: `shadow-lg`
- Hover пункта: `bg-[#F2F2F7]`
- Active: `bg-[#E5E5EA]`

**Действия для активных:** Редактировать, Поставить на паузу
**Действия для приостановленных:** Редактировать, Опубликовать

### Модальное окно подтверждения

- Оверлей: `fixed inset-0 bg-black/50`
- Карточка: белая, `rounded-[20px]`, `max-w-sm`
- Заголовок: `17px`, semibold, Manrope
- Описание: `15px`, серый
- Кнопки: "Отмена" | Действие (разделены бордером)

---

## Страница — Десктопная версия

**Файл:** `src/components/desktop/DesktopMyAdsPage.tsx`

### Макет

- Фон: `bg-[#F5F5F5]`, `min-h-screen`
- Контейнер: `max-w-[1200px] mx-auto px-6 py-8`

### Заголовок

- Текст: "Мои объявления" — `text-3xl`, bold, Manrope
- Подзаголовок: "Управляйте своими объявлениями" — серый текст

### Карточка объявления

Горизонтальный layout: большое изображение (256x192) | контент.

```
┌─────────────┬──────────────────────────────────────┐
│             │ Toyota Camry 2.5 AT Premium   [Активно] │
│   Image     │ 2022 • 25 000 км • Душанбе           │
│  256x192    │                                        │
│             │ 350 000 сомони                         │
│             │ 👁 245 просмотров  📅 Опубликовано: ... │
│             │ [Редактировать] [На паузу] [Удалить]  │
└─────────────┴──────────────────────────────────────┘
```

**Стили карточки:**
- Контейнер: `bg-white rounded-2xl p-6 border border-[#E5E5E7]`
- Hover: `hover:border-[#111111] hover:shadow-lg transition-all`
- Gap: `gap-6`
- Стек: `space-y-4`

**Изображение:**
- Размер: `w-64 h-48` (256x192)
- `rounded-xl`, `overflow-hidden`
- Hover: `group-hover:scale-105 transition-transform`

**Заголовок объявления:**
- Размер: `text-[20px]`, bold, цвет `#111111`
- Hover: `group-hover:text-[#E53935] transition-colors`

**Характеристики:**
- Формат: "Год • Пробег • Город"
- Размер: `14px`, серый

### Бейдж статуса (десктоп)

| Статус | Фон | Текст | Бордер |
|--------|-----|-------|--------|
| Активно | `bg-green-50` | `text-green-700` | `border-green-200` |
| На паузе | `bg-orange-50` | `text-orange-700` | `border-orange-200` |

Стиль: `px-3 py-1.5 rounded-lg text-[13px] font-medium border`

### Цена

- Размер: `text-[28px]`, bold
- Цвет: `#E53935` (красный)
- Формат: `Intl.NumberFormat('ru-RU')` + " сомони"

### Статистика

- Просмотры: иконка `Eye` + "XXX просмотров" (`14px`, серый)
- Дата публикации: "Опубликовано: дата" (`14px`, серый)

### Кнопки действий

| Кнопка | Фон | Текст | Hover | Иконка |
|--------|-----|-------|-------|--------|
| Редактировать | `#111111` | белый | `hover:bg-[#2C2C2E]` | Edit |
| На паузу | белый + border | чёрный | `hover:bg-[#F5F5F5]` | Pause |
| Опубликовать | зелёный | зелёный | `hover:bg-green-50` | Play |
| Удалить | белый + border | красный | `hover:bg-red-50` | Trash2 |

Стиль кнопок: `px-4 py-2.5 rounded-xl transition-colors`

---

## Пустые состояния

### Активная вкладка (нет объявлений)

**Мобильная:**
- Компонент `EmptyState`
- Иконка: `Package`
- Заголовок: "У вас пока нет активных объявлений"
- Описание: "Создайте новое объявление, чтобы начать продажу"
- Кнопка: "Разместить объявление"

**Десктопная:**
- Контейнер: `py-20 bg-white rounded-2xl border border-[#E5E5E7]`
- Иконка Package в круге: `w-16 h-16`, фон `#F5F5F5`
- Заголовок: "Нет объявлений" (`text-xl`, semibold)
- Описание: зависит от вкладки

### Вкладка "Пауза" (нет объявлений)

- Заголовок: "Пауза объявлений"
- Описание: "Здесь будут храниться объявления на паузе"
- Кнопка: отсутствует

---

## API-сервис

**Файл:** `src/services/api/myads.ts`

### Эндпоинты

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/v1/my/ads` | Список объявлений (с фильтрами) |
| POST | `/v1/my/ads` | Создать черновик |
| GET | `/v1/my/ads/{ad_id}` | Детали объявления |
| PATCH | `/v1/my/ads/{ad_id}` | Обновить данные |
| DELETE | `/v1/my/ads/{ad_id}` | Удалить объявление |
| POST | `/v1/my/ads/{ad_id}/photos` | Загрузить фото (до 25) |
| POST | `/v1/my/ads/{ad_id}/video` | Загрузить видео (1, до 60 сек) |
| POST | `/v1/my/ads/{ad_id}/panorama` | Загрузить панораму (1) |
| POST | `/v1/my/ads/{ad_id}/submit` | Отправить на модерацию |
| POST | `/v1/my/ads/{ad_id}/archive` | Архивировать |
| POST | `/v1/my/ads/{ad_id}/restore` | Восстановить из архива |

### Ответ списка

```typescript
interface MyAdsResponse {
  ads: Ad[]
  total: number
  page: number
  limit: number
  has_more: boolean
}
```

---

## Цветовая палитра

| Элемент | Цвет | Hex |
|---------|------|-----|
| Основной текст | Чёрный | `#111111` |
| Вторичный текст | Серый | `#8E8E93` |
| Фон десктоп | Светло-серый | `#F5F5F5` |
| Цена (десктоп) | Красный | `#E53935` |
| Бейдж "Активно" (мобайл) | Зелёный фон | `#EAF7EE` |
| Бейдж "Активно" текст (мобайл) | Зелёный | `#2E7D32` |
| Бейдж "Пауза" (мобайл) | Серый фон | `gray-100` |
| Границы | Серый | `#E5E5E7` / `#E5E5EA` |
| Меню hover | Светло-серый | `#F2F2F7` |

---

## Типографика

| Элемент | Размер | Вес | Шрифт |
|---------|--------|-----|-------|
| Заголовок (десктоп) | 3xl (~30px) | bold | Manrope |
| Заголовок объявления (десктоп) | 20px | bold | Manrope |
| Цена (десктоп) | 28px | bold | — |
| Заголовок объявления (мобайл) | sm (~14px) | semibold | — |
| Цена (мобайл) | lg (~18px) | semibold | — |
| Характеристики | 14px | regular | — |
| Статус бейдж (десктоп) | 13px | medium | — |
| Модальное окно заголовок | 17px | semibold | Manrope |
| Метка меню | 11px | medium | Manrope |

---

## Анимации и переходы

| Элемент | Эффект | Длительность |
|---------|--------|-------------|
| Карточка hover (мобайл) | `hover:shadow-md` | default (150ms) |
| Карточка hover (десктоп) | `hover:border-[#111111]`, `hover:shadow-lg` | default |
| Изображение hover (десктоп) | `scale-105` | `transition-transform` |
| Заголовок hover (десктоп) | цвет → `#E53935` | `transition-colors` |
| Кнопки действий | `transition-colors` | default |
| Кнопка меню (мобайл) | `active:scale-[0.96]` | 120ms |
| Табы (десктоп) | `transition-all` | default |

---

## Аутентификация

| Точка входа | Авторизация |
|-------------|-------------|
| Десктоп — кнопка в хедере | Скрыта если не авторизован |
| Мобайл — иконка в меню | Disabled + opacity 50% |
| Страница myads | Доступна только авторизованным |

---

## Различия мобильной и десктопной версий

| Параметр | Мобильная | Десктопная |
|----------|-----------|-----------|
| Layout карточек | List (128x128 image) | Большие карточки (256x192 image) |
| Цена | Чёрная, 18px | Красная (`#E53935`), 28px |
| Статус бейдж | На изображении (top-left) | Справа от заголовка |
| Цвет бейджа "Пауза" | Серый | Оранжевый |
| Действия | Меню `⋮` (MoreVertical) | Кнопки в строке |
| Удаление | Нет | Есть кнопка "Удалить" |
| Просмотры | Нет | Есть (`Eye` + счётчик) |
| Модальное подтверждение | Есть (пауза/публикация) | Нет (прямые действия) |
| Заголовок | Sticky хедер + back | Статичный с подзаголовком |
| Фон | `bg-background` | `#F5F5F5` |
| Макс. ширина | Нет | `1200px` |
| Hover эффекты | Минимальные | Развёрнутые (scale, color, shadow) |

---

## Mock-данные

### Мобильная (6 объявлений)

| Название | Статус | Цена | Категория |
|----------|--------|------|-----------|
| Toyota Camry 2.5 AT | active | 350 000 TJS | cars |
| Honda Accord 2.0 CVT | active | 280 000 TJS | cars |
| Mercedes-Benz E-Class | paused | 520 000 TJS | cars |
| BMW 3 Series 320i | active | 420 000 TJS | cars |
| Lexus RX 300 | paused | 380 000 TJS | cars |
| Шины Michelin летние | active | 2 500 TJS | parts |

### Десктопная (3 объявления)

| Название | Статус | Цена | Просмотры |
|----------|--------|------|-----------|
| Toyota Camry 2.5 AT Premium | active | 350 000 TJS | 245 |
| Honda Accord 2.0 CVT Elegance | active | 280 000 TJS | 182 |
| Mercedes-Benz E-Class 220d | paused | 520 000 TJS | 98 |
