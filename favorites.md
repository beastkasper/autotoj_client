# Избранное (Favorites) - Документация

## Обзор

Функционал "Избранное" позволяет пользователям сохранять понравившиеся объявления для быстрого доступа. Реализован для мобильной и десктопной версий с адаптивным дизайном.

---

## Файловая структура

| Файл | Назначение |
|------|-----------|
| `src/components/pages/FavoritesPage.tsx` | Мобильная страница избранного |
| `src/components/desktop/DesktopFavoritesPage.tsx` | Десктопная страница избранного |
| `src/components/AdCard.tsx` | Карточка объявления (кнопка сердечка) |
| `src/components/desktop/DesktopHeader.tsx` | Десктопный хедер (кнопка входа в избранное) |
| `src/components/pages/MenuPage.tsx` | Мобильное меню (иконка избранного) |
| `src/services/api/favorites.ts` | Сервис работы с данными избранного |
| `src/components/EmptyState.tsx` | Компонент пустого состояния |
| `src/App.tsx` | Маршрутизация (route `'favorites'`) |

---

## Навигация / Кнопка входа на страницу

### Десктоп - кнопка в хедере

**Файл:** `src/components/desktop/DesktopHeader.tsx`

Иконка Heart расположена в правой части верхнего хедера среди навигационных кнопок.

```tsx
<button
  onClick={() => onNavigate('favorites')}
  className={`p-2 rounded-lg transition-all ${
    activeTab === 'favorites'
      ? 'bg-[#111111] text-white'
      : 'text-[#8E8E93] hover:bg-[#F5F5F5] hover:text-[#111111]'
  }`}
  title="Избранное"
>
  <Heart className="w-5 h-5" />
</button>
```

**Стили:**
- Padding: `p-2` (8px)
- Border-radius: `rounded-lg` (8px)
- Цвет иконки по умолчанию: `#8E8E93` (серый)
- Активное состояние (текущая вкладка): фон `#111111`, иконка белая
- Hover: фон `#F5F5F5`, иконка `#111111`
- Размер иконки: `w-5 h-5` (20x20)
- Анимация: `transition-all`

### Мобильная версия - иконка в меню

**Файл:** `src/components/pages/MenuPage.tsx`

Карточка-иконка в iOS-стиле в сетке меню. **Требует авторизации** - если пользователь не авторизован, кнопка неактивна (opacity 50%).

```tsx
<button
  onClick={() => handleProtectedAction(() => onNavigate('favorites'))}
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
- Форма: квадратная карточка (`aspectRatio: 1/1`)
- Фон: белый с тенью
- Border-radius: `14px`
- Контейнер иконки: `40x40`, круглый фон `#F7F7F9`
- Иконка Heart: `w-5 h-5`, цвет `#111111`, strokeWidth 1.5
- Текст: `11px`, шрифт Manrope, цвет `#000000`
- Анимация нажатия: `scale-[0.96]`, длительность `120ms`
- Неактивное состояние: `opacity-50`, `cursor-not-allowed`

---

## Кнопка "Сердечко" на карточке объявления

**Файл:** `src/components/AdCard.tsx`

Кнопка расположена в правом верхнем углу изображения карточки, одинакова для list- и grid-вариантов.

```tsx
<button
  onClick={(e) => {
    e.stopPropagation();
    onFavoriteToggle(ad.id);
  }}
  className="absolute top-2 right-2 w-7 h-7 bg-black/20 backdrop-blur-sm rounded-[14px]
             flex items-center justify-center active:opacity-70 transition-opacity z-10"
>
  <Heart
    className={`w-4 h-4 ${ad.isFavorite ? 'fill-[#E53935] text-[#E53935]' : 'text-white'}`}
  />
</button>
```

**Стили:**
- Позиция: `absolute top-2 right-2` (верхний правый угол изображения)
- Размер кнопки: `w-7 h-7` (28x28)
- Фон: `bg-black/20` (полупрозрачный черный 20%) + `backdrop-blur-sm`
- Border-radius: `14px` (круглая форма)
- Размер иконки: `w-4 h-4` (16x16)
- Z-index: `10`
- **Не в избранном:** иконка белая (`text-white`)
- **В избранном:** иконка красная, заливка красная (`fill-[#E53935] text-[#E53935]`)
- Анимация нажатия: `active:opacity-70`, `transition-opacity`

---

## Страница избранного - Десктоп

**Файл:** `src/components/desktop/DesktopFavoritesPage.tsx`

### Макет

- Фон страницы: `#F5F5F5`
- Контейнер: `max-w-[1440px]`, центрирован, padding `px-6`
- Верхний padding: `pt-6`

### Заголовок

- Текст: "Избранное" - `34px`, bold, шрифт Manrope, цвет `#111111`
- Подзаголовок с количеством: `17px`, цвет `#8E8E93`
- Склонение: "объявление" / "объявления" / "объявлений" (русская логика множественного числа)

### Сортировка (только десктоп)

Выпадающий список справа от заголовка:

| Значение | Текст |
|----------|-------|
| `recent` | Недавно добавленные |
| `price_asc` | Сначала дешевле |
| `price_desc` | Сначала дороже |
| `year` | По году выпуска |

**Стили селекта:**
- Иконка: `SlidersHorizontal` (lucide-react)
- Фон: белый
- Граница: `#E5E5E7`
- Border-radius: `rounded-xl` (12px)
- Текст: `15px`, medium, шрифт Manrope

### Сетка объявлений

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
```

| Breakpoint | Колонки |
|------------|---------|
| По умолчанию | 1 |
| `md` (768px) | 2 |
| `lg` (1024px) | 3 |
| `xl` (1280px) | 4 |

Gap между карточками: `gap-4` (16px).

### Пустое состояние (десктоп)

```tsx
<div className="bg-white/80 backdrop-blur-xl rounded-[24px] border border-[#E5E5E7] p-12 max-w-md text-center">
```

- Контейнер: `min-h-[600px]`, по центру
- Карточка: `bg-white/80`, `backdrop-blur-xl`, border `#E5E5E7`, `rounded-[24px]`, padding `p-12`
- Макс. ширина: `max-w-md` (448px)
- Иконка Heart: `w-10 h-10`, цвет `#8E8E93`, в круге `80x80` с фоном `#F5F5F5`
- Заголовок: "Нет избранных объявлений" - `22px`, semibold, `#111111`
- Описание: "Добавляйте понравившиеся автомобили..." - `17px`, `#8E8E93`

---

## Страница избранного - Мобильная

**Файл:** `src/components/pages/FavoritesPage.tsx`

### Макет

- Padding снизу: `pb-20` (для таб-бара)
- Фон: прозрачный

### Заголовок

- Кнопка "Назад" (`ChevronLeft`) + "Избранное" + количество
- Стиль хедера: `p-4 bg-transparent border-b border-border`

### Список объявлений

- Карточки в формате list (горизонтальный layout)
- Контейнер: `p-4 space-y-3` (padding 16px, gap 12px между карточками)
- Нет сортировки

### Пустое состояние (мобильная)

Компонент `EmptyState` с:
- Иконка: Heart
- Заголовок: "Нет избранных объявлений"
- Описание: "Добавляйте понравившиеся автомобили в избранное, чтобы быстро найти их позже"
- Кнопка действия: "К поиску"

---

## Управление состоянием

### Локальное хранилище (localStorage)

**Файл:** `src/services/api/favorites.ts`

Ключ хранения: `'favorites'`, формат: JSON-массив ID объявлений.

```typescript
favoritesLocal = {
  getFavoriteIds(): string[]        // Получить все ID
  addFavorite(adId: string): void   // Добавить в избранное
  removeFavorite(adId: string): void // Удалить из избранного
  isFavorite(adId: string): boolean  // Проверить наличие
  toggleFavorite(adId: string): boolean // Переключить
  clearFavorites(): void             // Очистить все
}
```

### Состояние в компонентах

Каждый компонент управляет Set избранных ID:

```typescript
const [favorites, setFavorites] = useState<Set<string>>(new Set());

const handleFavoriteToggle = (id: string) => {
  setFavorites((prev) => {
    const newFavorites = new Set(prev);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    return newFavorites;
  });
};
```

### Серверная синхронизация (опционально)

API-эндпоинты:
- `GET /v1/favorites?page={page}&limit={limit}` - получить список
- `POST /v1/favorites/{ad_id}` - добавить
- `DELETE /v1/favorites/{ad_id}` - удалить
- `GET /v1/favorites/check/{ad_id}` - проверить

---

## Цветовая палитра

| Элемент | Цвет | Hex |
|---------|------|-----|
| Основной текст | Черный | `#111111` |
| Вторичный текст | Серый | `#8E8E93` |
| Фон десктоп | Светло-серый | `#F5F5F5` |
| Сердечко (активное) | Красный | `#E53935` |
| Границы | Серый | `#E5E5E7` |
| Hover фон | Светло-серый | `#F5F5F5` |
| Фон иконки меню | Серый | `#F7F7F9` |

---

## Типографика

| Элемент | Размер | Вес | Шрифт |
|---------|--------|-----|-------|
| Заголовок страницы (десктоп) | 34px | bold | Manrope |
| Подзаголовок | 17px | regular | Manrope |
| Пустое состояние заголовок | 22px | semibold | Manrope |
| Пустое состояние текст | 17px | regular | Manrope |
| Метка меню (мобайл) | 11px | medium | Manrope |
| Текст сортировки | 15px | medium | Manrope |

---

## Анимации и переходы

| Элемент | Эффект | Длительность |
|---------|--------|-------------|
| Сердечко на карточке | `active:opacity-70` | default (150ms) |
| Кнопка меню (мобайл) | `active:scale-[0.96]` | 120ms |
| Хедер кнопка (десктоп) | `transition-all` (цвет, фон) | default |
| Таб-бар при скролле | translate-y, opacity, scale | 300ms ease-out |
| Заливка сердечка | Мгновенная смена цвета | - |

---

## Аутентификация

| Платформа | Требуется авторизация? |
|-----------|----------------------|
| Десктоп - кнопка в хедере | Нет (всегда видна) |
| Десктоп - страница избранного | Нет |
| Мобайл - иконка в меню | **Да** (disabled если не авторизован) |
| Мобайл - страница избранного | Через авторизованное меню |

---

## Различия мобильной и десктопной версий

| Параметр | Мобильная | Десктопная |
|----------|-----------|-----------|
| Layout карточек | List (горизонтальный) | Grid (адаптивный 1-4 колонки) |
| Сортировка | Нет | 4 варианта |
| Навигация | Через меню (авторизация) | Кнопка в хедере |
| Пустое состояние | Кнопка "К поиску" | Без кнопки |
| Фон | Прозрачный | `#F5F5F5` |
| Заголовок | С кнопкой "Назад" | Без кнопки "Назад" |
| Стиль пустого состояния | Простой центрированный | Карточка с blur и border |
