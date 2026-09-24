"use client";

import { useState } from "react";
import { ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";

interface WheelsPreviewStepProps {
  formData: {
    vehicleType: string;
    condition: string;
    diameter: string;
    width: string;
    pcd: string;
    offset: string;
    dia: string;
    wheelType: string;
    material: string;
    brand: string;
    model: string;
    quantity: string;
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
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}</span>
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

export function WheelsPreviewStep({ formData, onBack, onClose, onPublish }: WheelsPreviewStepProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    photos: true,
    basic: true,
    parameters: true,
    type: true,
    manufacturer: true,
    quantity: true,
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

      {/* Content */}
      <div className="flex-1">
        <div
          className="mx-auto w-full max-w-[720px] px-[20px] pt-[24px]"
          style={{ paddingBottom: "calc(160px + 149px + env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Фото */}
          {formData.photos && formData.photos.length > 0 && (
            <Section title="Фото" isExpanded={expandedSections.photos} onToggle={() => toggleSection("photos")}>
              <div className="flex flex-row flex-wrap gap-[8px]">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="aspect-square w-[31%] overflow-hidden rounded-[12px] bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="" className="size-full object-cover" />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Основная информация */}
          <Section title="Основная информация" isExpanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
            {formData.condition ? <InfoRow label="Состояние" value={formData.condition} /> : null}
          </Section>

          {/* Параметры диска */}
          {(formData.diameter || formData.width || formData.pcd || formData.offset || formData.dia) ? (
            <Section title="Параметры диска" isExpanded={expandedSections.parameters} onToggle={() => toggleSection("parameters")}>
              {formData.diameter ? <InfoRow label="Диаметр (R)" value={formData.diameter} /> : null}
              {formData.width ? <InfoRow label="Ширина диска (J)" value={formData.width} /> : null}
              {formData.pcd ? <InfoRow label="Разболтовка (PCD)" value={formData.pcd} /> : null}
              {formData.offset ? <InfoRow label="Вылет (ET)" value={`${formData.offset} мм`} /> : null}
              {formData.dia ? <InfoRow label="Центральное отверстие (DIA)" value={`${formData.dia} мм`} /> : null}
            </Section>
          ) : null}

          {/* Тип и материал */}
          {(formData.wheelType || formData.material) ? (
            <Section title="Тип и материал" isExpanded={expandedSections.type} onToggle={() => toggleSection("type")}>
              {formData.wheelType ? <InfoRow label="Тип диска" value={formData.wheelType} /> : null}
              {formData.material ? <InfoRow label="Материал" value={formData.material} /> : null}
            </Section>
          ) : null}

          {/* Производитель */}
          {(formData.brand || formData.model) ? (
            <Section title="Производитель" isExpanded={expandedSections.manufacturer} onToggle={() => toggleSection("manufacturer")}>
              {formData.brand ? <InfoRow label="Бренд" value={formData.brand} /> : null}
              {formData.model ? <InfoRow label="Модель" value={formData.model} /> : null}
            </Section>
          ) : null}

          {/* Количество */}
          {formData.quantity ? (
            <Section title="Количество" isExpanded={expandedSections.quantity} onToggle={() => toggleSection("quantity")}>
              <InfoRow label="Количество дисков" value={formData.quantity} />
            </Section>
          ) : null}

          {/* Описание */}
          {formData.description ? (
            <Section title="Описание" isExpanded={expandedSections.description} onToggle={() => toggleSection("description")}>
              <p className="whitespace-pre-wrap text-[14px] font-normal text-[#000000]">{formData.description}</p>
            </Section>
          ) : null}

          {/* Цена */}
          {formData.price ? (
            <Section title="Цена" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
              <p className="text-[20px] font-semibold text-[#000000]">{formData.price} сомони</p>
            </Section>
          ) : null}

          {/* Контакты */}
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
            <span className="text-[16px] font-semibold text-[#FFFFFF]">Опубликовать объявление</span>
          </button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={() => {
          setShowExitConfirmation(false);
          onClose();
        }}
        title="Выйти без публикации?"
        message="Если вы выйдете сейчас, все введённые данные будут потеряны."
        cancelText="Остаться"
        confirmText="Выйти"
      />
    </div>
  );
}
