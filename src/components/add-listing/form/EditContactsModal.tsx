"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { cn } from "@/lib/utils";

interface EditContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentPhone: string;
  currentCity: string;
  onSave: (phone: string, city: string) => void;
}

const inputBase =
  "h-12 rounded-[12px] border px-4 text-[15px] outline-none placeholder:text-muted-foreground";

export function EditContactsModal({
  isOpen,
  onClose,
  currentName,
  currentPhone,
  currentCity,
  onSave,
}: EditContactsModalProps) {
  const [phone, setPhone] = useState(currentPhone || "");
  const [city, setCity] = useState(currentCity || "");

  // Аналог мобильного useEffect([isOpen, currentPhone, currentCity]): сбрасываем поля при
  // открытии/смене исходных значений (во время рендера — без каскадного эффекта).
  const syncKey = `${isOpen}|${currentPhone}|${currentCity}`;
  const [prevSyncKey, setPrevSyncKey] = useState(syncKey);
  if (syncKey !== prevSyncKey) {
    setPrevSyncKey(syncKey);
    if (isOpen) {
      setPhone(currentPhone || "");
      setCity(currentCity || "");
    }
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 9);
    if (limited.length <= 2) return limited;
    if (limited.length <= 5) return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    if (limited.length <= 7) return `${limited.slice(0, 2)} ${limited.slice(2, 5)} ${limited.slice(5)}`;
    return `${limited.slice(0, 2)} ${limited.slice(2, 5)} ${limited.slice(5, 7)} ${limited.slice(7)}`;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const handleSave = () => {
    onSave(phone, city);
    onClose();
  };

  const isSaveDisabled = !phone || !city;

  return (
    <BottomSheet open={isOpen} onClose={onClose} maxHeight="90%">
      {/*
        Вся шторка — один BottomSheetScrollView: в динамическом режиме именно он сообщает
        высоту контента, а при открытой клавиатуре форма прокручивается целиком.
      */}
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between border-b border-border px-5 py-4">
          <span className="text-[17px] font-semibold text-foreground">Изменить контакты</span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-[16px]"
          >
            <X size={20} strokeWidth={1.5} className="text-foreground" />
          </button>
        </div>

        <div className="px-5 py-6">
          {/* Name (Read-only) */}
          <div className="mb-5 flex flex-col">
            <span className="mb-2 text-[14px] font-medium text-foreground">Имя</span>
            <input
              value={currentName}
              readOnly
              className={cn(inputBase, "w-full border-border bg-secondary font-normal text-muted-foreground")}
            />
            <span className="mt-1.5 text-[12px] font-normal text-muted-foreground">
              Имя можно изменить в разделе Профиль
            </span>
          </div>

          {/* Phone */}
          <div className="mb-5 flex flex-col">
            <span className="mb-2 text-[14px] font-medium text-foreground">
              Номер телефона <span className="text-[#FF3B30]">*</span>
            </span>
            <div className="flex flex-row gap-2">
              <input
                value="+992"
                readOnly
                className="h-12 w-20 shrink-0 rounded-[12px] border border-border bg-secondary px-4 text-[15px] font-medium text-muted-foreground outline-none"
              />
              <input
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="900 00 00"
                inputMode="tel"
                type="tel"
                className={cn(inputBase, "min-w-0 flex-1 border-border bg-card font-normal text-foreground")}
              />
            </div>
          </div>

          {/* City */}
          <div className="mb-5 flex flex-col">
            <span className="mb-2 text-[14px] font-medium text-foreground">
              Город <span className="text-[#FF3B30]">*</span>
            </span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Душанбе"
              className={cn(inputBase, "w-full border-border bg-card font-normal text-foreground")}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 px-5 pb-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={cn(
              "flex h-[52px] w-full items-center justify-center rounded-[14px] bg-foreground",
              isSaveDisabled && "opacity-40",
            )}
          >
            <span className="text-[16px] font-semibold text-background">Сохранить</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-secondary"
          >
            <span className="text-[16px] font-semibold text-foreground">Отмена</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
