"use client";

import { useState } from "react";
import { ArrowLeft, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";

interface TiresPreviewStepProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: () => void;
  formData: {
    vehicleType: string;
    tireType: string;
    condition: string;
    width: string;
    profile: string;
    diameter: string;
    loadIndex: string;
    speedIndex: string;
    runFlat: boolean;
    studded: boolean;
    reinforced: boolean;
    brand: string;
    model: string;
    countryOfOrigin: string;
    photos: string[];
    description: string;
    price: string;
    quantity: string;
    name: string;
    phone: string;
    city: string;
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between py-[4px]">
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}:</span>
      <span className="text-[14px] font-normal text-[#000000]">{value}</span>
    </div>
  );
}

function CheckRow({ text, color = "#34C759" }: { text: string; color?: string }) {
  return (
    <div className="flex flex-row items-center gap-[8px] py-[4px]">
      <Check color={color} size={16} strokeWidth={2} />
      <span className="text-[14px] font-normal text-[#000000]">{text}</span>
    </div>
  );
}

function Section({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[16px] overflow-hidden rounded-[20px] border border-[#EDEDED] bg-[#FFFFFF]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-row items-center justify-between p-[16px] text-left"
      >
        <span className="text-[16px] font-semibold text-[#000000]">{title}</span>
        {isExpanded ? (
          <ChevronUp color="#8E8E93" size={20} strokeWidth={1.5} />
        ) : (
          <ChevronDown color="#8E8E93" size={20} strokeWidth={1.5} />
        )}
      </button>
      {isExpanded && <div className="flex flex-col gap-[8px] px-[16px] pb-[16px]">{children}</div>}
    </div>
  );
}

export function TiresPreviewStep({ onBack, onClose, onPublish, formData }: TiresPreviewStepProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    size: true,
    characteristics: true,
    manufacturer: true,
    media: true,
    description: true,
    price: true,
    contacts: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const titleText = formData.brand && formData.model
    ? `${formData.brand} ${formData.model}`
    : formData.brand || "Шины";

  const sizeText = `${formData.width}/${formData.profile} R${formData.diameter}`;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background pb-[12px]"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          height: "calc(56px + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center justify-between px-[20px]">
          <button type="button" onClick={onBack} className="flex size-[36px] items-center justify-center">
            <ArrowLeft size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
          <span className="text-[17px] font-semibold text-foreground">Проверка объявления</span>
          <button
            type="button"
            onClick={() => setShowExitConfirmation(true)}
            className="flex size-[36px] items-center justify-center"
          >
            <X size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div
          className="mx-auto w-full max-w-[720px] px-[20px] pt-[24px]"
          style={{ paddingBottom: "calc(160px + 149px + env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Photos */}
          {formData.photos.length > 0 && (
            <div className="relative mb-[16px] overflow-hidden rounded-[16px] bg-[#F2F2F7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.photos[0]} alt="" className="aspect-[4/3] w-full object-cover" />
              {formData.photos.length > 1 && (
                <div className="absolute bottom-[12px] right-[12px] rounded-[12px] bg-[rgba(0,0,0,0.6)] px-[10px] py-[4px]">
                  <span className="text-[13px] font-medium text-[#FFFFFF]">
                    1/{formData.photos.length}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Price Card */}
          <div className="mb-[16px] rounded-[20px] border border-[#EDEDED] bg-[#FFFFFF] px-[16px] py-[16px]">
            <div className="flex flex-row items-baseline gap-[8px]">
              <span className="text-[28px] font-semibold text-[#000000]">{formData.price}</span>
              <span className="text-[17px] font-normal text-muted-foreground">сомони</span>
            </div>
          </div>

          {/* Title Card */}
          <div className="mb-[16px] rounded-[20px] border border-[#EDEDED] bg-[#FFFFFF] px-[16px] py-[16px]">
            <p className="text-[20px] font-semibold text-[#000000]">{titleText}</p>
            <p className="mt-[4px] text-[15px] font-normal text-[#8E8E93]">{sizeText}</p>
          </div>

          {/* Basic Info */}
          <Section title="Основная информация" isExpanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
            <InfoRow label="Тип шин" value={formData.tireType} />
            <InfoRow label="Состояние" value={formData.condition} />
            {formData.quantity ? <InfoRow label="Количество" value={formData.quantity} /> : null}
          </Section>

          {/* Size */}
          <Section title="Размер" isExpanded={expandedSections.size} onToggle={() => toggleSection("size")}>
            <InfoRow label="Ширина" value={formData.width} />
            <InfoRow label="Профиль" value={formData.profile} />
            <InfoRow label="Диаметр (R)" value={formData.diameter} />
          </Section>

          {/* Characteristics */}
          {(formData.loadIndex || formData.speedIndex || formData.runFlat || formData.studded || formData.reinforced) && (
            <Section title="Характеристики" isExpanded={expandedSections.characteristics} onToggle={() => toggleSection("characteristics")}>
              {formData.loadIndex ? <InfoRow label="Индекс нагрузки" value={formData.loadIndex} /> : null}
              {formData.speedIndex ? <InfoRow label="Индекс скорости" value={formData.speedIndex} /> : null}
              {formData.runFlat && <CheckRow text="RunFlat" />}
              {formData.studded && <CheckRow text="Шипы" />}
              {formData.reinforced && <CheckRow text="Усиленные (XL)" />}
            </Section>
          )}

          {/* Manufacturer */}
          {(formData.brand || formData.model || formData.countryOfOrigin) && (
            <Section title="Производитель" isExpanded={expandedSections.manufacturer} onToggle={() => toggleSection("manufacturer")}>
              {formData.brand ? <InfoRow label="Бренд" value={formData.brand} /> : null}
              {formData.model ? <InfoRow label="Модель" value={formData.model} /> : null}
              {formData.countryOfOrigin ? <InfoRow label="Страна производства" value={formData.countryOfOrigin} /> : null}
            </Section>
          )}

          {/* Media */}
          {formData.photos.length > 0 && (
            <Section title="Медиа" isExpanded={expandedSections.media} onToggle={() => toggleSection("media")}>
              <InfoRow label="Фото" value={`${formData.photos.length} шт.`} />
            </Section>
          )}

          {/* Description */}
          {formData.description ? (
            <Section title="Описание" isExpanded={expandedSections.description} onToggle={() => toggleSection("description")}>
              <p className="whitespace-pre-wrap text-[14px] font-normal text-[#000000]">{formData.description}</p>
            </Section>
          ) : null}

          {/* Price */}
          <Section title="Цена" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
            <InfoRow label="Цена" value={`${formData.price} сомони`} />
          </Section>

          {/* Contacts */}
          <Section title="Контакты" isExpanded={expandedSections.contacts} onToggle={() => toggleSection("contacts")}>
            {formData.name ? <InfoRow label="Имя" value={formData.name} /> : null}
            <InfoRow label="Телефон" value={`+992 ${formData.phone}`} />
            {formData.city ? <InfoRow label="Город" value={formData.city} /> : null}
          </Section>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div
          className="mx-auto flex w-full max-w-[720px] flex-col gap-[12px] px-[20px] pt-[16px]"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] w-full flex-row items-center justify-center gap-[8px] rounded-[24px] bg-[#F2F2F7]"
          >
            <ArrowLeft size={20} strokeWidth={1.5} className="text-foreground" />
            <span className="text-[16px] font-semibold text-[#000000]">Вернуться к редактированию</span>
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="flex h-[52px] w-full items-center justify-center rounded-[24px] bg-[#000000]"
          >
            <span className="text-[16px] font-semibold text-[#FFFFFF]">Подтвердить и опубликовать</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={() => { setShowExitConfirmation(false); onClose(); }}
        title="Выйти без публикации?"
        message="Если вы выйдете сейчас, все введённые данные будут потеряны."
        cancelText="Остаться"
        confirmText="Выйти"
      />
    </div>
  );
}
