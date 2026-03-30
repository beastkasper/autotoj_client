import type { Metadata } from "next";

const API_BASE = "https://api.autotoj.tj/v1";

async function getRental(id: string) {
  try {
    const res = await fetch(`${API_BASE}/rental/${id}`, {
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
  const rental = await getRental(id);
  if (!rental) {
    return { title: "Объявление не найдено | autoTOJ" };
  }

  const title = `${rental.title} — аренда от ${rental.price_per_day} сомони/день`;
  const description = `Аренда ${rental.title}${rental.car_class ? `, класс: ${rental.car_class}` : ""}. Цена: ${rental.price_per_day} сомони/день. ${rental.contact_city ?? ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://autotoj.tj/rental/${id}`,
      images: rental.photos?.length > 0 ? [{ url: rental.photos[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `https://autotoj.tj/rental/${id}` },
  };
}

export default function RentalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
