import type { Metadata } from "next";

const API_BASE = "https://api.autotoj.tj/v1";

interface AdForMeta {
  id: string;
  title: string;
  price: number;
  currency: string;
  year: number;
  mileage: number;
  location: string;
  photos: string[];
  brand: string;
  model: string;
  description: string | null;
}

async function getAd(id: string): Promise<AdForMeta | null> {
  try {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json", "Accept-Language": "ru" },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAd(id);
  if (!ad) {
    return { title: "Объявление не найдено | autoTOJ" };
  }

  const title = `${ad.brand} ${ad.model} ${ad.year} — ${ad.price.toLocaleString("ru-RU")} сомони`;
  const description = ad.description
    ? ad.description.slice(0, 160)
    : `Купить ${ad.brand} ${ad.model} ${ad.year} в ${ad.location}. Цена: ${ad.price.toLocaleString("ru-RU")} сомони. Пробег: ${ad.mileage.toLocaleString("ru-RU")} км`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://autotoj.tj/ad/${id}`,
      images: ad.photos.length > 0 ? [{ url: ad.photos[0], width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ad.photos.length > 0 ? [ad.photos[0]] : undefined,
    },
    alternates: {
      canonical: `https://autotoj.tj/ad/${id}`,
    },
  };
}

export default function AdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
