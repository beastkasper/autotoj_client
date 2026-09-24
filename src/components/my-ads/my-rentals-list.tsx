"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { SkeletonGrid } from "@/components/layout/skeleton-grid";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";
import {
  useGetMyRentalsQuery,
  useDeleteMyRentalMutation,
} from "@/lib/features/rental/rentalApi";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { label, CITY_LABELS, RENTAL_CLASS_LABELS } from "@/lib/utils/dict-labels";
import { formatPrice } from "@/lib/utils/formatPrice";

/**
 * Список арендных авто пользователя.
 *
 * Раньше объявления о прокате нельзя было ни найти, ни отредактировать, ни
 * удалить: в «Моих объявлениях» их не было, в профиле тоже, а /post-ad про
 * аренду не знает — созданное объявление просто пропадало из виду.
 */
export function MyRentalsList() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetMyRentalsQuery();
  const [deleteRental] = useDeleteMyRentalMutation();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const cars = data?.cars ?? [];

  const handleDelete = async (id: string) => {
    setConfirmId(null);
    try {
      await deleteRental(id).unwrap();
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Не удалось удалить объявление"));
    }
  };

  if (isLoading) return <SkeletonGrid count={3} variant="list" />;

  if (error) {
    return (
      <ErrorState
        type="error"
        title="Не удалось загрузить объявления о прокате"
        description={getApiErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="Нет объявлений о прокате"
        description="Добавьте автомобиль в разделе «Авто прокат»"
        action={{ label: "Перейти в прокат", onClick: () => router.push("/rental") }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {deleteError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-[#D32F2F]">
          {deleteError}
        </p>
      )}

      {cars.map((car) => (
        <article
          key={car.id}
          className="flex gap-3 overflow-hidden rounded-2xl border border-[#E5E5E7] bg-white"
        >
          <button
            type="button"
            onClick={() => router.push(`/rental/${car.id}`)}
            className="size-28 shrink-0"
            aria-label={`Открыть ${car.title}`}
          >
            <ImageWithFallback
              src={car.photos?.[0] ?? ""}
              alt={car.title}
              className="size-full object-cover"
              width={384}
            />
          </button>

          <div className="flex flex-1 flex-col justify-between py-3 pr-3">
            <div>
              <h3 className="text-[15px] font-medium text-[#111111]">{car.title}</h3>
              <p className="mt-0.5 text-[13px] text-[#8E8E93]">
                {label(car.car_class, RENTAL_CLASS_LABELS)}
                {car.contact_city ? ` • ${label(car.contact_city, CITY_LABELS)}` : ""}
              </p>
              <p className="mt-1 text-[16px] font-bold text-[#111111]">
                {formatPrice(car.price_per_day)} сомони / день
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[12px] text-[#8E8E93]">
                {car.year ? `${car.year} г.` : ""}
              </span>
              <button
                type="button"
                onClick={() => setConfirmId(car.id)}
                aria-label="Удалить объявление"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] text-[#D32F2F] transition-colors hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Удалить
              </button>
            </div>
          </div>
        </article>
      ))}

      {confirmId && (
        <ConfirmModal
          title="Удалить объявление?"
          description="Автомобиль будет убран из проката безвозвратно."
          confirmLabel="Удалить"
          destructive
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
