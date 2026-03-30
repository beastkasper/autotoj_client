import type { Metadata } from "next";

const API_BASE = "https://api.autotoj.tj/v1";

async function getPart(id: string) {
  try {
    const res = await fetch(`${API_BASE}/parts/${id}`, {
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
  const part = await getPart(id);
  if (!part) {
    return { title: "Запчасть не найдена | autoTOJ" };
  }

  const title = `${part.title ?? `${part.brand ?? ""} ${part.model ?? ""}`.trim()} — ${part.price} сомони`;
  const condition = part.condition === "new" ? "Новый" : "Б/у";
  const description = `${condition} ${part.part_type ?? "запчасть"}. Цена: ${part.price} сомони. ${part.contact_city ?? ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://autotoj.tj/parts/${id}`,
      images: part.photos?.length > 0 ? [{ url: part.photos[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `https://autotoj.tj/parts/${id}` },
  };
}

export default function PartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
