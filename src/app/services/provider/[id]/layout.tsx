import type { Metadata } from "next";

const API_BASE = process.env.INTERNAL_API_URL || "https://api.autotoj.tj/v1";

async function getProvider(id: string) {
  try {
    const res = await fetch(`${API_BASE}/service-providers/${id}`, {
      next: { revalidate: 300 },
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
  const provider = await getProvider(id);
  if (!provider) return { title: "Сервис не найден | autoTOJ" };

  const title = `${provider.name} — автосервис в ${provider.city}`;
  const description = provider.description
    ? provider.description.slice(0, 160)
    : `${provider.name} — автосервис в ${provider.city}. Рейтинг: ${provider.rating}/5`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://autotoj.tj/services/provider/${id}`,
      images: provider.logo_url ? [{ url: provider.logo_url }] : undefined,
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://autotoj.tj/services/provider/${id}` },
  };
}

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
