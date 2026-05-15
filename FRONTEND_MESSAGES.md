# Бэк для фронт-страниц `/messages` — что готово

Документ-ответ на аудит фронта от 2026-05-14 по недостающим роутам.
Все упомянутые ниже изменения уже в `master`, тесты добавлены.

---

## TL;DR

Фронт может реализовывать `/messages` и `/messages/[chatId]?ad=<id>` —
бэк закрывает все три блокера из аудита:

1. ✅ Появился `GET /v1/chats/{chat_id}` — для deep-link на конкретный чат.
2. ✅ `POST /v1/chats/{chat_id}/messages` теперь пушит событие `message:new`
   в WebSocket обоим участникам.
3. ✅ Контракт `SendMessageInput` приведён к реализации — фронт может
   полагаться на Swagger / OpenAPI.

---

## Сценарии и какие endpoint-ы для них

### A. Открыть `/messages` (список диалогов)

```
GET /v1/chats?page=1&limit=20
Authorization: Bearer <token>
```

**Ответ:**
```json
{
  "chats": [
    {
      "id": "uuid",
      "ad": { "id": "uuid", "title": "...", "photo": "url", "price": 150000 },
      "partner": { "id": "uuid", "name": "...", "avatar": "url" },
      "last_message": { "text": "...", "created_at": "...", "is_mine": false },
      "unread_count": 3,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 12, "page": 1, "limit": 20, "has_more": false
}
```

`last_message.is_mine` — true, если последнее сообщение отправил
текущий пользователь, иначе false. `null`, если чат пустой.

### B. Открыть `/messages/[chatId]` (deep-link)

```
GET /v1/chats/{chat_id}
Authorization: Bearer <token>
```

Возвращает один объект **в том же шейпе**, что и item из `GET /chats`.
Используется фронтом для рендера заголовка (партнёр + объявление) при
переходе по прямой ссылке или после `F5`.

**Ошибки:**
- `404 NOT_FOUND` — чат не существует
- `403 FORBIDDEN` — текущий юзер не buyer и не seller этого чата

### C. Открыть чат из карточки объявления (`?ad=<id>`)

Это идемпотентная операция — если чат уже есть, вернётся существующий.

```
POST /v1/chats
Content-Type: application/json
{ "ad_id": "uuid" }
```

**Ответ:** `{ "chat_id": "uuid" }`

**Ошибки:**
- `404` — объявление не найдено
- `403` — пользователь пытается открыть чат к своему же объявлению

**Рекомендуемый flow на фронте:**

```ts
// в обработчике "Написать продавцу"
const { chat_id } = await api.post('/chats', { ad_id });
router.push(`/messages/${chat_id}`);
```

### D. Загрузить сообщения

```
GET /v1/chats/{chat_id}/messages?page=1&limit=50
```

Возвращается порция от свежих к старым (для infinite-scroll вверх).

```json
{
  "messages": [
    {
      "id": "uuid",
      "chat_id": "uuid",
      "sender_id": "uuid",
      "text": "Здравствуйте...",
      "media_url": null,
      "media_type": null,
      "is_mine": true,
      "is_read": false,
      "created_at": "..."
    }
  ],
  "total": 87, "page": 1, "limit": 50, "has_more": true
}
```

### E. Отправить сообщение

```
POST /v1/chats/{chat_id}/messages
Content-Type: application/json
{ "text": "Когда удобно созвониться?" }
```

**Контракт:**

| Поле | Тип | Обяз. | Примечание |
|---|---|---|---|
| `text` | string ≤ 5000 | ❶ | Хотя бы одно из text/media_id обязательно |
| `media_id` | UUID | ❶ | Идентификатор уже загруженного медиа из `POST /v1/media/upload`. Бэк сам резолвит в `media_url`/`media_type`. |

❶ — должно быть указано хотя бы одно. Иначе `422 VALIDATION_ERROR`
(«Сообщение должно содержать текст или вложение»).

**Чтобы прикрепить файл** — сначала загрузите через `POST /v1/media/upload`,
затем передайте полученный `id` как `media_id`.

**Ответ (201):** объект `MessageOut` (как item в списке выше) с `is_mine: true`.

**В тот же момент** все участники чата получают через WebSocket событие
`message:new` (см. ниже).

### F. Отметить чат прочитанным

```
POST /v1/chats/{chat_id}/read
```

Возвращает `{ "success": true }`. Сбрасывает `unread_count` для текущего
юзера и помечает все непрочитанные сообщения от партнёра как `is_read=true`.

### G. Заблокировать пользователя

```
POST /v1/blocks
{ "user_id": "uuid" }
```

---

## WebSocket

```
ws://api.autotoj.tj/v1/ws?token=<JWT>
```

Поддерживается multi-device (один юзер — несколько соединений).

### Событие `message:new`

Шлётся **обоим участникам чата** сразу после `POST /chats/{id}/messages`:

```json
{
  "event": "message:new",
  "data": {
    "id": "uuid",
    "chat_id": "uuid",
    "sender_id": "uuid",
    "text": "...",
    "media_url": null,
    "media_type": null,
    "created_at": "2026-05-15T10:30:00+00:00"
  }
}
```

Поле `is_mine` в WS-payload **не передаётся** — фронт вычисляет сам по
`sender_id === current_user_id` (иначе пришлось бы слать два разных
payload-а на каждое сообщение).

**Зачем шлём отправителю тоже:** чтобы у юзера, открытого с двух устройств,
обновлялись оба клиента.

### События, которых пока нет

- `chat:updated` — обновление превью в списке чатов. Сейчас фронту нужно
  на `message:new` локально пересчитывать last_message / unread в сторе.
  Если нужен серверный пуш — заведите тикет.
- `typing` — индикатор «печатает…». Endpoint в WS принимает событие,
  но broadcast пока заглушка. Когда понадобится — поднимем.

---

## Что **НЕ** сделано в этой итерации (приоритет 2)

| Что | Зачем нужно | Где обсудить |
|---|---|---|
| `GET /v1/chats/unread-count` | Badge непрочитанных в шапке без загрузки всего списка | следующий спринт |
| Проверка `Block` в `send_message` | Чтобы заблокированный не мог писать | следующий спринт |
| WS-событие `typing` | Индикатор печати | по запросу |
| WS-событие `chat:updated` | Серверный пуш изменений превью в списке | по запросу |

---

## Изменённые файлы (для ревью)

- [app/api/v1/messages.py](app/api/v1/messages.py) — переписан целиком
- [app/schemas/chat.py:101](app/schemas/chat.py#L101) — уточнён `SendMessageInput`
- [tests/test_api.py:534](tests/test_api.py#L534) — добавлены тесты на `GET /chats/{id}`

## Проверка локально

```bash
docker-compose up
# в другом терминале:
API_BASE_URL=http://localhost:8000/v1 pytest tests/test_api.py::TestChat -v
```

Swagger / актуальный OpenAPI: <http://localhost:8000/docs>.
