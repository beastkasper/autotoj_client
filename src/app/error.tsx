"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-center">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-sm">
        <h2 className="mb-2 text-2xl font-bold text-red-400">
          Что-то пошло не так
        </h2>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          Произошла непредвиденная ошибка. Попробуйте повторить действие.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
