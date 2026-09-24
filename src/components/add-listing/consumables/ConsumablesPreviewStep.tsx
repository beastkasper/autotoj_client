"use client";

import { useState } from "react";
import { ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";

interface ConsumablesPreviewStepProps {
  formData: {
    condition: string;
    consumableType: string;
    volume: string;
    viscosity: string;
    articleNumber: string;
    manufacturer: string;
    compatibility: string;
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
    <div className="flex flex-row items-center justify-between py-1">
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}:</span>
      <span className="shrink text-right text-[14px] font-normal text-black">{value}</span>
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
    <div className="mb-4 overflow-hidden rounded-[20px] border border-[#EDEDED] bg-white">
      <button type="button" onClick={onToggle} className="flex w-full flex-row items-center justify-between p-4 text-left">
        <span className="text-[16px] font-semibold text-black">{title}</span>
        {isExpanded ? (
          <ChevronUp color="#8E8E93" size={20} strokeWidth={1.5} />
        ) : (
          <ChevronDown color="#8E8E93" size={20} strokeWidth={1.5} />
        )}
      </button>
      {isExpanded && <div className="flex flex-col gap-2 px-4 pb-4">{children}</div>}
    </div>
  );
}

export function ConsumablesPreviewStep({ formData, onBack, onClose, onPublish }: ConsumablesPreviewStepProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    photos: true,
    basic: true,
    type: true,
    params: true,
    compatibility: true,
    quantity: true,
    description: true,
    price: true,
    contacts: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 h-[calc(56px+env(safe-area-inset-top,0px))] border-b border-border bg-background pt-[env(safe-area-inset-top,0px)] pb-3">
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center justify-between px-5">
          <button type="button" onClick={onBack} className="flex size-9 items-center justify-center">
            <ArrowLeft size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
          <span className="text-[17px] font-semibold text-foreground">Предпросмотр</span>
          <button type="button" onClick={() => setShowExitConfirmation(true)} className="flex size-9 items-center justify-center">
            <X size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="mx-auto w-full max-w-[720px] flex-1 px-5 pt-6 pb-[calc(160px+env(safe-area-inset-bottom,0px))]">

        {/* Photos */}
        {formData.photos.length > 0 && (
          <Section title="Фотографии" isExpanded={expandedSections.photos} onToggle={() => toggleSection("photos")}>
            <div className="flex flex-row flex-wrap gap-2">
              {formData.photos.map((photo, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src={photo}
                  alt=""
                  className="aspect-square w-[31%] rounded-[12px] bg-[#F2F2F7] object-cover"
                />
              ))}
            </div>
          </Section>
        )}

        {/* Main Info */}
        {formData.condition ? (
          <Section title="Основная информация" isExpanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
            <InfoRow label="Состояние" value={formData.condition} />
          </Section>
        ) : null}

        {/* Type */}
        {formData.consumableType ? (
          <Section title="Тип расходника" isExpanded={expandedSections.type} onToggle={() => toggleSection("type")}>
            <p className="whitespace-pre-wrap text-[14px] font-normal text-black">{formData.consumableType}</p>
          </Section>
        ) : null}

        {/* Parameters */}
        {(formData.volume || formData.viscosity || formData.articleNumber || formData.manufacturer) ? (
          <Section title="Параметры" isExpanded={expandedSections.params} onToggle={() => toggleSection("params")}>
            {formData.volume ? <InfoRow label="Объём / ёмкость" value={formData.volume} /> : null}
            {formData.viscosity ? <InfoRow label="Вязкость" value={formData.viscosity} /> : null}
            {formData.articleNumber ? <InfoRow label="Артикул" value={formData.articleNumber} /> : null}
            {formData.manufacturer ? <InfoRow label="Производитель" value={formData.manufacturer} /> : null}
          </Section>
        ) : null}

        {/* Compatibility */}
        {formData.compatibility ? (
          <Section title="Совместимость" isExpanded={expandedSections.compatibility} onToggle={() => toggleSection("compatibility")}>
            <p className="whitespace-pre-wrap text-[14px] font-normal text-black">{formData.compatibility}</p>
          </Section>
        ) : null}

        {/* Quantity */}
        {formData.quantity ? (
          <Section title="Количество" isExpanded={expandedSections.quantity} onToggle={() => toggleSection("quantity")}>
            <p className="whitespace-pre-wrap text-[14px] font-normal text-black">{formData.quantity}</p>
          </Section>
        ) : null}

        {/* Description */}
        {formData.description ? (
          <Section title="Описание" isExpanded={expandedSections.description} onToggle={() => toggleSection("description")}>
            <p className="whitespace-pre-wrap text-[14px] font-normal text-black">{formData.description}</p>
          </Section>
        ) : null}

        {/* Price */}
        {formData.price ? (
          <Section title="Цена" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
            <p className="text-[20px] font-bold text-black">{formData.price} сомони</p>
          </Section>
        ) : null}

        {/* Contacts */}
        <Section title="Контакты" isExpanded={expandedSections.contacts} onToggle={() => toggleSection("contacts")}>
          {formData.name ? <InfoRow label="Имя" value={formData.name} /> : null}
          {formData.phone ? <InfoRow label="Телефон" value={`+992 ${formData.phone}`} /> : null}
          {formData.city ? <InfoRow label="Город" value={formData.city} /> : null}
        </Section>

      </div>

      {/* Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3 px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] w-full flex-row items-center justify-center gap-2 rounded-[24px] bg-[#F2F2F7]"
          >
            <ArrowLeft size={20} strokeWidth={1.5} className="text-foreground" />
            <span className="text-[16px] font-semibold text-black">Вернуться к редактированию</span>
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="flex h-[52px] w-full items-center justify-center rounded-[24px] bg-black"
          >
            <span className="text-[16px] font-semibold text-white">Опубликовать</span>
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
