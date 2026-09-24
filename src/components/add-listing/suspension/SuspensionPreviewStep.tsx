"use client";

import { useState } from "react";
import { ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";

interface SuspensionPreviewStepProps {
  formData: {
    condition: string;
    partType: string;
    axle: string;
    side: string;
    quantity: string;
    carBrand: string;
    carModel: string;
    carYear: string;
    bodyType: string;
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
    <div className="mb-4 overflow-hidden rounded-[20px] border border-[#EDEDED] bg-[#FFFFFF]">
      <button type="button" onClick={onToggle} className="flex w-full flex-row items-center justify-between p-4 text-left">
        <span className="text-[16px] font-semibold text-[#000000]">{title}</span>
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

export function SuspensionPreviewStep({ formData, onBack, onClose, onPublish }: SuspensionPreviewStepProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    photos: true,
    basic: true,
    parameters: true,
    compatibility: true,
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
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center justify-between px-5 pb-3">
          <button type="button" onClick={onBack} className="flex size-9 items-center justify-center">
            <ArrowLeft className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
          <span className="text-[17px] font-semibold text-foreground">Проверка объявления</span>
          <button type="button" onClick={() => setShowExitConfirmation(true)} className="flex size-9 items-center justify-center">
            <X className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        className="mx-auto w-full max-w-[720px] flex-1 px-5 pt-6"
        style={{ paddingBottom: "calc(293px + max(16px, env(safe-area-inset-bottom, 0px)))" }}
      >
        {/* Photos */}
        {formData.photos.length > 0 && (
          <Section
            title="Фотографии"
            isExpanded={expandedSections.photos}
            onToggle={() => toggleSection("photos")}
          >
            <div className="flex flex-row flex-wrap gap-2">
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
        <Section
          title="Основная информация"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
        >
          {formData.condition ? <InfoRow label="Состояние" value={formData.condition} /> : null}
          {formData.partType ? <InfoRow label="Тип детали" value={formData.partType} /> : null}
        </Section>

        {/* Параметры детали */}
        <Section
          title="Параметры детали"
          isExpanded={expandedSections.parameters}
          onToggle={() => toggleSection("parameters")}
        >
          {formData.axle ? <InfoRow label="Ось установки" value={formData.axle} /> : null}
          {formData.side ? <InfoRow label="Сторона" value={formData.side} /> : null}
          {formData.quantity ? <InfoRow label="Количество" value={formData.quantity} /> : null}
        </Section>

        {/* Совместимость */}
        {(formData.carBrand || formData.carModel || formData.carYear || formData.bodyType) && (
          <Section
            title="Совместимость"
            isExpanded={expandedSections.compatibility}
            onToggle={() => toggleSection("compatibility")}
          >
            {formData.carBrand ? <InfoRow label="Марка автомобиля" value={formData.carBrand} /> : null}
            {formData.carModel ? <InfoRow label="Модель автомобиля" value={formData.carModel} /> : null}
            {formData.carYear ? <InfoRow label="Год выпуска" value={formData.carYear} /> : null}
            {formData.bodyType ? <InfoRow label="Тип кузова" value={formData.bodyType} /> : null}
          </Section>
        )}

        {/* Описание */}
        {formData.description ? (
          <Section
            title="Описание"
            isExpanded={expandedSections.description}
            onToggle={() => toggleSection("description")}
          >
            <p className="whitespace-pre-wrap text-[14px] font-normal text-[#000000]">{formData.description}</p>
          </Section>
        ) : null}

        {/* Цена */}
        <Section
          title="Цена"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <p className="text-[20px] font-bold text-[#000000]">{formData.price} сомони</p>
          {formData.quantity ? (
            <p className="mt-1 text-[14px] font-normal text-[#8E8E93]">За {formData.quantity}</p>
          ) : null}
        </Section>

        {/* Контакты */}
        <Section
          title="Контакты"
          isExpanded={expandedSections.contacts}
          onToggle={() => toggleSection("contacts")}
        >
          {formData.name ? <InfoRow label="Имя" value={formData.name} /> : null}
          {formData.phone ? <InfoRow label="Телефон" value={`+992 ${formData.phone}`} /> : null}
          {formData.city ? <InfoRow label="Город" value={formData.city} /> : null}
        </Section>
      </div>

      {/* Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div
          className="mx-auto flex w-full max-w-[720px] flex-col gap-3 px-5 pt-4"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] w-full flex-row items-center justify-center gap-2 rounded-[24px] bg-[#F2F2F7]"
          >
            <ArrowLeft className="text-foreground" size={20} strokeWidth={1.5} />
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
