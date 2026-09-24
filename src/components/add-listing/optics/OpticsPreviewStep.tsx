"use client";

import { useState } from "react";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpticsPreviewStepProps {
  formData: {
    condition: string;
    opticsType: string;
    side: string;
    lampType: string;
    originalOrAnalog: string;
    quantity: string;
    carBrand: string;
    carModel: string;
    carYear: string;
    photos: string[];
    description: string;
    price: string;
    name: string;
    phone: string;
    city: string;
  };
  onBack: () => void;
  onClose: () => void;
  onPublish: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between py-1">
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}</span>
      <span className="text-[14px] font-normal text-[#000000]">{value}</span>
    </div>
  );
}

export function OpticsPreviewStep({ formData, onBack, onClose, onPublish }: OpticsPreviewStepProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    onPublish();
  };

  const card = "rounded-[16px] bg-[#FFFFFF] p-4";
  const cardTitle = "mb-3 text-[14px] font-semibold text-[#000000]";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center px-4">
          <button type="button" onClick={onBack} className="-ml-2 flex size-10 items-center justify-center">
            <ChevronLeft className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">Проверка объявления</span>
          <button type="button" onClick={onClose} className="-mr-2 flex size-10 items-center justify-center">
            <X className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-[#F5F5F5]">
        <div
          className="mx-auto flex w-full max-w-[720px] flex-col gap-3 p-4"
          style={{ paddingBottom: "calc(89px + max(16px, env(safe-area-inset-bottom, 0px)))" }}
        >
          {/* Photos */}
          {formData.photos.length > 0 && (
            <div className={card}>
              <div className="flex flex-row flex-wrap gap-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="aspect-square w-[31%] overflow-hidden rounded-[12px] bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="" className="size-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className={card}>
            <p className={cardTitle}>Основная информация</p>
            {formData.condition ? <InfoRow label="Состояние" value={formData.condition} /> : null}
            {formData.opticsType ? <InfoRow label="Тип оптики" value={formData.opticsType} /> : null}
          </div>

          {/* Optics Parameters */}
          <div className={card}>
            <p className={cardTitle}>Параметры оптики</p>
            {formData.side ? <InfoRow label="Сторона" value={formData.side} /> : null}
            {formData.lampType ? <InfoRow label="Тип лампы" value={formData.lampType} /> : null}
            {formData.originalOrAnalog ? <InfoRow label="Оригинал / Аналог" value={formData.originalOrAnalog} /> : null}
          </div>

          {/* Compatibility */}
          {(formData.carBrand || formData.carModel || formData.carYear) ? (
            <div className={card}>
              <p className={cardTitle}>Совместимость</p>
              {formData.carBrand ? <InfoRow label="Марка автомобиля" value={formData.carBrand} /> : null}
              {formData.carModel ? <InfoRow label="Модель автомобиля" value={formData.carModel} /> : null}
              {formData.carYear ? <InfoRow label="Год выпуска" value={formData.carYear} /> : null}
            </div>
          ) : null}

          {/* Description */}
          {formData.description ? (
            <div className={card}>
              <p className={cardTitle}>Описание</p>
              <p className="whitespace-pre-wrap text-[14px] font-normal text-[#000000]">{formData.description}</p>
            </div>
          ) : null}

          {/* Price */}
          <div className={card}>
            <p className={cardTitle}>Цена</p>
            <p className="text-[20px] font-bold text-[#000000]">{formData.price} сомони</p>
            {formData.quantity ? (
              <p className="mt-1 text-[14px] font-normal text-[#8E8E93]">За {formData.quantity}</p>
            ) : null}
          </div>

          {/* Contacts */}
          <div className={card}>
            <p className={cardTitle}>Контакты</p>
            {formData.name ? <InfoRow label="Имя" value={formData.name} /> : null}
            {formData.phone ? <InfoRow label="Телефон" value={`+992 ${formData.phone}`} /> : null}
            {formData.city ? <InfoRow label="Город" value={formData.city} /> : null}
          </div>

          {/* Bottom padding for floating button */}
          <div className="h-[96px]" />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div
          className="mx-auto w-full max-w-[720px] px-4 pt-4"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className={cn(
              "flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#111111]",
              isPublishing && "opacity-60",
            )}
          >
            {isPublishing ? (
              <Loader2 className="size-5 animate-spin" color="#FFFFFF" />
            ) : (
              <span className="text-[17px] font-semibold text-[#FFFFFF]">Подтвердить и опубликовать</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
