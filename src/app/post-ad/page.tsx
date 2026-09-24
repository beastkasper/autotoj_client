"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequireAuth } from "@/components/auth/require-auth";
import { AddListingCategoryPage } from "@/components/add-listing/AddListingCategoryPage";
import { PostAdPage, type PostAdCategory } from "@/components/add-listing/PostAdPage";
import { FeedbackHost } from "@/components/add-listing/FeedbackHost";
import { useGetProfileQuery } from "@/lib/features/profile/profileApi";
import { setRemoteProfile } from "@/lib/add-listing/userStore";

const CATEGORIES: PostAdCategory[] = ["cars", "moto", "commercial", "parts"];

function parseCategory(value: string | null): PostAdCategory | null {
  return value && (CATEGORIES as string[]).includes(value) ? (value as PostAdCategory) : null;
}

/**
 * Поток подачи объявления как в мобилке: экран выбора категории
 * (AddListingCategoryPage) → PostAdPage. `?category=` открывает форму сразу.
 */
function PostAdFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = parseCategory(searchParams.get("category"));
  const [category, setCategory] = useState<PostAdCategory | null>(preselected);

  const { data: profile } = useGetProfileQuery();
  useEffect(() => {
    setRemoteProfile(profile);
  }, [profile]);

  const exit = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  }, [router]);

  // Как navigation.goBack() в мобилке: из формы — назад к выбору категории,
  // а если категория пришла из ссылки — уходим со страницы.
  const handleClose = useCallback(() => {
    if (preselected) exit();
    else setCategory(null);
  }, [preselected, exit]);

  return (
    <>
      {category ? (
        <PostAdPage
          key={category}
          initialCategory={category}
          onClose={handleClose}
          onSuccess={() => router.push("/")}
        />
      ) : (
        <AddListingCategoryPage onBack={exit} onSelectCategory={setCategory} />
      )}
      <FeedbackHost />
    </>
  );
}

export default function PostAdRoute() {
  return (
    <RequireAuth description="Разместить объявление можно только из своего аккаунта">
      <Suspense fallback={null}>
        <PostAdFlow />
      </Suspense>
    </RequireAuth>
  );
}
