import type { Metadata } from "next";

const API_BASE = process.env.INTERNAL_API_URL || "https://api.autotoj.tj/v1";

async function getPlate(id: string) {
  try {
    const res = await fetch(`${API_BASE}/license-plates/${id}`, {
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
  const plate = await getPlate(id);
  if (!plate) {
    return { title: "Объявление не найдено | autoTOJ" };
  }

  const title = `Гос. номер ${plate.plate_number} — ${plate.price} сомони`;
  const description = `Автомобильный гос. номер ${plate.plate_number}. Цена: ${plate.price} сомони. ${plate.region ?? plate.contact_city ?? ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://autotoj.tj/plates/${id}`,
      images: plate.photos?.length > 0 ? [{ url: plate.photos[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `https://autotoj.tj/plates/${id}` },
  };
}

export default function PlateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
