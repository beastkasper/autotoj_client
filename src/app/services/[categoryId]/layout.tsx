import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;

  const title = `Автосервисы — ${categoryId} | autoTOJ`;
  const description = `Автосервисы и услуги в категории ${categoryId}. Найдите лучших специалистов на autoTOJ`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `https://autotoj.tj/services/${categoryId}` },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `https://autotoj.tj/services/${categoryId}` },
  };
}

export default function ServiceCategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
