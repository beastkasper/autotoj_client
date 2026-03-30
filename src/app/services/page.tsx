"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Wrench } from "lucide-react";
import { useGetServiceCategoriesQuery } from "@/lib/features/services/servicesApi";
import { EmptyState } from "@/components/states/EmptyState";
import { PageHeader } from "@/components/layout/page-header";
import { DesktopPageHeader } from "@/components/layout/desktop-page-header";

/** Icon map -- maps API icon key to a display emoji/label */
const CATEGORY_ICONS: Record<string, string> = {
  auto_selection: "\uD83D\uDD0D",
  tow_truck: "\uD83D\uDE9B",
  inspection: "\uD83D\uDD0E",
  car_service: "\uD83D\uDD27",
  insurance: "\uD83D\uDEE1\uFE0F",
  car_wash: "\uD83D\uDEBF",
  tire_service: "\uD83D\uDEDE",
  detailing: "\u2728",
  driving_school: "\uD83C\uDF93",
};

function formatCompaniesCount(count: number): string {
  if (count === 1) return "компания";
  if (count < 5) return "компании";
  return "компаний";
}

export default function ServicesPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useGetServiceCategoriesQuery();

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <PageHeader title="Сервисы" />
      <DesktopPageHeader title="Сервисы" subtitle="Выберите категорию услуг" />

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E7] border-t-[#111111] rounded-full animate-spin" />
        </div>
      )}

      {/* ── Categories Grid ── */}
      {!isLoading && categories && categories.length > 0 && (
        <>
          {/* Desktop */}
          <div className="hidden lg:block max-w-[1440px] mx-auto px-6 py-6">
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/services/${cat.id}`)}
                  className="bg-white rounded-2xl p-6 text-left hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {CATEGORY_ICONS[cat.icon] ?? "\uD83D\uDD27"}
                      </span>
                      <div>
                        <h3 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
                          {cat.name}
                        </h3>
                        <p className="text-[13px] text-[#8E8E93] mt-0.5 font-[family-name:var(--font-manrope)]">
                          {cat.companies_count} {formatCompaniesCount(cat.companies_count)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#C7C7CC] group-hover:text-[#8E8E93] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden px-4 py-4 space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/services/${cat.id}`)}
                className="w-full bg-white rounded-2xl px-4 py-4 flex items-center justify-between active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {CATEGORY_ICONS[cat.icon] ?? "\uD83D\uDD27"}
                  </span>
                  <div className="text-left">
                    <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
                      {cat.name}
                    </h3>
                    <p className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                      {cat.companies_count} {formatCompaniesCount(cat.companies_count)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Empty State ── */}
      {!isLoading && (!categories || categories.length === 0) && (
        <EmptyState
          icon={Wrench}
          title="Нет доступных сервисов"
          description="Сервисы появятся позже"
        />
      )}
    </main>
  );
}
