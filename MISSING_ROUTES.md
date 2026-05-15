# Недостающие роуты autoTOJ

Аудит на основе сравнения всех `router.push(...)` / `href="..."` со списком директорий в `src/app/`.

**Дата аудита:** 2026-05-14
**Найдено:** 5 ссылок ведут в 404

---

## 1. `/messages` — личные сообщения / чаты

**Приоритет:** Высокий — это основная функция marketplace, ломается на всех детальных страницах.

Подразумеваемая логика: страница принимает query `?ad=<id>` и открывает / создаёт чат по конкретному объявлению.

| Где вызывается | Контекст |
|---|---|
| `src/components/header/DesktopHeader.tsx:39` | пункт «Сообщения» в шапке десктопа (`HeaderActions`) |
| `src/components/ad/AdActionBar.tsx:39` | кнопка «Написать» в sticky CTA на мобильной детальной |
| `src/app/ad/[id]/page.tsx:316` | внутри карточки авто (десктоп) |
| `src/app/parts/[id]/page.tsx:294` | внутри карточки запчасти |
| `src/app/rental/[id]/page.tsx:284` | внутри карточки аренды |

**Что нужно создать:**
- `src/app/messages/page.tsx` — список диалогов
- `src/app/messages/[chatId]/page.tsx` (или query-based) — конкретный чат

---

## 2. `/about` — «О приложении»

**Приоритет:** Низкий (статика).

Ссылка: `src/components/footer/DesktopFooter.tsx:16`

**Что нужно создать:** `src/app/about/page.tsx` со статическим контентом о проекте.

---

## 3. `/terms` — «Условия соглашения»

**Приоритет:** Низкий (статика), но юридически обязателен для marketplace.

Ссылка: `src/components/footer/DesktopFooter.tsx:17`

**Что нужно создать:** `src/app/terms/page.tsx` с текстом пользовательского соглашения.

---

## 4. `/privacy` — «Конфиденциальность»

**Приоритет:** Низкий (статика), но юридически обязателен (GDPR / закон РТ о персональных данных).

Ссылка: `src/components/footer/DesktopFooter.tsx:18`

**Что нужно создать:** `src/app/privacy/page.tsx` с политикой конфиденциальности.

---

## 5. `/faq` — «Помощь»

**Приоритет:** Низкий (статика).

Ссылка: `src/components/footer/DesktopFooter.tsx:19`

**Что нужно создать:** `src/app/faq/page.tsx` с разделом помощи / FAQ.

---

## Существующие роуты (для справки)

Список 19 действующих страниц:

```
/
/ad/[id]
/favorites
/logbook
/logbook/[id]
/logbook/create
/login
/login/confirm
/me
/my-ads
/parts
/parts/[id]
/post-ad
/profile
/rental
/rental/[id]
/services
/services/[categoryId]
/services/provider/[id]
```

---

## Что НЕ является пробелом

Эти пути встречаются в коде, но это **backend-endpoints** в `src/lib/features/`, а не Next.js-роуты — страницы создавать НЕ нужно:

- `/profile/settings` — endpoint в `profileApi.ts`
- `/notifications`, `/notifications/read`, `/notifications/unread-count`, `/notifications/fcm-token` — endpoints в `notificationsApi.ts`

---

## Итоговый чек-лист

- [ ] `src/app/messages/page.tsx` *(критично)*
- [ ] `src/app/messages/[chatId]/page.tsx` *(критично)*
- [ ] `src/app/about/page.tsx`
- [ ] `src/app/terms/page.tsx`
- [ ] `src/app/privacy/page.tsx`
- [ ] `src/app/faq/page.tsx`
