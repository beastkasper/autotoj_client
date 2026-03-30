// Справочники для формы добавления запчастей

// ── Общие ──
export const CITIES = [
  "Душанбе", "Худжанд", "Куляб", "Курган-Тюбе",
  "Истаравшан", "Вахдат", "Турсунзаде", "Хорог",
  "Пенджикент", "Канибадам",
] as const;

// ── Шины ──
export const TIRE_VEHICLE_TYPES = ["Легковые", "Мото", "Коммерческие"] as const;
export const TIRE_TYPES = ["Летние", "Зимние", "Всесезонные"] as const;
export const TIRE_CONDITIONS = ["Новые", "Б/у"] as const;
export const TIRE_BRANDS = [
  "Michelin", "Bridgestone", "Continental", "Goodyear", "Pirelli",
  "Dunlop", "Yokohama", "Hankook", "Nokian", "Toyo",
  "Cooper", "BFGoodrich", "Firestone", "Kumho", "Maxxis",
  "Nitto", "Falken", "General Tire", "Nexen", "GT Radial",
] as const;

// ── Диски ──
export const WHEEL_VEHICLE_TYPES = ["Легковые", "Коммерческие", "Мото"] as const;
export const WHEEL_CONDITIONS = ["Новые", "Б/у"] as const;
export const WHEEL_TYPES = ["Литые", "Кованые", "Штампованные"] as const;
export const WHEEL_MATERIALS = ["Алюминиевые", "Стальные"] as const;

// ── Руль ──
export const STEERING_VEHICLE_TYPES = ["Легковые", "Коммерческие"] as const;
export const STEERING_CONDITIONS = ["Новый", "Б/у"] as const;
export const STEERING_TYPES = ["Обычный", "Спортивный", "Мультируль", "Классический", "Универсальный"] as const;
export const STEERING_MATERIALS = ["Кожа", "Экокожа", "Пластик", "Алькантара", "Дерево", "Комбинированный"] as const;

// ── Оптика ──
export const OPTICS_CONDITIONS = ["Новое", "Б/у"] as const;
export const OPTICS_TYPES = [
  "Фара передняя", "Фара задняя", "Противотуманная фара",
  "Поворотник", "Стоп-сигнал", "Габарит",
  "ДХО (дневные ходовые огни)", "Фонарь", "Подсветка номера",
] as const;
export const OPTICS_SIDES = ["Левая", "Правая", "Комплект"] as const;
export const LAMP_TYPES = ["Галоген", "Ксенон", "LED", "Лазер"] as const;
export const OPTICS_ORIGIN = ["Оригинал", "Аналог"] as const;

// ── Ходовая часть ──
export const SUSPENSION_CONDITIONS = ["Новое", "Б/у"] as const;
export const SUSPENSION_TYPES = [
  "Амортизатор", "Пружина", "Рычаг подвески", "Шаровая опора",
  "Стойка стабилизатора", "Сайлентблок", "Ступица", "Подшипник ступицы",
  "Рулевой наконечник", "Тяга", "Опора стойки", "Балка", "Подрамник", "Другое",
] as const;
export const SUSPENSION_AXLES = ["Передняя", "Задняя"] as const;
export const SUSPENSION_SIDES = ["Левая", "Правая", "Комплект"] as const;

// ── Детали кузова ──
export const BODY_PART_CONDITIONS = ["Новая", "Б/у"] as const;
export const BODY_PART_TYPES = [
  "Бампер", "Капот", "Крыло", "Дверь", "Крышка багажника", "Крыша",
  "Порог", "Панель кузова", "Лонжерон", "Решётка радиатора", "Зеркало",
  "Стекло", "Фара", "Фонарь", "Молдинг", "Усилитель бампера",
  "Подкрылок", "Защита двигателя",
] as const;
export const BODY_PART_SIDES = ["Левая", "Правая", "Передняя", "Задняя", "Не имеет значения"] as const;
export const BODY_PART_COLORS = [
  "Белый", "Чёрный", "Серый", "Серебристый", "Синий",
  "Красный", "Зелёный", "Жёлтый", "Другой",
] as const;

// ── Двигатель ──
export const ENGINE_CONDITIONS = ["Новый", "Б/у"] as const;
export const ENGINE_TYPES = ["Бензин", "Дизель", "Гибрид", "Электрический", "Не указано"] as const;
export const ENGINE_CYLINDER_LAYOUTS = ["Рядный", "V-образный", "Оппозитный", "Роторный", "Не указано"] as const;
export const ENGINE_CYLINDER_COUNTS = ["3", "4", "5", "6", "8", "10", "12"] as const;

// ── КПП ──
export const TRANSMISSION_CONDITIONS = ["Новый", "Б/у"] as const;
export const TRANSMISSION_TYPES = ["Механическая", "Автомат", "Робот", "Вариатор"] as const;
export const TRANSMISSION_DRIVE_TYPES = ["Передний", "Задний", "Полный"] as const;

// ── Расходники ──
export const CONSUMABLE_CONDITIONS = ["Новый", "Б/у"] as const;
export const CONSUMABLE_TYPES = [
  "Масло моторное", "Масло трансмиссионное", "Масло гидравлическое",
  "Фильтр масляный", "Фильтр воздушный", "Фильтр салонный", "Фильтр топливный",
  "Тормозные колодки", "Тормозные диски", "Свечи зажигания",
  "Антифриз", "Тормозная жидкость", "Ремень ГРМ",
  "Ремень навесного оборудования", "Цепь ГРМ", "Прокладки", "Другие расходники",
] as const;

// ── Марки авто (общие для двигатель/КПП/совместимость) ──
export const CAR_BRANDS_SHORT = [
  "Toyota", "Honda", "Mercedes-Benz", "BMW", "Volkswagen", "Audi",
  "Lexus", "Nissan", "Mazda", "Hyundai", "Kia", "Ford", "Chevrolet",
] as const;

export const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "RAV4", "Highlander", "Prius"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Fit"],
  "Mercedes-Benz": ["E-Class", "C-Class", "S-Class", "GLE", "GLC"],
  "BMW": ["3 Series", "5 Series", "7 Series", "X5", "X3"],
  "Volkswagen": ["Passat", "Golf", "Tiguan", "Polo", "Jetta"],
  "Audi": ["A4", "A6", "Q5", "Q7", "A3"],
  "Lexus": ["RX", "ES", "LX", "NX", "GX"],
  "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano"],
  "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5"],
  "Hyundai": ["Sonata", "Elantra", "Tucson", "Santa Fe", "Accent"],
  "Kia": ["Optima", "Forte", "Sportage", "Sorento", "Rio"],
  "Ford": ["Focus", "Fusion", "Escape", "Explorer", "F-150"],
  "Chevrolet": ["Malibu", "Cruze", "Equinox", "Traverse", "Silverado"],
};
