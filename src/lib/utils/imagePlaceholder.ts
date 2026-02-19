// Генератор placeholder изображений для автомобилей
// Использует простой градиент с текстом марки и модели

export function getCarImagePlaceholder(brand: string, model: string, color?: string): string {
  // Цветовая схема в зависимости от бренда
  const brandColors: Record<string, string> = {
    'Toyota': '#EB0A1E',
    'Honda': '#CC0000',
    'Mercedes-Benz': '#00ADEF',
    'BMW': '#1C69D4',
    'Audi': '#BB0A30',
    'Lexus': '#000000',
    'Hyundai': '#002C5F',
    'Kia': '#BB162B',
    'Porsche': '#D5001C',
    'Volkswagen': '#001E50',
    'Mazda': '#C8102E',
    'Nissan': '#C3002F',
    'Chevrolet': '#FFC72C',
    'Ford': '#003478',
    'Land Rover': '#005A2B',
    'Jeep': '#1A3F2A',
    'Subaru': '#0054A6',
    'Mitsubishi': '#E60012',
    'Suzuki': '#E4032E',
    'Harley-Davidson': '#FF6600',
    'Yamaha': '#0C4289',
    'Ducati': '#CC0000',
    'Kawasaki': '#00A651',
    'KTM': '#FF6600',
  };

  const brandColor = brandColors[brand] || '#111111';
  
  // Создаем data URI с SVG
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${brandColor};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${brandColor};stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grad)"/>
      <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Manrope, Arial, sans-serif" font-size="48" font-weight="700">${brand}</text>
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-family="Manrope, Arial, sans-serif" font-size="36" font-weight="500" opacity="0.9">${model}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Простая функция для генерации цветного placeholder
export function getColorPlaceholder(width: number = 800, height: number = 600, color: string = '#E5E5E7'): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
