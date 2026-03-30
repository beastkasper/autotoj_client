export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "ТО": "bg-blue-100 text-blue-700",
    "Прошу совета": "bg-orange-100 text-orange-700",
    "Тюнинг": "bg-purple-100 text-purple-700",
    "Ремонт": "bg-red-100 text-red-700",
    "Покупка": "bg-green-100 text-green-700",
    "Автопутешествия": "bg-teal-100 text-teal-700",
    "Поломка": "bg-red-100 text-red-700",
    "Гаджеты": "bg-indigo-100 text-indigo-700",
    "Автоматика": "bg-cyan-100 text-cyan-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

export function getCategoryColorDesktop(category: string): string {
  const colors: Record<string, string> = {
    "ТО": "bg-blue-50 text-blue-700 border-blue-200",
    "Прошу совета": "bg-orange-50 text-orange-700 border-orange-200",
    "Тюнинг": "bg-purple-50 text-purple-700 border-purple-200",
    "Ремонт": "bg-red-50 text-red-700 border-red-200",
    "Покупка": "bg-green-50 text-green-700 border-green-200",
    "Автопутешествия": "bg-teal-50 text-teal-700 border-teal-200",
    "Поломка": "bg-red-50 text-red-700 border-red-200",
    "Гаджеты": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Автоматика": "bg-cyan-50 text-cyan-700 border-cyan-200",
  };
  return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
}
