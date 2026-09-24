"use client";

import { useState } from "react";
import { ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";

interface SteeringWheelPreviewStepProps {
  formData: {
    vehicleType: string;
    condition: string;
    wheelType: string;
    diameter: string;
    material: string;
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
    <div className="flex flex-row items-center justify-between py-[4px]">
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}:</span>
      <span className="text-[14px] font-normal text-[#000000]">{value}</span>
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

export function SteeringWheelPreviewStep({ formData, onBack, onClose, onPublish }: SteeringWheelPreviewStepProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    parameters: true,
    compatibility: true,
    media: true,
    description: true,
    price: true,
    contacts: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
          {/* 1. Photos */}
          {formData.photos && formData.photos.length > 0 && (
            <Section title="Фотографии" isExpanded={expandedSections.media} onToggle={() => toggleSection("media")}>
              <InfoRow label="Фото" value={`${formData.photos.length} шт.`} />
            </Section>
          )}

          {/* 2. Basic Info */}
          <Section title="Основная информация" isExpanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
            {formData.vehicleType ? <InfoRow label="Тип ТС" value={formData.vehicleType} /> : null}
            {formData.condition ? <InfoRow label="Состояние" value={formData.condition} /> : null}
          </Section>

          {/* 3. Steering Wheel Parameters */}
          <Section title="Параметры руля" isExpanded={expandedSections.parameters} onToggle={() => toggleSection("parameters")}>
            {formData.wheelType ? <InfoRow label="Тип руля" value={formData.wheelType} /> : null}
            {formData.diameter ? <InfoRow label="Диаметр руля" value={`${formData.diameter} мм`} /> : null}
            {formData.material ? <InfoRow label="Материал" value={formData.material} /> : null}
          </Section>

          {/* 4. Compatibility */}
          {(formData.carBrand || formData.carModel || formData.carYear) ? (
            <Section title="Совместимость" isExpanded={expandedSections.compatibility} onToggle={() => toggleSection("compatibility")}>
              {formData.carBrand ? <InfoRow label="Марка автомобиля" value={formData.carBrand} /> : null}
              {formData.carModel ? <InfoRow label="Модель автомобиля" value={formData.carModel} /> : null}
              {formData.carYear ? <InfoRow label="Год выпуска" value={formData.carYear} /> : null}
            </Section>
          ) : formData.wheelType === "Универсальный" ? (
            <Section title="Совместимость" isExpanded={expandedSections.compatibility} onToggle={() => toggleSection("compatibility")}>
              <p className="text-[14px] font-normal text-[#8E8E93]">
                Универсальный руль (подходит для большинства автомобилей)
              </p>
            </Section>
          ) : null}

          {/* 5. Description */}
          {formData.description ? (
            <Section title="Описание" isExpanded={expandedSections.description} onToggle={() => toggleSection("description")}>
              <p className="whitespace-pre-wrap text-[14px] font-normal text-[#000000]">{formData.description}</p>
            </Section>
          ) : null}

          {/* 6. Price */}
          {formData.price ? (
            <Section title="Цена" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
              <p className="text-[24px] font-bold text-[#000000]">{formData.price} сомони</p>
            </Section>
          ) : null}

          {/* 7. Contacts */}
          <Section title="Контакты" isExpanded={expandedSections.contacts} onToggle={() => toggleSection("contacts")}>
            {formData.name ? <InfoRow label="Имя" value={formData.name} /> : null}
            {formData.phone ? <InfoRow label="Телефон" value={`+992 ${formData.phone}`} /> : null}
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

      {/* Exit Confirmation Modal */}
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
