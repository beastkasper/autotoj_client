"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, X, Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { InfoModal } from "@/components/add-listing/form/InfoModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";

interface MotoPreviewStepProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: () => void;
  onEdit?: (section: string) => void;
  subcategory: string;
  formData: {
    brand: string;
    model: string;
    motorcycleType?: string;
    scooterType?: string;
    snowmobileType?: string;
    atvType?: string;
    year: string;
    mileage: string;
    engineVolume?: string;
    engineType?: string;
    cylinderLayout?: string;
    cylinderCount?: string;
    power?: string;
    drive?: string;
    gearbox?: string;
    strokes?: string;
    color: string;
    hasElectricStarter?: boolean;
    hasABS?: boolean;
    vehicleStatus: string;
    isCustomsCleared: boolean;
    originCountry?: string;
    pts: string;
    owners: string;
    isDamaged: boolean;
    photos: string[];
    video?: string;
    panorama?: string;
    description?: string;
    price: string;
    bargaining?: boolean;
    exchange?: boolean;
    name: string;
    phone: string;
    city: string;
    readyForOnlineViewing?: boolean;
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between py-1">
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}:</span>
      <span className="text-[14px] font-normal text-black">{value}</span>
    </div>
  );
}

function CheckRow({ text, color = "#34C759" }: { text: string; color?: string }) {
  return (
    <div className="flex flex-row items-center gap-2 py-1">
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
  children: ReactNode;
}) {
  return (
    <div className="mb-4 overflow-hidden rounded-[20px] border border-[#EDEDED] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-row items-center justify-between p-4 text-left"
      >
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

export function MotoPreviewStep({ onBack, onClose, onPublish, subcategory, formData }: MotoPreviewStepProps) {
  const [showCustomsInfoModal, setShowCustomsInfoModal] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    technical: true,
    color: true,
    documents: true,
    status: true,
    media: true,
    description: true,
    price: true,
    contacts: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getVehicleType = () => {
    if (subcategory === "Мотоциклы") return formData.motorcycleType;
    if (subcategory === "Скутеры") return formData.scooterType;
    if (subcategory === "Снегоходы") return formData.snowmobileType;
    if (subcategory === "Мотовездеходы") return formData.atvType;
    return "";
  };

  const getStatusTitle = () => {
    if (subcategory === "Мотоциклы") return "Статус мотоцикла";
    if (subcategory === "Скутеры") return "Статус скутера";
    if (subcategory === "Снегоходы") return "Статус снегохода";
    if (subcategory === "Мотовездеходы") return "Статус мотовездехода";
    return "Статус";
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-[55px] w-full max-w-[720px] flex-row items-center justify-between px-5 pb-3 pt-0">
          <button
            type="button"
            onClick={onBack}
            className="flex size-9 items-center justify-center text-foreground"
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="text-[17px] font-semibold text-foreground">Проверка объявления</span>
          <button
            type="button"
            onClick={() => setShowExitConfirmation(true)}
            className="flex size-9 items-center justify-center text-foreground"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="mx-auto w-full max-w-[720px] px-5 pt-6 pb-[calc(160px+env(safe-area-inset-bottom,0px))]">
          {/* 1. Basic Info */}
          <Section title="Основная информация" isExpanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
            <InfoRow label="Марка" value={formData.brand} />
            <InfoRow label="Модель" value={formData.model} />
            {getVehicleType() ? <InfoRow label="Тип" value={getVehicleType()!} /> : null}
            <InfoRow label="Год выпуска" value={formData.year} />
            {formData.mileage ? <InfoRow label="Пробег" value={`${formData.mileage} км`} /> : null}
          </Section>

          {/* 2. Technical */}
          <Section title="Технические характеристики" isExpanded={expandedSections.technical} onToggle={() => toggleSection("technical")}>
            {formData.engineVolume ? <InfoRow label="Объём, см³" value={formData.engineVolume} /> : null}
            {formData.engineType ? <InfoRow label="Тип двигателя" value={formData.engineType} /> : null}
            {formData.cylinderCount ? <InfoRow label="Кол-во цилиндров" value={formData.cylinderCount} /> : null}
            {formData.cylinderLayout ? <InfoRow label="Расположение цилиндров" value={formData.cylinderLayout} /> : null}
            {formData.power ? <InfoRow label="Мощность, л.с." value={formData.power} /> : null}
            {formData.drive ? <InfoRow label="Привод" value={formData.drive} /> : null}
            {formData.gearbox ? <InfoRow label="Коробка" value={formData.gearbox} /> : null}
            {formData.strokes ? <InfoRow label="Число тактов" value={formData.strokes} /> : null}
          </Section>

          {/* 3. Color & Equipment */}
          {(formData.color || formData.hasElectricStarter || formData.hasABS) && (
            <Section title="Цвет и комплектация" isExpanded={expandedSections.color} onToggle={() => toggleSection("color")}>
              {formData.color ? <InfoRow label="Цвет" value={formData.color} /> : null}
              {formData.hasElectricStarter && <CheckRow text="Электростартер" />}
              {formData.hasABS && <CheckRow text="ABS" />}
            </Section>
          )}

          {/* 4. Documents */}
          <Section title="Документы и состояние" isExpanded={expandedSections.documents} onToggle={() => toggleSection("documents")}>
            {formData.pts ? <InfoRow label="Паспорт ТС" value={formData.pts} /> : null}
            {formData.owners ? <InfoRow label="Владельцев по ПТС" value={formData.owners} /> : null}
            {formData.isDamaged && <CheckRow text="Битый или не на ходу" color="#FF3B30" />}
          </Section>

          {/* 5. Status */}
          <Section title={getStatusTitle()} isExpanded={expandedSections.status} onToggle={() => toggleSection("status")}>
            <InfoRow label="Статус" value={formData.vehicleStatus} />
            {formData.vehicleStatus === "На заказ" && formData.originCountry && (
              <InfoRow label="Откуда" value={formData.originCountry} />
            )}
            <div className="flex flex-row items-center justify-between py-1">
              <div className="flex flex-row items-center gap-1">
                <span className="text-[14px] font-normal text-[#8E8E93]">Статус растаможки:</span>
                <button
                  type="button"
                  onClick={() => setShowCustomsInfoModal(true)}
                  className="flex size-4 items-center justify-center"
                >
                  <Info color="#8E8E93" size={16} strokeWidth={2} />
                </button>
              </div>
              <span className="text-[14px] font-normal text-black">
                {formData.isCustomsCleared ? "Не растаможен" : "Растаможен"}
              </span>
            </div>
          </Section>

          {/* 6. Media */}
          {(formData.photos.length > 0 || formData.video || formData.panorama) && (
            <Section title="Медиа" isExpanded={expandedSections.media} onToggle={() => toggleSection("media")}>
              {formData.photos.length > 0 && (
                <InfoRow label="Фото" value={`${formData.photos.length} шт.`} />
              )}
              {formData.video && <CheckRow text="Видео добавлено" />}
              {formData.panorama && <CheckRow text="Панорама 360°" />}
            </Section>
          )}

          {/* 7. Description */}
          {formData.description ? (
            <Section title="Описание" isExpanded={expandedSections.description} onToggle={() => toggleSection("description")}>
              <p className="whitespace-pre-wrap text-[14px] font-normal text-black">{formData.description}</p>
            </Section>
          ) : null}

          {/* 8. Price */}
          <Section title="Цена" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")}>
            <InfoRow label="Цена" value={`${formData.price} сомони`} />
            {formData.bargaining && <CheckRow text="Торг уместен" />}
            {formData.exchange && <CheckRow text="Возможен обмен" />}
          </Section>

          {/* 9. Contacts */}
          <Section title="Контакты" isExpanded={expandedSections.contacts} onToggle={() => toggleSection("contacts")}>
            <InfoRow label="Имя" value={formData.name} />
            <InfoRow label="Телефон" value={formData.phone} />
            <InfoRow label="Город" value={formData.city} />
            {formData.readyForOnlineViewing && <CheckRow text="Готов показать онлайн" />}
          </Section>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3 px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] flex-row items-center justify-center gap-2 rounded-[24px] bg-[#F2F2F7]"
          >
            <ArrowLeft className="text-foreground" size={20} strokeWidth={1.5} />
            <span className="text-[16px] font-semibold text-black">Вернуться к редактированию</span>
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="flex h-[52px] items-center justify-center rounded-[24px] bg-black"
          >
            <span className="text-[16px] font-semibold text-white">Опубликовать объявление</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <InfoModal
        isOpen={showCustomsInfoModal}
        onClose={() => setShowCustomsInfoModal(false)}
        title="Не растаможен"
        message="Отметьте пункт, если вы ввезли транспорт из-за границы, но не растаможили его. Даже если он привезён из страны Таможенного союза, перед продажей всё равно нужно будет заплатить пошлину."
      />
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
