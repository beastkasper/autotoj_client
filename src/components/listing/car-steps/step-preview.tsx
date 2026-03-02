"use client";

import type { CarListingForm } from "@/lib/types/listing";

interface StepPreviewProps {
  form: CarListingForm;
}

function formatPrice(val: string): string {
  if (!val) return "0";
  return val.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatPhone(digits: string): string {
  if (!digits) return "";
  if (digits.length <= 2) return `+992 ${digits}`;
  if (digits.length <= 5) return `+992 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `+992 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
}

export function StepPreview({ form }: StepPreviewProps) {
  const title = [
    form.customBrand || form.brand,
    form.customModel || form.model,
    form.modification,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-0 pb-24">
      {/* Photo Gallery */}
      {form.media.photoPreviewUrls.length > 0 && (
        <div className="w-full h-[280px] overflow-x-auto flex snap-x snap-mandatory">
          {form.media.photoPreviewUrls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Фото ${i + 1}`}
              className="h-full w-full object-cover snap-center shrink-0"
            />
          ))}
        </div>
      )}

      {/* Title & Price */}
      <div className="px-4 pt-5 pb-4 border-b border-[#E5E5EA]">
        <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)] text-[#1C1C1E]">
          {title || "—"}
        </h2>
        <p className="text-[22px] font-bold font-[family-name:var(--font-manrope)] text-[#1C1C1E] mt-1">
          {formatPrice(form.price)} с
        </p>
        <div className="flex items-center gap-2 mt-1 text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          {form.year && <span>{form.year}</span>}
          {form.mileage && (
            <>
              <span>•</span>
              <span>{Number(form.mileage).toLocaleString("ru-RU")} км</span>
            </>
          )}
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {form.negotiable && (
            <span className="text-[12px] px-2 py-1 rounded-lg bg-[#F2F2F7] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Торг
            </span>
          )}
          {form.exchangePossible && (
            <span className="text-[12px] px-2 py-1 rounded-lg bg-[#F2F2F7] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Обмен
            </span>
          )}
          {form.isNotCustomsCleared && (
            <span className="text-[12px] px-2 py-1 rounded-lg bg-[#FFF3E0] text-[#E65100] font-[family-name:var(--font-manrope)]">
              Не растаможен
            </span>
          )}
        </div>
      </div>

      {/* Specs Grid */}
      <div className="px-4 py-4 border-b border-[#E5E5EA]">
        <h3 className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] mb-3">
          Характеристики
        </h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          {form.bodyType && (
            <div>
              <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Кузов
              </span>
              <p className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.bodyType}
              </p>
            </div>
          )}
          {form.engineType && (
            <div>
              <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Двигатель
              </span>
              <p className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.engineType}
              </p>
            </div>
          )}
          {form.driveType && (
            <div>
              <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Привод
              </span>
              <p className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.driveType}
              </p>
            </div>
          )}
          {form.color && (
            <div>
              <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Цвет
              </span>
              <p className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.color}
              </p>
            </div>
          )}
          {form.pts && (
            <div>
              <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                ПТС
              </span>
              <p className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.pts}
              </p>
            </div>
          )}
          {form.owners && (
            <div>
              <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Владельцев
              </span>
              <p className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.owners}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {form.description && (
        <div className="px-4 py-4 border-b border-[#E5E5EA]">
          <h3 className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] mb-2">
            Описание
          </h3>
          <p className="text-[15px] text-[#3C3C43] leading-relaxed font-[family-name:var(--font-manrope)] whitespace-pre-line">
            {form.description}
          </p>
        </div>
      )}

      {/* Equipment */}
      {form.equipment.length > 0 && (
        <div className="px-4 py-4 border-b border-[#E5E5EA]">
          <h3 className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] mb-2">
            Комплектация
          </h3>
          <div className="flex flex-wrap gap-2">
            {form.equipment.slice(0, 6).map((item) => (
              <span
                key={item}
                className="text-[13px] px-3 py-1.5 rounded-lg bg-[#F2F2F7] text-[#1C1C1E] font-[family-name:var(--font-manrope)]"
              >
                {item}
              </span>
            ))}
            {form.equipment.length > 6 && (
              <span className="text-[13px] px-3 py-1.5 rounded-lg bg-[#F2F2F7] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                +{form.equipment.length - 6}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contacts */}
      <div className="px-4 py-4">
        <h3 className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] mb-3">
          Контакты
        </h3>
        <div className="space-y-2">
          {form.contacts.name && (
            <div className="flex justify-between">
              <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Имя
              </span>
              <span className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.contacts.name}
              </span>
            </div>
          )}
          {form.contacts.phone && (
            <div className="flex justify-between">
              <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Телефон
              </span>
              <span className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {formatPhone(form.contacts.phone)}
              </span>
            </div>
          )}
          {form.contacts.city && (
            <div className="flex justify-between">
              <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                Город
              </span>
              <span className="text-[15px] font-medium font-[family-name:var(--font-manrope)]">
                {form.contacts.city === "Другой"
                  ? form.contacts.customCity || "Другой"
                  : form.contacts.city}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
