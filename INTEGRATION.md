# AutoToj Backend API — Полная документация

> Документ описывает все API-эндпоинты, схему базы данных, форматы запросов/ответов, безопасность и инфраструктуру для бэкенда мобильного приложения **AutoToj** — автомобильного маркетплейса Таджикистана.

---

## Содержание

1. [Обзор и архитектура](#1-обзор-и-архитектура)
2. [Схема базы данных](#2-схема-базы-данных)
3. [API роуты — Авторизация](#3-api-роуты--авторизация)
4. [API роуты — Справочники](#4-api-роуты--справочники)
5. [API роуты — Объявления](#5-api-роуты--объявления)
6. [API роуты — Мои объявления](#6-api-роуты--мои-объявления)
7. [API роуты — Запчасти](#7-api-роуты--запчасти)
8. [API роуты — Аренда](#8-api-роуты--аренда)
9. [API роуты — Сервисы](#9-api-роуты--сервисы)
10. [API роуты — Избранное](#10-api-роуты--избранное)
11. [API роуты — Сообщения](#11-api-роуты--сообщения)
12. [API роуты — Профиль](#12-api-роуты--профиль)
13. [API роуты — Бортжурнал](#13-api-роуты--бортжурнал)
14. [API роуты — Уведомления](#14-api-роуты--уведомления)
15. [Загрузка медиафайлов](#15-загрузка-медиафайлов)
16. [Безопасность](#16-безопасность)
17. [Формат ошибок](#17-формат-ошибок)
18. [Инфраструктура и DevOps](#18-инфраструктура-и-devops)

---

## 1. Обзор и архитектура

### Стек (рекомендация)

| Компонент | Технология |
|-----------|-----------|
| Runtime | Python |
| Framework | FastAPI |
| Database | PostgreSQL |
| Cache | Redis |
| Object Storage | S3-совместимое (MinIO / AWS S3) |
| Message Queue | Redis Streams |
| Search | PostgreSQL Full-Text |
| Realtime | WebSocket |
| Push Notifications | Firebase Cloud Messaging (FCM) |

### Base URL

```
Production: https://api.autotoj.tj/v1
Staging:    https://api-staging.autotoj.tj/v1
```

### Формат авторизации

```
Authorization: Bearer <jwt_token>
```

Все запросы, кроме публичных (справочники, поиск, просмотр объявлений), требуют валидного JWT-токена.

### Общие заголовки

```
Content-Type: application/json
Accept: application/json
Accept-Language: ru
```

Загрузка файлов: `Content-Type: multipart/form-data` (без `application/json`).

### Пагинация

Все списковые эндпоинты поддерживают единый формат пагинации:

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `page` | integer | 1 | Номер страницы (начинается с 1) |
| `limit` | integer | 20 | Количество элементов на странице (max 100) |

**Формат ответа:**

```json
{
  "data": [...],
  "total": 156,
  "page": 1,
  "limit": 20,
  "has_more": true
}
```

### Rate Limiting

| Эндпоинт | Лимит | Окно |
|----------|-------|------|
| `POST /auth/request` | 3 запроса | 1 минута |
| `POST /auth/verify` | 5 попыток | 5 минут |
| Аутентифицированные запросы | 120 запросов | 1 минута |
| Публичные запросы | 60 запросов | 1 минута |
| Загрузка файлов | 10 запросов | 1 минута |

Заголовки rate-limit:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1708300800
```

### CORS

```
Access-Control-Allow-Origin: https://autotoj.tj, https://admin.autotoj.tj
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Accept-Language
Access-Control-Max-Age: 86400
```

---

## 2. Схема базы данных

### 2.1. users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,       -- +992XXXXXXXXX
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100),
    bio VARCHAR(150),
    avatar_url VARCHAR(500),
    banner_url VARCHAR(500),
    city_id VARCHAR(50) REFERENCES cities(id),
    user_type VARCHAR(20) NOT NULL DEFAULT 'private'
        CHECK (user_type IN ('private', 'business')),
    phone_verified BOOLEAN NOT NULL DEFAULT false,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    block_reason VARCHAR(50),                -- 'limit', 'attempts', 'server'
    blocked_until TIMESTAMPTZ,
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    ads_count INTEGER DEFAULT 0,
    fcm_token VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
```

### 2.2. auth_codes

```sql
CREATE TABLE auth_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_codes_phone ON auth_codes(phone, created_at DESC);
```

### 2.3. sessions

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 хеш JWT
    device_info JSONB,                        -- { platform, os, app_version }
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
```

### 2.4. vehicle_types

```sql
CREATE TABLE vehicle_types (
    id VARCHAR(50) PRIMARY KEY,              -- 'car', 'moto', 'commercial', 'special'
    name VARCHAR(100) NOT NULL,              -- 'Легковые', 'Мото', 'Коммерческие'
    icon VARCHAR(200),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.5. brands

```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    vehicle_type VARCHAR(50) NOT NULL REFERENCES vehicle_types(id),
    is_custom BOOLEAN NOT NULL DEFAULT false, -- Пользовательский бренд
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_brands_vehicle_type ON brands(vehicle_type);
CREATE INDEX idx_brands_name ON brands(name);
```

### 2.6. models

```sql
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_models_brand_id ON models(brand_id);
```

### 2.7. generations

```sql
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,              -- 'XV70', 'E90'
    year_from INTEGER NOT NULL,
    year_to INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_generations_model_id ON generations(model_id);
```

### 2.8. cities

```sql
CREATE TABLE cities (
    id VARCHAR(50) PRIMARY KEY,              -- 'dushanbe', 'khujand'
    name VARCHAR(100) NOT NULL,              -- 'Душанбе', 'Худжанд'
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.9. dict_items

```sql
-- Единая таблица для всех справочников (fuel_types, transmission_types, etc.)
CREATE TABLE dict_items (
    id VARCHAR(50) NOT NULL,
    dict_type VARCHAR(50) NOT NULL,          -- 'fuel_type', 'transmission', 'drive', 'body', 'color', 'condition', 'option'
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),                    -- Для options: 'safety', 'comfort', 'tech', 'exterior', 'interior', ...
    hex VARCHAR(7),                          -- Для цветов: '#FF0000'
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id, dict_type)
);

CREATE INDEX idx_dict_items_type ON dict_items(dict_type);
```

### 2.10. ads

```sql
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Категория
    category VARCHAR(20) NOT NULL
        CHECK (category IN ('cars', 'moto', 'commercial')),
    subcategory VARCHAR(50),                 -- 'motorcycle', 'atv', 'scooter', 'snowmobile',
                                             -- 'light_commercial', 'truck', 'semi_truck', 'bus',
                                             -- 'trailer', 'removable_body', 'agricultural',
                                             -- 'construction', 'loader', 'crane', 'excavator',
                                             -- 'bulldozer', 'municipal'

    -- Базовая информация
    title VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(100),                    -- '2.5 AT', 'Prestige', 'M60i xDrive'
    generation VARCHAR(50),
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL DEFAULT 0,      -- км

    -- Технические характеристики (автомобили)
    body_type VARCHAR(50),                   -- 'sedan', 'suv', 'hatchback', etc.
    engine_type VARCHAR(50),                 -- 'petrol', 'diesel', 'hybrid', 'electric', 'gas_petrol'
    engine_volume DECIMAL(4,1),              -- литры: 2.5, 3.3
    power INTEGER,                           -- л.с.
    transmission VARCHAR(30),                -- 'automatic', 'manual', 'robot', 'cvt'
    drive_type VARCHAR(30),                  -- 'fwd', 'rwd', 'awd'
    color VARCHAR(50),
    modification VARCHAR(60),
    vin VARCHAR(17),

    -- Мото-специфичные поля
    motorcycle_type VARCHAR(50),             -- 'sportbike', 'cruiser', 'enduro', etc. (25 типов)
    cylinder_layout VARCHAR(30),             -- 'v', 'opposed', 'inline', 'rotor'
    cylinder_count INTEGER,
    strokes INTEGER,                         -- 2 или 4

    -- Коммерческие специфичные поля
    bus_type VARCHAR(30),                    -- 'city', 'intercity', 'tourist', 'school', etc.
    load_capacity INTEGER,                   -- кг
    seats_count INTEGER,
    wheel_formula VARCHAR(10),               -- '4x2', '6x4', '6x6'
    steering_wheel VARCHAR(10),              -- 'left', 'right'

    -- Статусы
    vehicle_status VARCHAR(20) DEFAULT 'available'
        CHECK (vehicle_status IN ('available', 'on_order')),
    is_customs_cleared BOOLEAN DEFAULT true,
    origin_country VARCHAR(100),             -- Страна заказа (если status='on_order')
    condition VARCHAR(30),                   -- 'new', 'used', 'good', 'excellent'
    is_damaged BOOLEAN DEFAULT false,
    pts VARCHAR(30),                         -- 'original', 'electronic', 'duplicate', 'none'
    owners INTEGER,                          -- 0, 1, 2, 3, 4 (4 = 4+)

    -- Медиа
    photos TEXT[],                           -- URL массив (до 30)
    video_url VARCHAR(500),
    panorama_url VARCHAR(500),

    -- Опции / комплектация
    equipment TEXT[],                        -- Массив ID опций
    custom_equipment TEXT[],                 -- Пользовательские опции (текст)

    -- Описание и цена
    description TEXT,                        -- до 3000 символов
    price INTEGER NOT NULL,                  -- в сомони (TJS)
    currency VARCHAR(3) NOT NULL DEFAULT 'TJS',
    negotiable BOOLEAN DEFAULT false,        -- Торг
    can_exchange BOOLEAN DEFAULT false,      -- Обмен

    -- Контакты (копия на момент создания)
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_city VARCHAR(100),
    contact_additional VARCHAR(200),
    ready_for_online_viewing BOOLEAN DEFAULT false,

    -- Метрики
    views_count INTEGER NOT NULL DEFAULT 0,
    favorites_count INTEGER NOT NULL DEFAULT 0,

    -- Модерация и статус
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'moderation', 'active', 'rejected', 'archived')),
    rejection_reason TEXT,
    moderated_at TIMESTAMPTZ,
    moderated_by UUID,

    -- Временные метки
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_category ON ads(category);
CREATE INDEX idx_ads_brand_model ON ads(brand, model);
CREATE INDEX idx_ads_price ON ads(price);
CREATE INDEX idx_ads_year ON ads(year);
CREATE INDEX idx_ads_city ON ads(contact_city);
CREATE INDEX idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX idx_ads_published_at ON ads(published_at DESC);

-- Полнотекстовый поиск
CREATE INDEX idx_ads_search ON ads USING gin(
    to_tsvector('russian', coalesce(title, '') || ' ' || coalesce(brand, '') || ' ' || coalesce(model, '') || ' ' || coalesce(description, ''))
);
```

### 2.11. parts

```sql
CREATE TABLE parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Тип запчасти
    part_type VARCHAR(30) NOT NULL
        CHECK (part_type IN (
            'tires', 'wheels', 'engine', 'body_parts', 'transmission',
            'suspension', 'optics', 'steering_wheel', 'consumables'
        )),

    -- Общие поля
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'used')),
    brand VARCHAR(100),
    model VARCHAR(100),
    description TEXT,                        -- до 1000 символов
    price INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'TJS',
    photos TEXT[],                           -- URL массив (до 10)

    -- Контакты
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20) NOT NULL,
    contact_city VARCHAR(100),

    -- Шины (tires)
    tire_type VARCHAR(20),                   -- 'summer', 'winter', 'all_season'
    tire_vehicle_type VARCHAR(20),           -- 'cars', 'moto', 'commercial'
    tire_width INTEGER,                      -- мм (e.g. 205)
    tire_profile INTEGER,                    -- % (e.g. 55)
    tire_diameter INTEGER,                   -- R (e.g. 16)
    tire_load_index VARCHAR(10),
    tire_speed_index VARCHAR(5),
    tire_run_flat BOOLEAN DEFAULT false,
    tire_studded BOOLEAN DEFAULT false,
    tire_reinforced BOOLEAN DEFAULT false,
    tire_quantity INTEGER,
    tire_country_of_origin VARCHAR(100),

    -- Диски (wheels)
    wheel_diameter INTEGER,                  -- R
    wheel_width DECIMAL(4,1),               -- J (e.g. 7.5)
    wheel_pcd VARCHAR(20),                   -- '5x114.3'
    wheel_offset INTEGER,                    -- ET (мм)
    wheel_dia DECIMAL(5,1),                  -- Центральное отверстие (мм)
    wheel_type VARCHAR(20),                  -- 'alloy', 'forged', 'steel'
    wheel_material VARCHAR(20),              -- 'aluminum', 'steel'
    wheel_quantity INTEGER,

    -- Двигатель (engine)
    engine_type VARCHAR(30),
    engine_displacement INTEGER,             -- см³
    engine_power INTEGER,                    -- л.с.
    engine_cylinder_layout VARCHAR(20),      -- 'inline', 'v', 'opposed', 'rotary'
    engine_cylinder_count INTEGER,

    -- Кузовные запчасти (body_parts)
    body_part_category VARCHAR(30),          -- 'bumper', 'hood', 'fender', 'door', etc. (18 типов)
    body_part_side VARCHAR(20),              -- 'left', 'right', 'front', 'rear', 'any'
    body_part_color VARCHAR(50),

    -- Метрики и статус
    views_count INTEGER NOT NULL DEFAULT 0,
    favorites_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'moderation', 'active', 'rejected', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_parts_user_id ON parts(user_id);
CREATE INDEX idx_parts_type ON parts(part_type);
CREATE INDEX idx_parts_status ON parts(status);
CREATE INDEX idx_parts_price ON parts(price);
CREATE INDEX idx_parts_city ON parts(contact_city);
```

### 2.12. rental_cars

```sql
CREATE TABLE rental_cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    car_class VARCHAR(30) NOT NULL
        CHECK (car_class IN ('economy', 'comfort', 'business', 'premium',
                             'suv', 'minivan', 'convertible', 'sport')),
    year INTEGER NOT NULL,
    transmission VARCHAR(20) NOT NULL
        CHECK (transmission IN ('automatic', 'manual')),
    fuel_type VARCHAR(20) NOT NULL
        CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
    price_per_day INTEGER NOT NULL,          -- сомони/день
    currency VARCHAR(3) NOT NULL DEFAULT 'TJS',
    description TEXT,
    photos TEXT[],                            -- URL массив (до 10)

    -- Доп. характеристики (для детальной страницы)
    seats INTEGER DEFAULT 5,
    engine_volume VARCHAR(10),               -- '2.5L'
    mileage VARCHAR(30),                     -- '25,000 км'

    -- Контакты
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_city VARCHAR(100) NOT NULL,

    -- Метрики и статус
    views_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'moderation', 'active', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rental_user_id ON rental_cars(user_id);
CREATE INDEX idx_rental_class ON rental_cars(car_class);
CREATE INDEX idx_rental_price ON rental_cars(price_per_day);
CREATE INDEX idx_rental_city ON rental_cars(contact_city);
CREATE INDEX idx_rental_status ON rental_cars(status);
```

### 2.13. service_categories

```sql
CREATE TABLE service_categories (
    id VARCHAR(50) PRIMARY KEY,              -- 'auto_selection', 'tow_truck', etc.
    name VARCHAR(100) NOT NULL,              -- 'Автоподбор', 'Эвакуатор'
    icon VARCHAR(50),                        -- Имя иконки (Sparkles, Truck, etc.)
    bg_color VARCHAR(7),                     -- '#E8F5E9'
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9 категорий: auto_selection, tow_truck, inspection, car_service,
-- insurance, car_wash, tire_service, detailing, driving_school
```

### 2.14. service_providers

```sql
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id),
    user_id UUID REFERENCES users(id),       -- Если связан с пользователем
    name VARCHAR(200) NOT NULL,
    description TEXT,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(300),
    city_id VARCHAR(50) REFERENCES cities(id),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    logo_url VARCHAR(500),
    photos TEXT[],
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    working_hours JSONB,                     -- { "mon": "09:00-18:00", ... }
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'moderation')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_providers_category ON service_providers(category_id);
CREATE INDEX idx_providers_city ON service_providers(city_id);
```

### 2.15. favorites

```sql
CREATE TABLE favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, ad_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC);
```

### 2.16. chats

```sql
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_text TEXT,
    last_message_at TIMESTAMPTZ,
    last_message_is_mine BOOLEAN,            -- Относительно buyer
    buyer_unread_count INTEGER NOT NULL DEFAULT 0,
    seller_unread_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (ad_id, buyer_id)
);

CREATE INDEX idx_chats_buyer ON chats(buyer_id, updated_at DESC);
CREATE INDEX idx_chats_seller ON chats(seller_id, updated_at DESC);
```

### 2.17. messages

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    text TEXT,
    media_url VARCHAR(500),
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_chat ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
```

### 2.18. blocks

```sql
CREATE TABLE blocks (
    blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id)
);
```

### 2.19. reviews

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (reviewer_id, target_user_id)     -- Один отзыв на пользователя
);

CREATE INDEX idx_reviews_target ON reviews(target_user_id, created_at DESC);
```

### 2.20. logbook_posts

```sql
CREATE TABLE logbook_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    category VARCHAR(30) NOT NULL
        CHECK (category IN (
            'no_topic', 'automatics', 'advice', 'road_trips',
            'breakdown', 'maintenance', 'repair', 'tuning',
            'purchase', 'gadgets'
        )),
    photos TEXT[],                           -- URL массив (до 10)
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_logbook_author ON logbook_posts(author_id, created_at DESC);
CREATE INDEX idx_logbook_category ON logbook_posts(category);
```

### 2.21. logbook_comments

```sql
CREATE TABLE logbook_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES logbook_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_logbook_comments_post ON logbook_comments(post_id, created_at);
```

### 2.22. logbook_likes

```sql
CREATE TABLE logbook_likes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES logbook_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);
```

### 2.23. notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL
        CHECK (type IN (
            'new_message', 'ad_status', 'price_change',
            'new_review', 'system', 'promo'
        )),
    title VARCHAR(200) NOT NULL,
    body TEXT,
    data JSONB,                              -- { "ad_id": "...", "chat_id": "..." }
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE NOT is_read;
```

### 2.24. reports

```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    entity VARCHAR(30) NOT NULL CHECK (entity IN ('ad', 'user', 'review', 'logbook_post')),
    entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    moderator_id UUID REFERENCES users(id),
    moderator_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_entity ON reports(entity, entity_id);
CREATE INDEX idx_reports_status ON reports(status);
```

### 2.25. media

```sql
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(30) NOT NULL,        -- 'ad', 'part', 'rental', 'logbook', 'avatar', 'banner'
    entity_id UUID,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('image', 'video', 'panorama')),
    original_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    medium_url VARCHAR(500),
    width INTEGER,
    height INTEGER,
    file_size INTEGER,                       -- bytes
    mime_type VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_entity ON media(entity_type, entity_id);
CREATE INDEX idx_media_user ON media(user_id);
```

### 2.26. user_settings

```sql
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Уведомления
    notify_messages BOOLEAN NOT NULL DEFAULT true,
    notify_price_changes BOOLEAN NOT NULL DEFAULT true,
    notify_ad_status BOOLEAN NOT NULL DEFAULT true,
    notify_new_reviews BOOLEAN NOT NULL DEFAULT true,
    notify_system BOOLEAN NOT NULL DEFAULT true,
    notify_promo BOOLEAN NOT NULL DEFAULT false,

    -- Приватность
    hide_name BOOLEAN NOT NULL DEFAULT false,
    hide_phone BOOLEAN NOT NULL DEFAULT false,
    call_hours_from VARCHAR(5),              -- '09:00'
    call_hours_to VARCHAR(5),                -- '21:00'

    -- Приложение
    language VARCHAR(5) NOT NULL DEFAULT 'ru', -- 'ru', 'tj', 'en'
    theme VARCHAR(10) NOT NULL DEFAULT 'system', -- 'light', 'dark', 'system'

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 3. API роуты — Авторизация

### 3.1. `POST /auth/request` — Запрос OTP-кода

Отправляет SMS с 4/6-значным кодом на номер телефона.

**Авторизация:** Не требуется

**Request:**
```json
{
  "phone": "+992901234567"
}
```

**Валидация:**
- `phone` — обязательно, формат: `+992` + 9 цифр
- Rate limit: 3 запроса/минуту на номер

**Response 200:**
```json
{
  "success": true,
  "message": "SMS код отправлен",
  "expires_in": 120
}
```

**Response 429 (Too Many Requests):**
```json
{
  "error": {
    "code": "RATE_LIMIT",
    "message": "Слишком много запросов. Подождите 45 секунд."
  }
}
```

### 3.2. `POST /auth/verify` — Верификация OTP-кода

**Авторизация:** Не требуется

**Request:**
```json
{
  "phone": "+992901234567",
  "code": "123456"
}
```

**Валидация:**
- `phone` — обязательно
- `code` — обязательно, 4-6 цифр
- Максимум 5 попыток на код

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "+992901234567",
    "name": "Алишер",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

**Response 401 (Invalid Code):**
```json
{
  "error": {
    "code": "INVALID_CODE",
    "message": "Неверный код",
    "remaining_attempts": 3
  }
}
```

**Response 403 (Blocked):**
```json
{
  "error": {
    "code": "USER_BLOCKED",
    "message": "Аккаунт временно заблокирован",
    "block_reason": "attempts",
    "blocked_until": "2026-01-15T11:00:00Z"
  }
}
```

### 3.3. `POST /auth/logout` — Выход

**Авторизация:** Bearer token

**Response 200:**
```json
{
  "success": true
}
```

### 3.4. `POST /auth/refresh` — Обновление токена

**Авторизация:** Bearer token (может быть просроченный в пределах refresh window)

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-02-15T10:30:00Z"
}
```

---

## 4. API роуты — Справочники

### 4.1. `GET /vehicle-types` — Типы транспорта

**Авторизация:** Не требуется

**Response 200:**
```json
[
  { "id": "car", "name": "Легковые", "icon": "car" },
  { "id": "moto", "name": "Мото", "icon": "bike" },
  { "id": "commercial", "name": "Коммерческие", "icon": "truck" },
  { "id": "special", "name": "Спецтехника", "icon": "tractor" }
]
```

### 4.2. `GET /brands` — Бренды

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `type` | string | Фильтр по vehicle_type: `car`, `moto`, `commercial` |

**Response 200:**
```json
[
  { "id": "uuid-1", "name": "Toyota", "logo": "https://cdn.autotoj.tj/brands/toyota.png", "vehicle_type": "car" },
  { "id": "uuid-2", "name": "BMW", "logo": "https://cdn.autotoj.tj/brands/bmw.png", "vehicle_type": "car" },
  { "id": "uuid-3", "name": "Honda", "logo": null, "vehicle_type": "car" }
]
```

### 4.3. `GET /models` — Модели

**Query-параметры:**

| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|----------|
| `brand_id` | UUID | Да | ID бренда |

**Response 200:**
```json
[
  { "id": "uuid-10", "brand_id": "uuid-1", "name": "Camry" },
  { "id": "uuid-11", "brand_id": "uuid-1", "name": "Corolla" },
  { "id": "uuid-12", "brand_id": "uuid-1", "name": "RAV4" },
  { "id": "uuid-13", "brand_id": "uuid-1", "name": "Land Cruiser" }
]
```

### 4.4. `GET /generations` — Поколения

**Query-параметры:**

| Параметр | Тип | Обязательно | Описание |
|----------|-----|------------|----------|
| `model_id` | UUID | Да | ID модели |

**Response 200:**
```json
[
  { "id": "uuid-100", "model_id": "uuid-10", "name": "XV70", "year_from": 2017, "year_to": 2024 },
  { "id": "uuid-101", "model_id": "uuid-10", "name": "XV50", "year_from": 2011, "year_to": 2017 },
  { "id": "uuid-102", "model_id": "uuid-10", "name": "XV40", "year_from": 2006, "year_to": 2011 }
]
```

### 4.5. `GET /dicts` — Все справочники одним запросом

Кэшируется на клиенте. Используется при запуске приложения.

**Авторизация:** Не требуется

**Response 200:**
```json
{
  "vehicle_types": [
    { "id": "car", "name": "Легковые" },
    { "id": "moto", "name": "Мото" },
    { "id": "commercial", "name": "Коммерческие" }
  ],
  "brands": [
    { "id": "uuid-1", "name": "Toyota", "logo": "https://cdn.autotoj.tj/brands/toyota.png", "vehicle_type": "car" },
    { "id": "uuid-2", "name": "BMW", "logo": "https://cdn.autotoj.tj/brands/bmw.png", "vehicle_type": "car" },
    { "id": "uuid-3", "name": "Honda", "logo": "https://cdn.autotoj.tj/brands/honda.png", "vehicle_type": "car" }
  ],
  "models": [],
  "fuel_types": [
    { "id": "petrol", "name": "Бензин" },
    { "id": "diesel", "name": "Дизель" },
    { "id": "hybrid", "name": "Гибрид" },
    { "id": "electric", "name": "Электро" },
    { "id": "gas_petrol", "name": "Газ/Бензин" }
  ],
  "transmission_types": [
    { "id": "automatic", "name": "Автомат" },
    { "id": "manual", "name": "Механика" },
    { "id": "robot", "name": "Робот" },
    { "id": "cvt", "name": "Вариатор" }
  ],
  "drive_types": [
    { "id": "fwd", "name": "Передний" },
    { "id": "rwd", "name": "Задний" },
    { "id": "awd", "name": "Полный" }
  ],
  "body_types": [
    { "id": "sedan", "name": "Седан" },
    { "id": "suv", "name": "Внедорожник" },
    { "id": "hatchback", "name": "Хэтчбек" },
    { "id": "wagon", "name": "Универсал" },
    { "id": "coupe", "name": "Купе" },
    { "id": "minivan", "name": "Минивэн" },
    { "id": "cabrio", "name": "Кабриолет" },
    { "id": "crossover", "name": "Кроссовер" },
    { "id": "pickup", "name": "Пикап" },
    { "id": "van", "name": "Фургон" },
    { "id": "liftback", "name": "Лифтбек" }
  ],
  "colors": [
    { "id": "white", "name": "Белый", "hex": "#FFFFFF" },
    { "id": "black", "name": "Чёрный", "hex": "#000000" },
    { "id": "gray", "name": "Серый", "hex": "#808080" },
    { "id": "silver", "name": "Серебристый", "hex": "#C0C0C0" },
    { "id": "red", "name": "Красный", "hex": "#FF0000" },
    { "id": "blue", "name": "Синий", "hex": "#0000FF" },
    { "id": "green", "name": "Зелёный", "hex": "#008000" },
    { "id": "brown", "name": "Коричневый", "hex": "#8B4513" },
    { "id": "beige", "name": "Бежевый", "hex": "#F5F5DC" },
    { "id": "yellow", "name": "Жёлтый", "hex": "#FFD700" },
    { "id": "orange", "name": "Оранжевый", "hex": "#FF8C00" },
    { "id": "purple", "name": "Фиолетовый", "hex": "#800080" }
  ],
  "cities": [
    { "id": "dushanbe", "name": "Душанбе" },
    { "id": "khujand", "name": "Худжанд" },
    { "id": "kulob", "name": "Куляб" },
    { "id": "qurghonteppa", "name": "Курган-Тюбе" },
    { "id": "istaravshan", "name": "Истаравшан" },
    { "id": "tursunzoda", "name": "Турсунзаде" },
    { "id": "khorog", "name": "Хорог" },
    { "id": "panjakent", "name": "Пенджикент" },
    { "id": "konibodom", "name": "Канибадам" }
  ],
  "conditions": [
    { "id": "new", "name": "Новый" },
    { "id": "used", "name": "С пробегом" }
  ],
  "options": [
    { "id": "conditioner", "name": "Кондиционер", "category": "comfort" },
    { "id": "climate_control", "name": "Климат-контроль", "category": "comfort" },
    { "id": "climate_2zone", "name": "Двухзонный климат-контроль", "category": "comfort" },
    { "id": "cruise_control", "name": "Круиз-контроль", "category": "comfort" },
    { "id": "adaptive_cruise", "name": "Адаптивный круиз-контроль", "category": "comfort" },
    { "id": "power_windows", "name": "Электростеклоподъёмники", "category": "comfort" },
    { "id": "power_seats", "name": "Электропривод сидений", "category": "comfort" },
    { "id": "power_mirrors", "name": "Электропривод зеркал", "category": "comfort" },
    { "id": "heated_seats", "name": "Подогрев сидений", "category": "comfort" },
    { "id": "heated_rear_seats", "name": "Подогрев задних сидений", "category": "comfort" },
    { "id": "heated_steering", "name": "Подогрев руля", "category": "comfort" },
    { "id": "heated_mirrors", "name": "Подогрев зеркал", "category": "comfort" },
    { "id": "ventilated_seats", "name": "Вентиляция сидений", "category": "comfort" },
    { "id": "massage_seats", "name": "Массаж сидений", "category": "comfort" },
    { "id": "push_start", "name": "Запуск кнопкой", "category": "comfort" },
    { "id": "keyless_entry", "name": "Бесключевой доступ", "category": "comfort" },
    { "id": "abs", "name": "ABS", "category": "safety" },
    { "id": "esp", "name": "ESP/ESC", "category": "safety" },
    { "id": "airbags_front", "name": "Подушки безопасности (фронтальные)", "category": "safety" },
    { "id": "airbags_side", "name": "Подушки безопасности (боковые)", "category": "safety" },
    { "id": "airbags_curtain", "name": "Подушки безопасности (шторки)", "category": "safety" },
    { "id": "isofix", "name": "Isofix", "category": "safety" },
    { "id": "immobilizer", "name": "Иммобилайзер", "category": "safety" },
    { "id": "alarm", "name": "Сигнализация", "category": "safety" },
    { "id": "central_lock", "name": "Центральный замок", "category": "safety" },
    { "id": "tpms", "name": "Контроль давления в шинах", "category": "safety" },
    { "id": "blind_spot", "name": "Контроль слепых зон", "category": "safety" },
    { "id": "lane_keeping", "name": "Удержание в полосе", "category": "safety" },
    { "id": "hill_assist", "name": "Ассистент старта в гору", "category": "safety" },
    { "id": "auto_brake", "name": "Автоматическое экстренное торможение", "category": "safety" },
    { "id": "multimedia", "name": "Мультимедийная система", "category": "tech" },
    { "id": "touchscreen", "name": "Сенсорный экран", "category": "tech" },
    { "id": "navigation", "name": "Навигация", "category": "tech" },
    { "id": "bluetooth", "name": "Bluetooth", "category": "tech" },
    { "id": "usb", "name": "USB", "category": "tech" },
    { "id": "apple_carplay", "name": "Apple CarPlay", "category": "tech" },
    { "id": "android_auto", "name": "Android Auto", "category": "tech" },
    { "id": "voice_control", "name": "Голосовое управление", "category": "tech" },
    { "id": "hud", "name": "Проекция на лобовое стекло (HUD)", "category": "tech" },
    { "id": "digital_dash", "name": "Цифровая приборная панель", "category": "tech" },
    { "id": "premium_audio", "name": "Аудиосистема премиум", "category": "tech" },
    { "id": "alloy_wheels", "name": "Легкосплавные диски", "category": "exterior" },
    { "id": "fog_lights", "name": "Противотуманные фары", "category": "exterior" },
    { "id": "led_headlights", "name": "LED фары", "category": "exterior" },
    { "id": "xenon", "name": "Ксенон", "category": "exterior" },
    { "id": "drl", "name": "Дневные ходовые огни", "category": "exterior" },
    { "id": "sunroof", "name": "Люк", "category": "exterior" },
    { "id": "panoramic_roof", "name": "Панорамная крыша", "category": "exterior" },
    { "id": "roof_rails", "name": "Рейлинги на крыше", "category": "exterior" },
    { "id": "tinted_windows", "name": "Тонированные стёкла", "category": "exterior" },
    { "id": "leather", "name": "Кожаный салон", "category": "interior" },
    { "id": "fabric", "name": "Тканевый салон", "category": "interior" },
    { "id": "combined", "name": "Комбинированный салон", "category": "interior" },
    { "id": "sport_seats", "name": "Спортивные сиденья", "category": "interior" },
    { "id": "steering_adjust", "name": "Регулировка руля", "category": "interior" },
    { "id": "multifunction_steering", "name": "Многофункциональный руль", "category": "interior" },
    { "id": "ambient_light", "name": "Подсветка салона", "category": "interior" },
    { "id": "rear_camera", "name": "Камера заднего вида", "category": "utility" },
    { "id": "camera_360", "name": "Камеры 360°", "category": "utility" },
    { "id": "front_sensors", "name": "Парктроники (передние)", "category": "utility" },
    { "id": "rear_sensors", "name": "Парктроники (задние)", "category": "utility" },
    { "id": "power_trunk", "name": "Электропривод багажника", "category": "utility" },
    { "id": "folding_seats", "name": "Складные задние сиденья", "category": "utility" },
    { "id": "outlet_12v", "name": "Розетка 12V", "category": "utility" }
  ]
}
```

### 4.6. `GET /cities` — Список городов

**Авторизация:** Не требуется

**Response 200:**
```json
[
  { "id": "dushanbe", "name": "Душанбе" },
  { "id": "khujand", "name": "Худжанд" },
  { "id": "kulob", "name": "Куляб" },
  { "id": "qurghonteppa", "name": "Курган-Тюбе" },
  { "id": "khorog", "name": "Хорог" },
  { "id": "istaravshan", "name": "Истаравшан" },
  { "id": "tursunzoda", "name": "Турсунзаде" },
  { "id": "isfara", "name": "Исфара" },
  { "id": "panjakent", "name": "Пенджикент" },
  { "id": "konibodom", "name": "Канибадам" }
]
```

---

## 5. API роуты — Объявления

### 5.1. `GET /ads` — Поиск объявлений

**Авторизация:** Не требуется

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `q` | string | Текстовый поиск (бренд, модель, описание) |
| `type` | string | Тип ТС: `car`, `moto`, `commercial` |
| `brand_id` | UUID | ID бренда |
| `model_id` | UUID | ID модели |
| `generation_id` | UUID | ID поколения |
| `year_from` | integer | Год от (1980+) |
| `year_to` | integer | Год до |
| `price_from` | integer | Цена от (сомони) |
| `price_to` | integer | Цена до |
| `city_id` | string | ID города |
| `mileage_from` | integer | Пробег от (км) |
| `mileage_to` | integer | Пробег до |
| `fuel` | string | Тип топлива: `petrol`, `diesel`, `hybrid`, `electric`, `gas_petrol` |
| `transmission` | string | КПП: `automatic`, `manual`, `robot`, `cvt` |
| `drive` | string | Привод: `fwd`, `rwd`, `awd` |
| `body` | string | Тип кузова: `sedan`, `suv`, `hatchback`, ... |
| `color` | string | Цвет: `black`, `white`, `silver`, ... |
| `condition` | string | Состояние: `new`, `used` |
| `with_photos` | boolean | Только с фото |
| `with_video` | boolean | Только с видео |
| `sort` | string | Сортировка: `date_desc` (default), `date_asc`, `price_asc`, `price_desc` |
| `page` | integer | Страница (default: 1) |
| `limit` | integer | Кол-во (default: 20, max: 100) |

**Response 200:**
```json
{
  "ads": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Toyota Land Cruiser 300 Prestige",
      "price": 550000,
      "currency": "TJS",
      "year": 2024,
      "mileage": 0,
      "location": "Душанбе",
      "photos": [
        "https://cdn.autotoj.tj/ads/550e8400/photo_1.jpg",
        "https://cdn.autotoj.tj/ads/550e8400/photo_2.jpg"
      ],
      "brand": "Toyota",
      "model": "Land Cruiser 300",
      "generation": null,
      "fuel": "Дизель",
      "transmission": "Автомат",
      "drive": "Полный",
      "body": "Внедорожник",
      "color": "Белый",
      "condition": "Новый",
      "engine_volume": 3.3,
      "power": 299,
      "seller": {
        "id": "seller-uuid",
        "name": "Автосалон Премиум Авто",
        "phone": "+992921000001"
      },
      "views": 245,
      "favorites": 12,
      "status": "active",
      "created_at": "2026-01-22T10:00:00Z",
      "updated_at": "2026-01-22T10:00:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20,
  "has_more": true
}
```

### 5.2. `GET /ads/:id` — Детали объявления

**Авторизация:** Не требуется

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Toyota Land Cruiser 300 Prestige",
  "price": 550000,
  "currency": "TJS",
  "year": 2024,
  "mileage": 0,
  "location": "Душанбе",
  "photos": [
    "https://cdn.autotoj.tj/ads/550e8400/photo_1.jpg",
    "https://cdn.autotoj.tj/ads/550e8400/photo_2.jpg",
    "https://cdn.autotoj.tj/ads/550e8400/photo_3.jpg"
  ],
  "video": "https://cdn.autotoj.tj/ads/550e8400/video.mp4",
  "panorama": null,
  "brand": "Toyota",
  "model": "Land Cruiser 300",
  "version": "Prestige",
  "generation": null,
  "fuel": "Дизель",
  "transmission": "Автомат",
  "drive": "Полный",
  "body": "Внедорожник",
  "color": "Белый",
  "condition": "Новый",
  "engine_volume": 3.3,
  "power": 299,
  "vin": null,
  "description": "Новый Toyota Land Cruiser 300 2024 года, 0 км. Официальный дилер.",
  "options": [
    "panoramic_roof", "climate_2zone", "ventilated_seats", "leather",
    "camera_360", "adaptive_cruise", "blind_spot", "navigation",
    "premium_audio", "led_headlights", "power_trunk"
  ],
  "negotiable": false,
  "can_exchange": false,
  "vehicle_status": "available",
  "is_customs_cleared": true,
  "pts": "original",
  "owners": 0,
  "is_damaged": false,
  "seller": {
    "id": "seller-uuid",
    "name": "Автосалон Премиум Авто",
    "phone": "+992921000001",
    "type": "business",
    "ads_count": 12,
    "phone_verified": true,
    "rating": 4.8,
    "reviews_count": 24,
    "avatar": "https://cdn.autotoj.tj/avatars/seller-uuid.jpg"
  },
  "views": 245,
  "favorites": 12,
  "status": "active",
  "published_at": "2026-01-22T10:00:00Z",
  "created_at": "2026-01-22T09:30:00Z",
  "updated_at": "2026-01-22T10:00:00Z"
}
```

### 5.3. `POST /ads/:id/view` — Трекинг просмотра

**Авторизация:** Не требуется (может использовать IP/fingerprint для дедупликации)

**Response 200:**
```json
{
  "views": 246
}
```

### 5.4. `GET /ads/:id/similar` — Похожие объявления

**Query-параметры:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `limit` | integer | 10 | Кол-во (max 20) |

Алгоритм: тот же бренд → та же категория → ±20% цена → тот же город.

**Response 200:**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Toyota Camry 2020",
    "price": 145000,
    "currency": "TJS",
    "year": 2020,
    "mileage": 72000,
    "location": "Душанбе",
    "photos": ["https://cdn.autotoj.tj/ads/a1b2c3d4/photo_1.jpg"],
    "brand": "Toyota",
    "model": "Camry",
    "generation": "XV70",
    "fuel": "Бензин",
    "transmission": "Автомат",
    "drive": "Передний",
    "body": "Седан",
    "color": "Серебристый",
    "condition": "С пробегом",
    "engine_volume": 2.5,
    "power": 181,
    "seller": {
      "id": "seller-uuid-123",
      "name": "Рустам",
      "phone": "+992931112233"
    },
    "views": 120,
    "favorites": 5,
    "status": "active",
    "created_at": "2026-01-18T10:00:00Z",
    "updated_at": "2026-01-20T14:30:00Z"
  }
]
```

### 5.5. `POST /reports` — Жалоба на объявление

**Авторизация:** Bearer token

**Request:**
```json
{
  "entity": "ad",
  "entity_id": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "Мошенничество — несуществующий автомобиль"
}
```

**Response 200:**
```json
{
  "id": "report-uuid",
  "status": "pending"
}
```

### 5.6. `POST /ads/by-ids` — Объявления по списку ID

Используется для получения актуальных данных объявлений из списка избранного.

**Авторизация:** Не требуется

**Request:**
```json
{
  "ids": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Response 200:**
```json
[
  {
    "id": "uuid-1",
    "title": "Toyota Camry 2.5 AT 2020",
    "price": 95000,
    "currency": "TJS",
    "year": 2020,
    "mileage": 65000,
    "location": "Душанбе",
    "photos": ["https://cdn.autotoj.tj/ads/uuid-1/photo_1.jpg"],
    "brand": "Toyota",
    "model": "Camry",
    "generation": "XV70",
    "fuel": "Бензин",
    "transmission": "Автомат",
    "drive": "Передний",
    "body": "Седан",
    "color": "Серебристый",
    "condition": "С пробегом",
    "engine_volume": 2.5,
    "power": 181,
    "seller": {
      "id": "seller-uuid",
      "name": "Алишер",
      "phone": "+992901234567"
    },
    "views": 78,
    "favorites": 3,
    "status": "active",
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-01-20T12:00:00Z"
  },
  {
    "id": "uuid-2",
    "title": "BMW 3 Series 320i 2021",
    "price": 128000,
    "currency": "TJS",
    "year": 2021,
    "mileage": 42000,
    "location": "Худжанд",
    "photos": ["https://cdn.autotoj.tj/ads/uuid-2/photo_1.jpg"],
    "brand": "BMW",
    "model": "3 Series",
    "generation": "G20",
    "fuel": "Бензин",
    "transmission": "Автомат",
    "drive": "Задний",
    "body": "Седан",
    "color": "Чёрный",
    "condition": "С пробегом",
    "engine_volume": 2.0,
    "power": 184,
    "seller": {
      "id": "seller-uuid-2",
      "name": "Рустам",
      "phone": "+992937778899"
    },
    "views": 134,
    "favorites": 8,
    "status": "active",
    "created_at": "2026-01-18T09:00:00Z",
    "updated_at": "2026-01-21T16:00:00Z"
  }
]
```

> Если объявление удалено/архивировано — не возвращается в массиве.

---

## 6. API роуты — Мои объявления

Все эндпоинты требуют **авторизации (Bearer token)**.

### 6.1. `GET /my/ads` — Список моих объявлений

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `status` | string | Фильтр: `active`, `moderation`, `rejected`, `archived`, `draft` |
| `page` | integer | Страница (default: 1) |
| `limit` | integer | Кол-во (default: 20) |

**Response 200:**
```json
{
  "ads": [
    {
      "id": "my-ad-uuid",
      "title": "Toyota Camry 2020",
      "price": 95000,
      "currency": "TJS",
      "year": 2020,
      "mileage": 65000,
      "location": "Душанбе",
      "photos": ["https://cdn.autotoj.tj/ads/my-ad-uuid/photo_1.jpg"],
      "brand": "Toyota",
      "model": "Camry",
      "fuel": "Бензин",
      "transmission": "Автомат",
      "drive": "Передний",
      "body": "Седан",
      "color": "Серебристый",
      "condition": "С пробегом",
      "seller": { "id": "me", "name": "Алишер", "phone": "+992901234567" },
      "views": 245,
      "favorites": 12,
      "status": "active",
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-01-22T15:30:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20,
  "has_more": false
}
```

### 6.2. `POST /my/ads` — Создать черновик объявления

**Request:** Пустой body (черновик создаётся без данных)

**Response 201:**
```json
{
  "ad_id": "new-ad-uuid",
  "status": "draft"
}
```

### 6.3. `GET /my/ads/:id` — Детали моего объявления

Аналогичен `GET /ads/:id`, но возвращает даже draft/rejected объявления текущего пользователя.

### 6.4. `PATCH /my/ads/:id` — Обновить объявление

**Request (все поля опциональны):**
```json
{
  "vehicle_type": "car",
  "brand_id": "uuid-1",
  "model_id": "uuid-10",
  "generation_id": "uuid-100",
  "year": 2020,
  "body": "sedan",
  "condition": "used",
  "mileage": 65000,
  "fuel": "petrol",
  "transmission": "automatic",
  "drive": "fwd",
  "engine_volume": 2.5,
  "power": 181,
  "price": 145000,
  "city_id": "dushanbe",
  "color": "silver",
  "vin": "4T1BF1FK8CU123456",
  "options": ["climate_control", "heated_seats", "rear_camera", "bluetooth", "leather"],
  "description": "Toyota Camry 2020 года в хорошем состоянии.",
  "contact_name": "Рустам",
  "contact_phone": "+992931112233",
  "contact_additional": null
}
```

**Response 200:**
```json
{
  "id": "my-ad-uuid",
  "title": "Toyota Camry 2.5 AT 2020",
  "price": 145000,
  "currency": "TJS",
  "year": 2020,
  "mileage": 65000,
  "location": "Душанбе",
  "photos": ["https://cdn.autotoj.tj/ads/my-ad-uuid/photo_1.jpg"],
  "brand": "Toyota",
  "model": "Camry",
  "version": "2.5 AT",
  "generation": "XV70",
  "fuel": "Бензин",
  "transmission": "Автомат",
  "drive": "Передний",
  "body": "Седан",
  "color": "Серебристый",
  "condition": "С пробегом",
  "engine_volume": 2.5,
  "power": 181,
  "vin": "4T1BF1FK8CU123456",
  "description": "Toyota Camry 2020 года в хорошем состоянии.",
  "options": ["climate_control", "heated_seats", "rear_camera", "bluetooth", "leather"],
  "negotiable": false,
  "can_exchange": false,
  "vehicle_status": "available",
  "is_customs_cleared": true,
  "pts": "original",
  "owners": 1,
  "is_damaged": false,
  "seller": {
    "id": "me-uuid",
    "name": "Рустам",
    "phone": "+992931112233",
    "type": "private",
    "ads_count": 3,
    "phone_verified": true,
    "rating": 4.5,
    "reviews_count": 8,
    "avatar": null
  },
  "views": 0,
  "favorites": 0,
  "status": "draft",
  "published_at": null,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-22T15:30:00Z"
}
```

> `title` генерируется автоматически из `brand + model + version + year`.

### 6.5. `POST /my/ads/:id/photos` — Загрузка фото

**Content-Type:** `multipart/form-data`

**Form fields:**
- `photos` — файлы изображений (до 30 штук, max 10 MB каждый)

**Response 200:**
```json
[
  { "id": "photo-uuid-1", "url": "https://cdn.autotoj.tj/ads/my-ad-uuid/photo_1.jpg" },
  { "id": "photo-uuid-2", "url": "https://cdn.autotoj.tj/ads/my-ad-uuid/photo_2.jpg" }
]
```

### 6.6. `POST /my/ads/:id/video` — Загрузка видео

**Content-Type:** `multipart/form-data`

**Form fields:**
- `video` — видеофайл (1 штука, max 100 MB, до 60 секунд)

**Response 200:**
```json
{
  "id": "video-uuid",
  "url": "https://cdn.autotoj.tj/ads/my-ad-uuid/video.mp4"
}
```

### 6.7. `POST /my/ads/:id/panorama` — Загрузка панорамы

**Content-Type:** `multipart/form-data`

**Form fields:**
- `panorama` — изображение панорамы (1 штука, max 20 MB)

**Response 200:**
```json
{
  "id": "pano-uuid",
  "url": "https://cdn.autotoj.tj/ads/my-ad-uuid/panorama.jpg"
}
```

### 6.8. `POST /my/ads/:id/submit` — Отправить на модерацию

Переводит объявление из `draft` в `moderation`.

**Валидация:** Проверяет наличие обязательных полей (brand, model, year, price, contact).

**Response 200:**
```json
{
  "id": "my-ad-uuid",
  "status": "moderation",
  "title": "Toyota Camry 2.5 AT 2020",
  "price": 145000,
  "currency": "TJS",
  "year": 2020,
  "brand": "Toyota",
  "model": "Camry",
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-22T16:00:00Z"
}
```

**Response 422 (Validation Error):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Не заполнены обязательные поля",
    "fields": {
      "price": "Укажите цену",
      "contact_phone": "Укажите номер телефона"
    }
  }
}
```

### 6.9. `DELETE /my/ads/:id` — Удалить объявление

**Response 204:** Пустой ответ

### 6.10. `POST /my/ads/:id/archive` — Архивировать объявление

**Response 200:**
```json
{
  "id": "my-ad-uuid",
  "status": "archived",
  "title": "Toyota Camry 2.5 AT 2020",
  "price": 145000,
  "currency": "TJS",
  "year": 2020,
  "brand": "Toyota",
  "model": "Camry",
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-22T17:00:00Z"
}
```

### 6.11. `POST /my/ads/:id/restore` — Восстановить из архива

Восстанавливает в статус `active`.

**Response 200:**
```json
{
  "id": "my-ad-uuid",
  "status": "active",
  "title": "Toyota Camry 2.5 AT 2020",
  "price": 145000,
  "currency": "TJS",
  "year": 2020,
  "brand": "Toyota",
  "model": "Camry",
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-22T18:00:00Z"
}
```

---

## 7. API роуты — Запчасти

### 7.1. `GET /parts` — Поиск запчастей

**Авторизация:** Не требуется

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `q` | string | Текстовый поиск |
| `part_type` | string | Тип: `tires`, `wheels`, `engine`, `body_parts`, `transmission`, `suspension`, `optics`, `steering_wheel`, `consumables` |
| `condition` | string | Состояние: `new`, `used` |
| `price_from` | integer | Цена от |
| `price_to` | integer | Цена до |
| `city_id` | string | ID города |
| `brand` | string | Бренд (для двигателей, дисков) |
| `sort` | string | `date_desc`, `date_asc`, `price_asc`, `price_desc` |
| `page` | integer | Страница |
| `limit` | integer | Кол-во (max 100) |

**Доп. фильтры для шин (part_type=tires):**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `tire_type` | string | `summer`, `winter`, `all_season` |
| `tire_width` | integer | Ширина (мм) |
| `tire_profile` | integer | Профиль (%) |
| `tire_diameter` | integer | Диаметр (R) |

**Доп. фильтры для дисков (part_type=wheels):**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `wheel_diameter` | integer | Диаметр (R) |
| `wheel_pcd` | string | Разболтовка (e.g. `5x114.3`) |
| `wheel_type` | string | `alloy`, `forged`, `steel` |

**Response 200:**
```json
{
  "parts": [
    {
      "id": "part-uuid",
      "part_type": "tires",
      "title": "Michelin Pilot Sport 4 225/45 R18",
      "condition": "new",
      "brand": "Michelin",
      "model": "Pilot Sport 4",
      "price": 450,
      "currency": "TJS",
      "photos": ["https://cdn.autotoj.tj/parts/part-uuid/photo_1.jpg"],
      "contact_city": "Душанбе",
      "tire_type": "summer",
      "tire_width": 225,
      "tire_profile": 45,
      "tire_diameter": 18,
      "views_count": 32,
      "status": "active",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "has_more": true
}
```

### 7.2. `GET /parts/:id` — Детали запчасти

**Response 200:**
```json
{
  "id": "part-uuid",
  "part_type": "tires",
  "condition": "new",
  "brand": "Michelin",
  "model": "Pilot Sport 4",
  "description": "Новые летние шины. Полный комплект 4 шт.",
  "price": 450,
  "currency": "TJS",
  "photos": ["https://cdn.autotoj.tj/parts/part-uuid/photo_1.jpg"],
  "contact_name": "Давлат",
  "contact_phone": "+992925556677",
  "contact_city": "Душанбе",
  "tire_type": "summer",
  "tire_vehicle_type": "cars",
  "tire_width": 225,
  "tire_profile": 45,
  "tire_diameter": 18,
  "tire_load_index": "95",
  "tire_speed_index": "Y",
  "tire_run_flat": false,
  "tire_studded": false,
  "tire_reinforced": true,
  "tire_quantity": 4,
  "tire_country_of_origin": "Франция",
  "views_count": 32,
  "favorites_count": 3,
  "status": "active",
  "published_at": "2026-01-20T10:00:00Z",
  "created_at": "2026-01-20T09:30:00Z",
  "updated_at": "2026-01-20T10:00:00Z",
  "seller": {
    "id": "seller-uuid",
    "name": "Давлат",
    "phone": "+992925556677",
    "rating": 4.5,
    "ads_count": 8
  }
}
```

### 7.3. `POST /my/parts` — Создать объявление запчасти

**Авторизация:** Bearer token

**Request (пример — шины):**
```json
{
  "part_type": "tires",
  "condition": "new",
  "brand": "Michelin",
  "model": "Pilot Sport 4",
  "tire_type": "summer",
  "tire_vehicle_type": "cars",
  "tire_width": 225,
  "tire_profile": 45,
  "tire_diameter": 18,
  "tire_load_index": "95",
  "tire_speed_index": "Y",
  "tire_run_flat": false,
  "tire_studded": false,
  "tire_reinforced": true,
  "tire_quantity": 4,
  "tire_country_of_origin": "Франция",
  "description": "Новые летние шины. Полный комплект 4 шт.",
  "price": 450,
  "contact_name": "Давлат",
  "contact_phone": "+992925556677",
  "contact_city": "Душанбе"
}
```

**Request (пример — диски):**
```json
{
  "part_type": "wheels",
  "condition": "used",
  "wheel_diameter": 17,
  "wheel_width": 7.5,
  "wheel_pcd": "5x114.3",
  "wheel_offset": 45,
  "wheel_dia": 60.1,
  "wheel_type": "alloy",
  "wheel_material": "aluminum",
  "wheel_quantity": 4,
  "brand": "BBS",
  "model": "CH-R",
  "description": "Литые диски BBS, б/у, в отличном состоянии.",
  "price": 1200,
  "contact_phone": "+992925556677",
  "contact_city": "Душанбе"
}
```

**Request (пример — двигатель):**
```json
{
  "part_type": "engine",
  "condition": "used",
  "brand": "Toyota",
  "model": "Camry",
  "engine_type": "petrol",
  "engine_displacement": 2500,
  "engine_power": 181,
  "engine_cylinder_layout": "inline",
  "engine_cylinder_count": 4,
  "description": "Контрактный двигатель 2AR-FE, пробег 60 тыс.",
  "price": 5000,
  "contact_name": "Фарход",
  "contact_phone": "+992911112233",
  "contact_city": "Душанбе"
}
```

**Request (пример — кузовные запчасти):**
```json
{
  "part_type": "body_parts",
  "condition": "new",
  "body_part_category": "bumper",
  "body_part_side": "front",
  "body_part_color": "white",
  "brand": "Toyota",
  "model": "Camry XV70",
  "description": "Передний бампер Toyota Camry XV70, новый, оригинал.",
  "price": 800,
  "contact_phone": "+992931112233",
  "contact_city": "Душанбе"
}
```

**Response 201:**
```json
{
  "id": "new-part-uuid",
  "part_type": "tires",
  "status": "moderation",
  "created_at": "2026-01-22T10:00:00Z"
}
```

### 7.4. `PATCH /my/parts/:id` — Обновить запчасть

**Авторизация:** Bearer token

Аналогичен `POST /my/parts`, все поля опциональны.

### 7.5. `DELETE /my/parts/:id` — Удалить запчасть

**Авторизация:** Bearer token

**Response 204:** Пустой ответ

### 7.6. `GET /my/parts` — Мои запчасти

**Авторизация:** Bearer token

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `status` | string | `active`, `moderation`, `archived` |
| `page` | integer | Страница |
| `limit` | integer | Кол-во |

**Response 200:** Аналогичен `GET /parts`, но включает черновики и отклонённые.

### 7.7. `POST /my/parts/:id/photos` — Загрузка фото запчасти

**Content-Type:** `multipart/form-data`

**Form fields:**
- `photos` — файлы изображений (до 10 штук, max 10 MB каждый)

**Response 200:**
```json
[
  { "id": "photo-uuid-1", "url": "https://cdn.autotoj.tj/parts/part-uuid/photo_1.jpg" }
]
```

### 7.8. Справочник типов кузовных запчастей

| ID | Название (ru) |
|----|--------------|
| `bumper` | Бампер |
| `hood` | Капот |
| `fender` | Крыло |
| `door` | Дверь |
| `trunk_lid` | Крышка багажника |
| `roof` | Крыша |
| `sill` | Порог |
| `body_panel` | Панель кузова |
| `longerone` | Лонжерон |
| `grille` | Решётка радиатора |
| `mirror` | Зеркало |
| `glass` | Стекло |
| `headlight` | Фара |
| `taillight` | Фонарь |
| `molding` | Молдинг |
| `bumper_reinforcement` | Усилитель бампера |
| `fender_liner` | Подкрылок |
| `engine_guard` | Защита двигателя |

---

## 8. API роуты — Аренда

### 8.1. `GET /rental` — Список авто в аренду

**Авторизация:** Не требуется

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `q` | string | Текстовый поиск |
| `car_class` | string | Класс (множественные через запятую): `economy`, `comfort`, `business`, `premium`, `suv`, `minivan`, `convertible`, `sport` |
| `price_from` | integer | Цена от (сомони/день) |
| `price_to` | integer | Цена до |
| `city` | string | Город (множественные через запятую) |
| `sort` | string | `date_desc`, `price_asc`, `price_desc` |
| `page` | integer | Страница |
| `limit` | integer | Кол-во |

**Response 200:**
```json
{
  "cars": [
    {
      "id": "rental-uuid",
      "title": "Toyota Camry 2023",
      "car_class": "comfort",
      "year": 2023,
      "transmission": "automatic",
      "fuel_type": "petrol",
      "price_per_day": 1500,
      "currency": "TJS",
      "photos": ["https://cdn.autotoj.tj/rental/rental-uuid/photo_1.jpg"],
      "contact_city": "Душанбе",
      "published_at": "2026-01-22T10:00:00Z"
    }
  ],
  "total": 23,
  "page": 1,
  "limit": 20,
  "has_more": true
}
```

### 8.2. `GET /rental/:id` — Детали арендного авто

**Response 200:**
```json
{
  "id": "rental-uuid",
  "title": "Toyota Camry 2023",
  "car_class": "comfort",
  "year": 2023,
  "transmission": "automatic",
  "fuel_type": "petrol",
  "price_per_day": 1500,
  "currency": "TJS",
  "description": "Комфортный седан для деловых поездок.",
  "photos": [
    "https://cdn.autotoj.tj/rental/rental-uuid/photo_1.jpg",
    "https://cdn.autotoj.tj/rental/rental-uuid/photo_2.jpg"
  ],
  "seats": 5,
  "engine_volume": "2.5L",
  "mileage": "25,000 км",
  "owner": {
    "id": "owner-uuid",
    "name": "Алишер",
    "phone": "+992901234567",
    "city": "Душанбе",
    "avatar": "https://cdn.autotoj.tj/avatars/owner-uuid.jpg",
    "rating": 4.8,
    "reviews_count": 12,
    "cars_count": 5
  },
  "views_count": 87,
  "published_at": "2026-01-22T10:00:00Z",
  "created_at": "2026-01-22T09:30:00Z"
}
```

### 8.3. `POST /my/rental` — Добавить авто в аренду

**Авторизация:** Bearer token

**Request:**
```json
{
  "title": "Toyota Camry 2023",
  "car_class": "comfort",
  "year": 2023,
  "transmission": "automatic",
  "fuel_type": "petrol",
  "price_per_day": 1500,
  "description": "Комфортный седан для деловых поездок.",
  "contact_name": "Алишер",
  "contact_phone": "+992901234567",
  "contact_city": "Душанбе"
}
```

**Response 201:**
```json
{
  "id": "new-rental-uuid",
  "status": "moderation",
  "created_at": "2026-01-22T10:00:00Z"
}
```

### 8.4. `PATCH /my/rental/:id` — Обновить арендное авто

**Авторизация:** Bearer token

Все поля опциональны. Формат аналогичен `POST /my/rental`.

### 8.5. `DELETE /my/rental/:id` — Удалить арендное авто

**Авторизация:** Bearer token

**Response 204:** Пустой ответ

### 8.6. `GET /my/rental` — Мои арендные авто

**Авторизация:** Bearer token

**Response 200:** Аналогичен `GET /rental`, включает все статусы.

### 8.7. `POST /my/rental/:id/photos` — Загрузка фото

**Content-Type:** `multipart/form-data`

**Form fields:**
- `photos` — файлы изображений (до 10 штук, max 10 MB)

**Response 200:**
```json
[
  { "id": "photo-uuid", "url": "https://cdn.autotoj.tj/rental/rental-uuid/photo_1.jpg" }
]
```

### 8.8. `GET /rental/:id/similar` — Похожие арендные авто

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `limit` | integer | Кол-во (default: 6) |

Алгоритм: тот же класс → тот же город → ±30% цена.

**Response 200:**
```json
[
  {
    "id": "similar-rental-uuid-1",
    "title": "Hyundai Sonata 2022",
    "car_class": "comfort",
    "year": 2022,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "price_per_day": 1200,
    "currency": "TJS",
    "photos": ["https://cdn.autotoj.tj/rental/similar-rental-uuid-1/photo_1.jpg"],
    "contact_city": "Душанбе",
    "published_at": "2026-01-20T10:00:00Z"
  },
  {
    "id": "similar-rental-uuid-2",
    "title": "Kia K5 2023",
    "car_class": "comfort",
    "year": 2023,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "price_per_day": 1400,
    "currency": "TJS",
    "photos": ["https://cdn.autotoj.tj/rental/similar-rental-uuid-2/photo_1.jpg"],
    "contact_city": "Душанбе",
    "published_at": "2026-01-19T12:00:00Z"
  }
]
```

### 8.9. Справочник классов автомобилей (аренда)

| ID | Название (ru) |
|----|--------------|
| `economy` | Эконом |
| `comfort` | Комфорт |
| `business` | Бизнес |
| `premium` | Премиум |
| `suv` | Внедорожник |
| `minivan` | Минивэн |
| `convertible` | Кабриолет |
| `sport` | Спортивный |

---

## 9. API роуты — Сервисы

### 9.1. `GET /service-categories` — Категории сервисов

**Авторизация:** Не требуется

**Response 200:**
```json
[
  { "id": "auto_selection", "name": "Автоподбор", "icon": "sparkles", "companies_count": 3 },
  { "id": "tow_truck", "name": "Эвакуатор", "icon": "truck", "companies_count": 4 },
  { "id": "inspection", "name": "Техосмотр", "icon": "clipboard_check", "companies_count": 3 },
  { "id": "car_service", "name": "Автосервис", "icon": "settings", "companies_count": 5 },
  { "id": "insurance", "name": "Страховка", "icon": "shield_check", "companies_count": 4 },
  { "id": "car_wash", "name": "Автомойка", "icon": "droplets", "companies_count": 8 },
  { "id": "tire_service", "name": "Шиномонтаж", "icon": "circle_dot", "companies_count": 6 },
  { "id": "detailing", "name": "Детейлинг", "icon": "star", "companies_count": 3 },
  { "id": "driving_school", "name": "Автошкола", "icon": "graduation_cap", "companies_count": 4 }
]
```

### 9.2. `GET /service-providers` — Список поставщиков услуг

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `category_id` | string | Обязательно. ID категории (e.g. `car_service`) |
| `city_id` | string | Фильтр по городу |
| `q` | string | Текстовый поиск |
| `sort` | string | `rating_desc`, `reviews_desc`, `name_asc` |
| `page` | integer | Страница |
| `limit` | integer | Кол-во |

**Response 200:**
```json
{
  "providers": [
    {
      "id": "provider-uuid",
      "name": "AutoService Plus",
      "category_id": "car_service",
      "description": "Полный спектр автосервисных услуг.",
      "phone": "+992901234567",
      "address": "ул. Рудаки 100, Душанбе",
      "city": "Душанбе",
      "logo_url": "https://cdn.autotoj.tj/providers/provider-uuid/logo.jpg",
      "rating": 4.7,
      "reviews_count": 32,
      "is_verified": true,
      "working_hours": {
        "mon": "08:00-18:00",
        "tue": "08:00-18:00",
        "wed": "08:00-18:00",
        "thu": "08:00-18:00",
        "fri": "08:00-18:00",
        "sat": "09:00-15:00",
        "sun": null
      }
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "has_more": false
}
```

### 9.3. `GET /service-providers/:id` — Детали поставщика

**Response 200:**
```json
{
  "id": "provider-uuid",
  "name": "AutoService Plus",
  "category_id": "car_service",
  "description": "Полный спектр автосервисных услуг. Диагностика, ремонт двигателей, КПП, ходовой части.",
  "phone": "+992901234567",
  "address": "ул. Рудаки 100, Душанбе",
  "city": "Душанбе",
  "latitude": 38.5598,
  "longitude": 68.7738,
  "logo_url": "https://cdn.autotoj.tj/providers/provider-uuid/logo.jpg",
  "photos": [
    "https://cdn.autotoj.tj/providers/provider-uuid/photo_1.jpg",
    "https://cdn.autotoj.tj/providers/provider-uuid/photo_2.jpg"
  ],
  "rating": 4.7,
  "reviews_count": 32,
  "is_verified": true,
  "working_hours": {
    "mon": "08:00-18:00",
    "tue": "08:00-18:00",
    "wed": "08:00-18:00",
    "thu": "08:00-18:00",
    "fri": "08:00-18:00",
    "sat": "09:00-15:00",
    "sun": null
  }
}
```

### 9.4. `GET /service-providers/:id/reviews` — Отзывы о поставщике

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | integer | Страница |
| `limit` | integer | Кол-во |

**Response 200:**
```json
{
  "reviews": [
    {
      "id": "review-uuid",
      "user_name": "Рустам",
      "user_avatar": "https://cdn.autotoj.tj/avatars/user-uuid.jpg",
      "rating": 5,
      "comment": "Отличный сервис, быстро и качественно!",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 32,
  "page": 1,
  "limit": 20,
  "has_more": true,
  "average_rating": 4.7
}
```

---

## 10. API роуты — Избранное

Все эндпоинты требуют **авторизации (Bearer token)**.

Клиент использует гибридный подход: локальное хранилище (AsyncStorage) + серверная синхронизация.

### 10.1. `GET /favorites` — Список избранного

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | integer | Страница |
| `limit` | integer | Кол-во (max 100) |

**Response 200:**
```json
{
  "ads": [
    {
      "id": "ad-uuid",
      "title": "Toyota Camry 2020",
      "price": 145000,
      "currency": "TJS",
      "year": 2020,
      "mileage": 72000,
      "location": "Душанбе",
      "photos": ["https://cdn.autotoj.tj/ads/ad-uuid/photo_1.jpg"],
      "brand": "Toyota",
      "model": "Camry",
      "fuel": "Бензин",
      "transmission": "Автомат",
      "drive": "Передний",
      "body": "Седан",
      "color": "Серебристый",
      "condition": "С пробегом",
      "seller": {
        "id": "seller-uuid-456",
        "name": "Рустам",
        "phone": "+992931112233"
      },
      "views": 120,
      "favorites": 5,
      "status": "active",
      "created_at": "2026-01-18T10:00:00Z",
      "updated_at": "2026-01-20T14:30:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20,
  "has_more": false
}
```

### 10.2. `POST /favorites/:ad_id` — Добавить в избранное

**Response 200:**
```json
{
  "success": true
}
```

**Response 409 (Already favorited):**
```json
{
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "Объявление уже в избранном"
  }
}
```

### 10.3. `DELETE /favorites/:ad_id` — Удалить из избранного

**Response 204:** Пустой ответ

### 10.4. `GET /favorites/check/:ad_id` — Проверить наличие в избранном

**Response 200:**
```json
{
  "is_favorite": true
}
```

---

## 11. API роуты — Сообщения

Все эндпоинты требуют **авторизации (Bearer token)**.

### 11.1. `GET /chats` — Список чатов

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | integer | Страница |
| `limit` | integer | Кол-во (default: 20) |

**Response 200:**
```json
{
  "chats": [
    {
      "id": "chat-uuid",
      "ad": {
        "id": "ad-uuid",
        "title": "Toyota Camry 2020",
        "photo": "https://cdn.autotoj.tj/ads/ad-uuid/photo_1_thumb.jpg",
        "price": 145000
      },
      "partner": {
        "id": "user-uuid",
        "name": "Фарход",
        "avatar": null
      },
      "last_message": {
        "text": "Машина в каком районе?",
        "created_at": "2026-01-22T15:30:00Z",
        "is_mine": false
      },
      "unread_count": 2,
      "created_at": "2026-01-22T14:00:00Z",
      "updated_at": "2026-01-22T15:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "has_more": false
}
```

### 11.2. `POST /chats` — Создать или получить чат

Если чат по данному объявлению уже существует — возвращает существующий.

**Request:**
```json
{
  "ad_id": "ad-uuid"
}
```

**Response 200:**
```json
{
  "chat_id": "chat-uuid"
}
```

### 11.3. `GET /chats/:id/messages` — Сообщения чата

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | integer | Страница (default: 1) |
| `limit` | integer | Кол-во (default: 50) |

Сортировка: по `created_at` DESC (новые сверху). Клиент переворачивает массив для отображения.

**Response 200:**
```json
{
  "messages": [
    {
      "id": "msg-uuid-5",
      "chat_id": "chat-uuid",
      "sender_id": "user-uuid",
      "text": "Машина в каком районе?",
      "media_url": null,
      "media_type": null,
      "is_mine": false,
      "is_read": false,
      "created_at": "2026-01-22T15:30:00Z"
    },
    {
      "id": "msg-uuid-4",
      "chat_id": "chat-uuid",
      "sender_id": "me-uuid",
      "text": "Конечно, приезжайте после 18:00",
      "media_url": null,
      "media_type": null,
      "is_mine": true,
      "is_read": true,
      "created_at": "2026-01-22T15:15:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 50,
  "has_more": false
}
```

### 11.4. `POST /chats/:id/messages` — Отправить сообщение

**Request (текст):**
```json
{
  "text": "Здравствуйте! Машина ещё доступна?"
}
```

**Request (с медиа):**
```json
{
  "text": "Вот фото повреждения",
  "media_id": "media-uuid"
}
```

**Response 201:**
```json
{
  "id": "msg-uuid-new",
  "chat_id": "chat-uuid",
  "sender_id": "me-uuid",
  "text": "Здравствуйте! Машина ещё доступна?",
  "media_url": null,
  "media_type": null,
  "is_mine": true,
  "is_read": false,
  "created_at": "2026-01-22T16:00:00Z"
}
```

### 11.5. `POST /chats/:id/read` — Отметить как прочитанное

Отмечает все непрочитанные сообщения в чате как прочитанные.

**Response 200:**
```json
{
  "success": true
}
```

### 11.6. `POST /blocks` — Заблокировать пользователя

**Request:**
```json
{
  "user_id": "user-uuid"
}
```

**Response 200:**
```json
{
  "success": true
}
```

### 11.7. WebSocket — Реал-тайм сообщения

**Подключение:**
```
wss://api.autotoj.tj/v1/ws?token=<jwt_token>
```

**Входящие события (server → client):**

```json
{
  "event": "new_message",
  "data": {
    "chat_id": "chat-uuid",
    "message": {
      "id": "msg-uuid",
      "sender_id": "user-uuid",
      "text": "Когда можно посмотреть?",
      "is_mine": false,
      "is_read": false,
      "created_at": "2026-01-22T16:05:00Z"
    }
  }
}
```

```json
{
  "event": "message_read",
  "data": {
    "chat_id": "chat-uuid",
    "read_by": "user-uuid",
    "read_until": "2026-01-22T16:00:00Z"
  }
}
```

```json
{
  "event": "typing",
  "data": {
    "chat_id": "chat-uuid",
    "user_id": "user-uuid"
  }
}
```

**Исходящие события (client → server):**

```json
{
  "event": "typing",
  "data": {
    "chat_id": "chat-uuid"
  }
}
```

---

## 12. API роуты — Профиль

Все эндпоинты требуют **авторизации (Bearer token)**.

### 12.1. `GET /profile` — Получить профиль

**Response 200:**
```json
{
  "id": "user-uuid",
  "name": "Алишер Рахимов",
  "phone": "+992901234567",
  "email": "alisher@example.com",
  "bio": "Продаю и покупаю авто",
  "avatar_url": "https://cdn.autotoj.tj/avatars/user-uuid.jpg",
  "banner_url": "https://cdn.autotoj.tj/banners/user-uuid.jpg",
  "city": "Душанбе",
  "user_type": "private",
  "phone_verified": true,
  "rating": 4.8,
  "reviews_count": 24,
  "ads_count": 3,
  "created_at": "2026-01-15T10:30:00Z"
}
```

### 12.2. `PATCH /profile` — Обновить профиль

**Request (все поля опциональны):**
```json
{
  "name": "Алишер Рахимов",
  "email": "alisher@example.com",
  "bio": "Продаю и покупаю авто",
  "city_id": "dushanbe"
}
```

**Response 200:** Полный объект профиля.

### 12.3. `POST /profile/avatar` — Загрузка аватара

**Content-Type:** `multipart/form-data`

**Form fields:**
- `avatar` — файл изображения (max 5 MB, JPEG/PNG)

**Response 200:**
```json
{
  "avatar_url": "https://cdn.autotoj.tj/avatars/user-uuid.jpg"
}
```

### 12.4. `POST /profile/banner` — Загрузка баннера

**Content-Type:** `multipart/form-data`

**Form fields:**
- `banner` — файл изображения (max 10 MB, JPEG/PNG)

**Response 200:**
```json
{
  "banner_url": "https://cdn.autotoj.tj/banners/user-uuid.jpg"
}
```

### 12.5. `GET /profile/settings` — Получить настройки

**Response 200:**
```json
{
  "notifications": {
    "messages": true,
    "price_changes": true,
    "ad_status": true,
    "new_reviews": true,
    "system": true,
    "promo": false
  },
  "privacy": {
    "hide_name": false,
    "hide_phone": false,
    "call_hours_from": "09:00",
    "call_hours_to": "21:00"
  },
  "app": {
    "language": "ru",
    "theme": "system"
  }
}
```

### 12.6. `PATCH /profile/settings` — Обновить настройки

**Request (все поля опциональны, deep merge):**
```json
{
  "notifications": {
    "promo": true
  },
  "privacy": {
    "hide_phone": true,
    "call_hours_from": "10:00",
    "call_hours_to": "20:00"
  },
  "app": {
    "theme": "dark",
    "language": "tj"
  }
}
```

**Response 200:** Полный объект настроек.

### 12.7. `DELETE /profile` — Удалить аккаунт

Полное удаление аккаунта и всех связанных данных.

**Request:**
```json
{
  "confirm": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Аккаунт удалён"
}
```

### 12.8. `GET /users/:id` — Публичный профиль пользователя

**Авторизация:** Не требуется

**Response 200:**
```json
{
  "id": "user-uuid",
  "name": "Алишер",
  "city": "Душанбе",
  "avatar_url": "https://cdn.autotoj.tj/avatars/user-uuid.jpg",
  "banner_url": "https://cdn.autotoj.tj/banners/user-uuid.jpg",
  "user_type": "private",
  "rating": 4.8,
  "reviews_count": 24,
  "ads_count": 3,
  "created_at": "2026-01-15T10:30:00Z"
}
```

> Поля `phone`, `email`, `bio` скрываются если `hide_phone`/`hide_name` включены.

### 12.9. `GET /users/:id/ads` — Объявления пользователя

**Авторизация:** Не требуется

**Query-параметры:** Стандартная пагинация (`page`, `limit`).

**Response 200:** Аналогичен `GET /ads`, только от конкретного пользователя.

### 12.10. `GET /users/:id/reviews` — Отзывы о пользователе

**Query-параметры:** Стандартная пагинация.

**Response 200:**
```json
{
  "reviews": [
    {
      "id": "review-uuid",
      "user_name": "Фарход",
      "user_avatar": "https://cdn.autotoj.tj/avatars/reviewer-uuid.jpg",
      "rating": 5,
      "comment": "Честный продавец, машина как описана.",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 24,
  "page": 1,
  "limit": 20,
  "has_more": true,
  "average_rating": 4.8
}
```

### 12.11. `POST /users/:id/reviews` — Оставить отзыв

**Авторизация:** Bearer token

**Request:**
```json
{
  "rating": 5,
  "comment": "Честный продавец, машина как описана."
}
```

**Валидация:**
- `rating` — обязательно, 1-5
- `comment` — обязательно, min 10 символов
- Нельзя оставить отзыв самому себе
- Один отзыв на пользователя (обновляется при повторном POST)

**Response 201:**
```json
{
  "id": "review-uuid",
  "rating": 5,
  "comment": "Честный продавец, машина как описана.",
  "created_at": "2026-01-22T16:00:00Z"
}
```

---

## 13. API роуты — Бортжурнал

### 13.1. `GET /logbook` — Лента постов

**Авторизация:** Не требуется

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `category` | string | Фильтр: `no_topic`, `automatics`, `advice`, `road_trips`, `breakdown`, `maintenance`, `repair`, `tuning`, `purchase`, `gadgets` |
| `author_id` | UUID | Посты конкретного автора |
| `q` | string | Текстовый поиск |
| `sort` | string | `date_desc` (default), `popular` |
| `page` | integer | Страница |
| `limit` | integer | Кол-во |

**Response 200:**
```json
{
  "posts": [
    {
      "id": "post-uuid",
      "author": {
        "id": "user-uuid",
        "name": "Рустам",
        "avatar": "https://cdn.autotoj.tj/avatars/user-uuid.jpg"
      },
      "title": "Замена масла в двигателе Toyota Camry",
      "category": "maintenance",
      "excerpt": "Делюсь опытом замены масла в двигателе 2AR-FE...",
      "photos": ["https://cdn.autotoj.tj/logbook/post-uuid/photo_1.jpg"],
      "likes_count": 15,
      "comments_count": 8,
      "created_at": "2026-01-22T10:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "has_more": true
}
```

### 13.2. `GET /logbook/:id` — Детали поста

**Response 200:**
```json
{
  "id": "post-uuid",
  "author": {
    "id": "user-uuid",
    "name": "Рустам",
    "avatar": "https://cdn.autotoj.tj/avatars/user-uuid.jpg"
  },
  "title": "Замена масла в двигателе Toyota Camry",
  "text": "Делюсь опытом замены масла в двигателе 2AR-FE. Использовал масло Mobil 1 5W-30...",
  "category": "maintenance",
  "photos": [
    "https://cdn.autotoj.tj/logbook/post-uuid/photo_1.jpg",
    "https://cdn.autotoj.tj/logbook/post-uuid/photo_2.jpg"
  ],
  "likes_count": 15,
  "comments_count": 8,
  "is_liked": false,
  "created_at": "2026-01-22T10:00:00Z",
  "updated_at": "2026-01-22T10:00:00Z"
}
```

### 13.3. `POST /logbook` — Создать пост

**Авторизация:** Bearer token

**Request:**
```json
{
  "title": "Замена масла в двигателе Toyota Camry",
  "text": "Делюсь опытом замены масла в двигателе 2AR-FE. Использовал масло Mobil 1 5W-30...",
  "category": "maintenance"
}
```

**Валидация:**
- `title` — обязательно, 5-200 символов
- `text` — обязательно, 20+ символов
- `category` — обязательно, из списка допустимых

**Response 201:**
```json
{
  "id": "new-post-uuid",
  "status": "active",
  "created_at": "2026-01-22T16:00:00Z"
}
```

### 13.4. `PATCH /logbook/:id` — Обновить пост

**Авторизация:** Bearer token (только автор)

**Request:** Все поля опциональны, аналогично `POST /logbook`.

### 13.5. `DELETE /logbook/:id` — Удалить пост

**Авторизация:** Bearer token (только автор)

**Response 204:** Пустой ответ

### 13.6. `POST /logbook/:id/photos` — Загрузка фото

**Content-Type:** `multipart/form-data`

**Form fields:**
- `photos` — до 10 изображений (max 10 MB каждое)

**Response 200:**
```json
[
  { "id": "photo-uuid", "url": "https://cdn.autotoj.tj/logbook/post-uuid/photo_1.jpg" }
]
```

### 13.7. `POST /logbook/:id/like` — Лайк поста

**Авторизация:** Bearer token

**Response 200:**
```json
{
  "likes_count": 16,
  "is_liked": true
}
```

### 13.8. `DELETE /logbook/:id/like` — Убрать лайк

**Авторизация:** Bearer token

**Response 200:**
```json
{
  "likes_count": 15,
  "is_liked": false
}
```

### 13.9. `GET /logbook/:id/comments` — Комментарии поста

**Query-параметры:** Стандартная пагинация.

**Response 200:**
```json
{
  "comments": [
    {
      "id": "comment-uuid",
      "author": {
        "id": "user-uuid",
        "name": "Фарход",
        "avatar": null
      },
      "text": "Спасибо за полезную информацию!",
      "created_at": "2026-01-22T12:00:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 50,
  "has_more": false
}
```

### 13.10. `POST /logbook/:id/comments` — Добавить комментарий

**Авторизация:** Bearer token

**Request:**
```json
{
  "text": "Спасибо за полезную информацию!"
}
```

**Валидация:**
- `text` — обязательно, 1-1000 символов

**Response 201:**
```json
{
  "id": "new-comment-uuid",
  "text": "Спасибо за полезную информацию!",
  "created_at": "2026-01-22T16:05:00Z"
}
```

### 13.11. Справочник категорий бортжурнала

| ID | Название (ru) | Цвет |
|----|--------------|------|
| `no_topic` | Без темы | Серый |
| `automatics` | Автоматика | Бирюзовый |
| `advice` | Прошу совета | Оранжевый |
| `road_trips` | Автопутешествия | Тёмно-бирюзовый |
| `breakdown` | Поломка | Красный |
| `maintenance` | ТО | Синий |
| `repair` | Ремонт | Красный |
| `tuning` | Тюнинг | Фиолетовый |
| `purchase` | Покупка | Зелёный |
| `gadgets` | Гаджеты | Индиго |

---

## 14. API роуты — Уведомления

Все эндпоинты требуют **авторизации (Bearer token)**.

### 14.1. `GET /notifications` — Список уведомлений

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `type` | string | Фильтр: `new_message`, `ad_status`, `price_change`, `new_review`, `system`, `promo` |
| `is_read` | boolean | Фильтр: прочитанные / непрочитанные |
| `page` | integer | Страница |
| `limit` | integer | Кол-во |

**Response 200:**
```json
{
  "notifications": [
    {
      "id": "notif-uuid-1",
      "type": "new_message",
      "title": "Новое сообщение",
      "body": "Фарход: Машина в каком районе?",
      "data": {
        "chat_id": "chat-uuid",
        "sender_id": "user-uuid"
      },
      "is_read": false,
      "created_at": "2026-01-22T15:30:00Z"
    },
    {
      "id": "notif-uuid-2",
      "type": "ad_status",
      "title": "Объявление опубликовано",
      "body": "Ваше объявление «Toyota Camry 2020» прошло модерацию",
      "data": {
        "ad_id": "ad-uuid",
        "status": "active"
      },
      "is_read": true,
      "created_at": "2026-01-22T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "has_more": false,
  "unread_count": 3
}
```

### 14.2. `POST /notifications/read` — Отметить как прочитанные

**Request (конкретные):**
```json
{
  "ids": ["notif-uuid-1", "notif-uuid-2"]
}
```

**Request (все):**
```json
{
  "all": true
}
```

**Response 200:**
```json
{
  "success": true,
  "unread_count": 0
}
```

### 14.3. `GET /notifications/unread-count` — Количество непрочитанных

**Response 200:**
```json
{
  "count": 3
}
```

### 14.4. `POST /notifications/fcm-token` — Регистрация FCM-токена

**Request:**
```json
{
  "token": "dGVzdC10b2tlbi0xMjM0NTY...",
  "platform": "ios"
}
```

**Response 200:**
```json
{
  "success": true
}
```

### 14.5. `DELETE /notifications/fcm-token` — Удаление FCM-токена

Вызывается при выходе из аккаунта.

**Response 204:** Пустой ответ

### 14.6. Push-уведомления (FCM)

**Типы push-уведомлений:**

| Тип | Когда отправляется | Условие |
|-----|-------------------|---------|
| `new_message` | Новое сообщение в чате | `notify_messages = true` |
| `ad_status` | Смена статуса объявления | `notify_ad_status = true` |
| `price_change` | Изменение цены в избранном | `notify_price_changes = true` |
| `new_review` | Новый отзыв о пользователе | `notify_new_reviews = true` |
| `system` | Системные уведомления | `notify_system = true` |
| `promo` | Промо и акции | `notify_promo = true` |

**FCM payload:**
```json
{
  "notification": {
    "title": "Новое сообщение",
    "body": "Фарход: Машина в каком районе?"
  },
  "data": {
    "type": "new_message",
    "chat_id": "chat-uuid",
    "sender_id": "user-uuid"
  }
}
```

---

## 15. Загрузка медиафайлов

### 15.1. `POST /media/upload` — Универсальная загрузка

**Авторизация:** Bearer token

**Content-Type:** `multipart/form-data`

**Form fields:**

| Поле | Тип | Обязательно | Описание |
|------|-----|------------|----------|
| `file` | File | Да | Файл изображения или видео |
| `entity_type` | string | Да | `ad`, `part`, `rental`, `logbook`, `avatar`, `banner`, `chat` |
| `entity_id` | UUID | Нет | ID сущности (если уже создана) |

**Ограничения:**

| Тип | Форматы | Макс. размер | Макс. разрешение |
|-----|---------|-------------|-----------------|
| Фото (объявления) | JPEG, PNG, WebP | 10 MB | 4096x4096 |
| Фото (запчасти) | JPEG, PNG, WebP | 10 MB | 4096x4096 |
| Фото (аренда) | JPEG, PNG, WebP | 10 MB | 4096x4096 |
| Фото (бортжурнал) | JPEG, PNG, WebP | 10 MB | 4096x4096 |
| Видео | MP4, MOV | 100 MB | 1920x1080, 60 сек |
| Панорама | JPEG, PNG | 20 MB | 8192x4096 |
| Аватар | JPEG, PNG | 5 MB | 1024x1024 |
| Баннер | JPEG, PNG | 10 MB | 2048x1024 |

**Response 200:**
```json
{
  "id": "media-uuid",
  "url": "https://cdn.autotoj.tj/uploads/media-uuid.jpg",
  "thumbnail_url": "https://cdn.autotoj.tj/uploads/media-uuid_thumb.jpg",
  "medium_url": "https://cdn.autotoj.tj/uploads/media-uuid_medium.jpg",
  "width": 1920,
  "height": 1080,
  "file_size": 2048576,
  "mime_type": "image/jpeg"
}
```

### 15.2. `DELETE /media/:id` — Удалить медиафайл

**Авторизация:** Bearer token (только владелец)

**Response 204:** Пустой ответ

### 15.3. Pipeline обработки медиа

При загрузке изображения:
1. **Валидация:** формат, размер, разрешение
2. **Обработка:** EXIF rotation fix, strip metadata
3. **Генерация вариантов:**
   - `original` — исходный размер (сжатие до 85% quality)
   - `medium` — 800px по длинной стороне
   - `thumbnail` — 200x200 crop center
4. **Загрузка в S3:** все 3 варианта
5. **CDN:** автоматическая инвалидация при удалении

При загрузке видео:
1. **Валидация:** формат, размер, длительность (max 60 сек)
2. **Транскодинг:** H.264, AAC, MP4 container
3. **Генерация превью:** кадр из первой секунды
4. **Загрузка в S3**

---

## 16. Безопасность

### 16.1. JWT-аутентификация

**Формат токена:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "phone": "+992901234567",
    "iat": 1708300800,
    "exp": 1710892800
  }
}
```

**Параметры:**
- Алгоритм: HS256 (HMAC SHA-256)
- Время жизни: 30 дней
- Refresh window: последние 7 дней перед истечением
- При выходе — токен инвалидируется через `sessions` таблицу

### 16.2. Rate Limiting

| Категория | Лимит | Окно | Ключ |
|-----------|-------|------|------|
| OTP запрос | 3 | 1 мин | IP + phone |
| OTP верификация | 5 | 5 мин | IP + phone |
| Auth (общий) | 120 | 1 мин | user_id |
| Public | 60 | 1 мин | IP |
| Upload | 10 | 1 мин | user_id |
| Create ad | 5 | 1 час | user_id |
| Send message | 30 | 1 мин | user_id |
| Report | 5 | 1 час | user_id |

Реализация: Redis (sliding window counter).

### 16.3. Блокировка пользователей

**Причины блокировки:**

| Код | Описание | Длительность |
|-----|----------|-------------|
| `attempts` | Превышение попыток OTP | 15 минут |
| `limit` | Превышение лимита запросов OTP | 1 час |
| `server` | Серверная ошибка / подозрительная активность | Бессрочно (ручная разблокировка) |
| `manual` | Блокировка модератором | По решению модератора |

### 16.4. Валидация входных данных

Все поля валидируются на бэкенде:

| Правило | Описание |
|---------|----------|
| **Телефон** | Формат `+992XXXXXXXXX`, 12 символов |
| **Email** | RFC 5322 compliant |
| **Цена** | Целое число > 0, max 99 999 999 |
| **Год** | 1980 — текущий год + 1 |
| **Пробег** | Целое число >= 0, max 9 999 999 |
| **VIN** | 17 символов, [A-HJ-NPR-Z0-9] |
| **Описание (авто)** | Max 3000 символов, strip HTML |
| **Описание (запчасти)** | Max 1000 символов |
| **Фото авто** | Max 30 штук |
| **Фото запчасти/аренда** | Max 10 штук |
| **Видео** | Max 1 штука, 60 секунд |
| **Имя** | 2-100 символов |
| **Bio** | Max 150 символов |
| **Отзыв** | Min 10 символов |

### 16.5. Защита от атак

| Вектор | Защита |
|--------|--------|
| SQL Injection | Parameterized queries (ORM / prepared statements) |
| XSS | HTML sanitization на входе, Content-Type: application/json |
| CSRF | Token-based auth (не cookies) |
| IDOR | Проверка ownership на каждом эндпоинте |
| File Upload | Проверка MIME type по magic bytes, антивирусное сканирование |
| Brute Force | Rate limiting + exponential backoff на OTP |
| Mass Scraping | Rate limiting + CAPTCHA при подозрительной активности |
| Phone Enumeration | Одинаковый ответ для существующих/несуществующих номеров |

---

## 17. Формат ошибок

### 17.1. Единый формат

Все ошибки возвращаются в едином формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Человекочитаемое описание ошибки",
    "details": {}
  }
}
```

### 17.2. HTTP-статусы

| Статус | Когда |
|--------|-------|
| 200 | Успешный запрос |
| 201 | Успешное создание |
| 204 | Успешное удаление (пустой ответ) |
| 400 | Неверный формат запроса |
| 401 | Не авторизован / невалидный токен |
| 403 | Нет доступа (чужой ресурс, блокировка) |
| 404 | Ресурс не найден |
| 409 | Конфликт (дубликат, уже существует) |
| 413 | Файл слишком большой |
| 415 | Неподдерживаемый тип файла |
| 422 | Ошибка валидации |
| 429 | Превышение rate limit |
| 500 | Внутренняя ошибка сервера |
| 503 | Сервис недоступен |

### 17.3. Коды ошибок

| Код | HTTP | Описание |
|-----|------|----------|
| `VALIDATION_ERROR` | 422 | Ошибка валидации (поля в `details.fields`) |
| `INVALID_CODE` | 401 | Неверный OTP-код |
| `CODE_EXPIRED` | 401 | OTP-код истёк |
| `UNAUTHORIZED` | 401 | Невалидный или отсутствующий токен |
| `FORBIDDEN` | 403 | Нет прав на действие |
| `USER_BLOCKED` | 403 | Пользователь заблокирован |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `ALREADY_EXISTS` | 409 | Ресурс уже существует |
| `RATE_LIMIT` | 429 | Превышение лимита запросов |
| `FILE_TOO_LARGE` | 413 | Файл превышает допустимый размер |
| `UNSUPPORTED_FILE` | 415 | Неподдерживаемый формат файла |
| `INTERNAL_ERROR` | 500 | Внутренняя ошибка сервера |
| `SERVICE_UNAVAILABLE` | 503 | Сервис временно недоступен |

### 17.4. Примеры ошибок

**Ошибка валидации (422):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Не заполнены обязательные поля",
    "details": {
      "fields": {
        "price": "Укажите цену",
        "contact_phone": "Укажите номер телефона",
        "year": "Год должен быть от 1980 до 2027"
      }
    }
  }
}
```

**Не авторизован (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Требуется авторизация"
  }
}
```

**Файл слишком большой (413):**
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Максимальный размер файла — 10 MB",
    "details": {
      "max_size": 10485760,
      "actual_size": 15728640
    }
  }
}
```

---

## 18. Инфраструктура и DevOps

### 18.1. Окружения

| Окружение | URL | Описание |
|-----------|-----|----------|
| **Production** | `https://api.autotoj.tj/v1` | Боевой сервер |
| **Staging** | `https://api-staging.autotoj.tj/v1` | Предрелизное тестирование |
| **Development** | `http://localhost:8000/v1` | Локальная разработка |

### 18.2. Переменные окружения

```env
# Server
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=8000
API_BASE_URL=https://api.autotoj.tj/v1

# Database
DATABASE_URL=postgresql+asyncpg://user:password@db-host:5432/autotoj

# Redis
REDIS_URL=redis://redis-host:6379/0

# JWT
JWT_SECRET=<256-bit-random-string>
JWT_EXPIRES_DAYS=30
JWT_REFRESH_WINDOW_DAYS=7

# SMS Provider
SMS_PROVIDER=console                          # 'console' (dev) или 'http' (prod)
SMS_PROVIDER_URL=https://sms-api.provider.tj
SMS_API_KEY=<sms-api-key>

# Media / Uploads
UPLOAD_DIR=./uploads
MEDIA_BASE_URL=https://cdn.autotoj.tj/uploads  # В dev: http://localhost:8000/uploads

# CORS
CORS_ORIGINS=https://autotoj.tj,https://admin.autotoj.tj
```

> **Примечание:** В dev-режиме файлы сохраняются локально в `./uploads` и раздаются через `StaticFiles`. В production рекомендуется использовать S3/CDN.

### 18.3. Развёртывание

**Рекомендуемая архитектура:**

```
                    ┌──────────────┐
                    │   CDN        │
                    │  (CloudFlare)│
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Load Balancer│
                    │  (Nginx)     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──┐  ┌──────▼──┐  ┌──────▼──┐
       │ API #1  │  │ API #2  │  │ API #3  │
       │(Uvicorn)│  │(Uvicorn)│  │(Uvicorn)│
       └────┬────┘  └────┬────┘  └────┬────┘
            │            │            │
       ┌────▼────────────▼────────────▼────┐
       │           Redis Cluster           │
       │    (sessions, cache, rate limit)  │
       └──────────────┬───────────────────┘
                      │
       ┌──────────────▼───────────────────┐
       │    PostgreSQL (Primary + Replica) │
       └──────────────┬───────────────────┘
                      │
       ┌──────────────▼───────────────────┐
       │         S3 Object Storage         │
       │     (photos, videos, panoramas)   │
       └───────────────────────────────────┘
```

### 18.4. Мониторинг

| Метрика | Инструмент | Порог алерта |
|---------|-----------|-------------|
| API response time (p95) | Prometheus + Grafana | > 500ms |
| API error rate (5xx) | Prometheus + Grafana | > 1% |
| Database connections | pg_stat | > 80% pool |
| Redis memory | Redis INFO | > 80% maxmemory |
| Disk usage | Node exporter | > 85% |
| SMS delivery rate | SMS provider dashboard | < 95% |
| Upload queue depth | Redis Streams | > 100 |
| Active WebSocket connections | Custom metric | > 10,000 |

### 18.5. Бэкапы

| Данные | Частота | Хранение | Метод |
|--------|---------|----------|-------|
| PostgreSQL | Каждые 6 часов | 30 дней | `pg_dump` + S3 |
| Redis (AOF) | Каждый час | 7 дней | RDB snapshot + S3 |
| Медиафайлы (S3) | Репликация | Бессрочно | S3 cross-region replication |
| Логи | Ежедневно | 90 дней | Compressed rotation |

### 18.6. CI/CD Pipeline

```
push to main
    │
    ├── Lint (ruff check)
    ├── Type Check (mypy)
    ├── Unit Tests (pytest)
    ├── Integration Tests (pytest + TestDB)
    │
    ▼
Build Docker Image
    │
    ▼
Push to Container Registry
    │
    ├── [staging] Auto-deploy to staging
    │       └── Run E2E tests
    │
    └── [production] Manual approval → Deploy
            └── Health check → Rollback on failure
```

### 18.7. Миграции базы данных

Инструмент: `Alembic` (SQLAlchemy migrations)

Порядок первичного развёртывания:
1. `cities` (справочник)
2. `vehicle_types` (справочник)
3. `dict_items` (справочник)
4. `service_categories` (справочник)
5. `users`
6. `auth_codes`, `sessions`
7. `brands`, `models`, `generations`
8. `ads`, `parts`, `rental_cars`
9. `chats`, `messages`
10. `favorites`, `blocks`
11. `reviews`
12. `logbook_posts`, `logbook_comments`, `logbook_likes`
13. `notifications`
14. `reports`, `media`
15. `user_settings`
16. `service_providers`

---

## Приложение A: Полная карта подкатегорий

### Мототехника (category: `moto`)

| subcategory | Название | Специфичные поля |
|-------------|---------|-----------------|
| `motorcycle` | Мотоцикл | motorcycle_type (25 типов), cylinder_layout, cylinder_count, strokes, drive (кардан/ремень/цепь), gearbox (1-8 передач, АКПП, робот) |
| `atv` | Квадроцикл | atv_type (Детский, Спортивный, Туристический, Утилитарный, Амфибия, Багги) |
| `scooter` | Скутер | strokes, gearbox |
| `snowmobile` | Снегоход | snowmobile_type (Детский, Кроссовер, Спортивный горный/кроссовый, Туристический, Утилитарный) |

### Коммерческий транспорт (category: `commercial`)

| subcategory | Название | Специфичные поля |
|-------------|---------|-----------------|
| `light_commercial` | Лёгкий коммерческий | load_capacity, body_type (17 типов: фургон, рефрижератор, самосвал, кемпер, пикап...) |
| `truck` | Грузовик | load_capacity, wheel_formula, body_type |
| `semi_truck` | Седельный тягач | wheel_formula |
| `bus` | Автобус | bus_type (8 типов), seats_count, wheel_formula |
| `trailer` | Прицеп | load_capacity |
| `removable_body` | Съёмный кузов | body_type |
| `agricultural` | Сельхозтехника | — |
| `construction` | Строительная техника | — |
| `loader` | Погрузчик | — |
| `crane` | Автокран | — |
| `excavator` | Экскаватор | — |
| `bulldozer` | Бульдозер | — |
| `municipal` | Коммунальная техника | — |

### Запчасти (part_type)

| part_type | Название | Специфичные поля |
|-----------|---------|-----------------|
| `tires` | Шины | tire_type, width, profile, diameter, load_index, speed_index, run_flat, studded, reinforced, quantity |
| `wheels` | Диски | wheel_diameter, width, pcd, offset, dia, type, material, quantity |
| `engine` | Двигатель | engine_type, displacement, power, cylinder_layout, cylinder_count |
| `body_parts` | Кузовные запчасти | body_part_category (18 типов), side, color |
| `transmission` | Трансмиссия | transmission_type, gear_count, drive_type |
| `suspension` | Подвеска | suspension_part_type |
| `optics` | Оптика | optics_type, side |
| `steering_wheel` | Руль | steering_type |
| `consumables` | Расходники | consumable_type |

---

## Приложение B: Полный список городов

| ID | Название | Регион |
|----|---------|--------|
| `dushanbe` | Душанбе | Столица |
| `khujand` | Худжанд | Согдийская область |
| `kulob` | Куляб | Хатлонская область |
| `qurghonteppa` | Курган-Тюбе (Бохтар) | Хатлонская область |
| `istaravshan` | Истаравшан | Согдийская область |
| `tursunzoda` | Турсунзаде | РРП |
| `khorog` | Хорог | ГБАО |
| `isfara` | Исфара | Согдийская область |
| `panjakent` | Пенджикент | Согдийская область |
| `konibodom` | Канибадам | Согдийская область |
