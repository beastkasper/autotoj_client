# 📝 ДОБАВИТЬ ОБЪЯВЛЕНИЕ — ПОЛНОЕ ТЗ

**Платформа:** iOS Web App  
**Формат:** iPhone 16 Pro Max (440×956px)  
**Версия:** 2.0 Final  
**Дата:** Январь 2026

---

# 📋 ОГЛАВЛЕНИЕ

1. [Общая информация](#общая-информация)
2. [Легковые автомобили (18 шагов)](#легковые-автомобили)
3. [Мото (Accordion форма)](#мото)
4. [Комтранс (Accordion форма)](#комтранс)
5. [UI/UX спецификация](#uiux-спецификация)
6. [Валидация](#валидация)
7. [Публикация](#публикация)

---

# 1️⃣ ОБЩАЯ ИНФОРМАЦИЯ

## Архитектура

```
PostAdPage (главный контейнер)
├── CategorySelectSheet (выбор категории)
├── Легковые → 18 шагов (full screen)
├── Мото → MotoSubcategorySheet → Accordion форма
└── Комтранс → CommercialSubcategorySheet → Accordion форма
```

## Категории транспорта

1. **Легковые** — пошаговый flow (18 шагов)
2. **Мото** — 4 подкатегории:
   - Мотоциклы
   - Мотовездеходы (ATV)
   - Снегоходы
   - Скутеры
3. **Комтранс** — 14 подкатегорий:
   - Лёгкие коммерческие
   - Грузовики
   - Седельные тягачи
   - Автобусы
   - Прицепы
   - Съёмные кузова
   - Сельскохозяйственная
   - Строительная
   - Автопогрузчики
   - Автокраны
   - Экскаваторы
   - Бульдозеры
   - Коммунальная

## Модерация

⚠️ **ВАЖНО:** Модерация ОТКЛЮЧЕНА — все объявления публикуются сразу после нажатия "Опубликовать объявление".

---

# 2️⃣ ЛЕГКОВЫЕ АВТОМОБИЛИ

## Архитектура: 18 шагов (Full Screen)

### Header на каждом шаге:

```
┌─────────────────────────────────┐
│ ← | Добавить объявление | X     │
│     Шаг N из 18                 │
└─────────────────────────────────┘
```

**Спецификация Header:**

```
Height: 56px
Background: #FFFFFF
Border bottom: 1px solid #E5E5EA
Padding: 0 16px

← (Назад):         32px × 32px
Заголовок:         16px SemiBold Manrope
X (Закрыть):       32px × 32px
Прогресс:          12px Regular Manrope, #8E8E93
```

---

## ШАГ 1: СТАТУС АВТОМОБИЛЯ

### Поля:

#### 1.1 Статус (Обязательное)

```
Тип: Segmented Control
Варианты:
  - В наличии
  - В пути
  - На заказ

UI:
  Height: 40px
  Border Radius: 20px
  Gap: 12px

  Inactive:
    Background: transparent
    Border: 1px solid #D1D1D6
    Text: 15px Medium #000000

  Active:
    Background: #000000
    Text: 15px SemiBold #FFFFFF
```

#### 1.2 Не растаможен (Всегда видим)

```
Тип: Toggle Switch
Default: false (растаможен)

UI:
  Container:
    Height: 48px
    Border: 1px solid #D0D0D0
    Border Radius: 12px
    Background: #FFFFFF

  Label: "Не растаможен"
  Font: 15px Regular Manrope

  Info Icon:
    Size: 20px
    Color: #8E8E93
    Stroke: 1.5px

  Toggle:
    Width: 48px
    Height: 28px
    Border Radius: full
    Inactive: #E5E5E5
    Active: #000000
```

**Info Modal:**

```
Заголовок: "Не растаможен"
Текст: "Отметьте пункт, если вы ввезли транспорт из-за
        границы, но не растаможили его. Даже если он
        привезён из страны Таможенного союза, перед
        продажей всё равно нужно будет заплатить пошлину."
```

#### 1.3 Страна поставки (Только для "На заказ")

```
Тип: Text Input
Обязательное: Да (если статус "На заказ")
Placeholder: "Например: Германия, Корея, США"

UI:
  Height: 48px
  Border: 1px solid #D0D0D0
  Border Radius: 14px
  Padding: 0 16px
  Font: 16px Regular Manrope

  Focus:
    Border: 1px solid #000000
```

### Кнопка "Продолжить":

```
Position: Fixed bottom
Height: 52px
Border Radius: 24px
Width: 100%
Padding bottom: safe-area-inset-bottom

Active:
  Background: #000000
  Text: 16px SemiBold #FFFFFF

Disabled:
  Background: #E5E5E5
  Text: 16px SemiBold #9E9E9E
```

---

## ШАГ 2: VIN-НОМЕР

### Поля:

#### 2.1 VIN-номер (Необязательное)

```
Тип: Text Input
Max Length: 17 символов
Uppercase: Да (автоматическая конвертация)
Валидация: 17 латинских букв/цифр

UI:
  Height: 48px
  Border: 1px solid #D0D0D0
  Border Radius: 14px
  Padding: 0 16px
  Font: 16px Regular Manrope
  Text Transform: uppercase
```

### Кнопки:

```
1. "Пропустить" (вверху справа)
   Color: #8E8E93
   Font: 15px Medium Manrope

2. "Продолжить" (внизу)
   Disabled если: VIN введён неполностью (не 17 символов)
```

---

## ШАГ 3: МАРКА

### UI: Bottom Sheet с поиском

```
Header:
  Height: 56px
  Title: "Выберите марку"
  Close button: X

Search:
  Height: 48px
  Border Radius: 12px
  Background: #F2F2F7
  Icon: Search (20px)
  Placeholder: "Поиск марки..."

List:
  Item Height: 52px
  Font: 15px Regular Manrope
  Divider: 1px solid #E5E5EA
  Active State: bg-[#F2F2F7]
```

### Марки (предустановленные):

```
Toyota, BMW, Mercedes-Benz, Audi, Volkswagen,
Honda, Hyundai, Kia, Nissan, Ford, Chevrolet,
Mazda, Lexus, Subaru, Mitsubishi, Suzuki, Infiniti,
Porsche, Land Rover, Jeep, Volvo, Peugeot, Renault,
Citroen, Skoda, Opel, Fiat, Alfa Romeo, SEAT,
Mini, Jaguar, Bentley, Aston Martin, Ferrari,
Lamborghini, Maserati, Bugatti, McLaren, Rolls-Royce,
Cadillac, Lincoln, Buick, GMC, Chrysler, Dodge, RAM,
Tesla, BYD, Geely, Chery, Haval, Great Wall,
Dongfeng, FAW, Hongqi, Lada, UAZ, GAZ, Москвич
```

### Кнопка "Добавить марку":

```
Position: Bottom of list
Height: 52px
Font: 15px SemiBold #D32F2F
Icon: Plus
```

---

## ШАГ 4: МОДЕЛЬ

### UI: Bottom Sheet с поиском (аналогичен марке)

### Модели (зависят от марки):

```javascript
// Пример для Toyota:
Camry, Corolla, RAV4, Land Cruiser, Highlander,
Prado, Hilux, Fortuner, Yaris, Avalon, Sienna,
Venza, Tacoma, Tundra, 4Runner, Sequoia, C-HR,
Supra, 86, GR Yaris, Crown, Alphard, Vellfire

// Для каждой марки свой список моделей
```

### Кнопка "Добавить модель":

```
Аналогично "Добавить марку"
```

---

## ШАГ 5: ГОД ВЫПУСКА

### UI: Bottom Sheet со списком

```
Years: 2026, 2025, 2024, ..., 1980
Format: Прокручиваемый список
```

---

## ШАГ 6: ПОКОЛЕНИЕ

### Поля:

#### 6.1 Поколение (Необязательное)

```
Тип: Text Input или Select
Примеры:
  - XV70 (2017-2024) для Toyota Camry
  - G30 (2016-2023) для BMW 5-Series

UI: Аналогично предыдущим шагам
```

### Кнопки:

```
"Пропустить" | "Продолжить"
```

---

## ШАГ 7: ТИП КУЗОВА

### UI: Bottom Sheet с иконками

### Типы кузова:

```
Седан, Хэтчбек, Универсал, Купе, Кабриолет,
Внедорожник, Кроссовер, Минивэн, Пикап, Лимузин,
Фургон, Родстер, Тарга
```

### Item UI:

```
Height: 72px
Layout: Icon + Text
Icon Size: 32px
Font: 15px Regular Manrope
```

---

## ШАГ 8: ТИП ДВИГАТЕЛЯ

### UI: Bottom Sheet

### Типы:

```
Бензин, Дизель, Гибрид, Электро,
Бензин (турбо), Дизель (турбо),
Plug-in гибрид, Газ, Газ-бензин
```

---

## ШАГ 9: ТИП ПРИВОДА

### UI: Bottom Sheet

### Типы:

```
Передний, Задний, Полный,
Полный подключаемый, Полный постоянный
```

---

## ШАГ 10: МОДИФИКАЦИЯ

### Поля:

#### 10.1 Модификация (Необязательное)

```
Тип: Text Input
Примеры:
  - 2.5 AT Premium
  - 3.0 TDI quattro
  - 2.0 TSI 4Motion

Placeholder: "Например: 2.5 AT Premium"
```

### Кнопки:

```
"Пропустить" | "Продолжить"
```

---

## ШАГ 11: ЦВЕТ

### UI: Grid 2 колонки

### Цвета:

```
Белый, Чёрный, Серебристый, Серый, Синий,
Красный, Зелёный, Коричневый, Бежевый, Жёлтый,
Оранжевый, Фиолетовый, Розовый, Золотой
```

### Item UI:

```
Height: 48px
Border Radius: 12px
Border: 1px solid #D1D1D6
Font: 15px Regular Manrope
Gap: 12px

Selected:
  Background: #000000
  Text: #FFFFFF
  Border: none
```

---

## ШАГ 12: ФОТО И ВИДЕО

### Поля:

#### 12.1 Фотографии

```
Лимит: 30 фото
Формат: JPG, PNG, WebP
Max Size: 10MB per file
Recommended: 1920×1080

UI:
  Grid: 3 колонки
  Item Size: ~110px × 110px
  Border Radius: 12px
  Gap: 8px

  Add Button:
    Background: #F2F2F7
    Icon: Camera (24px, #8E8E93)
    Dashed Border: #D1D1D6
```

#### 12.2 Видео (необязательное)

```
Лимит: 1 видео
Max Duration: 60 секунд
Format: MP4, MOV
Max Size: 50MB

UI:
  Size: Полная ширина × 200px
  Border Radius: 12px
  Play icon: Center
  Delete button: Top-right (X)
```

### Кнопки:

```
"Добавить фото" (Camera icon)
"Добавить видео" (Video icon)
"Продолжить"
```

---

## ШАГ 13: КОМПЛЕКТАЦИЯ

### UI: Checkboxes в категориях

### Категории:

#### 13.1 Безопасность

```
☐ ABS
☐ ESP
☐ Подушки безопасности (фронтальные)
☐ Подушки безопасности (боковые)
☐ Система помощи при торможении
☐ Система контроля слепых зон
☐ Камера заднего вида
☐ Парктроник
```

#### 13.2 Комфорт

```
☐ Кондиционер
☐ Климат-контроль (однозонный)
☐ Климат-контроль (многозонный)
☐ Круиз-контроль
☐ Адаптивный круиз-контроль
☐ Обогрев сидений
☐ Вентиляция сидений
☐ Электропривод сидений
☐ Панорамная крыша
☐ Люк
```

#### 13.3 Мультимедиа

```
☐ Мультимедийная система
☐ Apple CarPlay
☐ Android Auto
☐ Навигация
☐ Bluetooth
☐ USB
☐ Аудиосистема премиум
```

#### 13.4 Экстерьер

```
☐ Ксеноновые фары
☐ LED фары
☐ Противотуманные фары
☐ Легкосплавные диски
☐ Рейлинги на крыше
☐ Тонировка
```

### Checkbox UI:

```
Size: 20px × 20px
Border Radius: 6px
Border: 2px solid #D1D1D6
Checked: Background #000000, Checkmark #FFFFFF
Label: 15px Regular Manrope
```

### Кнопка "Показать всё":

```
По умолчанию: 6 популярных опций
После клика: Все опции раскрываются
Text: 15px Medium #D32F2F
Icon: ChevronDown/ChevronUp
```

---

## ШАГ 14: ИСТОРИЯ АВТОМОБИЛЯ

### Поля:

#### 14.1 Пробег, км (Обязательное)

```
Тип: Number Input
Min: 0
Max: 999999
Placeholder: "Например: 45000"

UI:
  Height: 48px
  Border Radius: 14px
  Font: 16px Regular Manrope
```

#### 14.2 ПТС (Обязательное)

```
Тип: Select
Варианты:
  - Оригинал
  - Дубликат
  - Нет ПТС

UI: Bottom Sheet
```

#### 14.3 Владельцев по ПТС (Обязательное)

```
Тип: Select
Варианты:
  - 1
  - 2
  - 3
  - 4+

UI: Bottom Sheet
```

#### 14.4 Побывал в ДТП (Checkbox)

```
Тип: Checkbox
Default: false
Label: "Автомобиль побывал в ДТП"

UI:
  Checkbox: 20px × 20px
  Font: 15px Regular Manrope
  Color: #1C1C1E
```

---

## ШАГ 15: ОПИСАНИЕ

### Поля:

#### 15.1 Описание (Необязательное)

```
Тип: Textarea
Max Length: 3000 символов
Min Height: 120px
Auto-resize: Да

UI:
  Border: 1px solid #D0D0D0
  Border Radius: 14px
  Padding: 16px
  Font: 16px Regular Manrope

Placeholder:
"Расскажите о своём автомобиле:
• Состояние
• Особенности
• История обслуживания
• Дополнительное оборудование"

Counter: "0 / 3000" (внизу справа)
```

---

## ШАГ 16: ЦЕНА

### Поля:

#### 16.1 Цена (Обязательное)

```
Тип: Number Input
Min: 1
Max: 999999999
Currency: Сомони (с)

UI:
  Height: 64px
  Border Radius: 16px
  Font: 24px Bold Manrope
  Suffix: "с" (автоматически)

  Format:
    Input: 12500
    Display: "12 500 с" (с пробелами)
```

#### 16.2 Возможен обмен (Checkbox)

```
Тип: Checkbox
Default: false
Label: "Возможен обмен"
```

#### 16.3 Возможен торг (Checkbox)

```
Тип: Checkbox
Default: false
Label: "Возможен торг"
```

---

## ШАГ 17: КОНТАКТЫ

### Поля:

#### 17.1 Имя (Обязательное)

```
Тип: Text Input
Max Length: 50

UI:
  Height: 48px
  Border Radius: 14px
  Placeholder: "Ваше имя"
```

#### 17.2 Телефон (Обязательное)

```
Тип: Phone Input
Format: +992 XX XXX XXXX
Mask: Да

UI:
  Height: 48px
  Border Radius: 14px
  Prefix: "+992" (нередактируемый)
```

#### 17.3 Город (Обязательное)

```
Тип: Select
Варианты:
  - Душанбе
  - Худжанд
  - Бохтар
  - Куляб
  - Истаравшан
  - Турсунзаде
  - Хорог
  - Пенджикент
  - Канибадам
  - Другой (ввод вручную)

UI: Bottom Sheet
```

#### 17.4 Готов к онлайн-показу (Checkbox)

```
Тип: Checkbox
Default: false
Label: "Готов к онлайн-показу автомобиля"
Icon: Info (с пояснением)

Info Modal:
"Вы можете провести видео-звонок с
 потенциальным покупателем и показать
 автомобиль удалённо."
```

---

## ШАГ 18: ПРЕДПРОСМОТР

### UI: Полноэкранный preview

```
┌─────────────────────────────────┐
│ ← | Предпросмотр | X            │
├─────────────────────────────────┤
│ [Photo Gallery]                 │
├─────────────────────────────────┤
│ Toyota Camry 2.5 AT Premium     │
│ 12 500 с                        │
│ 2018 • 45 000 км                │
├─────────────────────────────────┤
│ ХАРАКТЕРИСТИКИ (Grid 2×3)       │
│ Кузов: Седан                    │
│ Двигатель: Бензин 2.5           │
│ Привод: Передний                │
│ Коробка: Автомат                │
│ Цвет: Чёрный                    │
│ Руль: Левый                     │
├─────────────────────────────────┤
│ ОПИСАНИЕ                        │
│ [User description]              │
├─────────────────────────────────┤
│ КОМПЛЕКТАЦИЯ (chips preview)    │
│ [First 6 items]                 │
├─────────────────────────────────┤
│ КОНТАКТЫ                        │
│ Имя: [Name]                     │
│ Телефон: [Phone]                │
│ Город: [City]                   │
├─────────────────────────────────┤
│ [Опубликовать объявление]       │
└─────────────────────────────────┘
```

### Кнопка "Опубликовать объявление":

```
Position: Fixed bottom
Height: 52px
Border Radius: 24px
Background: #D32F2F (красный!)
Text: 16px SemiBold #FFFFFF
Safe area: pb-safe
```

---

# 3️⃣ МОТО

## Архитектура: Accordion форма (1 экран)

### Header:

```
┌─────────────────────────────────┐
│ ← | Мотоциклы | Сброс | X       │
└─────────────────────────────────┘

Height: 56px
Background: #FFFFFF
Border bottom: 1px solid #E5E5EA

← (Назад):     Chevron Left
Заголовок:     17px SemiBold Manrope
Сброс:         15px Medium #D32F2F
X (Закрыть):   X icon
```

---

## Секции (Accordion):

### 1. ОСНОВНАЯ ИНФОРМАЦИЯ \*

#### 1.1 Марка \* (BottomSheetSelect)

```
Варианты:
  - Yamaha
  - Honda
  - BMW
  - Kawasaki
  - Suzuki
  - Ducati
  - KTM
  - Harley-Davidson
  - Bajaj
  - [+ Добавить марку]

UI: Bottom Sheet с поиском
```

#### 1.2 Модель \* (зависит от марки)

```
Примеры для Yamaha:
  - R1
  - R6
  - MT-07
  - MT-09
  - Tenere 700
  - [+ Добавить модель]

UI: Bottom Sheet с поиском
```

---

### 2. ТИП МОТОЦИКЛА \*

#### 2.1 Тип \*

```
Варианты:
  - Allround
  - Внедорожный Эндуро
  - Мотоцикл повышенной проходимости
  - Спортивный Эндуро
  - Туристический Эндуро
  - Naked bike
  - Дорожный
  - Классик
  - Кастом
  - Круизер
  - Чоппер
  - Кросс
  - Speedway
  - Детский
  - Минибайк
  - Питбайк
  - Триал
  - Спорт-байк
  - Спорт-туризм
  - Супер-спорт
  - Супермото
  - Трайки
  - Трицикл
  - Туристические

UI: Bottom Sheet
```

---

### 3. ГОД \*

#### 3.1 Год выпуска \*

```
Диапазон: 2026 - 1980
UI: Bottom Sheet с прокруткой
```

---

### 4. ПРОБЕГ, КМ \*

#### 4.1 Пробег \*

```
Тип: Number Input
Min: 0
Max: 999999
Placeholder: "Пробег, км"

UI:
  Height: 48px
  Border: 1px solid #C7C7CC
  Border Radius: 12px
  Font: 15px Regular Manrope

  Focus:
    Border: 2px solid #000000
```

---

### 5. ОБЪЁМ, СМ³ \*

#### 5.1 Объём двигателя \*

```
Тип: Number Input
Min: 50
Max: 2500
Placeholder: "Объём, см³"

UI: Аналогично пробегу
```

---

### 6. ДВИГАТЕЛЬ \*

#### 6.1 Тип двигателя \*

```
Варианты:
  - Дизель
  - Инжектор
  - Карбюратор
  - Бензин турбонаддув
  - Электрический
  - Не указано

UI: Bottom Sheet
```

---

### 7. РАСПОЛОЖЕНИЕ ЦИЛИНДРОВ

#### 7.1 Расположение (необязательно)

```
Варианты:
  - V-образное
  - Оппозитное
  - Рядное
  - Ротор
  - Не указано

UI: Bottom Sheet
```

---

### 8. КОЛ-ВО ЦИЛИНДРОВ

#### 8.1 Количество (необязательно)

```
Тип: Number Input
Min: 1
Max: 12
Placeholder: "Кол-во цилиндров"
```

---

### 9. МОЩНОСТЬ, Л.С.

#### 9.1 Мощность (необязательно)

```
Тип: Number Input
Min: 1
Max: 300
Placeholder: "Мощность, л.с."
```

---

### 10. ПРИВОД \*

#### 10.1 Тип привода \*

```
Варианты:
  - Кардан
  - Ремень
  - Цепь
  - Не указано

UI: Bottom Sheet
```

---

### 11. КОРОБКА ПЕРЕДАЧ \*

#### 11.1 КПП \*

```
Варианты:
  - 1 передача
  - 2 передачи
  - 3 передачи
  - 4 передачи
  - 5 передач
  - 6 передач
  - 7 передач
  - 8 передач
  - 2-скоростной автомат
  - 3-скоростной автомат
  - 4 прямых и задняя
  - 5 прямых и задняя
  - 6 прямых и задняя
  - АКПП
  - Роботизированная
  - Роботизированная с двумя сцеплениями
  - Вариатор
  - Не указан

UI: Bottom Sheet
```

---

### 12. ТАКТЫ \*

#### 12.1 Количество тактов \*

```
Варианты:
  - 2
  - 4
  - Не указано

UI: Bottom Sheet
```

---

### 13. ЦВЕТ

#### 13.1 Цвет (необязательно)

```
Варианты:
  - Чёрный
  - Белый
  - Серый
  - Синий
  - Красный
  - Зелёный
  - Жёлтый
  - Оранжевый
  - Коричневый
  - Бежевый

UI: Bottom Sheet
```

---

### 14. ОБОРУДОВАНИЕ

#### 14.1 Электростартер (Checkbox)

```
☐ Электростартер
Default: false
```

#### 14.2 ABS (Checkbox)

```
☐ ABS
Default: false
```

---

### 15. СТАТУС ТРАНСПОРТА

#### 15.1 Статус (необязательно)

```
Варианты:
  - В наличии
  - В пути
  - На заказ

UI: Segmented Control (аналогично легковым)
```

#### 15.2 Не растаможен (Toggle)

```
Аналогично легковым
```

#### 15.3 Откуда (для "На заказ")

```
Тип: Text Input
Обязательно если: Статус = "На заказ"
Placeholder: "Страна поставки"
```

---

### 16. ДОКУМЕНТЫ

#### 16.1 ПТС (Обязательно для "В наличии")

```
Варианты:
  - Оригинал
  - Нет ПТС
  - Дубликат
```

#### 16.2 Владельцев (Обязательно для "В наличии")

```
Варианты:
  - 1
  - 2
  - 3
  - 4+
```

#### 16.3 Побывал в ДТП (Checkbox)

```
☐ Побывал в ДТП
Default: false
```

---

### 17. МЕДИА

#### 17.1 Фото (необязательно)

```
Лимит: 30 фото
Формат: JPG, PNG
Max Size: 10MB per file

UI: Grid 3 колонки
```

#### 17.2 Видео (необязательно)

```
Лимит: 1 видео
Max Duration: 60 секунд
Max Size: 50MB
```

---

### 18. ОПИСАНИЕ

#### 18.1 Описание (необязательно)

```
Тип: Textarea
Max Length: 3000
Placeholder: "Расскажите о мотоцикле..."
```

---

### 19. ЦЕНА \*

#### 19.1 Цена \*

```
Тип: Number Input
Min: 1
Currency: Сомони (с)
Font: 18px Bold Manrope
```

---

### 20. КОНТАКТЫ

#### 20.1 Имя \*

```
Тип: Text Input
Max Length: 50
```

#### 20.2 Телефон \*

```
Тип: Phone Input
Format: +992 XX XXX XXXX
```

#### 20.3 Город \*

```
Тип: Select
Варианты: Аналогично легковым
Обязательность:
  - Обязателен для "В наличии"
  - Необязателен для "В пути"
  - Скрыт для "На заказ"
```

---

### Кнопка "Далее":

```
Position: Fixed bottom
Height: 52px
Border Radius: 24px
Background: #000000
Text: 16px SemiBold #FFFFFF

Disabled:
  Background: #E5E5E5
  Text: #9E9E9E
```

---

# 4️⃣ КОМТРАНС (ЛЁГКИЕ КОММЕРЧЕСКИЕ)

## Архитектура: Accordion форма (1 экран)

### Header: Аналогично Мото

```
← | Лёгкие коммерческие | Сброс | X
```

---

## Секции (Accordion):

### 1. ОСНОВНАЯ ИНФОРМАЦИЯ \*

#### 1.1 Марка \*

```
Варианты:
  - GAZ
  - ISUZU
  - Mercedes-Benz
  - Volkswagen
  - Ford
  - Renault
  - Peugeot
  - Citroen
  - Fiat
  - Hyundai
  - Toyota
  - Nissan
  - [+ Добавить марку]
```

#### 1.2 Модель \*

```
Примеры для GAZ:
  - Gazelle Next
  - Gazelle
  - Sobol
  - [+ Добавить модель]
```

#### 1.3 Грузоподъёмность, т (необязательно)

```
Тип: Number Input (decimal)
Min: 0.5
Max: 5
Step: 0.1
Placeholder: "Грузоподъёмность, т"
```

#### 1.4 Год \*

```
Диапазон: 2026 - 1980
```

#### 1.5 Пробег, км \*

```
Тип: Number Input
Min: 0
Max: 999999
```

---

### 2. ТИП КУЗОВА

#### 2.1 Тип кузова (необязательно)

```
Варианты:
  - Автотопливозаправщик
  - Тент
  - Бортовой грузовик
  - Бортовой с КМУ
  - Изотермический кузов
  - Кемпер
  - Микроавтобус
  - Пикап
  - Промтоварный автофургон
  - Рефрижератор
  - Самосвал
  - Скорая помощь
  - Фургон для торговли
  - Цельнометаллический фургон
  - Цистерна
  - Шасси
  - Эвакуатор
```

---

### 3. ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ

#### 3.1 Привод (необязательно)

```
Варианты:
  - Задний
  - Передний
  - Полный
  - Заднеприводный с подключаемым передним
  - Полный подключаемый
  - Постоянный полный привод
```

#### 3.2 Двигатель (необязательно)

```
Варианты:
  - Бензин
  - Дизель
  - Электро
  - Гибрид
  - Дизель + газ
  - Бензин + газ
  - Газ
```

#### 3.3 Коробка передач (необязательно)

```
Варианты:
  - Автомат
  - Робот
  - Механическая
```

#### 3.4 Количество мест (необязательно)

```
Тип: Number Input
Min: 1
Max: 20
Placeholder: "Количество мест"
```

#### 3.5 Объём двигателя, л (необязательно)

```
Тип: Number Input (decimal)
Min: 0.8
Max: 10
Step: 0.1
Placeholder: "Объём, л"
```

#### 3.6 Мощность, л.с. (необязательно)

```
Тип: Number Input
Min: 50
Max: 500
```

#### 3.7 Руль (необязательно)

```
Варианты:
  - Левый
  - Правый
```

---

### 4. ЦВЕТ

#### 4.1 Цвет (Multiple Select, необязательно)

```
Варианты:
  - Белый
  - Чёрный
  - Серебристый
  - Серый
  - Синий
  - Красный
  - Коричневый
  - Зелёный
  - Бежевый
  - Оранжевый
  - [+ Добавить цвет]

UI: Можно выбрать несколько
Display: Chips (badges)
```

---

### 5. ДОКУМЕНТЫ

#### 5.1 ПТС (необязательно)

```
Варианты:
  - Оригинал
  - Нет ПТС
  - Дубликат
```

#### 5.2 Владельцев (необязательно)

```
Варианты:
  - 1
  - 2
  - 3
  - 4+
```

#### 5.3 Не растаможен (Toggle)

```
Default: false
```

#### 5.4 Побывал в ДТП (Checkbox)

```
Default: false
```

---

### 6. ОБОРУДОВАНИЕ

#### 6.1 Опции (Multiple Checkboxes)

```
☐ Антиблокировочная система (ABS)
☐ Антипробуксовочная система
☐ Круиз-контроль
☐ Бортовой компьютер
☐ Кондиционер
☐ Усилитель руля
☐ Регулировка руля
☐ Сигнализация
☐ Центральный замок
☐ Обогрев зеркал
☐ Электропривод зеркал
☐ Обогрев сидений
☐ Легкосплавные диски
```

#### 6.2 Подушки безопасности (Select)

```
Варианты:
  - Отсутствуют
  - Водителя
  - Водителя и пассажира
  - Передние и боковые
```

#### 6.3 Стеклоподъёмники (Select)

```
Варианты:
  - Отсутствуют
  - Все
  - Левый
  - Правый
```

#### 6.4 Магнитола (Select)

```
Варианты:
  - Отсутствует
  - CD
  - DVD
  - Кассетная
  - Радио
```

---

### 7. СТАТУС ТРАНСПОРТА

#### 7.1 Статус (необязательно)

```
Варианты:
  - В наличии
  - В пути
  - На заказ

UI: Segmented Control
```

#### 7.2 Откуда (для "На заказ")

```
Тип: Text Input
Placeholder: "Страна поставки"
```

---

### 8. МЕДИА

Аналогично Мото (30 фото + 1 видео 60 сек)

---

### 9. ОПИСАНИЕ

Аналогично Мото (3000 символов)

---

### 10. ЦЕНА \*

Аналогично Мото

---

### 11. КОНТАКТЫ

Аналогично Мото (Имя, Телефон, Город)

---

# 5️⃣ UI/UX СПЕЦИФИКАЦИЯ

## Accordion Sections

### Collapsed State:

```
Height: 56px
Background: #F7F7F7
Border Radius: 16px
Padding: 16px
Gap between sections: 12px

Layout:
┌─────────────────────────────────┐
│ Название секции *        ⌄     │
└─────────────────────────────────┘

Title:
  Font: 16px SemiBold Manrope
  Color: #000000

Icon: ChevronDown
  Size: 20px
  Color: #000000
```

### Expanded State:

```
Background: #F7F7F7
Border Radius: 16px
Padding: 16px

Layout:
┌─────────────────────────────────┐
│ Название секции *        ⌃     │
├─────────────────────────────────┤
│                                 │
│ [Form Fields]                   │
│                                 │
└─────────────────────────────────┘

Icon: ChevronUp
Content Padding: 16px (top/bottom/sides)
Gap between fields: 12px
```

---

## Bottom Sheet Select

### Trigger:

```
Height: 48px
Border: 1px solid #C7C7CC
Border Radius: 12px
Padding: 0 16px
Background: #FFFFFF

Layout:
┌─────────────────────────────────┐
│ Выбранное значение         ⌄   │
└─────────────────────────────────┘

Placeholder: 15px Regular #8E8E93
Selected Value: 15px Regular #000000
Icon: ChevronDown (16px, #8E8E93)
```

### Sheet:

```
Position: Fixed bottom
Max Height: 70vh
Background: #FFFFFF
Border Radius: 20px 20px 0 0
Shadow: 0 -4px 12px rgba(0,0,0,0.1)

Header:
  Height: 56px
  Border bottom: 1px solid #E5E5EA
  Padding: 0 16px

  Title: 17px SemiBold Manrope, Center
  Close: X icon (top-right)

Search (если есть):
  Height: 48px
  Background: #F2F2F7
  Border Radius: 12px
  Margin: 16px
  Icon: Search (20px)
  Placeholder: 15px Regular #8E8E93

List:
  Item Height: 52px
  Padding: 0 16px
  Font: 15px Regular Manrope
  Divider: 1px solid #E5E5EA

  Active State:
    Background: #F2F2F7

  Selected State:
    Font: 15px SemiBold Manrope
    Icon: Checkmark (right)

Add Custom Button:
  Height: 52px
  Font: 15px SemiBold #D32F2F
  Icon: Plus (20px, #D32F2F)
  Border top: 1px solid #E5E5EA
```

---

## Input Fields

### Text Input:

```
Height: 48px
Border: 1px solid #C7C7CC
Border Radius: 12px
Padding: 0 16px
Background: #FFFFFF
Font: 15px Regular Manrope

Placeholder:
  Color: #8E8E93

Focus:
  Border: 2px solid #000000
  Padding: 0 15px (компенсация 2px border)

Error:
  Border: 1px solid #E53935

  Error Message:
    Margin top: 4px
    Font: 12px Regular Manrope
    Color: #E53935
```

### Number Input:

```
Аналогично Text Input
Type: "number"
inputMode: "numeric"

Для decimal (грузоподъёмность, объём):
  Step: 0.1
```

### Textarea:

```
Min Height: 120px
Max Height: auto (с авторасширением)
Border: 1px solid #C7C7CC
Border Radius: 12px
Padding: 16px
Font: 15px Regular Manrope
Resize: none (автоматическое)

Counter:
  Position: Bottom-right (внутри)
  Font: 12px Regular #8E8E93
  Format: "123 / 3000"
```

---

## Checkboxes

### Standard Checkbox:

```
Size: 20px × 20px
Border: 2px solid #D1D1D6
Border Radius: 6px
Background: #FFFFFF

Checked:
  Background: #000000
  Border: none
  Checkmark: #FFFFFF (2px stroke)

Label:
  Margin left: 12px
  Font: 15px Regular Manrope
  Color: #1C1C1E

  Active State:
    Opacity: 0.6
```

---

## Toggle Switch

### Container:

```
Height: 48px
Border: 1px solid #D0D0D0
Border Radius: 12px
Background: #FFFFFF
Padding: 0 16px
Display: flex
Justify: space-between
Align: center
```

### Switch:

```
Width: 48px
Height: 28px
Border Radius: full

Inactive:
  Background: #E5E5E5

Active:
  Background: #000000

Thumb:
  Size: 24px × 24px
  Background: #FFFFFF
  Border Radius: full
  Transition: transform 200ms

  Inactive Position: 2px from left
  Active Position: 22px from left
```

---

## Photo Upload

### Grid:

```
Columns: 3
Gap: 8px
Padding: 16px
```

### Item:

```
Aspect Ratio: 1:1
Border Radius: 12px
Position: relative

Image:
  Object Fit: cover
  Width: 100%
  Height: 100%

Delete Button:
  Position: absolute top-1 right-1
  Size: 24px × 24px
  Background: rgba(0,0,0,0.6)
  Border Radius: full
  Icon: X (14px, #FFFFFF)
```

### Add Button:

```
Background: #F2F2F7
Border: 2px dashed #D1D1D6
Border Radius: 12px
Icon: Camera (24px, #8E8E93)
Text: "Добавить фото"
Font: 12px Medium #8E8E93
Layout: Vertical (icon + text)
Gap: 4px
```

---

## Buttons

### Primary Button (Fixed Bottom):

```
Position: fixed bottom-0
Width: 100%
Max Width: 448px (max-w-md)
Height: 52px
Border Radius: 24px
Margin: 0 auto
Padding: 16px (container)
Padding bottom: safe-area-inset-bottom
Background Container: #FFFFFF
Border top: 1px solid #F2F2F7

Button:
  Active:
    Background: #000000
    Text: 16px SemiBold #FFFFFF
    Shadow: none

  Disabled:
    Background: #E5E5E5
    Text: 16px SemiBold #9E9E9E

  Active State (pressed):
    Transform: scale(0.98)
    Opacity: 0.9
```

### Secondary Button (Сброс):

```
Height: auto
Padding: 8px 12px
Font: 15px Medium #D32F2F
Background: transparent
Border: none

Active State:
  Opacity: 0.6
```

---

## Error States

### Field Error:

```
Border: 1px solid #E53935
Background: #FFFFFF

Error Message:
  Margin top: 4px
  Font: 12px Regular Manrope
  Color: #E53935
  Icon: AlertCircle (12px, #E53935)
```

### Form Validation:

```
1. Пользователь нажимает "Продолжить" или "Далее"
2. Форма проверяется
3. Если ошибки:
   - Поля подсвечиваются красным
   - Под каждым полем появляется сообщение
   - Скролл к первой ошибке (smooth)
   - Фокус на первое поле с ошибкой
```

---

# 6️⃣ ВАЛИДАЦИЯ

## Легковые

### Обязательные поля:

```
Шаг 1:  ✓ Статус
Шаг 2:  - VIN (необязательно)
Шаг 3:  ✓ Марка
Шаг 4:  ✓ Модель
Шаг 5:  ✓ Год
Шаг 6:  - Поколение (необязательно)
Шаг 7:  ✓ Тип кузова
Шаг 8:  ✓ Тип двигателя
Шаг 9:  ✓ Тип привода
Шаг 10: - Модификация (необязательно)
Шаг 11: ✓ Цвет
Шаг 12: - Фото/Видео (рекомендуется, не обязательно)
Шаг 13: - Комплектация (необязательно)
Шаг 14: ✓ Пробег, ✓ ПТС, ✓ Владельцев
Шаг 15: - Описание (необязательно)
Шаг 16: ✓ Цена
Шаг 17: ✓ Имя, ✓ Телефон, ✓ Город
```

### Правила:

```
VIN:
  - 17 символов
  - Латинские буквы + цифры
  - Uppercase

Пробег:
  - Только цифры
  - 0 - 999999

Цена:
  - Только цифры
  - Минимум 1
  - Максимум 999999999

Телефон:
  - Формат: +992 XX XXX XXXX
  - 9 цифр после +992

Страна поставки (для "На заказ"):
  - Обязательно
  - Минимум 2 символа

Описание:
  - Максимум 3000 символов
```

---

## Мото

### Обязательные поля:

```
✓ Марка
✓ Модель
✓ Тип мотоцикла
✓ Год
✓ Пробег, км
✓ Объём, см³
✓ Двигатель
✓ Привод
✓ Коробка передач
✓ Такты
✓ Цена
✓ Имя
✓ Телефон
✓ Город (если статус "В наличии")

Условно обязательные:
✓ ПТС (если статус "В наличии")
✓ Владельцев (если статус "В наличии")
✓ Откуда (если статус "На заказ")
```

### Правила:

```
Объём:
  - 50 - 2500 см³

Пробег:
  - 0 - 999999 км

Кол-во цилиндров:
  - 1 - 12

Мощность:
  - 1 - 300 л.с.

Фото:
  - Максимум 30
  - Форматы: JPG, PNG, WebP
  - Размер: до 10MB каждое

Видео:
  - Максимум 1
  - Длительность: до 60 секунд
  - Размер: до 50MB
```

---

## Комтранс

### Обязательные поля:

```
✓ Марка
✓ Модель
✓ Год
✓ Пробег, км
✓ Цена
✓ Имя
✓ Телефон
✓ Город

Все остальные поля необязательные
```

### Правила:

```
Грузоподъёмность:
  - 0.5 - 5.0 т
  - Шаг: 0.1

Объём двигателя:
  - 0.8 - 10.0 л
  - Шаг: 0.1

Мощность:
  - 50 - 500 л.с.

Количество мест:
  - 1 - 20
```

---

# 7️⃣ ПУБЛИКАЦИЯ

## Экран успеха

```
┌─────────────────────────────────┐
│                                 │
│         [Success Icon]          │
│          64×64, #34C759         │
│                                 │
│    Объявление опубликовано!     │
│     24px Bold Manrope           │
│                                 │
│  Ваше объявление уже доступно   │
│       для просмотра             │
│     15px Regular #8E8E93        │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [Перейти к объявлению]         │
│     Primary Button              │
│                                 │
│  [На главную]                   │
│     Secondary Button            │
│                                 │
└─────────────────────────────────┘
```

### Кнопки:

```
"Перейти к объявлению":
  Background: #000000
  Text: #FFFFFF
  → Открывает AdDetailsPage созданного объявления

"На главную":
  Background: #F2F2F7
  Text: #000000
  → Закрывает flow, возвращает на SearchPage
```

---

## Модальные окна подтверждения

### Выход без сохранения:

```
Триггер: Нажатие X (если есть заполненные поля)

Заголовок: "Выйти без сохранения?"
Текст: "Все введённые данные будут потеряны"

Кнопки:
  "Отмена" (Secondary)
  "Выйти" (Primary, #D32F2F)
```

### Возврат назад (для Accordion форм):

```
Триггер: Нажатие ← (если есть заполненные поля)

Заголовок: "Вернуться назад?"
Текст: "Все введённые данные будут потеряны"

Кнопки:
  "Отмена" (Secondary)
  "Назад" (Primary, #D32F2F)
```

### Сброс формы:

```
Триггер: Нажатие "Сброс"

Заголовок: "Сбросить все данные?"
Текст: "Это действие нельзя отменить"

Кнопки:
  "Отмена" (Secondary)
  "Сбросить" (Primary, #D32F2F)
```

---

# 📊 СВОДНАЯ ТАБЛИЦА

## Сравнение категорий:

| Параметр               | Легковые        | Мото              | Комтранс          |
| ---------------------- | --------------- | ----------------- | ----------------- |
| **UI Pattern**         | 18 шагов        | Accordion         | Accordion         |
| **Навигация**          | ← →             | ← только          | ← только          |
| **Прогресс**           | "Шаг N из 18"   | Нет               | Нет               |
| **Header**             | Минималистичный | С кнопкой "Сброс" | С кнопкой "Сброс" |
| **Обязательных полей** | 13              | 13-16 (условно)   | 8                 |
| **Фото лимит**         | 30              | 30                | 30                |
| **Видео лимит**        | 1 (60 сек)      | 1 (60 сек)        | 1 (60 сек)        |
| **Предпросмотр**       | Отдельный шаг   | Модальное окно    | Модальное окно    |
| **Кнопка публикации**  | Красная #D32F2F | Чёрная #000000    | Чёрная #000000    |

---

# ✅ ЧЕКЛИСТ РЕАЛИЗАЦИИ

## Легковые:

- [ ] 18 шагов созданы
- [ ] Header с прогрессом работает
- [ ] Навигация вперёд/назад
- [ ] Валидация на каждом шаге
- [ ] VIN-валидатор (17 символов)
- [ ] Марки/модели с поиском
- [ ] Комплектация (accordion + "Показать всё")
- [ ] Фото/видео upload (лимиты)
- [ ] Предпросмотр с grid характеристик
- [ ] Публикация (красная кнопка)

## Мото:

- [ ] Подкатегории (4 типа)
- [ ] Accordion секции
- [ ] Условная валидация (статус)
- [ ] ПТС/Владельцы для "В наличии"
- [ ] Откуда для "На заказ"
- [ ] Город скрыт для "На заказ"
- [ ] Предпросмотр modal
- [ ] Публикация (чёрная кнопка)

## Комтранс:

- [ ] Подкатегории (14 типов)
- [ ] Multiple color select
- [ ] Decimal inputs (грузоподъёмность, объём)
- [ ] Оборудование (checkboxes grouped)
- [ ] Аналогично Мото

## Общее:

- [ ] Модальные подтверждения (выход/назад/сброс)
- [ ] Scroll to error
- [ ] Auto-uppercase для VIN
- [ ] Phone mask +992
- [ ] Price formatting (пробелы)
- [ ] Success screen
- [ ] Safe area handling
- [ ] Модерация ОТКЛЮЧЕНА

---

**КОНЕЦ ДОКУМЕНТА** ✨

_Все поля, стили и логика зафиксированы._