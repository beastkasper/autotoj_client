"use client";

import { useState } from "react";
import { ArrowLeft, X, Check, ChevronDown, ChevronUp, Info, Loader2 } from "lucide-react";
import { InfoModal } from "@/components/add-listing/form/InfoModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { cn } from "@/lib/utils";

interface CommercialPreviewStepProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: () => void;
  subcategory: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
}

const infoRowLabelCls = "text-[14px] font-normal text-[#8E8E93]";
const infoRowValueCls = "text-[14px] font-normal text-black";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between py-[4px]">
      <span className={infoRowLabelCls}>{label}:</span>
      <span className={infoRowValueCls}>{value}</span>
    </div>
  );
}

function CheckRow({ text, color = "#34C759" }: { text: string; color?: string }) {
  return (
    <div className="flex flex-row items-center gap-[8px] py-[4px]">
      <Check color={color} size={16} strokeWidth={2} />
      <span className="text-[14px] font-normal text-black">{text}</span>
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
    <div className="mb-[16px] overflow-hidden rounded-[20px] border border-[#EDEDED] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-row items-center justify-between p-[16px] text-left"
      >
        <span className="text-[16px] font-semibold text-black">{title}</span>
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

export function CommercialPreviewStep({
  onBack,
  onClose,
  onPublish,
  subcategory,
  formData,
}: CommercialPreviewStepProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showCustomsInfoModal, setShowCustomsInfoModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    bodyType: true,
    technical: true,
    color: true,
    documents: true,
    equipment: true,
    status: true,
    media: true,
    description: true,
    price: true,
    contacts: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePublish = () => {
    setIsPublishing(true);
    onPublish();
  };

  const hasTechnical =
    formData.driveType ||
    formData.engineType ||
    formData.transmission ||
    formData.engineVolume ||
    formData.power ||
    formData.seatsCount ||
    formData.steeringWheel;

  const hasDocuments = formData.pts || formData.owners || formData.isDamaged;

  const hasEquipment =
    (formData.equipment && formData.equipment.length > 0) ||
    formData.airbags ||
    formData.powerWindows ||
    formData.radio;

  const hasMedia = (formData.photos && formData.photos.length > 0) || formData.video;

  const hasContacts = formData.name || formData.phone || formData.city;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background pb-[12px]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center justify-between px-[20px]">
          <button type="button" onClick={onBack} className="flex h-[36px] w-[36px] items-center justify-center">
            <ArrowLeft className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
          <span className="text-[17px] font-semibold text-foreground">Проверка объявления</span>
          <button
            type="button"
            onClick={() => setShowCloseConfirmation(true)}
            className="flex h-[36px] w-[36px] items-center justify-center"
          >
            <X className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="mx-auto w-full max-w-[720px] px-[20px] pb-[160px] pt-[24px]">
          {/* Subcategory Badge */}
          <div className="mb-[16px] self-start">
            <div className="inline-block rounded-[12px] bg-[#F2F2F7] px-[16px] py-[8px]">
              <span className="text-[15px] font-medium text-black">{subcategory}</span>
            </div>
          </div>

          {/* 1. Media (Photos & Video) */}
          {hasMedia && (
            <Section title="Медиа" isExpanded={expandedSections.media} onToggle={() => toggleSection("media")}>
              {formData.photos && formData.photos.length > 0 && (
                <InfoRow label="Фото" value={`${formData.photos.length} шт.`} />
              )}
              {formData.video && <CheckRow text="Видео добавлено" />}
            </Section>
          )}

          {/* 2. Basic Info */}
          <Section
            title="Основная информация"
            isExpanded={expandedSections.basic}
            onToggle={() => toggleSection("basic")}
          >
            {formData.brand ? <InfoRow label="Марка" value={formData.brand} /> : null}
            {formData.model ? <InfoRow label="Модель" value={formData.model} /> : null}
            {formData.year ? <InfoRow label="Год" value={formData.year} /> : null}
            {formData.mileage ? <InfoRow label="Пробег" value={`${formData.mileage} км`} /> : null}
            {formData.motorHours ? <InfoRow label="Моточасы" value={formData.motorHours} /> : null}
            {formData.loadCapacity ? <InfoRow label="Загрузка" value={`${formData.loadCapacity} кг`} /> : null}
          </Section>

          {/* 3. Body Type */}
          {formData.bodyType ? (
            <Section
              title="Тип кузова"
              isExpanded={expandedSections.bodyType}
              onToggle={() => toggleSection("bodyType")}
            >
              <InfoRow label="Тип" value={formData.bodyType} />
            </Section>
          ) : null}

          {/* 4. Technical */}
          {hasTechnical ? (
            <Section
              title="Технические характеристики"
              isExpanded={expandedSections.technical}
              onToggle={() => toggleSection("technical")}
            >
              {formData.driveType ? <InfoRow label="Привод" value={formData.driveType} /> : null}
              {formData.engineType ? <InfoRow label="Двигатель" value={formData.engineType} /> : null}
              {formData.transmission ? <InfoRow label="Коробка" value={formData.transmission} /> : null}
              {formData.engineVolume ? (
                <InfoRow label="Объём двигателя" value={`${formData.engineVolume} см³`} />
              ) : null}
              {formData.power ? <InfoRow label="Мощность" value={`${formData.power} л.с.`} /> : null}
              {formData.seatsCount ? <InfoRow label="Количество мест" value={formData.seatsCount} /> : null}
              {formData.steeringWheel ? <InfoRow label="Руль" value={formData.steeringWheel} /> : null}
            </Section>
          ) : null}

          {/* 5. Color */}
          {formData.selectedColors && formData.selectedColors.length > 0 ? (
            <Section title="Цвет" isExpanded={expandedSections.color} onToggle={() => toggleSection("color")}>
              <InfoRow label="Цвет" value={formData.selectedColors.join(", ")} />
            </Section>
          ) : null}

          {/* 6. Documents & Condition */}
          {hasDocuments ? (
            <Section
              title="Документы и состояние"
              isExpanded={expandedSections.documents}
              onToggle={() => toggleSection("documents")}
            >
              {formData.pts ? <InfoRow label="ПТС" value={formData.pts} /> : null}
              {formData.owners ? <InfoRow label="Владельцев" value={formData.owners} /> : null}
              {formData.isDamaged && <CheckRow text="Битый или не на ходу" color="#FF3B30" />}
            </Section>
          ) : null}

          {/* 7. Equipment */}
          {hasEquipment ? (
            <Section
              title="Комплектация"
              isExpanded={expandedSections.equipment}
              onToggle={() => toggleSection("equipment")}
            >
              {formData.equipment && formData.equipment.length > 0 && (
                <span className="text-[14px] font-normal text-black">{formData.equipment.join(", ")}</span>
              )}
              {formData.airbags ? <InfoRow label="Подушки безопасности" value={formData.airbags} /> : null}
              {formData.powerWindows ? <InfoRow label="Электроподъёмники" value={formData.powerWindows} /> : null}
              {formData.radio ? <InfoRow label="Магнитола" value={formData.radio} /> : null}
            </Section>
          ) : null}

          {/* 8. Status */}
          <Section title="Статус" isExpanded={expandedSections.status} onToggle={() => toggleSection("status")}>
            {formData.vehicleStatus ? <InfoRow label="Статус" value={formData.vehicleStatus} /> : null}
            {formData.orderCountry ? <InfoRow label="Страна заказа" value={formData.orderCountry} /> : null}
            {/* Customs status - always shown */}
            <div className="flex flex-row items-center justify-between py-[4px]">
              <div className="flex flex-row items-center gap-[4px]">
                <span className={infoRowLabelCls}>Статус растаможки:</span>
                <button
                  type="button"
                  onClick={() => setShowCustomsInfoModal(true)}
                  className="flex h-[16px] w-[16px] items-center justify-center"
                >
                  <Info color="#8E8E93" size={16} strokeWidth={2} />
                </button>
              </div>
              <span className={infoRowValueCls}>{formData.isCustomsCleared ? "Не растаможен" : "Растаможен"}</span>
            </div>
          </Section>

          {/* 9. Description */}
          {formData.description ? (
            <Section
              title="Описание"
              isExpanded={expandedSections.description}
              onToggle={() => toggleSection("description")}
            >
              <span className="whitespace-pre-wrap text-[14px] font-normal text-black">{formData.description}</span>
            </Section>
          ) : null}

          {/* 10. Price */}
          {formData.price ? (
            <Section title="Цена" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
              <span className="text-[24px] font-bold text-black">{formData.price} сомони</span>
            </Section>
          ) : null}

          {/* 11. Contacts */}
          {hasContacts ? (
            <Section
              title="Контакты"
              isExpanded={expandedSections.contacts}
              onToggle={() => toggleSection("contacts")}
            >
              {formData.name ? <InfoRow label="Имя" value={formData.name} /> : null}
              {formData.phone ? <InfoRow label="Телефон" value={`+992 ${formData.phone}`} /> : null}
              {formData.city ? <InfoRow label="Город" value={formData.city} /> : null}
            </Section>
          ) : null}
        </div>
      </div>

      {/* Bottom Actions */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[12px] px-[20px] pt-[16px]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] w-full flex-row items-center justify-center gap-[8px] rounded-[24px] bg-[#F2F2F7]"
          >
            <ArrowLeft className="text-foreground" size={20} strokeWidth={1.5} />
            <span className="text-[16px] font-semibold text-black">Вернуться к редактированию</span>
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className={cn(
              "flex h-[52px] w-full items-center justify-center rounded-[24px] bg-black",
              isPublishing && "opacity-50",
            )}
          >
            {isPublishing ? (
              <Loader2 className="size-5 animate-spin" color="#FFFFFF" />
            ) : (
              <span className="text-[16px] font-semibold text-white">Опубликовать</span>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCloseConfirmation}
        onClose={() => setShowCloseConfirmation(false)}
        onConfirm={() => {
          setShowCloseConfirmation(false);
          onClose();
        }}
        title="Выйти без публикации?"
        message="Если вы выйдете сейчас, все введённые данные будут потеряны."
        cancelText="Остаться"
        confirmText="Выйти"
      />

      {/* Customs Info Modal */}
      <InfoModal
        isOpen={showCustomsInfoModal}
        onClose={() => setShowCustomsInfoModal(false)}
        title="Не растаможен"
        message="Отметьте пункт, если вы ввезли транспорт из-за границы, но не растаможили его. Даже если он привезён из страны Таможенного союза, перед продажей всё равно нужно будет заплатить пошлину."
      />
    </div>
  );
}
