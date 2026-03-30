import type { Metadata } from "next";

const API_BASE = "https://api.autotoj.tj/v1";

async function getPost(id: string) {
  try {
    const res = await fetch(`${API_BASE}/logbook/${id}`, {
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
  const post = await getPost(id);
  if (!post) return { title: "Запись не найдена | autoTOJ" };

  const title = post.title;
  const description = post.text ? post.text.slice(0, 160) : `${post.title} — бортжурнал autoTOJ`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://autotoj.tj/logbook/${id}`,
      images: post.photos?.length > 0 ? [{ url: post.photos[0] }] : undefined,
      publishedTime: post.created_at,
      authors: [post.author?.name ?? "autoTOJ"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.photos?.length > 0 ? [post.photos[0]] : undefined,
    },
    alternates: { canonical: `https://autotoj.tj/logbook/${id}` },
  };
}

export default function LogbookPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
