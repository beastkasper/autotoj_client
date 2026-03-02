// Справочники для формы "Добавить объявление"

// ── Категории транспорта ──
export const VEHICLE_CATEGORIES = [
  { id: "cars", label: "Легковые", icon: "Car" },
  { id: "moto", label: "Мото", icon: "Bike" },
  { id: "commercial", label: "Комтранс", icon: "Truck" },
] as const;

export type VehicleCategoryId = (typeof VEHICLE_CATEGORIES)[number]["id"];

// ── Подкатегории Мото ──
export const MOTO_SUBCATEGORIES = [
  "Мотоциклы",
  "Мотовездеходы (ATV)",
  "Снегоходы",
  "Скутеры",
] as const;

// ── Подкатегории Комтранс ──
export const COMMERCIAL_SUBCATEGORIES = [
  "Лёгкие коммерческие",
  "Грузовики",
  "Седельные тягачи",
  "Автобусы",
  "Прицепы",
  "Съёмные кузова",
  "Сельскохозяйственная",
  "Строительная",
  "Автопогрузчики",
  "Автокраны",
  "Экскаваторы",
  "Бульдозеры",
  "Коммунальная",
] as const;

// ── Статусы ──
export const VEHICLE_STATUSES = ["В наличии", "В пути", "На заказ"] as const;

// ── Марки легковых ──
export const CAR_BRANDS = [
  "Toyota", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
  "Honda", "Hyundai", "Kia", "Nissan", "Ford", "Chevrolet",
  "Mazda", "Lexus", "Subaru", "Mitsubishi", "Suzuki", "Infiniti",
  "Porsche", "Land Rover", "Jeep", "Volvo", "Peugeot", "Renault",
  "Citroen", "Skoda", "Opel", "Fiat", "Alfa Romeo", "SEAT",
  "Mini", "Jaguar", "Bentley", "Aston Martin", "Ferrari",
  "Lamborghini", "Maserati", "Bugatti", "McLaren", "Rolls-Royce",
  "Cadillac", "Lincoln", "Buick", "GMC", "Chrysler", "Dodge", "RAM",
  "Tesla", "BYD", "Geely", "Chery", "Haval", "Great Wall",
  "Dongfeng", "FAW", "Hongqi", "Lada", "UAZ", "GAZ", "Москвич",
] as const;

// ── Модели легковых (по маркам) ──
export const CAR_MODELS: Record<string, string[]> = {
  Toyota: [
    "Camry", "Corolla", "RAV4", "Land Cruiser", "Highlander",
    "Prado", "Hilux", "Fortuner", "Yaris", "Avalon", "Sienna",
    "Venza", "Tacoma", "Tundra", "4Runner", "Sequoia", "C-HR",
    "Supra", "86", "GR Yaris", "Crown", "Alphard", "Vellfire",
  ],
  BMW: [
    "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7",
    "X6", "4 Series", "8 Series", "Z4", "M3", "M5", "iX", "i4",
  ],
  "Mercedes-Benz": [
    "C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS",
    "A-Class", "CLA", "G-Class", "AMG GT", "EQS", "EQE",
  ],
  Audi: [
    "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8",
    "e-tron", "RS6", "RS7", "TT",
  ],
  Volkswagen: [
    "Golf", "Passat", "Tiguan", "Touareg", "Polo", "Jetta",
    "Atlas", "Arteon", "T-Roc", "ID.4",
  ],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit", "Odyssey"],
  Hyundai: ["Sonata", "Elantra", "Tucson", "Santa Fe", "Palisade", "Creta", "i30"],
  Kia: ["K5", "Sportage", "Sorento", "Seltos", "Carnival", "Rio", "Cerato"],
  Nissan: ["Qashqai", "X-Trail", "Patrol", "Juke", "Altima", "Leaf", "Navara"],
  Lexus: ["RX", "NX", "LX", "ES", "IS", "GX", "LS", "UX"],
};

// ── Марки мото ──
export const MOTO_BRANDS = [
  "Yamaha", "Honda", "BMW", "Kawasaki", "Suzuki",
  "Ducati", "KTM", "Harley-Davidson", "Bajaj",
] as const;

export const MOTO_MODELS: Record<string, string[]> = {
  Yamaha: ["R1", "R6", "MT-07", "MT-09", "Tenere 700", "YZF-R3", "XSR900"],
  Honda: ["CBR600RR", "CBR1000RR", "Africa Twin", "CB650R", "Forza 300"],
  BMW: ["S 1000 RR", "R 1250 GS", "F 900 R", "R nineT", "C 400 X"],
  Kawasaki: ["Ninja ZX-10R", "Z900", "Versys 650", "Vulcan S"],
  Suzuki: ["GSX-R1000", "V-Strom 650", "Hayabusa", "SV650"],
  Ducati: ["Panigale V4", "Monster", "Multistrada", "Scrambler"],
  KTM: ["Duke 390", "RC 390", "Adventure 1290", "EXC 300"],
  "Harley-Davidson": ["Iron 883", "Street Glide", "Fat Boy", "Road King"],
  Bajaj: ["Pulsar NS200", "Dominar 400", "Avenger"],
};

// ── Типы мотоциклов ──
export const MOTO_TYPES = [
  "Allround", "Внедорожный Эндуро", "Мотоцикл повышенной проходимости",
  "Спортивный Эндуро", "Туристический Эндуро", "Naked bike", "Дорожный",
  "Классик", "Кастом", "Круизер", "Чоппер", "Кросс", "Speedway",
  "Детский", "Минибайк", "Питбайк", "Триал", "Спорт-байк",
  "Спорт-туризм", "Супер-спорт", "Супермото", "Трайки",
  "Трицикл", "Туристические",
] as const;

// ── Марки комтранс ──
export const COMMERCIAL_BRANDS = [
  "GAZ", "ISUZU", "Mercedes-Benz", "Volkswagen", "Ford",
  "Renault", "Peugeot", "Citroen", "Fiat", "Hyundai",
  "Toyota", "Nissan",
] as const;

export const COMMERCIAL_MODELS: Record<string, string[]> = {
  GAZ: ["Gazelle Next", "Gazelle", "Sobol"],
  ISUZU: ["NQR", "NMR", "ELF", "Forward"],
  "Mercedes-Benz": ["Sprinter", "Vito", "Actros", "Atego"],
  Volkswagen: ["Crafter", "Transporter", "Caddy"],
  Ford: ["Transit", "Transit Custom", "Ranger"],
  Renault: ["Master", "Trafic", "Kangoo"],
  Hyundai: ["HD78", "Porter", "Mighty"],
  Toyota: ["Hiace", "Dyna", "Coaster"],
};

// ── Типы кузова легковых ──
export const CAR_BODY_TYPES = [
  "Седан", "Хэтчбек", "Универсал", "Купе", "Кабриолет",
  "Внедорожник", "Кроссовер", "Минивэн", "Пикап", "Лимузин",
  "Фургон", "Родстер", "Тарга",
] as const;

// ── Типы кузова комтранс ──
export const COMMERCIAL_BODY_TYPES = [
  "Автотопливозаправщик", "Тент", "Бортовой грузовик", "Бортовой с КМУ",
  "Изотермический кузов", "Кемпер", "Микроавтобус", "Пикап",
  "Промтоварный автофургон", "Рефрижератор", "Самосвал", "Скорая помощь",
  "Фургон для торговли", "Цельнометаллический фургон", "Цистерна",
  "Шасси", "Эвакуатор",
] as const;

// ── Типы двигателя легковых ──
export const CAR_ENGINE_TYPES = [
  "Бензин", "Дизель", "Гибрид", "Электро",
  "Бензин (турбо)", "Дизель (турбо)",
  "Plug-in гибрид", "Газ", "Газ-бензин",
] as const;

// ── Типы двигателя мото ──
export const MOTO_ENGINE_TYPES = [
  "Дизель", "Инжектор", "Карбюратор",
  "Бензин турбонаддув", "Электрический", "Не указано",
] as const;

// ── Типы двигателя комтранс ──
export const COMMERCIAL_ENGINE_TYPES = [
  "Бензин", "Дизель", "Электро", "Гибрид",
  "Дизель + газ", "Бензин + газ", "Газ",
] as const;

// ── Типы привода легковых ──
export const CAR_DRIVE_TYPES = [
  "Передний", "Задний", "Полный",
  "Полный подключаемый", "Полный постоянный",
] as const;

// ── Типы привода мото ──
export const MOTO_DRIVE_TYPES = [
  "Кардан", "Ремень", "Цепь", "Не указано",
] as const;

// ── Типы привода комтранс ──
export const COMMERCIAL_DRIVE_TYPES = [
  "Задний", "Передний", "Полный",
  "Заднеприводный с подключаемым передним",
  "Полный подключаемый", "Постоянный полный привод",
] as const;

// ── КПП мото ──
export const MOTO_TRANSMISSIONS = [
  "1 передача", "2 передачи", "3 передачи", "4 передачи",
  "5 передач", "6 передач", "7 передач", "8 передач",
  "2-скоростной автомат", "3-скоростной автомат",
  "4 прямых и задняя", "5 прямых и задняя", "6 прямых и задняя",
  "АКПП", "Роботизированная", "Роботизированная с двумя сцеплениями",
  "Вариатор", "Не указан",
] as const;

// ── КПП комтранс ──
export const COMMERCIAL_TRANSMISSIONS = [
  "Автомат", "Робот", "Механическая",
] as const;

// ── Расположение цилиндров мото ──
export const MOTO_CYLINDER_LAYOUTS = [
  "V-образное", "Оппозитное", "Рядное", "Ротор", "Не указано",
] as const;

// ── Такты мото ──
export const MOTO_STROKES = ["2", "4", "Не указано"] as const;

// ── Цвета ──
export const COLORS = [
  "Белый", "Чёрный", "Серебристый", "Серый", "Синий",
  "Красный", "Зелёный", "Коричневый", "Бежевый", "Жёлтый",
  "Оранжевый", "Фиолетовый", "Розовый", "Золотой",
] as const;

export const MOTO_COLORS = [
  "Чёрный", "Белый", "Серый", "Синий", "Красный",
  "Зелёный", "Жёлтый", "Оранжевый", "Коричневый", "Бежевый",
] as const;

// ── Города ──
export const CITIES = [
  "Душанбе", "Худжанд", "Бохтар", "Куляб", "Истаравшан",
  "Турсунзаде", "Хорог", "Пенджикент", "Канибадам", "Другой",
] as const;

// ── ПТС ──
export const PTS_OPTIONS = ["Оригинал", "Дубликат", "Нет ПТС"] as const;

// ── Владельцы ──
export const OWNERS_OPTIONS = ["1", "2", "3", "4+"] as const;

// ── Комплектация (Легковые) ──
export const EQUIPMENT_CATEGORIES = {
  safety: {
    title: "Безопасность",
    items: [
      "ABS", "ESP", "Подушки безопасности (фронтальные)",
      "Подушки безопасности (боковые)", "Система помощи при торможении",
      "Система контроля слепых зон", "Камера заднего вида", "Парктроник",
    ],
  },
  comfort: {
    title: "Комфорт",
    items: [
      "Кондиционер", "Климат-контроль (однозонный)",
      "Климат-контроль (многозонный)", "Круиз-контроль",
      "Адаптивный круиз-контроль", "Обогрев сидений",
      "Вентиляция сидений", "Электропривод сидений",
      "Панорамная крыша", "Люк",
    ],
  },
  multimedia: {
    title: "Мультимедиа",
    items: [
      "Мультимедийная система", "Apple CarPlay", "Android Auto",
      "Навигация", "Bluetooth", "USB", "Аудиосистема премиум",
    ],
  },
  exterior: {
    title: "Экстерьер",
    items: [
      "Ксеноновые фары", "LED фары", "Противотуманные фары",
      "Легкосплавные диски", "Рейлинги на крыше", "Тонировка",
    ],
  },
} as const;

// ── Оборудование комтранс ──
export const COMMERCIAL_EQUIPMENT = [
  "Антиблокировочная система (ABS)", "Антипробуксовочная система",
  "Круиз-контроль", "Бортовой компьютер", "Кондиционер",
  "Усилитель руля", "Регулировка руля", "Сигнализация",
  "Центральный замок", "Обогрев зеркал", "Электропривод зеркал",
  "Обогрев сидений", "Легкосплавные диски",
] as const;

export const COMMERCIAL_AIRBAGS = [
  "Отсутствуют", "Водителя", "Водителя и пассажира", "Передние и боковые",
] as const;

export const COMMERCIAL_WINDOWS = [
  "Отсутствуют", "Все", "Левый", "Правый",
] as const;

export const COMMERCIAL_RADIO = [
  "Отсутствует", "CD", "DVD", "Кассетная", "Радио",
] as const;

// ── Руль комтранс ──
export const STEERING_OPTIONS = ["Левый", "Правый"] as const;

// ── Годы ──
export function generateYears(from: number = 2026, to: number = 1980): number[] {
  const years: number[] = [];
  for (let y = from; y >= to; y--) {
    years.push(y);
  }
  return years;
}

export const YEARS = generateYears();
