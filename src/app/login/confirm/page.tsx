"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/hooks";
import { AuthCodeStep } from "@/components/login/auth-code-step";

export default function ConfirmPage() {
  const router = useRouter();
  const { contact, method } = useAppSelector((s) => s.auth);

  // If no contact in Redux (e.g. page refresh), redirect back
  useEffect(() => {
    if (!contact) {
      router.replace("/login");
    }
  }, [contact, router]);

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center w-[400px] h-[306px] justify-center pt-10 px-4">
      <AuthCodeStep
        contactValue={contact}
        contactType={method}
        onBack={() => router.push("/login")}
      />
    </div>
  );
}
