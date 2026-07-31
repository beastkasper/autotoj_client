# autoTOJ — Полная дизайн-спецификация мобильного приложения

**Автономный документ.** Здесь есть всё, что нужно, чтобы сверстать веб-мобилку, визуально идентичную
нативному приложению autoTOJ: токены, размеры, разметка, тексты интерфейса, списки значений, поведение.
Доступ к исходному коду проекта не требуется — ничего не осталось «за кадром».

Все числа взяты из реализации (React Native + Expo). В RN размеры в стилях — это dp, которые
переносятся в CSS-пиксели один в один: `padding: 16` → `padding: 16px`.

**autoTOJ** — автомобильный маркетплейс для Таджикистана: поиск и продажа авто, мото и спецтехники,
запчасти, аренда авто, автосервисы. Язык интерфейса — русский, валюта — сомони (TJS).

**Про блюр.** Оригинальный дизайн задумывался с размытием фона (таббар, кнопка избранного, нижняя
панель, бейджи поверх фото). В React Native `backdrop-filter` недоступен, поэтому там стоит
полупрозрачный фон и комментарии «blur not supported». На вебе размытие работает — в местах,
отмеченных ниже словом **[блюр]**, его нужно включить: получится ближе к замыслу, чем в самом приложении.

---

# Содержание

1. [Оболочка приложения](#1-оболочка-приложения)
2. [Цвета](#2-цвета)
3. [Типографика](#3-типографика)
4. [Радиусы, тени, отступы, границы](#4-радиусы-тени-отступы-границы)
5. [Иконки](#5-иконки)
6. [Базовые компоненты](#6-базовые-компоненты)
7. [Навигация и карта экранов](#7-навигация-и-карта-экранов)
8. [Оверлеи: шиты, модалки, тосты](#8-оверлеи-шиты-модалки-тосты)
9. [Состояния: загрузка, пусто, ошибка](#9-состояния-загрузка-пусто-ошибка)
10. [Экраны](#10-экраны)
11. [Мастер создания объявления](#11-мастер-создания-объявления)
12. [Анимации и жесты](#12-анимации-и-жесты)
13. [Справочник контента](#13-справочник-контента)
14. [Готовый CSS-старт](#14-готовый-css-старт)
15. [Чек-лист приёмки](#15-чек-лист-приёмки)

---

# 1. Оболочка приложения

```
┌─ body (background: var(--background)) ────────────────┐
│         ┌─ .app-shell ───────────────────┐            │
│         │  max-width: 440px              │            │
│         │  margin: 0 auto                │            │
│         │  background: var(--card)       │            │
│         │  min-height: 100dvh            │            │
│         │                                │            │
│         │   [ контент экрана ]           │            │
│         │                                │            │
│         │   [ TabBar — fixed, z-50 ]     │            │
│         └────────────────────────────────┘            │
└───────────────────────────────────────────────────────┘
```

- Приложение ограничено шириной **440px** и центрировано. На широких экранах по бокам виден
  фон `--background`, сам контейнер — `--card`.
- Все экраны скроллятся внутри контейнера. Таббар — `position: fixed`, `z-index: 50`.
- Нижний отступ прокручиваемого контента под таббаром: **80px**.
- Safe area: `env(safe-area-inset-top)` сверху для шапок, `max(env(safe-area-inset-bottom), 16px)`
  снизу для таббара. Нужен `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.

```css
.app-shell {
  max-width: 440px;
  margin-inline: auto;
  min-height: 100dvh;
  background: var(--card);
  position: relative;
  overflow-x: hidden;
}
.screen { padding-bottom: 80px; }
.pt-safe { padding-top: env(safe-area-inset-top, 0px); }
```

---

# 2. Цвета

Палитра построена вокруг системных цветов iOS. Primary — **чёрный**, не синий: главные кнопки чёрные
с белым текстом. Фирменный акцент один — красный `#E53935` (логотип, счётчики непрочитанного, активное «сердце»).

## Светлая тема

| Токен | HEX | Где используется |
|---|---|---|
| `--background` | `#FFFFFF` | фон страницы |
| `--foreground` | `#111111` | основной текст |
| `--card` | `#FFFFFF` | карточки, шапки, листы |
| `--card-foreground` | `#111111` | текст на карточках |
| `--popover` | `#FFFFFF` | поповеры, боттом-шиты |
| `--primary` | `#111111` | кнопки, активные чипы, активный фильтр |
| `--primary-foreground` | `#FFFFFF` | текст на primary |
| `--secondary` | `#F2F2F7` | фон полей, капсула активного таба, плашки |
| `--secondary-foreground` | `#111111` | текст на secondary |
| `--muted` | `#E5E5EA` | скелетоны, круги под иконками пустых состояний |
| `--muted-foreground` | `#8E8E93` | вторичный текст, плейсхолдеры, неактивные иконки |
| `--accent` | `#111111` | = primary |
| `--accent-foreground` | `#FFFFFF` | текст на accent |
| `--destructive` | `#FF3B30` | ошибки, удаление, выход |
| `--destructive-foreground` | `#FFFFFF` | текст на destructive |
| `--success` | `#34C759` | успех, публикация |
| `--border` | `#E5E5EA` | все границы и разделители |
| `--input` | `#E5E5EA` | границы инпутов |
| `--ring` | `#111111` | фокус |

Дополнительно из палитры (используется редко): `chart1 #111111`, `chart2 #34C759`, `chart3 #FF9500`,
`chart4 #FF3B30`, `chart5 #AF52DE`.

## Тёмная тема

| Токен | HEX |
|---|---|
| `--background` | `#000000` |
| `--foreground` | `#F5F5F7` |
| `--card` | `#1C1C1E` |
| `--card-foreground` | `#F5F5F7` |
| `--popover` | `#1C1C1E` |
| `--primary` | `#F5F5F7` |
| `--primary-foreground` | `#000000` |
| `--secondary` | `#2C2C2E` |
| `--secondary-foreground` | `#F5F5F7` |
| `--muted` | `#3A3A3C` |
| `--muted-foreground` | `#98989D` |
| `--accent` | `#F5F5F7` |
| `--accent-foreground` | `#000000` |
| `--destructive` | `#FF453A` |
| `--success` | `#32D74B` |
| `--border` | `#3A3A3C` |
| `--input` | `#3A3A3C` |
| `--ring` | `#F5F5F7` |

Тёмные варианты chart: `#F5F5F7`, `#32D74B`, `#FF9F0A`, `#FF453A`, `#BF5AF2`.

В тёмной теме primary **инвертируется**: кнопка светлая с тёмным текстом.

## Фиксированные цвета (одинаковы в обеих темах)

| Цвет | Значение | Где |
|---|---|---|
| Красный бренда | `#E53935` | «auto» в логотипе, бейдж непрочитанных, активное сердце |
| Ссылка / iOS-синий | `#007AFF` | «Смотреть профиль», «Показать полностью» в запчастях, «Отменить» в диалогах, кнопки «Повторить» в запчастях и прокате |
| Бейдж «Новый» (авто) | `#4CAF50` | статус на карточке объявления |
| Бейдж «Новый» (запчасти) | `#34C759` | состояние запчасти |
| Бейдж «Б/у» | `#FF9500` | состояние запчасти |
| Бейдж «На заказ» | `#111111` | статус на карточке и в деталях |
| Бейдж «В наличии» | `#2196F3` | статус в деталях объявления |
| Бейдж «Растаможен» | `#9C27B0` | статус в деталях |
| Бейдж «Не растаможен» | `#F44336` | статус в деталях |
| Звезда рейтинга | `#FFD700` | заливка и обводка звезды |
| Тёмная плашка | `rgba(0,0,0,.6)` / `rgba(0,0,0,.7)` | счётчик фото, бейдж видео |
| Кнопка избранного на фото | `rgba(0,0,0,.2)` | круглая кнопка 28×28 |
| Ошибка отправки в чате | фон `#FFECEC`, текст `#D32F2F` | неотправленное сообщение |
| Иконбоксы главных сервисов | `#1a1a1a` (Запчасти), `#2d2d2d` (Авто прокат) | плитки на вкладке «Сервисы» |
| Светло-серый блок | `#F7F7F9` | гостевой блок, иконбоксы услуг, поля профиля, инфоблоки |
| Светло-серый блок 2 | `#F8F8F8` | фон деталей запчасти, карточки предпросмотра |
| Светло-серый блок 3 | `#F5F5F7` | карточки в настройках уведомлений |
| Граница карточек профиля | `#EAEAEA` | карточка профиля, список меню, шапки сервисов |
| Граница мастера объявления | `#EDEDED` | шапка и карточки мастера |
| Трек выключенного switch | `#D1D1D6` | настройки |
| Неактивный текст кнопки | `#C7C7CC` | «Сохранить» в неактивном состоянии, счётчик символов |
| Фон успеха | `#EAF7EE` | круг под галочкой после отправки отзыва |
| Фон ошибки | `#FEE2E2` / `#FFE5E5` | круг под иконкой ошибки, модалка удаления |
| Плейсхолдер изображения | `#F3F4F6` | фон битой картинки |
| Серый текст чата | `#6B7280` (аватар, авто), `#3A3A3C` (последнее сообщение) | список чатов |

## Переключение темы

Три режима: **Светлая** / **Тёмная** / **Системная**. Выбор сохраняется (в приложении —
AsyncStorage, на вебе — `localStorage`). Реализуйте через `data-theme` на `<html>`;
режим «системная» читает `matchMedia('(prefers-color-scheme: dark)')`.

---

# 3. Типографика

## Шрифты

- Основной — **Manrope**: 400, 500, 600, 700.
- Логотип — задумывался шрифт **Cadillac**; его нет в проекте, фактически рисуется системным
  шрифтом с `font-weight: 900`. На вебе: `font-family: Cadillac, system-ui, sans-serif`, вес 900.
- **Open Sans** 700/800 подключён для пресета `.text-logo`, но в живых экранах не применяется.

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
:root { --font-sans: 'Manrope', system-ui, -apple-system, sans-serif; }
body { font-family: var(--font-sans); }
```

## Шкала пресетов

| Класс | Размер / интерлиньяж | Вес | Цвет по умолчанию |
|---|---|---|---|
| `.text-logo` | 22 / 26 | 800 | — |
| `.text-h1` | 24 / 30 | 700 | — |
| `.text-h2` | 20 / 26 | 600 | — |
| `.text-h3` | 16 / 22 | 600 | — |
| `.text-body-primary` | 15 / 22 | 400 | `#1C1C1E` |
| `.text-body-secondary` | 13 / 18 | 400 | `#8E8E93` |
| `.text-price-main` | 17 / 22 | 700 | `#000000` |
| `.text-price-meta` | 12 / 16 | 500 | `#8E8E93` |
| `.text-button-primary` | 15 / 20 | 600 | `#FFFFFF` |
| `.text-button-secondary` | 14 / 18 | 500 | `#1C1C1E` |
| `.text-tab-active` | 12 / 16 | 600 | `#111111` |
| `.text-tab-inactive` | 12 / 16 | 500 | `#8E8E93` |
| `.text-chip-active` | 13 / 16 | 600 | — |
| `.text-chip-default` | 13 / 16 | 500 | — |
| `.text-caption` | 12 / 16 | 400 | `#8E8E93` |
| `.text-error` | 12 / 16 | 400 | `#FF3B30` |

`letter-spacing: 0` везде, кроме логотипа (`-1px` при 30–52px, `-0.5px` при 18–32px)
и «капслочных» подзаголовков вроде «ЧАТЫ» (`+0.5px`).

## Фактически применяемые размеры

Компоненты чаще задают размер напрямую, минуя пресеты. Опорные значения:

| Размер / вес | Где |
|---|---|
| 52 / 900 | логотип на сплэше |
| 48 / 700 | крупная оценка рейтинга на экране отзывов |
| 30 / 900 | логотип на главной |
| 28 / 700 | цена в деталях, заголовок шага мастера, заголовок успеха публикации |
| 24 / 700 | имя автосервиса в детали |
| 24 / 600 | заголовок «Избранное» |
| 22 / 700 | «Услуги», имя продавца, заголовки шитов темы и языка, цена в предпросмотре |
| 22 / 600 | заголовок объявления в деталях |
| 20 / 700 | заголовок формы входа, модалки, «Комплектация» |
| 20 / 600 | «Сообщения», «Фильтры», заголовки внутренних экранов (Мои объявления, Бортжурнал, Отзывы, Обсуждения, Уведомления, Активность) |
| 18 / 700 | заголовок секции в деталях запчасти, «Отзывы» |
| 18 / 600 | цена в «Моих объявлениях», заголовок шага кода, заголовок в бортжурнале |
| 17 / 600 | **заголовок шапки экрана** — самый частый |
| 17 / 700 | счётчик в плитке комплектации |
| 16 / 700 | цена на карточке объявления |
| 16 / 500 | пункт меню, лейбл настройки, категория |
| 15 / 600 | кнопки, имя продавца, значения в карточках |
| 15 / 400 | текст сообщений, описания, пункты списков |
| 14 / 500 | заголовок карточки объявления, табы, чипы |
| 13 / 400 | подписи, вторичные строки |
| 12 / 400 | характеристики, таймстемпы, счётчики |
| 11 / 700 | текст на бейджах статуса поверх фото |
| 11 / 500 | подпись иконки-карточки в профиле |
| 8 / 500 | подписи в таббаре (да, восемь) |

---

# 4. Радиусы, тени, отступы, границы

## Радиусы

Базовая шкала: `sm 8`, `md 10`, `lg 12`, `xl 16`. Фактически используется расширенный набор:

| px | Что |
|---|---|
| 4 | линии скелетонов |
| 6 | мелкие бейджи (статус на фото, видео) |
| 8 | инпуты и кнопки в фильтрах, чипы-опции, миниатюры |
| 10 | поле поиска в мастере, инфо-хинты |
| 12 | инпуты форм, тост, пункты шитов действий, карточки списков, кнопки мастера |
| 14 | иконка-карточка в профиле, кнопки мастера (52px) |
| 16 | карточки-контейнеры, кнопки деталей, поля кода, шапка шита фильтров |
| 18 | круглые чипы (h36), инфоблок сервисов |
| 20 | карточки объявлений, гостевой блок, плитки сервисов, поле поиска, капсула таба, шиты действий |
| 24 | таббар, форма авторизации, боттом-шит выбора, карточка характеристик, круглые кнопки h48 |
| 26 | кнопки h52 (отзывы, профиль) |
| 28 | плавающий контейнер поиска, шит выбора темы |
| 9999 | круглые чипы фильтров, бейджи-счётчики, поля профиля, поле комментария |

## Тени

```css
--shadow-card:      0 4px 16px rgba(0,0,0,.06);  /* карточка объявления, кнопки в «Сообщениях» */
--shadow-float:     0 8px 24px rgba(0,0,0,.08);  /* таббар, плавающий поиск */
--shadow-panel:     0 8px 24px rgba(0,0,0,.06);  /* карточка характеристик */
--shadow-tile:      0 4px 12px rgba(0,0,0,.06);  /* плитки сервисов */
--shadow-icon-card: 0 2px 8px rgba(0,0,0,.06);   /* иконки-карточки в профиле */
--shadow-header:    0 1px 4px rgba(0,0,0,.05);   /* липкая шапка деталей */
--shadow-hairline:  0 1px 2px rgba(0,0,0,.05);   /* компактный сёрчбар */
--shadow-menu:      0 4px 16px rgba(0,0,0,.12);  /* контекстное меню объявления */
--shadow-modal:     0 8px 24px rgba(0,0,0,.20);  /* центрированные модалки */
--shadow-sheet:     0 -4px 24px rgba(0,0,0,.12); /* боттом-шиты (тень вверх) */
--shadow-avatar:    0 4px 12px rgba(0,0,0,.12);  /* аватар поверх баннера */
```

В тёмной теме тени визуально не читаются — разделение держится на `--card` (`#1C1C1E`) поверх
`--background` (`#000`). Тени можно оставить, они не мешают.

## Отступы

- Горизонтальный отступ экрана — **16px** (везде; исключения: мастер объявления и шиты темы/языка — **20px**).
- Между карточками в сетке 2 колонки — **12px**; в сетке 3 колонки (услуги) — **8px**.
- Между секциями в деталях объявления — **16px**.
- Внутренние отступы карточек: 12px (карточка объявления), 16px (карточка профиля, плитка услуги,
  строка списка), 20px (карточка характеристик, крупная плитка, шапка шита), 24px (форма авторизации,
  карточка сводки отзывов).
- Высоты: 56px (шапка, строка ввода чата), 72px (строка чата), 52px (крупная кнопка), 48px (кнопка,
  инпут), 44px (поле поиска в запчастях/прокате), 40px (поле поиска на главной, иконка-кнопка),
  36px (чип, поле ввода сообщения).

## Границы

Разделители в RN — `hairlineWidth` (~0.5px):

```css
.hairline { border-bottom: 1px solid var(--border); }
@media (min-resolution: 2dppx) { .hairline { border-bottom-width: .5px; } }
```

---

# 5. Иконки

Библиотека — **lucide** (на вебе `lucide-react` или SVG-спрайт с теми же формами).

**Правила:** размер по умолчанию `20×20`, `stroke-width: 1.5`. Активное состояние — `stroke-width: 2`.
Характеристики в деталях объявления — `24×24`. Мелкие в бейджах — `16×16` или `12×12`.
Цвет — `currentColor` от `--foreground` или `--muted-foreground`.

**Полный перечень иконок по местам:**

| Место | Иконки |
|---|---|
| Таббар | `Search`, `Wrench`, `PlusCircle`, `MessageCircle`, `User` |
| Главная | `Search` (18px, stroke 2), `SlidersHorizontal` (20px) |
| Карточка объявления | `Heart` (16px), `Video` (12px) |
| Детали объявления — шапка | `ArrowLeft`, `Upload` (поделиться), `Heart` |
| Детали объявления — характеристики | `Calendar` (Год), `Settings` (Трансмиссия), `Fuel` (Топливо), `Car` (Кузов), `Gauge` (Пробег), `Palette` (Цвет), `Cog` (Привод), `Shield` (Состояние), `Users` (Владельцев), `FileText` (ПТС) |
| Детали объявления — прочее | `MapPin`, `Eye`, `ChevronDown`/`ChevronUp`, `Phone`, `MessageCircle`, `User`, `Check` |
| Сервисы — главные плитки | `Wrench` (Запчасти), `Car` (Авто прокат) |
| Сервисы — услуги | `Sparkles` (Автоподбор), `TruckIcon` (Эвакуатор), `ClipboardCheck` (Техосмотр), `Settings` (Автосервис), `ShieldCheck` (Страховка), `Droplets` (Автомойка), `CircleDot` (Шиномонтаж), `Star` (Детейлинг), `GraduationCap` (Автошкола) |
| Профиль — меню | `Globe` (Язык), `Palette` (Тема), `Bell` (Уведомления), `Smartphone` (О приложении), `FileText` (Условия), `Lock` (Конфиденциальность), `Star` (Рекомендации), `HelpCircle` (FAQ), `ChevronRight` |
| Профиль — карточки | `Package` (Мои объявления), `Heart` (Избранное), `BookOpen` (Бортжурнал), `Edit2` |
| Чат | `ArrowLeft`, `MoreVertical`, `Paperclip`, `AlertCircle`, `Ban`, `Trash2`, `FileText`, `Camera`, `Image`, `X`, `ChevronRight` |
| Сообщения | `MessageCircle`, `Bell` |
| Формы | `ChevronDown` (селект), `Check` (чекбокс/выбор), `Plus` (добавить своё), `X` (закрыть) |
| Состояния | `Search` (пусто), `AlertCircle` (ошибка), `WifiOff` (офлайн), `RefreshCw` (повторить) |
| Мастер | `ChevronLeft`, `X`, `Info`, `Check` |
| Категории объявления | `Car` (Легковые), `Bike` (Мото), `Truck` (Комтранс) |
| Рейтинги | `Star` (заливка `#FFD700`) |

---

# 6. Базовые компоненты

## 6.1. Кнопки

**Primary — чёрная, белый текст.**

```html
<button class="btn btn--primary">Войти</button>
```
```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-sans); border: none; cursor: pointer;
  transition: transform .15s ease, opacity .15s ease, background-color .15s ease;
}
.btn:active { transform: scale(.97); }
.btn--primary {
  height: 48px; padding-inline: 24px; border-radius: 24px;
  background: var(--primary); color: var(--primary-foreground);
  font-size: 15px; font-weight: 600;
}
```

Варианты по месту:

| Где | Стиль |
|---|---|
| «Войти» в профиле | `height: 48; radius: 24; width: 100%` |
| «Позвонить»/«Написать» в детали сервиса | `height: 48; radius: 24; flex: 1` |
| «Написать отзыв», «Отправить» | `height: 52; radius: 26; + тень 0 4px 12px rgba(0,0,0,.15)` |
| Кнопки мастера («Продолжить») | `height: 52; radius: 12; font-size: 16` |
| Кнопки предпросмотра («Опубликовать») | `height: 52; radius: 14; font-size: 16` |
| «Показать объявления» в фильтрах | `padding: 16px 0; radius: 8; font: 500 16px` |
| «Сбросить фильтры» в пустом состоянии | `padding: 12px 24px; radius: 8; font: 500 16px` |
| Мелкая кнопка «Создать» в бортжурнале | `padding: 8px 12px; radius: 8; font: 500 14px` |
| Кнопки в пустых состояниях активности | `padding: 12px 24px; radius: 12; font: 500 15px` |

**Outline — обводка.**

```css
.btn--outline {
  flex: 1; height: 52px;
  border: 1px solid var(--foreground); border-radius: 16px;
  background: transparent; color: var(--foreground);
  font-weight: 600;
}
/* вариант в детали автосервиса: height 48; radius 24; border-width 2px */
```

**Secondary — серая.**

```css
.btn--secondary {
  height: 52px; border-radius: 24px;      /* «Редактировать» в предпросмотре — radius 14 */
  background: var(--secondary); color: var(--foreground);
  font: 600 16px var(--font-sans);
}
```

**Destructive.**

```css
.btn--danger { height: 52px; border-radius: 26px; background: #FF3B30; color: #fff; font: 600 15px; }
.btn--danger-ghost {                       /* «Выйти из аккаунта» */
  height: 52px; border-radius: 26px; background: var(--card); color: #FF3B30;
  border: 1px solid rgba(255,59,48,.1); font: 600 15px;
}
```

**Icon button** — 40×40 (иногда 36×36), `border-radius: 20px`, прозрачный фон, при нажатии фон `--secondary`.

**Состояния нажатия** — обязательны для «нативного» ощущения:
кнопки и строки списков → фон `--secondary` или `opacity: .7….9`;
карточки → `scale(.96….97)`; таб таббара → `scale(.95)`.

## 6.2. Чипы

**Круглый чип** (быстрые фильтры, фильтры запчастей и проката):

```css
.chip {
  height: 36px; padding-inline: 16px; border-radius: 18px;
  background: var(--secondary); color: var(--foreground);
  font: 500 14px var(--font-sans);
  display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
}
.chip[aria-pressed="true"] { background: var(--primary); color: var(--primary-foreground); }
```

Вариант в шите фильтров: `padding: 8px 16px; border-radius: 9999px; background: #E5E5EA`.
Вариант в обсуждениях: `padding: 6px 12px; border-radius: 9999px; background: #F2F2F7;
color: #8E8E93` (активный — фон `#111`, текст белый).

**Прямоугольный чип-опция** (марка, кузов, цвет в фильтрах):

```css
.chip-option {
  padding: 8px 14px; border-radius: 8px; margin-right: 8px;
  background: var(--card); border: 1px solid var(--border);
  font-size: 14px; color: var(--foreground);
}
.chip-option[aria-pressed="true"] { background: #111; border-color: #111; color: #fff; }
```

Ряды чипов скроллятся горизонтально без видимого скроллбара.

**Бейдж-категория** (бортжурнал, обсуждения): `padding: 4px 8px; border-radius: 9999px;
font: 500 12px`, фон `rgba(17,17,17,.1)`, текст `#111`.

## 6.3. Поля ввода

```css
.input {
  height: 48px; padding-inline: 16px;
  border: 1px solid var(--border); border-radius: 12px;
  background: var(--card);
  font: 400 15px var(--font-sans); color: var(--foreground);
}
.input::placeholder { color: var(--muted-foreground); }
.input[aria-invalid="true"] { border-color: #E53935; }
```

| Разновидность | Стиль |
|---|---|
| Поле поиска на главной | `height: 40; radius: 20; background: var(--secondary); padding-inline: 12; gap: 8; font-size: 14` — без границы |
| Поиск в запчастях / прокате | `height: 44; radius: 12; background: #F2F2F7; padding-left: 40` (иконка слева, `left: 12`) |
| Поиск в обсуждениях | `height: 40; radius: 8; border: 1px solid var(--border); gap: 8; font-size: 15` |
| Диапазоны в фильтрах | `padding: 12px 16px; radius: 8; border: 1px; font-size: 16` |
| Поле профиля | `border-radius: 9999px; padding: 16px 20px; background: #F7F7F9; border: 1px solid rgba(0,0,0,.04); font-size: 15` |
| Био в профиле | то же, но `radius: 20; height: 72` + счётчик символов 11px `#C7C7CC` справа |
| Textarea отзыва | `height: 160; radius: 16; padding: 12px 16px; background: #F7F7F9; border: .5px solid rgba(0,0,0,.08); font-size: 15` |
| Textarea отзыва (создание) | `height: 150; radius: 8; border: 1px solid var(--border); padding: 12px 16px` |
| Поле сообщения в чате | `height: 36; radius: 20; background: #F2F2F7; padding-inline: 16; font-size: 15` |
| Поле сообщения в поддержке | `height: 36; radius: 18; border: 1px solid var(--border); background: transparent; padding-inline: 12` |
| Поле комментария | `border-radius: 9999px; padding: 8px 16px; border: 1px solid var(--border); font-size: 15` |
| Ячейка кода OTP | `56×56; border: 2px solid var(--border); radius: 16; font: 600 22px; text-align: center`. Заполненная → `border-color: #111`; ошибка → `#FF3B30` |
| Инпут шага мастера | `font-size: 24; border-bottom: 1px solid; padding-bottom: 12` — без рамки и фона |
| Инпут цены в мастере | `font: 600 28px; border-bottom: 1px` + суффикс «сомони» 18px |

**Селект** — это не `<select>`, а триггер, открывающий боттом-шит:

```css
.select-trigger {
  height: 48px; padding-inline: 16px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--card);
  display: flex; align-items: center; justify-content: space-between;
  font-size: 15px;
}
.select-trigger[data-empty] { color: var(--muted-foreground); }
/* справа иконка ChevronDown 20px */
```

## 6.4. Чекбокс

```css
.checkbox {
  width: 20px; height: 20px;
  border: 2px solid var(--border); border-radius: 6px;
  background: var(--card);
  display: grid; place-items: center; flex-shrink: 0;
}
.checkbox[data-checked] { background: var(--foreground); border-color: var(--foreground); }
/* галочка: Check 12×12, stroke-width 2.5, цвет var(--background) */
```
Строка: `display: flex; gap: 12px; align-items: center`, лейбл 16px/400.
Вариант в форме отзыва: `border-radius: 4; border-width: 1`.

## 6.5. Переключатель

```css
.switch { width: 48px; height: 28px; border-radius: 14px; background: #D1D1D6;
          padding: 2px; display: flex; align-items: center; transition: background .2s; }
.switch[data-on] { background: #000; }
.switch-thumb { width: 24px; height: 24px; border-radius: 12px; background: #fff;
                transition: transform .2s; }
.switch[data-on] .switch-thumb { transform: translateX(20px); }
```

В настройках уведомлений используется увеличенный вариант: трек `51×31; radius: 15.5`,
бегунок `27×27; radius: 13.5` с тенью `0 1px 2px rgba(0,0,0,.1)`.

## 6.6. Радиокнопка

Круг `24×24; border-radius: 12; border: 2px solid var(--border)`; выбранная — заливка
`var(--foreground)` с точкой/галочкой внутри. Используется в шитах выбора темы и языка.

## 6.7. Бейджи

| Тип | Стиль |
|---|---|
| Статус на фото | `padding: 4px 8px; radius: 6; font: 700 11px; color: #fff` + цвет статуса |
| Статус в деталях | `padding: 6px 12px; radius: 10; font: 600 13px; color: #fff` |
| Статус в предпросмотре | `padding: 4px 12px; radius: 20; background: rgba(255,255,255,.9); font: 600 12px; color: #000` |
| Видео на фото | `padding: 2px 6px; radius: 6; background: rgba(0,0,0,.7)`, иконка 12px |
| Счётчик непрочитанных | `18×18; radius: 9; background: #E53935; font: 500-600 11px; color: #fff` |
| Счётчик у таба | `padding: 2px 8px; radius: 9999; background: var(--muted); font-size: 12` |
| Счётчик непрочитанных уведомлений | `padding: 4px 8px; radius: 9999; background: rgba(17,17,17,.1); font: 500 12px` |
| Точка непрочитанного | `8×8; radius: 4; background: var(--foreground)` |

## 6.8. Карточка объявления

Две вариации: **grid** (по умолчанию, 2 в ряд) и **list**.

```
GRID (ширина = (440 − 32 − 12) / 2 ≈ 198px)
┌──────────────────────────┐
│  фото 4:3                │
│  ┌───┐          ┌──┐     │  бейджи: top 8, left 8, gap 4
│  │Нов│          │♥ │     │  избранное: top 8, right 8, 28×28, r14
│  └───┘          └──┘     │
│  ┌──┐                    │  видео: bottom 8, left 8
│  │▶ │                    │
├──────────────────────────┤
│ padding: 12px            │
│ Toyota Camry      14/500 │  1 строка, обрезка, mb 2
│ 2.5 Elegance      12/400 │  muted, mb 4
│ 285 000 сомони    16/700 │  mb 4
│ 2019              12/400 │  muted
└──────────────────────────┘
```

```html
<article class="ad-card">
  <div class="ad-card__media">
    <img src="…" alt="Toyota Camry">
    <div class="ad-card__badges"><span class="badge badge--new">Новый</span></div>
    <button class="ad-card__fav" aria-pressed="false"><!-- Heart 16 --></button>
    <div class="ad-card__video"><!-- Video 12 --></div>
  </div>
  <div class="ad-card__body">
    <h3 class="ad-card__title">Toyota · Camry</h3>
    <p class="ad-card__version">2.5 Elegance</p>
    <p class="ad-card__price">285 000 сомони</p>
    <p class="ad-card__specs">2019</p>
  </div>
</article>
```

```css
.ad-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-card);
  transition: transform .15s ease;
}
.ad-card:active { transform: scale(.97); }
.ad-card__media { position: relative; aspect-ratio: 4/3; }
.ad-card__media img { width: 100%; height: 100%; object-fit: cover; }
.ad-card__fav {
  position: absolute; top: 8px; right: 8px; z-index: 10;
  width: 28px; height: 28px; border-radius: 14px;
  background: rgba(0,0,0,.2); backdrop-filter: blur(4px);   /* [блюр] */
  display: grid; place-items: center; border: none;
}
.ad-card__badges { position: absolute; top: 8px; left: 8px; display: flex; gap: 4px; }
.ad-card__video {
  position: absolute; bottom: 8px; left: 8px;
  padding: 2px 6px; border-radius: 6px; background: rgba(0,0,0,.7);
  display: flex; align-items: center; gap: 2px;
}
.ad-card__body { padding: 12px; }
.ad-card__title   { font: 500 14px var(--font-sans); color: var(--foreground); margin-bottom: 2px; }
.ad-card__version { font: 400 12px var(--font-sans); color: var(--muted-foreground); margin-bottom: 4px; }
.ad-card__price   { font: 700 16px var(--font-sans); color: var(--foreground); margin-bottom: 4px; }
.ad-card__specs   { font: 400 12px var(--font-sans); color: var(--muted-foreground); }
.ad-card__title, .ad-card__version, .ad-card__specs {
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
```

Сердце: 16×16, `stroke-width: 2`, цвет `#FFFFFF`; в избранном — `#E53935` с заливкой.

**Формирование заголовка:** если есть версия → заголовок `«{марка} · {модель}»` и версия отдельной
строкой; иначе `«{марка} {модель}»`. Для запчасти — её название или «Запчасть».
**Цена:** `285 000 сомони` — разряды разделены пробелами (`toLocaleString('ru-RU')` с заменой запятых
на пробелы).
**Характеристики:** строка вида `2019` (год).

**List-вариация:** горизонтальный ряд, фото `128×128` слева, контент `flex: 1` с `padding: 12px`
и `justify-content: space-between`. Радиус 20 и тень те же.

## 6.9. Карточка «похожего» объявления

```css
.similar-card {
  background: var(--card); border: 1px solid rgba(0,0,0,.06);
  border-radius: 16px; overflow: hidden;
}
.similar-card__media { aspect-ratio: 4/3; background: var(--secondary); }
.similar-card__fav {                     /* светлая, в отличие от обычной карточки */
  position: absolute; top: 8px; right: 8px; width: 32px; height: 32px;
  border-radius: 16px; background: rgba(255,255,255,.9);
}
.similar-card__body { padding: 12px; }
/* title 15/600 mb4 · price 17/700 mb8 (валюта внутри 14/400 muted)
   specs 13/400 muted mb4 · location 13/400 muted */
```

---

# 7. Навигация и карта экранов

## 7.1. Нижний таббар

Плавающая «пилюля», не приклеенная к краю панель.

```
       ┌──────────────────────────────────────┐  ← max-width 340, r24
       │  🔍     🔧     ⊕     💬     👤       │
       │ Поиск Сервисы Добавить Сообщ. Профиль│
       └──────────────────────────────────────┘
   ← 24px →                            ← 24px →     (контейнер max-width 448)
                    ↓ padding-bottom: max(safe-area, 16px)
```

```html
<nav class="tabbar-wrap">
  <div class="tabbar">
    <button class="tabbar__item" aria-current="page">
      <span class="tabbar__capsule"></span>
      <!-- Search 20 --><span class="tabbar__label">Поиск</span>
    </button>
    …
  </div>
</nav>
```

```css
.tabbar-wrap {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
  pointer-events: none;
  max-width: 448px; margin-inline: auto; padding-inline: 24px;
  padding-bottom: max(env(safe-area-inset-bottom, 0px), 16px);
}
.tabbar {
  pointer-events: auto;
  max-width: 340px; margin-inline: auto;
  display: grid; grid-template-columns: repeat(5, 1fr);
  padding: 6px 8px; border-radius: 24px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,.9);
  backdrop-filter: blur(20px);                          /* [блюр] */
  box-shadow: var(--shadow-float);
}
:root[data-theme="dark"] .tabbar { background: rgba(28,28,30,.9); }
.tabbar__item {
  position: relative; border: none; background: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; padding: 6px; border-radius: 20px;
  transition: transform .15s ease;
}
.tabbar__item:active { transform: scale(.95); }
.tabbar__capsule {
  position: absolute; inset: 0; border-radius: 20px;
  background: var(--secondary); z-index: 0;
  animation: capsule-in .25s cubic-bezier(.2,.8,.2,1);
}
.tabbar__item > svg, .tabbar__label { position: relative; z-index: 1; }
.tabbar__label { font-size: 8px; font-weight: 500; }
@keyframes capsule-in { from { transform: scale(.9); opacity: 0 } to { transform: none; opacity: 1 } }
```

- **Активный:** иконка `--foreground`, `stroke-width: 2`, подпись `opacity: 1`.
- **Неактивный:** иконка `--muted-foreground`, `stroke-width: 1.5`, подпись `opacity: .75`.
- Таб **«Добавить»** — не экран: требует авторизации и открывает выбор категории объявления.
  Если пользователь не авторизован — сначала показывается экран входа.

## 7.2. Шапки экранов

Пять типов:

**A. Заголовок по центру, высота 56px** — Профиль, Сервисы, О приложении, FAQ, Условия,
Конфиденциальность, Рекомендации, Настройки уведомлений, Центр уведомлений.

```css
.header { padding-top: env(safe-area-inset-top); background: var(--card); }
.header__bar { height: 56px; display: grid; place-items: center; }
.header__title { font: 600 17px var(--font-sans); }
.header__divider { height: 1px; background: var(--border); }
```

**B. Крупный заголовок слева, padding 16px** — Сообщения (20/600, по центру),
Мои объявления, Бортжурнал, Отзывы, Обсуждения, Уведомления, Моя активность (20/600, слева,
рядом кнопка «назад»), Избранное (24/600 + подпись).

**C. Назад / заголовок / действия** — детали объявления, детали запчасти, профиль продавца.
`height: 56; padding-inline: 16; display: flex; justify-content: space-between`,
иконки-кнопки 40×40. В деталях объявления заголовок скрыт (`opacity: 0`) и проявляется при
`scrollY > 200px`.

**D. Шапка мастера объявления** — `←` / заголовок + «Шаг N из 21» (13/400 muted) / `✕`.
Высота 56px, `border-bottom: 1px solid #EDEDED`. Крестик открывает диалог подтверждения выхода.

**E. Плавающая шапка главной** — без фона и разделителя, см. [10.1](#101-поиск-главная).

## 7.3. Полная карта экранов

```
ТАББАР (5 вкладок)
├── Поиск ─────────── главная: поиск + сетка объявлений
│   └── Детали объявления
│       ├── Профиль продавца
│       │   └── Отзывы о продавце
│       └── Чат с продавцом
├── Сервисы ───────── хаб сервисов
│   ├── Запчасти (маркетплейс)
│   │   └── Детали запчасти
│   ├── Авто прокат
│   │   └── Профиль владельца
│   │       └── Отзывы о владельце
│   └── Категории услуг
│       └── Список исполнителей
│           └── Карточка исполнителя
│               └── Отзывы об исполнителе
├── Добавить ──────── (проверка авторизации) → Выбор категории → Мастер объявления
├── Сообщения ─────── список чатов
│   ├── Чат
│   ├── Чат с поддержкой
│   └── Центр уведомлений
└── Профиль ───────── меню
    ├── Редактирование профиля
    ├── Избранное
    ├── Мои объявления
    ├── Мои запчасти
    ├── Бортжурнал → Создание записи / Детали записи
    ├── Моя активность → Отзывы (→ Создание отзыва) / Обсуждения (→ Детали обсуждения)
    ├── Уведомления
    ├── Настройки → Настройки уведомлений / Тема / Язык
    ├── О приложении
    ├── Условия соглашения
    ├── Политика конфиденциальности
    ├── Правила рекомендаций
    └── Часто задаваемые вопросы
```

## 7.4. Переходы

- **Push/pop** — горизонтальный iOS-слайд: новый экран въезжает справа, предыдущий сдвигается
  влево примерно на 30% с лёгким затемнением. ~300–350 мс, `cubic-bezier(.2,.8,.2,1)`.
- **Swipe-back** — жест от левого края, зона захвата **50px**.
- **Экраны-модалки** (создание записи бортжурнала, выбор темы, выбор языка) открываются снизу вверх
  поверх затемнения; свайп-назад для них отключён.

```css
@keyframes slide-in-right { from { transform: translateX(100%) } to { transform: none } }
@keyframes slide-out-left { from { transform: none } to { transform: translateX(-30%); opacity: .85 } }
```

---

# 8. Оверлеи: шиты, модалки, тосты

## 8.1. Боттом-шит

```css
.sheet-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 100; }
.sheet {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 101;
  max-width: 440px; margin-inline: auto;
  background: var(--card);
  border-radius: 24px 24px 0 0;
  max-height: 80%;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-sheet);
  animation: sheet-up .3s cubic-bezier(.2,.8,.2,1);
}
.sheet__handle {
  width: 40px; height: 4px; border-radius: 2px;
  background: rgba(128,128,128,.4); margin: 8px auto 4px;
}
@keyframes sheet-up { from { transform: translateY(100%) } to { transform: none } }
```

Радиусы по типам шитов: **16px** — фильтры; **20px** — действия в чате, сортировка запчастей,
подтверждение выхода, настройки уведомлений, язык; **24px** — выбор значения (селект);
**28px** — выбор темы.

Затемнение: `rgba(0,0,0,.5)` (фильтры, чат, тема, язык), `rgba(0,0,0,.4)` (сортировка,
подтверждение выхода, настройки), `rgba(0,0,0,.1)` (селект).

**Жест закрытия:** тянуть вниз; закрывается при смещении **> 80px** или скорости **> 500 px/s**,
иначе пружиной возвращается на место.

**Шит выбора значения (селект).** Шапка `padding: 16px`: слева распорка 40px, по центру заголовок
17/600, справа `✕` 40×40; снизу разделитель. Пункт: `padding: 12px 16px`, текст 15/400, у выбранного
справа `Check` 20px. Разделители между пунктами `height: 1px; margin-inline: 16px`.
Опционально внизу строка «Добавить» с иконкой `Plus`. Нижний спейсер 32px.

**Шит действий (чат, вложения).** Радиус 20px, ручка `48×4` цвета `#E5E5EA`,
пункты `padding: 14px 16px; radius: 12; gap: 12`, отдельная кнопка «Отмена»
`background: var(--secondary); radius: 12; padding-block: 14; font: 600 15px`.

## 8.2. Шит фильтров

```
┌───────────────────────────────────┐ ← высота 85vh, радиус сверху 16
│  Фильтры              Сбросить    │ ← p16, 20/600 · 14/500 muted, hairline снизу
├───────────────────────────────────┤
│ [До 100 000] [Автомат] [С фото] → │ ← круглые чипы, гориз. скролл, p16, hairline
├───────────────────────────────────┤
│ Марка / Модель                 ⌃  │ ← аккордеон: p16, 16/500 + Chevron 20 muted
│   Марка                    14 mut │ ← mb 8
│   [Любая] [Toyota] [Hyundai] →    │ ← чипы-опции
│   Модель (появляется после марки) │
│ Цена                           ⌄  │ ← «От / До» + подпись «Валюта: сомони» 12 muted
│ Год                            ⌄  │ ← плейсхолдеры 1976 / 2026
│ Пробег                         ⌄  │ ← плейсхолдеры 0 / ∞
│ Технические                    ⌄  │ ← Двигатель, Коробка, Привод, Кузов
│ Дополнительно                  ⌄  │ ← Цвет, Владельцев, ПТС, 2 переключателя
├───────────────────────────────────┤
│ ┌───────────────────────────────┐ │ ← p16, hairline сверху
│ │  Показать объявления (3)      │ │ ← чёрная, r8, py16, 16/500
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

Диапазон «От / До» — два инпута в ряд, `gap: 12px`, над каждым лейбл 14/400 muted.
Строка с переключателем: `padding: 12px; background: rgba(229,229,234,.5); border-radius: 8px;
margin-top: 12px`. По умолчанию раскрыт только аккордеон «Марка / Модель».
Счётчик в кнопке — количество применённых фильтров.

## 8.3. Центрированная модалка

```css
.modal-backdrop {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,.4);              /* удаление аккаунта — .5 */
  display: grid; place-items: center; padding: 16px;
}
.modal {
  width: 100%; max-width: 320px;           /* удаление — 340; подтверждение действия — 384 */
  background: var(--card); border-radius: 20px;  /* удаление — 24 */
  overflow: hidden; box-shadow: var(--shadow-modal);
}
.modal__body { padding: 24px 24px 16px; text-align: center; }
.modal__title { font: 600 17px var(--font-sans); margin-bottom: 8px; }
.modal__text  { font: 400 15px var(--font-sans); color: var(--muted-foreground); }
.modal__buttons { display: flex; border-top: 1px solid var(--border); }
.modal__btn { flex: 1; height: 48px; display: grid; place-items: center; font: 500 15px; }
.modal__btn--cancel  { color: #007AFF; }
.modal__btn--confirm { color: #FF3B30; font-weight: 600; }
```

Модалка удаления аккаунта: круг `64×64; radius: 32; background: #FFE5E5` с иконкой,
заголовок 20/700, текст 15/400 muted `line-height: 22`, кнопки `height: 52`, разделённые линией.

**Диалог выхода из мастера** — боттом-шит, а не центр: ручка `40×4`, заголовок 20/700 по центру,
текст 15/400 muted по центру, две кнопки `height: 52; radius: 24` — чёрная «Продолжить заполнение»
и серая «Выйти».

## 8.4. Тост

```css
.toast {
  position: fixed; top: 8px; left: 50%; transform: translateX(-50%); z-index: 300;
  max-width: calc(440px - 32px);
  background: var(--foreground); color: var(--background);
  border-radius: 12px; padding: 12px 16px; font-size: 14px;
}
```

## 8.5. Полноэкранная галерея

Открывается по тапу на фото в записи бортжурнала: фон `#000`, кнопка закрытия
`top: 48; right: 16; padding: 8; border-radius: 9999; background: rgba(255,255,255,.1)`,
точки-индикаторы внизу (`bottom: 48; gap: 8`, активная белая, остальные `rgba(255,255,255,.5)`).

---

# 9. Состояния: загрузка, пусто, ошибка

## 9.1. Пусто

```
        ┌────────┐
        │  🔍    │   круг 80×80, r40, bg var(--muted); иконка 40px stroke 1.5 muted
        └────────┘
     Ничего не найдено       18/600, mb 8
  Попробуйте изменить …      14/400 muted, mb 24, max-width 384, по центру
   [ Сбросить фильтры ]      px24 py12 r8, bg primary, 16/500
```
Контейнер: `padding: 64px 16px; text-align: center`.

Варианты кругов на других экранах: `64×64; radius: 32` (центр уведомлений — фон `#F2F2F7`,
моя активность, ошибки — фон `#FEE2E2`, успех — `#EAF7EE`).

## 9.2. Ошибка

Тот же каркас; круг под иконкой `rgba(255,59,48,.1)`, иконка `AlertCircle` цвета `--destructive`.
Тексты: **«Не удалось загрузить объявления»** / «Произошла ошибка при загрузке данных»,
кнопка **«Повторить»** с иконкой `RefreshCw` 16px и `gap: 8px`.

Офлайн: иконка `WifiOff`, круг `var(--muted)`, **«Нет подключения к интернету»** /
«Проверьте подключение к сети и попробуйте снова».

В списке чатов ошибка проще: эмодзи ⚠️ 40px, текст 15/500 «Не удалось загрузить сообщения»,
кнопка-обводка «Повторить» `padding-inline: 24; height: 44; radius: 20; border: 1px solid var(--border)`.

## 9.3. Загрузка (скелетоны)

Пульсация `opacity` 1 ↔ .5 по 1000 мс `ease-in-out` бесконечно (в списке чатов — .4 ↔ 1 по 800 мс).

```css
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .5 } }
.skeleton { animation: pulse 2s ease-in-out infinite; background: var(--muted); border-radius: 4px; }
```

| Тип | Состав |
|---|---|
| Список объявлений | 4 карточки, `padding: 16; gap: 16`; карточка r12 + border; фото 128×128; 4 линии высотой 16/12/20/12 и шириной 75%/50%/33%/66%, `gap: 12` |
| Сетка объявлений | 6 карточек шириной 48.5%, r12; фото 4:3; линии 16/12/20/12 шириной 100%/66%/50%/75%, `gap: 8` |
| Список чатов | строка `height: 72`, круг 40px + линии 14px/60% и 12px/40% |
| Карточки бортжурнала/отзывов | карточка r12 + border, `padding: 16`; круг 40px + линии по 16px |
| Уведомления | строка `padding: 16; gap: 12`; круг 32px + линии 16px |
| Центр уведомлений | пузырь `max-width: 85%; radius: 20; padding: 12; background: #F2F2F7` + линии 192px и 128px |

---

# 10. Экраны

## 10.1. Поиск (главная)

```
   ┌───────────────────────────────────────┐
   │ ┌───────────────────────────────────┐ │ ← px16 py12, липкая, фон прозрачный
   │ │ ┌──────────────────────┐ ┌───┐    │ │   белый контейнер r28, p12, gap12, shadow-float
   │ │ │ 🔍 Поиск автомобилей │ │ ⚙ │    │ │   поле: h40 r20 bg secondary, иконка 18 stroke 2
   │ │ └──────────────────────┘ └───┘    │ │   кнопка: 40×40 r20 bg secondary
   │ └───────────────────────────────────┘ │   активные фильтры → кнопка чёрная, иконка белая
   ├───────────────────────────────────────┤
   │             autoTOJ                   │ ← блок py28; 30px/900, letter-spacing −1
   │      Покупка, продажа и сервисы       │ ← 14/400 muted, mt6
   │  ┌────────────┐  ┌────────────┐       │ ← сетка 2 колонки, px16, gap12
   │  │  AdCard    │  │  AdCard    │       │
   │  └────────────┘  └────────────┘       │
   └───────────────────────────────────────┘
```

- Шапка липкая (`position: sticky; top: 0; z-index: 40`), **фон прозрачный** — карточки проезжают
  под ней. Сверху отступ = safe-area.
- Логотип скроллится вместе с контентом (он не в шапке): `auto` — `#E53935`, `TOJ` — `--foreground`.
- Плейсхолдер поля: **«Поиск автомобилей»**.
- Есть pull-to-refresh (на вебе опционально).
- Пустой результат → пустое состояние с иконкой `Search`, заголовком **«Ничего не найдено»**,
  текстом «Попробуйте изменить параметры поиска или фильтры» и кнопкой **«Сбросить фильтры»**.
- Поиск фильтрует по марке, модели и версии; фильтры применяются на клиенте.

## 10.2. Детали объявления

```
┌────────────────────────────────────────┐
│ ←     [Toyota Camry ...]      ⤴   ♥   │ ← h56; заголовок появляется при scroll > 200
├────────────────────────────────────────┤
│                                  ┌───┐ │
│           фото 4:3               │1/8│ │ ← счётчик: top16 right16, rgba(0,0,0,.6), r8, 14/500
│         (свайп-галерея)          └───┘ │
│  ┌──┐              ▬▬ ·  ·  ·          │ ← точки: bottom16 gap8; активная 24×8, прочие 8×8
│  │▶ │                                  │ ← бейдж «Видео»: bottom16 left16
├────────────────────────────────────────┤ px16 pt16, между секциями 16px
│ Toyota Camry 2.5 Elegance      22/600  │ ← mb 8
│ 285 000 сомони                 28/700  │ ← mb 8
│ 📍 12 марта, Душанбе      👁 1 240     │ ← 15/400 muted, space-between, mb 12
│ • Торг возможен  • Обмен возможен      │ ← 15/400 foreground, gap 12, mb 12
│ [В наличии] [Растаможен]               │ ← бейджи r10, 13/600, gap 8
│                                        │
│ Характеристики                 17/600  │ ← mb 12
│ ┌────────────────────────────────────┐ │ ← карточка r24, p20, shadow-panel
│ │ 📅 Год        ⚙ Трансмиссия        │ │ ← сетка 2 колонки (по 47%), gap 16
│ │    2019          Автомат           │ │   иконка 24 в боксе 40×40; лейбл 13 muted mb4
│ │ ⛽ Топливо    🚗 Кузов             │ │   значение 17/600
│ │ 📊 Пробег     🎨 Цвет              │ │
│ │            Подробнее ⌄             │ │ ← mt16 py12, 15/500 + Chevron
│ └────────────────────────────────────┘ │
│                                        │
│ Комплектация                           │
│ ┌────────────────────────────────────┐ │
│ │ ┌──────────┐ ┌──────────┐          │ │ ← плитки 47%, bg secondary, r16, p16
│ │ │Безопасн.6│ │Комфорт  4│          │ │   название 15/500 · счётчик 17/700 muted
│ │ └──────────┘ └──────────┘          │ │
│ │ [        Все опции         ]       │ │ ← py16, bg secondary, r16, 15/500
│ └────────────────────────────────────┘ │
│                                        │
│ Описание                       17/600  │ ← 15/400; свёрнуто до 4 строк
│ ┌────────────────────────────────────┐ │   ссылка «Показать полностью» / «Скрыть» 15/500
│ └────────────────────────────────────┘ │   (показывается, если описание > 150 символов)
│                                        │
│ Продавец                       17/600  │
│ ┌────────────────────────────────────┐ │ ← p16, r16, border .5px
│ │ (👤) Асрор Каримов                 │ │   аватар 48 круг bg secondary
│ │      12 объявлений  Смотреть профиль│ │   имя 15/600 mb2 · счётчик 13/400 muted
│ └────────────────────────────────────┘ │   ссылка 13/500 #007AFF
│                                        │
│ Похожие объявления             17/600  │ ← сетка 2 колонки, gap 12
├────────────────────────────────────────┤
│ [ 📞 Позвонить ] [ 💬 Написать ]       │ ← fixed снизу; h52, обводка #111, r16, gap12
└────────────────────────────────────────┘   фон rgba(255,255,255,.8) [блюр], border-top .5px
```

**Склонение счётчика объявлений:** 1 → «объявление», 2–4 → «объявления», 5+ → «объявлений».
**Формат даты:** `12 марта, Душанбе` (день + месяц в родительном падеже + город).
**Категории комплектации:** Безопасность, Комфорт, Салон, Мультимедиа — показываются только
непустые, число справа — количество опций.
**Модалка «Все опции»:** полноэкранная, шапка `padding: 16px 20px` с кнопкой назад 36×36,
заголовком 20/700 и подзаголовком (название авто) 13/400 muted; далее секции с заголовком 20/700
и пунктами-буллитами (точка 4×4, текст 15/400, `gap: 12`, `margin-bottom: 12`), отступы `padding: 24px 20px`, между секциями 32px.

## 10.3. Профиль продавца

```
│ ←         Продавец            ⤴        │ ← h56, фон rgba(255,255,255,.85) [блюр], z-50
├────────────────────────────────────────┤
│                                        │
│         баннер 180px (bg secondary)    │
│  ┌────┐                                │ ← аватар 80×80, r40, border 4px белый
│  │ 👤 │  ← bottom −40, left 16         │   тень 0 4px 12px rgba(0,0,0,.12)
├──└────┘────────────────────────────────┤ ← контент pt56 px16 pb24
│ Асрор Каримов                  22/700  │ ← mb 8
│ ⭐ 4.8  (24 отзывов)                    │ ← звезда #FFD700 16px; оценка 15/600
│ 📍 Душанбе                             │   ссылка отзывов 14/400 muted, подчёркнута
│ ┌──────────────┐ ┌──────────────┐      │ ← gap 8, mt 16
│ │ 📞 Позвонить │ │ 💬 Написать  │      │   обе h48 r24; левая bg secondary + border .5
│ └──────────────┘ └──────────────┘      │   правая чёрная + тень 0 2px 8px rgba(0,0,0,.16)
│ Объявления (12)                17/600  │ ← px16, mb 12
│ ┌────────┐ ┌────────┐                  │ ← сетка 2 колонки, gap 12
```

## 10.4. Отзывы (о продавце / владельце / исполнителе)

```
│ ←         Отзывы                       │ ← h56, заголовок по центру 17/600
│ ┌────────────────────────────────────┐ │ ← px16 py24
│ │              4.8                   │ │ ← карточка r20 p24, border .5, shadow 0 4px 16px .06
│ │           ⭐⭐⭐⭐⭐                  │ │   оценка 48/700 mb8; звёзды 20px gap4 mb8
│ │          24 отзыва                 │ │   счётчик 14/400 muted
│ └────────────────────────────────────┘ │
│ [    ✎  Написать отзыв             ]  │ ← h52 r26 чёрная + тень 0 4px 12px .15
│ Отзывы                         18/700  │ ← mb 16
│ ┌────────────────────────────────────┐ │ ← карточка r16 p16, border .5, shadow 0 2px 8px .04
│ │ (👤) Алишер                        │ │   аватар 40 круг; имя 15/600 mb4
│ │      ⭐⭐⭐⭐⭐                       │ │   звёзды 14px gap2 mb4
│ │      12 января 2026                │ │   дата 13/400 muted
│ │ Отличный продавец, всё честно      │ │   текст 14/400 lh22
│ └────────────────────────────────────┘ │
```

Форма отзыва: имя адресата 18/700, роль 14/400 muted; лейбл секции 15/600 mb12;
выбор звёзд — ряд из 5 иконок `gap: 12`, размер ~32px; textarea `height: 160; radius: 16;
background: #F7F7F9`; кнопка отправки `h52 r26` чёрная.
Тосты: **«Отзыв добавлен!»**, ошибки — «Напишите текст отзыва», «Не удалось отправить отзыв».

## 10.5. Сервисы

```
│              Сервисы            17/600 │ ← h56 + hairline
│  ┌──────────────┐ ┌──────────────┐     │ ← px16 pt16, 2 колонки, gap 12
│  │  ┌────┐      │ │  ┌────┐      │     │   карточка r20 p20, border 1px rgba(0,0,0,.04)
│  │  │ 🔧 │      │ │  │ 🚗 │      │     │   тень 0 4px 12px rgba(0,0,0,.06)
│  │  └────┘      │ │  └────┘      │     │   иконбокс 52×52 r16; #1a1a1a / #2d2d2d
│  │  Запчасти    │ │  Авто прокат │     │   иконка 26px белая, stroke 1.8, mb 12
│  │  Покупка и…  │ │  Аренда авто │     │   title 15/700 lh20 mb4 · desc 13/400 muted lh17
│  └──────────────┘ └──────────────┘     │
│  Услуги                        22/700  │ ← mt24 mb12
│  ┌──────┐ ┌──────┐ ┌──────┐            │ ← 3 колонки, gap 8
│  │ ✨   │ │ 🚚   │ │ ✅   │            │   карточка r20 p16
│  │Автопо│ │Эвакуа│ │Техосм│            │   иконбокс 44×44 r14 bg #F7F7F9, иконка 22px
│  └──────┘ └──────┘ └──────┘            │   title 13/700 lh17
│  (всего 9 плиток)                      │
```

Тёмная тема: фон иконбокса услуг `rgba(255,255,255,.08)`, иконка `--foreground`.
Нажатие: крупные плитки `scale(.96)`, мелкие `scale(.94)`.

## 10.6. Категории услуг и исполнители

**Список категорий:** сетка карточек `r20 p20`, иконбокс `52×52 r16`, заголовок 15/700 mb4,
счётчик исполнителей 13/500 muted. Внизу инфоблок: `margin: 8px 16px 0; background: #F7F7F9;
border-radius: 18px; padding: 20px; border: 1px solid rgba(0,0,0,.04)`, текст 14/400 muted `lh21`
с выделенными словами 700 цвета `--foreground`.

**Список исполнителей:** карточки `r16 p16, border 1px #EAEAEA, shadow 0 2px 8px rgba(0,0,0,.06)`,
`gap: 12`. Верхний ряд: фото `80×80 r12` + информация (имя 17/600 mb4; ряд рейтинга — звезда,
оценка 14/500, «(N отзывов)» 13/400 muted, mb8; цена 15/600). Далее описание 14/400 muted `lh21` mb12
и строки-инфо с иконкой 16px и текстом 13/400 muted (`gap: 8; margin-bottom: 6`): адрес, телефон,
график работы (дни недели сокращённо: Пн, Вт, Ср, Чт, Пт, Сб, Вс; «Закрыто»).

**Карточка исполнителя:** обложка `height: 200; background: #F7F7F9`; блок информации `padding: 16px`:
имя 24/700 mb8, ряд рейтинга (звезда + оценка 15/600 + «N отзывов» 14/400 muted), описание 15/400
`lh: 22.5` mb16; инфо-карточки `background: #F7F7F9; radius: 12; padding: 12; gap: 12`
(лейбл 13/400 muted mb2, значение 15/500), между ними `gap: 8`; внизу две кнопки в ряд `gap: 12`:
чёрная «Написать» `h48 r24` и обводка «Позвонить» `h48 r24 border 2px #111`.

## 10.7. Запчасти

```
│ ←         Запчасти              ＋     │ ← h56; кнопка добавления 40×40 r20 bg rgba(0,0,0,.05)
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │ ← px16 pt16 pb12
│ │ 🔍  Поиск запчастей                │ │   h44 r12 bg #F2F2F7, иконка слева (left 12)
│ └────────────────────────────────────┘ │   текст с отступом слева 40px, 15/400
│ [Все] [Двигатель] [КПП] [Ходовая] →   │ ← чипы-фильтры h36 r18, gap 8
│ ┌────────┐ ┌────────┐                  │ ← сетка 2 колонки, gap 12, px16
│ │ фото 1:1│ │        │                 │   карточка r12, border 1px, фото квадратное
│ │ [Новый] │ │        │                 │   бейдж состояния: top8 left8, r6, 11/500
│ ├─────────┤ ├────────┤                 │   «Новый» #34C759 · «Б/у» #FF9500
│ │Тормозные│ │        │                 │   title 14/500
│ │колодки  │ │        │                 │   price 15/700
│ │450 сомони│ │       │                 │   meta 12/400 muted (город · дата)
│ │Душанбе  │ │        │                 │
│ └─────────┘ └────────┘                 │
```

Пустые состояния: «Ничего не найдено. Попробуйте другой запрос» /
«Пока нет объявлений. Добавьте первую запчасть»; ошибка — «Не удалось загрузить запчасти»
с синей кнопкой «Повторить» (`background: #007AFF; radius: 10; padding: 10px 24px`).

**Детали запчасти.** Фон экрана `#F8F8F8` (не белый!). Шапка фиксированная поверх галереи
(`position: absolute; top: 0`), контент отступает на 56px. Галерея 4:3 со счётчиком и точками
как в деталях объявления. Контент `padding: 16; gap: 12`:

- Карточка информации `background: #FFF; radius: 20; padding: 20; shadow 0 1px 2px rgba(0,0,0,.05)`:
  название 22/700 `lh28` mb12; блок цены `background: #F8F8F8; radius: 16; padding: 16; mb12`
  (лейбл «Цена» 13/400 muted mb4, значение 28/700, валюта 18px muted); дата и город 13/400 muted.
- Карточка характеристик: заголовок 18/700 mb16; строки `padding-block: 8`, лейбл 15/400 muted
  слева, значение 15/600 справа; часть значений — бейджи `padding: 6px 12px; background: #F8F8F8;
  radius: 10; font: 600 14px`. Поля: Состояние, Количество, Бренд, Модель, Год, Размер.
- Описание: текст 15/400 `lh22`, ссылка «Показать полностью» / «Скрыть» 15/600 `#007AFF` с шевроном.
- Похожие: сетка 2 колонки (карточки 48%, r16).

## 10.8. Авто прокат

```
│ ←         Авто прокат           ＋     │ ← h56, заголовок 18/600 по центру
│ ┌────────────────────────────────────┐ │ ← px16 py12
│ │ 🔍  Поиск автомобилей              │ │   h44 r12 bg #F2F2F7, отступ текста 40px, 16/400
│ └────────────────────────────────────┘ │
│ [Все] [Автомат] [Механика] [Цена] →   │ ← чипы h36 r18, gap 8, py12
│ ┌────────┐ ┌────────┐                  │ ← сетка 2 колонки, gap 12, padding 16
│ │ фото 4:3│ │        │                 │   карточка r16, тень 0 2px 8px rgba(0,0,0,.06)
│ ├─────────┤ ├────────┤                 │   без границы
│ │Toyota…  │ │        │                 │   title 14/600 mb4
│ │⚙ Автомат│ │        │                 │   строка трансмиссии: иконка + 12/400 muted, mb8
│ │350 сомони│ │       │                 │   price 15/700 mb4 + «/ день» 12/400 muted
│ │12 марта │ │        │                 │   дата 12/400 muted
│ └─────────┘ └────────┘                 │
```

Пустые состояния: «Ничего не найдено» / «Пока нет объявлений»;
ошибка — «Не удалось загрузить автомобили» + синяя кнопка «Повторить».
Профиль владителя и его отзывы построены так же, как профиль продавца ([10.3](#103-профиль-продавца))
и экран отзывов ([10.4](#104-отзывы-о-продавце--владельце--исполнителе)).

## 10.9. Сообщения

```
│             Сообщения           20/600 │ ← padding 16 + hairline
│  ┌──────────────┐ ┌──────────────┐     │ ← px16 py16, gap 12
│  │Чат с поддерж.│ │Центр уведом.③│     │   h48 r16, border 1px, shadow-card, 15/500 lh20
│  └──────────────┘ └──────────────┘     │   бейдж: 18×18 #E53935 r9, top −4 right −4, 11/600
│  ЧАТЫ                           13/600 │ ← px16 py8, muted, letter-spacing .5
│  ┌──┐ Асрор Каримов          14:32     │ ← строка h72, px16 py12, gap 12
│  │ А│ Toyota Camry 2019               │   аватар 40 круг bg #E5E5EA, буква 16/500 #6B7280
│  └──┘ Здравствуйте, ещё актуально? ②  │   имя 15/500 (mb4) · время 12/400 muted
│  ───────────────── (отступ слева 68) ──│   авто 13/400 #6B7280 (mb2)
│  ┌──┐ …                                │   сообщение 14/400 #3A3A3C · бейдж 18×18
```

**Формат времени:** сегодня → `14:32`; вчера → `Вчера`; раньше → `12.03`.
Пусто: иконка `MessageCircle` 48px muted, «Нет сообщений» 16/500 (mt16 mb8),
«Здесь будут ваши чаты с продавцами и поддержкой» 14/400 muted по центру, `padding: 96px 32px`.

## 10.10. Чат

```
│ ← (👤) Асрор Каримов              ⋮   │ ← h56
├────────────────────────────────────────┤
│ ┌──┐ Toyota Camry 2019           ›     │ ← плашка объявления: m 12px 16px 8px, gap 12
│ │📷│ Активно                            │   фото 40×40 r8; title 14/500; статус 12/400 muted
│ └──┘                                    │
├────────────────────────────────────────┤ ← px16, gap 8
│  ┌──────────────────────┐               │ ← входящее: bg #F2F2F7, r16 с левым нижним 4
│  │ Здравствуйте!        │               │   текст 15/400, padding 8px 12px, max-width 75%
│  └──────────────────────┘               │
│  14:32                                  │ ← 11/400 muted, mt4
│               ┌──────────────────────┐  │ ← исходящее: bg #E5E5EA, r16 с правым нижним 4
│               │ Да, актуально        │  │
│               └──────────────────────┘  │
├────────────────────────────────────────┤
│ 📎  ┌──────────────────────────┐   ➤   │ ← строка h56, px16 py8, gap 12, border-top
│     │ Сообщение…               │       │   поле h36 r20 bg #F2F2F7, px16, 15/400
│     └──────────────────────────┘       │
```

Статусы: отправляется — кружок-спиннер 10×10 (`border: 2px solid rgba(142,142,147,.5)`,
верх `#8E8E93`); ошибка — блок `background: #FFECEC; color: #D32F2F; radius: 12; padding: 8px 12px`,
текст 14/400.
Меню действий (`⋮`) — боттом-шит: «Пожаловаться», «Заблокировать», «Удалить чат», кнопка «Отмена».
Меню вложений (`📎`) — боттом-шит: «Документ», «Камера», «Галерея», «Отмена».

**Чат с поддержкой** отличается: заголовок 15/500, поле ввода с обводкой вместо серой заливки
(`h36 r18 border 1px, background: transparent`), первое сообщение —
«Здравствуйте! Это служба поддержки autoTOJ. Чем можем помочь?».

## 10.11. Центр уведомлений

Список «пузырей», а не строк: `padding: 16px; gap: 12`; пузырь `max-width: 85%; border-radius: 20px;
padding: 12px; background: #F2F2F7`; текст 15/400 `lh20` mb4; время 13/400 muted `lh18`.
Пусто: круг `64×64 r32 bg #F2F2F7`, «Нет уведомлений» 16/500, подпись 14/400 muted, `padding: 96px 32px`.

## 10.12. Уведомления (список)

Шапка: `←` + «Уведомления» 20/600 + бейдж непрочитанных
(`padding: 4px 8px; radius: 9999; background: rgba(17,17,17,.1); font: 500 12px`).
Строка: `padding: 16; gap: 12`, снизу hairline; слева эмодзи 24px; заголовок 14/500 (обрезка),
время 12/400 muted справа (`margin-left: 8`), текст 14/400 muted.
Непрочитанная строка — фон `rgba(17,17,17,.03)` и точка `8×8 r4` цвета `--foreground` справа.

## 10.13. Профиль (меню)

```
│              Профиль            17/600 │ ← h56 + hairline
│  ┌──────────────────────────────────┐  │ ← px16 mt16 mb24
│  │ (👤) Асрор Каримов          ✏   │  │   карточка r16 p16, border 1px #EAEAEA, gap 12
│  │      +992 90 123 45 67           │  │   аватар 40 круг; имя 16/700; телефон 13/400 muted
│  └──────────────────────────────────┘  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │ ← 4 колонки gap 8 (4-я пустая, для симметрии)
│  │ 📦 │ │ ♥  │ │ 📖 │ │    │           │   карточка aspect 1/1, r14, p8, shadow-icon-card
│  │Мои…│ │Изб.│ │Борт│ │    │           │   круг 40 r20 bg #F7F7F9 mb6; подпись 11/500 lh14
│  └────┘ └────┘ └────┘ └────┘           │
│  ────────────────────────────────────  │ ← список: border сверху и снизу #EAEAEA
│  🌐  Язык                          ›   │   строка px16 py16 gap 12
│  🎨  Тема оформления               ›   │   иконка 20 muted · лейбл 16/500 · шеврон 20 muted
│  🔔  Настройки уведомлений         ›   │   между строками разделитель (у последней нет)
│  📱  О приложении                  ›   │
│  📄  Условия соглашения            ›   │
│  🔒  Политика конфиденциальности   ›   │
│  ⭐  Правила рекомендаций          ›   │
│  ❓  Часто задаваемые вопросы      ›   │
```

**Гостевой режим** — вместо карточки профиля блок `background: #F7F7F9; border-radius: 20px;
padding: 16px`: заголовок **«Войдите в аккаунт»** 18/600 mb8, подпись
«Чтобы пользоваться всеми возможностями платформы» 14/400 muted mb16, кнопка **«Войти»**
на всю ширину `height: 48; border-radius: 24; background: #111; font: 600 15px`.
У гостя разделы «Мои объявления», «Избранное», «Бортжурнал» открывают экран входа.

## 10.14. Редактирование профиля

```
│ ←         Профиль          Сохранить   │ ← h56, фон rgba(255,255,255,.8); «Сохранить» 15/600
│                                        │   неактивная — цвет #C7C7CC; при отправке «Сохранение...»
│ ┌────────────────────────────────────┐ │ ← m16, h140, r20, bg #F7F7F9, тень 0 2px 8px .04
│ │        📷 Добавить обложку          │ │   подпись 13/500 muted
│ └────────────────────────────────────┘ │
│              ┌────┐                    │ ← аватар 88×88 r44, border 4px белый, mt −44
│              │ 👤 │📷                  │   тень 0 4px 12px .08; кнопка камеры 28×28 r14 чёрная
│              └────┘                    │
│  ┌────────────────────────────────────┐│ ← поля: px16 mt24 gap12
│  │ Имя                                ││   r9999, padding 16px 20px, bg #F7F7F9
│  └────────────────────────────────────┘│   border 1px rgba(0,0,0,.04), текст 15/400
│  ┌────────────────────────────────────┐│
│  │ О себе                             ││ ← r20, height 72 + счётчик 11/400 #C7C7CC справа
│  └────────────────────────────────────┘│
│  [    Выйти из аккаунта            ]  │ ← h52 r26, белая, текст #FF3B30 15/600
│  [    Удалить аккаунт              ]  │ ← h52 r26, фон #FF3B30, текст белый
```

## 10.15. Избранное

Шапка: `←` + «Избранное» 24/600 и подпись «N объявлений» 14/400 muted (mt4), `padding: 16`.
Список — карточки объявлений (list-вариант), `padding: 16; gap: 12`.
Склонение: 1 → «объявление», 2–4 → «объявления», 5+ → «объявлений».
Пусто — кнопка **«К поиску»**.

## 10.16. Мои объявления

```
│ ←  Мои объявления               20/600 │ ← padding 16, gap 12
│  Активные ③   Пауза ①                  │ ← табы: px16 py12, border-bottom 2px
│  ────────                              │   активный — border #111 и текст #111
├────────────────────────────────────────┤   неактивный — 14/500 muted; бейдж r9999 bg #E5E5EA
│  ┌────┬─────────────────────────┐  ⋮  │ ← карточка r12 border 1px, ряд
│  │фото│ Toyota Camry 2019       │      │   фото 128×128; бейдж статуса top8 left8 r6 12/500
│  │128 │ 2.5 AT · 45 000 км      │      │   title 14/600 mb4 · specs 12/400 muted mb8
│  │    │ Душанбе                 │      │   location 12/400 muted mb8
│  │    │ 285 000 сомони          │      │   price 18/600 mb4 · дата 12/400 muted
│  └────┴─────────────────────────┘      │
```

Меню (`⋮`) — всплывающее справа: `position: absolute; right: 12; top: 48; min-width: 200;
border-radius: 16; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,.12)`,
пункты `padding: 12px 16px; gap: 12; font-size: 15` с разделителями.
Действия: «Опубликовать», «Приостановить», «Редактировать», «Удалить».
Подтверждение — центрированная модалка `max-width: 384; radius: 20`: тело `padding: 24`,
заголовок 17/600 mb8, описание 15/400 muted; кнопки в ряд, разделённые линиями,
`padding-block: 16` («Отмена» 500 muted, действие 500 `#000`).

Пустые состояния: «У вас пока нет активных объявлений» / «Создайте новое объявление, чтобы начать
продажу» + кнопка «Разместить объявление»; на вкладке «Пауза» — «Пауза объявлений» /
«Здесь будут храниться объявления на паузе».

## 10.17. Бортжурнал

Шапка: `←` + «Бортжурнал» 20/600 слева, справа кнопка **«Создать»**
(`padding: 8px 12px; radius: 8; background: #111; font: 500 14px; color: #fff` + иконка).
Список: `padding: 16; gap: 12`. Карточка `background: var(--card); border: 1px solid var(--border);
border-radius: 12; padding: 16`:

- Ряд автора (`gap: 8; margin-bottom: 12`): аватар `40 круг; background: rgba(17,17,17,.1)`,
  инициал 14/600; имя 14/500; дата 12/400 muted.
- Заголовок 16/600 mb8.
- Бейдж категории `padding: 4px 8px; radius: 9999; font: 500 12px`, mb12.
- Отрывок 14/400 muted mb12.
- Фото `width: 100%; height: 192; border-radius: 8; background: var(--muted)`.

**Детали записи:** шапка 18/600; контент `padding: 16; gap: 16`: ряд автора (аватар 48, имя 15/600,
дата 14/400 muted), бейдж категории `padding: 4px 12px`, заголовок 20/600, текст 14/400 `lh22`,
сетка фото (`48%`, `aspect-ratio: 16/9`, r8, gap 8).
Ряд действий: `border-top`, `padding-top: 8; gap: 16`, кнопки `padding: 8px 12px; radius: 8; gap: 6`,
текст 14/500 muted (лайк, комментарии, поделиться).
Секция комментариев: `background: rgba(242,242,247,.3); padding: 16; min-height: 200`,
заголовок 16/600 mb16; карточка комментария `background: var(--card); radius: 8; padding: 12`,
аватар 32, автор 14/500, время 12/400 muted, текст 14/400 `lh20`, действия 12/400 muted.
Строка ввода комментария: `border-top`, поле `radius: 9999; padding: 8px 16px; border: 1px`,
кнопка отправки `36×36; radius: 18; background: #111`.

## 10.18. Моя активность

Шапка `←` + «Моя активность» 20/600. Три равных таба (`flex: 1; padding-block: 12`, текст 14/500,
активный — `#111` с индикатором `height: 2` внизу): **Бортжурнал**, **Отзывы**, **Обсуждения**.
Контент `padding: 16; padding-bottom: 80`.
Кнопки-фильтры внутри вкладок: `flex: 1; padding: 8px 16px; radius: 8; background: #F2F2F7`,
активная — чёрная с белым текстом.
Пустое состояние: круг `64×64 r32`, заголовок 18/500 mb8, описание 14/400 muted mb24,
кнопка `padding: 12px 24px; radius: 12; background: #111; font: 500 15px`.

## 10.19. Отзывы и обсуждения (разделы активности)

**Отзывы.** Фильтр-табы под шапкой: **Все / Продавцы / Автосалоны** (`flex: 1; padding-block: 12`;
активный — текст `#111` + индикатор `height: 2`; сверху hairline).
Карточка отзыва `r12 p16 border 1px`: ряд автора (аватар 40, имя 14/500, дата 12/400 muted),
строка адресата 14/400 muted с выделенным именем 14/500 `#111` (mb4), ряд звёзд (`gap: 2`),
текст 14/400 mb8, индикатор ответа (иконка 12px + текст 12/400).

**Обсуждения.** Под шапкой поле поиска (`h40 r8 border 1px; gap: 8; font-size: 15`), затем ряд
чипов-категорий (`padding: 6px 12px; radius: 9999; background: #F2F2F7; font: 500 14px; color: muted`;
активный — фон `#111`, текст белый).
Карточка `r12 p16 border 1px`: бейдж категории (`rgba(17,17,17,.1)`, 12/500 `#111`) mb8,
заголовок 16/600 mb8, отрывок 14/400 muted mb12, мета-ряд (аватар 24 круг с инициалом 10/600,
имя и дата 12/400 muted, разделитель «·»).
Пусто: «Нет обсуждений» / «Здесь будут отображаться обсуждения»; при поиске —
«Ничего не найдено» / «Попробуйте изменить запрос».

## 10.20. Настройки уведомлений

Шапка типа A. Контент `padding: 16; padding-bottom: 80`. Секции: заголовок 17/600 mb12,
карточка `background: #F5F5F7; border-radius: 16; overflow: hidden`.
Строка: `padding: 12px 16px; display: flex; justify-content: space-between`,
лейбл 16/500 mb2, подпись с каналами 13/400 muted, справа переключатель (51×31).
Разделители внутри карточки: `height: 1px; margin-inline: 16px`.
Под секцией — пояснение 13/400 muted (`margin-top: 8; padding-inline: 4`).
Внизу общий текст 13/400 muted по центру.

## 10.21. Тема оформления

Боттом-шит с радиусом сверху **28px** и тенью `0 -4px 24px rgba(0,0,0,.15)`.
Шапка: `padding: 20px 20px 16px`, заголовок 22/700, кнопка закрытия 32×32.
Три карточки в ряд (`gap: 16; padding: 0 20px 24px`), каждая — превью экрана
`aspect-ratio: 9/16; border-radius: 20; border: 2px; padding: 12; gap: 8` c мок-элементами
(полоски `height: 12; radius: 4`, карточки `height: 32; radius: 6`):

| Вариант | Превью |
|---|---|
| Светлая | фон `#FFFFFF`, граница `#E5E5EA` |
| Тёмная | фон `#1C1C1E`, граница `#2C2C2E` |
| Системная | половина белая / половина `#1C1C1E`, граница `#E5E5EA` |

Под превью подпись 15/600 mb8 и радиокнопка `24×24`.

## 10.22. Язык

Боттом-шит, радиус сверху 20px. Шапка как у темы (заголовок 22/700, закрытие 32×32).
Опции (`gap: 12`): `padding: 16; border-radius: 16; border: 2px; background: var(--card)`,
слева название на языке оригинала 17/600 и перевод 13/400 muted (mt2), справа радиокнопка 24×24.
Варианты: **Русский**, **Тоҷикӣ**.

## 10.23. Авторизация

Полноэкранный оверлей.

```
│      Вход / Регистрация         17/600 │ ← py16 + border-bottom; ✕ справа (right 20, padding 4)
│              autoTOJ                   │ ← pt40 pb32, логотип размера xl (32px)
│      Купить или продать авто    14 mut │ ← mt12
│  ┌──────────────────────────────────┐  │ ← mx20, bg #F2F2F7, r24, p24
│  │ Войти в аккаунт           20/700 │  │ ← mb20
│  │ ┌──────────┐ ┌──────────┐        │  │ ← табы gap12 mb24
│  │ │ Телефон  │ │  Email   │        │  │   py12 px16 r12, bg white, border 1px
│  │ └──────────┘ └──────────┘        │  │   активный: bg #111, текст белый 15/600
│  │ Номер телефона            14/600 │  │ ← mb8
│  │ ┌────┐ ┌───────────────────────┐ │  │   код страны: 70×48 r12 (текст «+992» 15/600)
│  │ │+992│ │ (90) 123 45 67        │ │  │   инпут: h48 r12 border 1px, 15/400
│  │ └────┘ └───────────────────────┘ │  │   маска: (XX) XXX XX XX, ровно 9 цифр
│  │ ☐ Согласен с условиями…   13/400 │  │ ← чекбокс 20×20 r6 border 2px, gap 12, mb24
│  │ [       Получить код        ]    │  │
│  └──────────────────────────────────┘  │
```

**Шаг ввода кода:** шапка `←` + заголовок 17/600 по центру + распорка 40px.
Контейнер `background: #F2F2F7; border-radius: 24; padding: 20; align-items: center`:
заголовок 18/600 mb12; подпись 15/400 muted `lh20` mb24 (номер внутри — 600 `#111`);
6 ячеек кода `56×56` c `gap: 12` mb16; при ошибке — строка с иконкой и текстом 14/500 `#FF3B30`;
при загрузке — спиннер и текст 14/500 muted; таймер повторной отправки 14/400 muted по центру.
В демо-режиме подходит код `123456`.

**Экран блокировки** показывается при превышении лимита попыток.

## 10.24. Статические экраны

**О приложении:** шапка типа A, контент по центру экрана — логотип, подпись
«Покупка, продажа и сервисы» 15/400 muted (mt12 mb32), версия 14/400 muted.

**FAQ:** шапка типа A («Часто задаваемые вопросы»). Аккордеон: `padding-inline: 16`,
кнопка вопроса `padding-block: 16; gap: 12` — текст 15/500 слева и шеврон справа;
ответ `padding-bottom: 16`, текст 14/400 muted `lh21`; между пунктами hairline. 11 вопросов
(см. [13.9](#139-faq)).

**Условия соглашения / Политика конфиденциальности / Правила рекомендаций:** шапка типа A,
текстовые блоки: заголовки секций 17/600, абзацы 15/400 `lh22`, отступы `padding: 16`.

---

# 11. Мастер создания объявления

## 11.1. Выбор категории

```
│ ←     Добавить объявление       17/600 │ ← h56 + hairline
│              autoTOJ                   │ ← pt32 pb24, логотип xl (32px)
│         Выберите категорию      15 mut │ ← mt12
│  ┌────────────────────────────────────┐│ ← px20, gap 12
│  │ (🚗)  Легковые                     ││   h64, r16, bg secondary, px20, gap 12
│  └────────────────────────────────────┘│   иконка в квадрате 40×40 r12 bg card, 24px
│  ┌────────────────────────────────────┐│   подпись 16/500
│  │ (🏍)  Мото                         ││   нажатие: opacity .8 + scale(.98)
│  └────────────────────────────────────┘│
│  ┌────────────────────────────────────┐│
│  │ (🚚)  Комтранс                     ││
│  └────────────────────────────────────┘│
```

## 11.2. Шаги мастера (легковые — 21 шаг)

| № | Шаг | Тип |
|---|---|---|
| 1 | Марка | выбор с поиском + «своё значение» |
| 2 | Модель | выбор с поиском + «своё значение» |
| 3 | Год выпуска | выбор |
| 4 | Поколение | выбор + «своё» + «Пропустить» |
| 5 | Кузов | выбор + «своё» |
| 6 | Двигатель | выбор |
| 7 | Привод | выбор |
| 8 | Коробка передач | выбор |
| 9 | Объём двигателя | ввод (суффикс «л», необязательный) |
| 10 | Мощность | ввод |
| 11 | Цвет | выбор |
| 12 | Состояние | выбор |
| 13 | Руль | выбор |
| 14 | Фотографии | загрузка |
| 15 | Комплектация | множественный выбор |
| 16 | История | форма |
| 17 | VIN | ввод |
| 18 | Описание | текст |
| 19 | Цена | ввод + чекбоксы |
| 20 | Контакты | форма |
| 21 | Проверка объявления | предпросмотр |

Для мото и коммерческого транспорта — свои наборы шагов с той же механикой.
Счётчик в шапке: «Шаг N из 21».

## 11.3. Шаблоны шагов

**Шаг-выбор:** `padding-inline: 16`; заголовок 28/700 (`margin: 16px 0`);
опционально поле поиска `height: 44; border-radius: 10; padding-inline: 12; gap: 8; font-size: 16`;
список: строка `padding-block: 16` + hairline снизу, иконка-колонка 32px (`margin-right: 12`),
лейбл 16/400, подпись 13/400 (mt2). Внизу «Добавить своё» — строка с `Plus`, `border-top`, 16/500.
Режим ввода своего значения: инпут 22/400 с нижней границей (`padding-bottom: 12; margin-bottom: 24`),
кнопка подтверждения `height: 52; radius: 12` и ссылка «Вернуться к списку» 15/500 по центру.

**Шаг-ввод:** заголовок 28/700 (mt16 mb8), подпись 14/400 muted `lh20` mb16;
ряд ввода `border-bottom: 1px; padding-bottom: 12; margin-bottom: 32`: инпут 24/400 и суффикс 18/400;
кнопка «Продолжить» `height: 52; radius: 12; font: 600 16px`.

**Шаг цены:** заголовок 28/700 mb24; ряд `border-bottom: 1px; padding-bottom: 12; margin-bottom: 24`:
инпут 28/600 + «сомони» 18/400; блок чекбоксов `gap: 16; margin-bottom: 32`; кнопка `h52 r12`.

**Шаг фото:** заголовок 28/700, подпись 14/400 `lh20` mb20; сетка плейсхолдеров `gap: 8` с
`border-radius: 12`; кнопка удаления фото `24×24; radius: 12; top: 6; right: 6`;
дополнительные миниатюры `80×60; radius: 8`; хинт `border-radius: 10; padding: 10px 14px`;
кнопка «Добавить фото» `height: 52; radius: 12; border: 1.5px`;
фиксированная нижняя панель `padding: 12px 16px 32px; border-top` с кнопкой «Продолжить».

**Предпросмотр (шаг 21):** заголовок «Проверка объявления» 28/700 и подпись
«Проверьте информацию перед публикацией» 13/400 muted (`padding: 16px 20px`).
Контент `padding: 24px 20px 160px`:

- Карточка-превью `radius: 20; border: 1px solid #EDEDED`: фото 4:3, бейдж статуса
  (`top: 12; right: 12; background: rgba(255,255,255,.9); padding: 4px 12px; radius: 20; font: 600 12px`),
  тело `padding: 16` — марка+модель 18/700 mb4, год 13/400 muted mb12, цена 22/700.
- Карточка «Краткая информация» `background: #F8F8F8; radius: 16; padding: 16; margin-bottom: 24`:
  заголовок 16/600 mb12, строки `padding-block: 4` — лейбл 14/400 muted слева, значение 14/400 `#000`
  справа. Поля: Год, Пробег, Двигатель, Привод, Статус, Страна поставки (если «На заказ»),
  «Статус растаможки» с иконкой `Info` (открывает пояснение).
- Карточка «Продавец»: имя, телефон, город (14/400, mb8); при включённой опции — строка с
  зелёной галочкой `#34C759` и текстом «Готов показать онлайн».
- Фиксированная панель снизу `padding: 16px 20px; border-top: 1px solid #EDEDED; gap: 12`:
  серая кнопка «Редактировать» и чёрная «Опубликовать объявление» (обе `h52 r14; font: 600 16px`).

**Экран успеха:** по центру круг `80×80; radius: 40; background: #34C759` с галочкой (mb24),
заголовок 28/700 mb8, описание 16/400 muted mb32, кнопка `width: 300; height: 52; radius: 14;
background: #000; font: 600 16px`, подсказка 13/400 muted mt16.

**Диалог выхода:** боттом-шит (см. [8.3](#83-центрированная-модалка)) с заголовком
«Выйти без публикации?» и текстом «Если вы выйдете сейчас, все введённые данные будут потеряны.»,
кнопки «Остаться» / «Выйти».

---

# 12. Анимации и жесты

| Элемент | Параметры |
|---|---|
| Сплэш | fade-in контента 600 мс `ease-out` + `translateY(−10 → 0)`; три точки прыгают (−8px: 400 мс вверх `ease-out`, 600 мс вниз `ease-in bounce`) со сдвигом 0 / 150 / 300 мс; fade-out начинается на 1700 мс и длится 300 мс; экран закрывается на 2000 мс |
| Переход экранов | горизонтальный iOS-слайд ~300–350 мс |
| Свайп-назад | от левого края, зона 50px |
| Открытие боттом-шита | slide-up ~300 мс |
| Закрытие шита свайпом | drag > 80px или скорость > 500 px/s; иначе пружинный возврат |
| Нажатие карточки объявления | `scale(.97)`, пружина (≈ `cubic-bezier(.2,.8,.2,1)`, 200 мс) |
| Нажатие плитки сервиса | `scale(.96)` крупная / `scale(.94)` мелкая |
| Нажатие карточки категории | `scale(.98)` + `opacity: .8` |
| Нажатие таба | `scale(.95)` |
| Капсула активного таба | `scale .9 → 1`, `opacity 0 → 1`, ~250 мс |
| Скелетоны | `pulse 2s ease-in-out infinite` |
| Заголовок в шапке деталей | fade-in при `scrollY > 200` |

Уважайте `prefers-reduced-motion: reduce` — отключайте `transform`-анимации и пульсацию.

## Экран запуска (сплэш)

```
              autoTOJ            ← 52px/900, letter-spacing −1; «auto» #E53935, «TOJ» foreground
      Покупка, продажа и сервисы ← 15/400 muted, mb 32
              ● ● ●             ← точки 8×8, gap 8, цвет var(--foreground)
```
Контейнер — на весь экран, фон `--background`, содержимое по центру.

---

# 13. Справочник контента

Все значения интерфейса, чтобы не гадать при вёрстке.

## 13.1. Таббар

`Поиск` · `Сервисы` · `Добавить` · `Сообщения` · `Профиль`

## 13.2. Фильтры поиска

**Быстрые фильтры (чипы):** До 100 000 сомони · Автомат · С фото · С видео · Не битый · От собственника

**Марки:** Toyota, Hyundai, Kia, Chevrolet, BMW, Mercedes-Benz, Lada, Daewoo, Honda, Lexus, Audi

**Модели по маркам:**

| Марка | Модели |
|---|---|
| Toyota | Camry, Corolla, Land Cruiser, RAV4, Highlander, Prado |
| Hyundai | Sonata, Elantra, Tucson, Santa Fe, Accent, Creta |
| Kia | Optima, Sportage, Sorento, K5, Seltos |
| Chevrolet | Nexia, Cobalt, Malibu, Lacetti, Spark, Captiva |
| BMW | 3 Series, 5 Series, 7 Series, X5, X3 |
| Mercedes-Benz | E-Class, C-Class, S-Class, GLE, GLC |
| Lada | Vesta, Granta, Niva, Priora, 2114 |
| Daewoo | Nexia, Matiz, Gentra, Lacetti |
| Honda | Accord, Civic, CR-V, Pilot |
| Lexus | RX, ES, NX, LX |
| Audi | A4, A6, Q5, Q7 |

**Двигатель:** Бензин · Дизель · Гибрид · Электро · Газ
**Коробка:** Механика · Автомат · Робот · Вариатор
**Привод:** Передний · Задний · Полный
**Кузов:** Седан · Кроссовер · Хэтчбек · Универсал · Купе · Минивэн · Пикап · Фургон
**Цвет:** Белый · Чёрный · Серебристый · Серый · Синий · Красный · Зелёный · Бежевый · Коричневый
**Владельцев:** 1 · 2 · 3 · 4+ (плюс «Не важно»)
**ПТС:** Оригинал · Электронный · Дубликат (плюс «Не важно»)
**Переключатели:** Торг возможен · Обмен возможен
**Плейсхолдеры «Любой»:** для марки/модели/коробки — «Любая», для остальных — «Любой».

## 13.3. Статусы объявления

`В наличии` (#2196F3) · `На заказ` (#111111) · `Растаможен` (#9C27B0) · `Не растаможен` (#F44336) ·
`Новый` (#4CAF50)

## 13.4. Сервисы

**Главные плитки:**
- **Запчасти** — «Покупка и продажа», иконбокс `#1a1a1a`
- **Авто прокат** — «Аренда автомобилей», иконбокс `#2d2d2d`

**Услуги (9):** Автоподбор · Эвакуатор · Техосмотр · Автосервис · Страховка · Автомойка ·
Шиномонтаж · Детейлинг · Автошкола

## 13.5. Запчасти

**Категории:** Двигатель · КПП · Ходовая часть · Детали кузова · Оптика · Шины · Диски · Руль · Расходники
**Состояние:** Новый (`#34C759`) · Б/у (`#FF9500`)
**Сортировка:** Сначала дешёвые · Сначала дорогие

## 13.6. Меню профиля

**Карточки-иконки (3):** Мои объявления · Избранное · Бортжурнал
**Пункты списка (8):** Язык · Тема оформления · Настройки уведомлений · О приложении ·
Условия соглашения · Политика конфиденциальности · Правила рекомендаций · Часто задаваемые вопросы

## 13.7. Категории контента

**Бортжурнал:** ТО · Ремонт · Тюнинг · Поломка · Покупка · Автопутешествия · Гаджеты ·
Автоматика · Прошу совета · Без темы
**Обсуждения:** Все · Выбор авто · Техническое · Документы · Страхование · Тюнинг
**Отзывы (фильтр):** Все · Продавцы · Автосалоны
**Мои объявления (табы):** Активные · Пауза
**Моя активность (табы):** Бортжурнал · Отзывы · Обсуждения
**Прокат (фильтры):** Все · Автомат · Механика · Цена

## 13.8. Настройки уведомлений

| Секция | Пункты |
|---|---|
| Сообщения | Сообщения |
| Ваш поиск | Сохранённые поиски · Изменения цены · Изменения в избранном · Рекомендации объявлений |
| Сообщество | Бортжурнал |
| Полезное от autoTOJ | Новости сервиса · Скидки и акции · Дополнительные сервисы |

**Каналы доставки:** Push-уведомления («Мгновенные уведомления на экран») ·
СМС на номер телефона · Почта («Уведомления на email»). Состояние «Выключено» при всех выключенных.

## 13.9. FAQ

1. **Как разместить объявление?** — «Нажмите на кнопку "+" в нижней навигации, выберите категорию
   транспорта, заполните все обязательные поля и добавьте фотографии. После нажатия
   "Опубликовать объявление" ваше объявление будет сразу опубликовано.»
2. **Сколько стоит размещение объявления?** — «Размещение объявлений на autoTOJ абсолютно бесплатно.
   Вы можете разместить неограниченное количество объявлений без каких-либо комиссий.»
3. **Как связаться с продавцом?** — «Откройте объявление и нажмите на кнопку "Написать продавцу"
   или позвоните по указанному номеру телефона. Все переписки сохраняются в разделе "Сообщения".»
4. **Как добавить объявление в избранное?** — «Нажмите на иконку сердца в правом верхнем углу
   карточки объявления. Все избранные объявления сохраняются в разделе "Избранное" в вашем профиле.»
5. **Как редактировать объявление?** — «Перейдите в раздел "Профиль" → "Мои объявления", найдите
   нужное объявление и нажмите на кнопку редактирования. Все изменения будут применены мгновенно.»
6. **Что такое бортжурнал?** — «Бортжурнал — это личный дневник вашего автомобиля, где вы можете
   фиксировать все расходы на обслуживание, ремонт, заправки и другие события. Это помогает
   контролировать затраты и историю обслуживания.»
7. **Какие валюты поддерживаются?** — «На платформе autoTOJ все цены указываются в таджикских
   сомони (TJS). Это упрощает процесс покупки и продажи для пользователей из Таджикистана.»
8. **Как работает раздел "Запчасти"?** — «Раздел "Запчасти" — это отдельный модуль в меню "Сервисы",
   где вы можете покупать и продавать автозапчасти. Размещение объявлений о запчастях работает так же,
   как и размещение объявлений об автомобилях.»
9. **Что такое "Авто прокат"?** — «Раздел "Авто прокат" позволяет арендовать автомобили на любой срок.
   Вы можете просмотреть доступные автомобили, их условия аренды, цены и связаться с владельцем напрямую.»
10. **Как настроить уведомления?** — «Перейдите в раздел "Профиль" → "Настройки уведомлений". Здесь
    вы можете включить или отключить уведомления о новых сообщениях, статусе объявлений и других событиях.»
11. **Можно ли изменить контактные данные?** — «Да, контактные данные можно изменить в разделе
    "Профиль". Номер телефона и город можно редактировать через модальное окно, а имя изменяется
    только в настройках профиля.»

## 13.10. Комплектация (категории и примеры опций)

Категории: **Безопасность**, **Комфорт**, **Салон**, **Мультимедиа**.
Примеры опций: Антиблокировочная система, Иммобилайзер, Защита от угона, Датчик проникновения
в салон, Автоматический корректор фар, Камера заднего вида, Датчик света, Датчик дождя,
Климат-контроль, Бортовой компьютер, Запуск двигателя с кнопки.

## 13.11. Форматирование

| Что | Формат |
|---|---|
| Цена | `285 000 сомони` — разряды через пробел |
| Пробег | `45 000 км` |
| Дата в деталях | `12 марта, Душанбе` |
| Дата в списках | `12 января 2026` |
| Время чата | сегодня — `14:32`; вчера — `Вчера`; раньше — `12.03` |
| Относительное время | `Только что`, `2 дня назад` |
| Телефон | `+992 (90) 123 45 67`, ввод по маске `(XX) XXX XX XX` (9 цифр) |
| Аренда | `350 сомони / день` |
| Объём двигателя | `2.0 л` |

---

# 14. Готовый CSS-старт

```css
/* ───────── Токены ───────── */
:root {
  --background: #FFFFFF;  --foreground: #111111;
  --card: #FFFFFF;        --card-foreground: #111111;
  --popover: #FFFFFF;     --popover-foreground: #111111;
  --primary: #111111;     --primary-foreground: #FFFFFF;
  --secondary: #F2F2F7;   --secondary-foreground: #111111;
  --muted: #E5E5EA;       --muted-foreground: #8E8E93;
  --accent: #111111;      --accent-foreground: #FFFFFF;
  --destructive: #FF3B30; --destructive-foreground: #FFFFFF;
  --success: #34C759;
  --border: #E5E5EA;      --input: #E5E5EA;  --ring: #111111;

  /* фиксированные */
  --brand-red: #E53935;
  --link: #007AFF;
  --star: #FFD700;
  --surface-alt: #F7F7F9;
  --border-soft: #EAEAEA;

  /* радиусы */
  --radius-sm: 8px; --radius-md: 10px; --radius-lg: 12px; --radius-xl: 16px;
  --radius-card: 20px; --radius-sheet: 24px; --radius-search: 28px; --radius-pill: 9999px;

  /* тени */
  --shadow-card: 0 4px 16px rgba(0,0,0,.06);
  --shadow-float: 0 8px 24px rgba(0,0,0,.08);
  --shadow-panel: 0 8px 24px rgba(0,0,0,.06);
  --shadow-tile: 0 4px 12px rgba(0,0,0,.06);
  --shadow-icon-card: 0 2px 8px rgba(0,0,0,.06);
  --shadow-header: 0 1px 4px rgba(0,0,0,.05);
  --shadow-menu: 0 4px 16px rgba(0,0,0,.12);
  --shadow-modal: 0 8px 24px rgba(0,0,0,.2);
  --shadow-sheet: 0 -4px 24px rgba(0,0,0,.12);

  /* прочее */
  --font-sans: 'Manrope', system-ui, -apple-system, sans-serif;
  --screen-pad: 16px;
  --shell-width: 440px;
}

:root[data-theme="dark"] {
  --background: #000000;  --foreground: #F5F5F7;
  --card: #1C1C1E;        --card-foreground: #F5F5F7;
  --popover: #1C1C1E;     --popover-foreground: #F5F5F7;
  --primary: #F5F5F7;     --primary-foreground: #000000;
  --secondary: #2C2C2E;   --secondary-foreground: #F5F5F7;
  --muted: #3A3A3C;       --muted-foreground: #98989D;
  --accent: #F5F5F7;      --accent-foreground: #000000;
  --destructive: #FF453A; --success: #32D74B;
  --border: #3A3A3C;      --input: #3A3A3C;  --ring: #F5F5F7;
  --surface-alt: #2C2C2E; --border-soft: #3A3A3C;
}

/* ───────── База ───────── */
* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  font-family: var(--font-sans);
  background: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}
img { max-width: 100%; display: block; }
button, input, textarea { font-family: inherit; }

/* ───────── Утилиты ───────── */
.app-shell {
  max-width: var(--shell-width); margin-inline: auto; min-height: 100dvh;
  background: var(--card); position: relative; overflow-x: hidden;
}
.screen { padding-bottom: 80px; }
.pt-safe { padding-top: env(safe-area-inset-top, 0px); }
.hairline { border-bottom: 1px solid var(--border); }
@media (min-resolution: 2dppx) { .hairline { border-bottom-width: .5px; } }
.scroll-x { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.scroll-x::-webkit-scrollbar { display: none; }
.line-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* ───────── Типографика ───────── */
.text-h1 { font: 700 24px/30px var(--font-sans); }
.text-h2 { font: 600 20px/26px var(--font-sans); }
.text-h3 { font: 600 16px/22px var(--font-sans); }
.text-body-primary   { font: 400 15px/22px var(--font-sans); }
.text-body-secondary { font: 400 13px/18px var(--font-sans); color: var(--muted-foreground); }
.text-caption { font: 400 12px/16px var(--font-sans); color: var(--muted-foreground); }
.text-error   { font: 400 12px/16px var(--font-sans); color: var(--destructive); }
.screen-title { font: 600 17px var(--font-sans); }

/* ───────── Логотип ───────── */
.logo { font-family: Cadillac, system-ui, sans-serif; font-weight: 900; letter-spacing: -1px;
        display: inline-flex; }
.logo__auto { color: var(--brand-red); }
.logo__toj  { color: var(--foreground); }

/* ───────── Анимации ───────── */
@keyframes pulse     { 0%,100% { opacity: 1 } 50% { opacity: .5 } }
@keyframes sheet-up  { from { transform: translateY(100%) } to { transform: none } }
@keyframes capsule-in{ from { transform: scale(.9); opacity: 0 } to { transform: none; opacity: 1 } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

---

# 15. Чек-лист приёмки

- [ ] Контент ограничен 440px и центрирован; фон за пределами — `--background`, внутри — `--card`.
- [ ] Горизонтальные отступы экранов ровно 16px (мастер объявления и шиты темы/языка — 20px).
- [ ] Таббар плавает: 340px, r24, полупрозрачный фон **с блюром**, тень `0 8px 24px rgba(0,0,0,.08)`,
      отступ снизу `max(safe-area, 16px)`.
- [ ] Подписи в таббаре — 8px; иконки 20px, у активной `stroke-width: 2`, у неактивной — 1.5
      и `opacity: .75`.
- [ ] Карточки объявлений: r20, border 1px, тень `0 4px 16px rgba(0,0,0,.06)`, фото 4:3 с `object-fit: cover`.
- [ ] Цены отформатированы с пробелами: `285 000 сомони`.
- [ ] Primary-кнопки чёрные (в тёмной теме — светлые); синий только у ссылок `#007AFF`.
- [ ] Разделители — `--border` в 1px (0.5px на 2x), а не тени.
- [ ] Селекты открывают боттом-шит, а не нативный `<select>`.
- [ ] Пустое / ошибка / загрузка оформлены по разделу 9, а не спиннером по центру.
- [ ] Все нажатия дают отклик: `scale` или смена фона на `--secondary`.
- [ ] Переходы между экранами — горизонтальный слайд; шиты и модальные экраны — снизу вверх.
- [ ] Свайп-назад работает от левого края (зона 50px), свайп вниз закрывает шиты.
- [ ] Тёмная тема проверена: карточки `#1C1C1E` на фоне `#000`, primary инвертирован.
- [ ] Три режима темы: светлая / тёмная / системная, выбор сохраняется.
- [ ] Заголовок в шапке деталей объявления появляется при прокрутке > 200px.
- [ ] Весь UI-текст на русском, валюта — сомони.
