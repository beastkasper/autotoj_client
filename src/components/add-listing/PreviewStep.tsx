"use client";

import { useState } from 'react';
import { Info, Check } from 'lucide-react';
import { AddListingHeader } from '@/components/add-listing/AddListingHeader';
import { InfoModal } from '@/components/add-listing/form/InfoModal';
import { ConfirmationModal } from '@/components/add-listing/form/ConfirmationModal';

interface PreviewStepProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: () => void;
  /** Идёт публикация: кнопка неактивна, чтобы двойной клик не создал два черновика. */
  isPublishing?: boolean;
  formData: {
    brand: string;
    model: string;
    year: string;
    price: string;
    city: string;
    /** vehicle_status: 'available' | 'on_order'. */
    status: string;
    /** true — растаможен (is_customs_cleared). */
    isCustomsCleared: boolean;
    country: string;
    photos: string[];
    mileage: string;
    engineType: string;
    driveType: string;
    name: string;
    phone: string;
    readyForOnlineViewing: boolean;
  };
}

const formatNumber = (value: string) => {
  const digits = (value || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/** '901234567' → '+992 90 123 45 67'. */
const formatPhone = (value: string) => {
  const d = (value || '').replace(/\D/g, '').slice(-9);
  if (d.length !== 9) return value;
  return `+992 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between py-1">
      <span className="text-[14px] font-normal text-muted-foreground">{label}:</span>
      <span className="text-[14px] font-normal text-foreground">{value}</span>
    </div>
  );
}

export function PreviewStep({ onBack, onClose, onPublish, isPublishing = false, formData }: PreviewStepProps) {
  const [showCustomsInfoModal, setShowCustomsInfoModal] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Форма хранит enum бэкенда ('on_order'); раньше здесь сравнивали с 'on-order',
  // и «На заказ» / «Страна поставки» никогда не показывались.
  const isOnOrder = formData.status === 'on_order' || formData.status === 'on-order';
  const getStatusLabel = () => {
    if (isOnOrder) return 'На заказ';
    if (formData.status === 'available' || !formData.status) return 'В наличии';
    return formData.status;
  };
  const price = formatNumber(formData.price);
  const mileage = formatNumber(formData.mileage);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <AddListingHeader
        onBack={onBack}
        onClose={() => setShowExitConfirmation(true)}
        currentStep={21}
      />

      <div className="mx-auto flex w-full max-w-[720px] shrink-0 flex-col px-5 py-4">
        <h2 className="text-[28px] font-bold text-foreground">Проверка объявления</h2>
        <p className="mt-1 text-[13px] font-normal text-muted-foreground">Проверьте информацию перед публикацией</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-5 pb-[160px] pt-6">
          {/* Preview Card */}
          <div className="mb-6 overflow-hidden rounded-[20px] border border-border bg-card">
            {formData.photos.length > 0 && formData.photos[0] !== '' && (
              <div className="relative aspect-[4/3] bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.photos[0]} alt="" className="size-full object-cover" />
                <div className="absolute right-3 top-3 rounded-[20px] bg-[rgba(255,255,255,0.9)] px-3 py-1">
                  <span className="text-[12px] font-semibold text-[#000000]">{getStatusLabel()}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col p-4">
              <span className="mb-1 text-[18px] font-bold text-foreground">{formData.brand} {formData.model}</span>
              <span className="mb-3 text-[13px] font-normal text-muted-foreground">{formData.year}</span>
              <span className="text-[22px] font-bold text-foreground">{price || '0'} сомони</span>
            </div>
          </div>

          {/* Brief Information */}
          <div className="mb-6 flex flex-col rounded-[16px] bg-secondary p-4">
            <span className="mb-3 text-[16px] font-semibold text-foreground">Краткая информация</span>
            <InfoRow label="Год" value={formData.year} />
            <InfoRow label="Пробег" value={mileage ? `${mileage} км` : '—'} />
            <InfoRow label="Двигатель" value={formData.engineType || '—'} />
            <InfoRow label="Привод" value={formData.driveType || '—'} />
            <InfoRow label="Статус" value={getStatusLabel()} />
            {isOnOrder && (
              <InfoRow label="Страна поставки" value={formData.country || '—'} />
            )}
            <div className="flex flex-row items-center justify-between py-1">
              <div className="flex flex-row items-center gap-1">
                <span className="text-[14px] font-normal text-muted-foreground">Статус растаможки:</span>
                <button
                  type="button"
                  onClick={() => setShowCustomsInfoModal(true)}
                  className="flex size-4 items-center justify-center"
                >
                  <Info color="#8E8E93" size={16} strokeWidth={2} />
                </button>
              </div>
              <span className="text-[14px] font-normal text-foreground">
                {formData.isCustomsCleared ? 'Растаможен' : 'Не растаможен'}
              </span>
            </div>
          </div>

          {/* Seller Contacts */}
          <div className="mb-6 flex flex-col rounded-[16px] bg-secondary p-4">
            <span className="mb-3 text-[16px] font-semibold text-foreground">Продавец</span>
            <span className="mb-2 text-[14px] font-normal text-foreground">{formData.name}</span>
            <span className="mb-2 text-[14px] font-normal text-foreground">{formatPhone(formData.phone)}</span>
            <span className="mb-2 text-[14px] font-normal text-foreground">{formData.city}</span>
            {formData.readyForOnlineViewing && (
              <div className="flex flex-row items-center gap-2 pt-1">
                <Check color="#34C759" size={16} strokeWidth={2} />
                <span className="text-[14px] font-normal text-foreground">Готов показать онлайн</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div
        className="shrink-0 border-t border-border bg-background px-5 pt-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isPublishing}
            className="flex h-[52px] items-center justify-center rounded-[14px] bg-secondary disabled:opacity-60"
          >
            <span className="text-[16px] font-semibold text-foreground">Редактировать</span>
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            aria-busy={isPublishing}
            className="flex h-[52px] items-center justify-center rounded-[14px] bg-foreground disabled:opacity-70"
          >
            <span className="text-[16px] font-semibold text-background">
              {isPublishing ? 'Публикуем…' : 'Опубликовать объявление'}
            </span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <InfoModal
        isOpen={showCustomsInfoModal}
        onClose={() => setShowCustomsInfoModal(false)}
        title="Не растаможен"
        message="Отметьте пункт «Не растаможен» на шаге «История автомобиля», если вы ввезли транспорт из-за границы, но не растаможили его. Даже если он привезён из страны Таможенного союза, перед продажей всё равно нужно будет заплатить пошлину."
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
