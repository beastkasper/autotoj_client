"use client";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Wrench,
  Car,
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

/** Главные плитки сервисов (§13.4): иконбоксы #1a1a1a и #2d2d2d. */
const FEATURED = [
  {
    id: "parts",
    title: "Запчасти",
    subtitle: "Покупка и продажа",
    icon: Wrench,
    iconBg: "#1a1a1a",
    href: "/parts",
  },
  {
    id: "rental",
    title: "Авто прокат",
    subtitle: "Аренда автомобилей",
    icon: Car,
    iconBg: "#2d2d2d",
    href: "/rental",
  },
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
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      <PageHeader title="Сервисы" variant="center" />
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

      {/* ── Мобилка (§10.5) ── */}
      <div className="px-4 pt-4 lg:hidden">
        {/* Главные плитки: 2 колонки, gap 12, r20 p20, shadow-tile */}
        <div className="grid grid-cols-2 gap-3">
          {FEATURED.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="press-tile rounded-[20px] border border-black/[0.04] bg-card p-5 text-left shadow-[var(--shadow-tile)] transition-transform"
              >
                <div
                  className="mb-3 grid size-[52px] place-items-center rounded-2xl"
                  style={{ background: item.iconBg }}
                >
                  <Icon className="size-[26px] text-white" strokeWidth={1.8} />
                </div>
                <h3 className="text-[15px] font-bold leading-5 text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-[13px] leading-[17px] text-muted-foreground">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        <h2 className="mb-3 mt-6 text-[22px] font-bold text-foreground">Услуги</h2>

        {/* Услуги: 3 колонки, gap 8, r20 p16 */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton h-[110px] rounded-[20px]" />
            ))}
          </div>
        ) : hasCategories ? (
          <div className="grid grid-cols-3 gap-2">
            {categories!.map((cat) => {
              const Icon = SERVICE_ICONS[cat.icon] ?? Wrench;
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/services/${cat.id}`)}
                  className="press-tile-sm flex flex-col items-start rounded-[20px] border border-black/[0.04] bg-card p-4 text-left shadow-[var(--shadow-tile)] transition-transform"
                >
                  <div className="grid size-11 place-items-center rounded-[14px] bg-surface-alt dark:bg-white/[0.08]">
                    <Icon className="size-[22px] text-foreground" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-3 text-[13px] font-bold leading-[17px] text-foreground">
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
