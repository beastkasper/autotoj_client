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
  formData: {
    brand: string;
    model: string;
    year: string;
    price: string;
    city: string;
    status: string;
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between py-1">
      <span className="text-[14px] font-normal text-[#8E8E93]">{label}:</span>
      <span className="text-[14px] font-normal text-[#000000]">{value}</span>
    </div>
  );
}

export function PreviewStep({ onBack, onClose, onPublish, formData }: PreviewStepProps) {
  const [showCustomsInfoModal, setShowCustomsInfoModal] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const getStatusLabel = () => {
    switch (formData.status) {
      case 'available': return 'В наличии';
      case 'on-order': return 'На заказ';
      default: return formData.status;
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <AddListingHeader
        onBack={onBack}
        onClose={() => setShowExitConfirmation(true)}
        currentStep={21}
      />

      <div className="mx-auto flex w-full max-w-[720px] shrink-0 flex-col px-5 py-4">
        <h2 className="text-[28px] font-bold text-[#000000]">Проверка объявления</h2>
        <p className="mt-1 text-[13px] font-normal text-[#8E8E93]">Проверьте информацию перед публикацией</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-5 pb-[160px] pt-6">
          {/* Preview Card */}
          <div className="mb-6 overflow-hidden rounded-[20px] border border-[#EDEDED] bg-[#FFFFFF]">
            {formData.photos.length > 0 && formData.photos[0] !== '' && (
              <div className="relative aspect-[4/3] bg-[#F2F2F7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.photos[0]} alt="" className="size-full object-cover" />
                <div className="absolute right-3 top-3 rounded-[20px] bg-[rgba(255,255,255,0.9)] px-3 py-1">
                  <span className="text-[12px] font-semibold text-[#000000]">{getStatusLabel()}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col p-4">
              <span className="mb-1 text-[18px] font-bold text-[#000000]">{formData.brand} {formData.model}</span>
              <span className="mb-3 text-[13px] font-normal text-[#8E8E93]">{formData.year}</span>
              <span className="text-[22px] font-bold text-[#000000]">{formData.price} сомони</span>
            </div>
          </div>

          {/* Brief Information */}
          <div className="mb-6 flex flex-col rounded-[16px] bg-[#F8F8F8] p-4">
            <span className="mb-3 text-[16px] font-semibold text-[#000000]">Краткая информация</span>
            <InfoRow label="Год" value={formData.year} />
            <InfoRow label="Пробег" value={`${formData.mileage} км`} />
            <InfoRow label="Двигатель" value={formData.engineType || '—'} />
            <InfoRow label="Привод" value={formData.driveType || '—'} />
            <InfoRow label="Статус" value={getStatusLabel()} />
            {formData.status === 'on-order' && (
              <InfoRow label="Страна поставки" value={formData.country} />
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
              <span className="text-[14px] font-normal text-[#000000]">
                {formData.isCustomsCleared ? 'Не растаможен' : 'Растаможен'}
              </span>
            </div>
          </div>

          {/* Seller Contacts */}
          <div className="mb-6 flex flex-col rounded-[16px] bg-[#F8F8F8] p-4">
            <span className="mb-3 text-[16px] font-semibold text-[#000000]">Продавец</span>
            <span className="mb-2 text-[14px] font-normal text-[#000000]">{formData.name}</span>
            <span className="mb-2 text-[14px] font-normal text-[#000000]">{formData.phone}</span>
            <span className="mb-2 text-[14px] font-normal text-[#000000]">{formData.city}</span>
            {formData.readyForOnlineViewing && (
              <div className="flex flex-row items-center gap-2 pt-1">
                <Check color="#34C759" size={16} strokeWidth={2} />
                <span className="text-[14px] font-normal text-[#000000]">Готов показать онлайн</span>
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
            className="flex h-[52px] items-center justify-center rounded-[14px] bg-[#F2F2F7]"
          >
            <span className="text-[16px] font-semibold text-[#000000]">Редактировать</span>
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="flex h-[52px] items-center justify-center rounded-[14px] bg-[#000000]"
          >
            <span className="text-[16px] font-semibold text-[#FFFFFF]">Опубликовать объявление</span>
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
