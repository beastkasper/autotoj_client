"use client";

import { useState } from "react";
import type { CarListingForm, ValidationErrors, ContactInfo } from "@/lib/types/listing";
import { CITIES } from "@/lib/data/listing-constants";
import { PhoneInput } from "@/components/listing/phone-input";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepContactsProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepContacts({ form, errors, onUpdate }: StepContactsProps) {
  const [showOnlineInfo, setShowOnlineInfo] = useState(false);

  const updateContact = <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) => {
    onUpdate("contacts", { ...form.contacts, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Контакты
      </h2>

      {/* Name */}
      <div>
        <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
          Имя *
        </label>
        <input
          type="text"
          value={form.contacts.name}
          onChange={(e) => updateContact("name", e.target.value)}
          placeholder="Ваше имя"
          maxLength={50}
          className={cn(
            "w-full h-12 px-4 rounded-[14px] border text-[16px] font-[family-name:var(--font-manrope)] outline-none transition-colors",
            errors.name ? "border-[#E53935]" : "border-[#D0D0D0] focus:border-black"
          )}
        />
        {errors.name && (
          <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone */}
      <PhoneInput
        value={form.contacts.phone}
        onChange={(v) => updateContact("phone", v)}
        error={errors.phone}
      />

      {/* City */}
      <BottomSheetSelect
        label="Город *"
        placeholder="Выберите город"
        value={form.contacts.city}
        options={CITIES}
        onSelect={(v) => updateContact("city", v)}
        error={errors.city}
      />

      {form.contacts.city === "Другой" && (
        <div>
          <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
            Укажите город
          </label>
          <input
            type="text"
            value={form.contacts.customCity || ""}
            onChange={(e) => updateContact("customCity", e.target.value)}
            placeholder="Введите название города"
            className="w-full h-12 px-4 rounded-[14px] border border-[#D0D0D0] text-[16px] font-[family-name:var(--font-manrope)] outline-none focus:border-black"
          />
        </div>
      )}

      {/* Online showing */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <Checkbox
            checked={form.contacts.onlineShowing}
            onCheckedChange={(checked) => updateContact("onlineShowing", !!checked)}
            className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <span className="text-[15px] text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
            Готов к онлайн-показу
          </span>
        </label>
        <button type="button" onClick={() => setShowOnlineInfo(true)}>
          <Info className="w-5 h-5 text-[#8E8E93]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Info modal */}
      {showOnlineInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl mx-6 p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-semibold font-[family-name:var(--font-manrope)]">
                Онлайн-показ
              </h3>
              <button type="button" onClick={() => setShowOnlineInfo(false)}>
                <X className="w-5 h-5 text-[#8E8E93]" />
              </button>
            </div>
            <p className="text-[15px] text-[#3C3C43] leading-relaxed font-[family-name:var(--font-manrope)]">
              Вы можете провести видео-звонок с потенциальным покупателем и показать автомобиль
              удалённо.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
