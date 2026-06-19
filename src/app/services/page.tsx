"use client";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Wrench,
  Box,
  Car,
  RectangleHorizontal,
  Sparkles,
  Truck,
  ClipboardCheck,
  Settings,
  ShieldCheck,
  Droplets,
  CircleDot,
  Star,
  GraduationCap,
} from "lucide-react";
import { useGetServiceCategoriesQuery } from "@/lib/features/services/servicesApi";
import { EmptyState } from "@/components/states/EmptyState";
import { PageHeader } from "@/components/layout/page-header";
import { DesktopPageHeader } from "@/components/layout/desktop-page-header";
import { ServicesCategoriesSkeleton } from "@/components/skeletons/services-skeleton";

/** Emoji icons for the desktop list view, keyed by the API `icon` field. */
const CATEGORY_ICONS: Record<string, string> = {
  sparkles: "🔍",
  truck: "🚛",
  clipboard_check: "🔎",
  settings: "🔧",
  shield_check: "🛡️",
  droplets: "🚿",
  circle_dot: "🛞",
  star: "✨",
  graduation_cap: "🎓",
};

/** Line icons (lucide) for the mobile services grid, keyed by the API `icon` field. */
const SERVICE_ICONS: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  truck: Truck,
  clipboard_check: ClipboardCheck,
  settings: Settings,
  shield_check: ShieldCheck,
  droplets: Droplets,
  circle_dot: CircleDot,
  star: Star,
  graduation_cap: GraduationCap,
};

/** Featured shortcut cards shown above the services grid on mobile. */
const FEATURED = [
  { id: "goods", title: "Автотовары", subtitle: "Покупка и продажа", icon: Box, href: "/parts" },
  { id: "rental", title: "Авто прокат", subtitle: "Аренда автомобилей", icon: Car, href: "/rental" },
  { id: "plates", title: "Гос номера", subtitle: "Покупка и продажа", icon: RectangleHorizontal, href: "/parts" },
];

function formatCompaniesCount(count: number): string {
  if (count === 1) return "компания";
  if (count < 5) return "компании";
  return "компаний";
}

export default function ServicesPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useGetServiceCategoriesQuery();
  const hasCategories = !!categories && categories.length > 0;

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <PageHeader title="Сервисы" />
      <DesktopPageHeader title="Сервисы" subtitle="Выберите категорию услуг" />

      {/* ── Desktop ── */}
      <div className="hidden lg:block">
        {isLoading ? (
          <ServicesCategoriesSkeleton />
        ) : hasCategories ? (
          <div className="max-w-[1440px] mx-auto px-6 py-6">
            <div className="grid grid-cols-3 gap-4">
              {categories!.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/services/${cat.id}`)}
                  className="bg-white rounded-2xl p-6 text-left hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {CATEGORY_ICONS[cat.icon] ?? "🔧"}
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
        ) : (
          <EmptyState
            icon={Wrench}
            title="Нет доступных сервисов"
            description="Сервисы появятся позже"
          />
        )}
      </div>

      {/* ── Mobile + Tablet ── */}
      <div className="lg:hidden px-4 md:px-6 pt-4 pb-28">
        {/* Featured shortcut cards */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-3">
          {FEATURED.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="bg-white rounded-2xl p-3 flex flex-col items-center text-center active:scale-[0.98] transition-transform"
              >
                <div className="size-14 rounded-[18px] bg-[#1C1C1E] flex items-center justify-center">
                  <Icon className="size-7 text-white" strokeWidth={1.8} />
                </div>
                <h3 className="mt-2.5 text-[13px] font-bold text-[#111111] leading-tight font-[family-name:var(--font-manrope)]">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#8E8E93] leading-tight font-[family-name:var(--font-manrope)]">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Услуги heading */}
        <h2 className="mt-7 mb-3 text-[24px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
          Услуги
        </h2>

        {/* Услуги grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2.5 md:gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[116px] animate-pulse" />
            ))}
          </div>
        ) : hasCategories ? (
          <div className="grid grid-cols-3 gap-2.5 md:gap-3">
            {categories!.map((cat) => {
              const Icon = SERVICE_ICONS[cat.icon] ?? Wrench;
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/services/${cat.id}`)}
                  className="bg-white rounded-2xl p-3 flex flex-col items-start active:scale-[0.98] transition-transform"
                >
                  <div className="size-12 rounded-2xl bg-[#F0F0F2] flex items-center justify-center">
                    <Icon className="size-5 text-[#111111]" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-3 text-[13px] font-bold text-[#111111] text-left leading-tight font-[family-name:var(--font-manrope)]">
                    {cat.name}
                  </h3>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Wrench}
            title="Нет доступных сервисов"
            description="Сервисы появятся позже"
          />
        )}
      </div>
    </main>
  );
}
