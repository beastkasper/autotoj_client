"use client";

import type { CommercialListingForm, ValidationErrors, ContactInfo, MediaData } from "@/lib/types/listing";
import {
  COMMERCIAL_BRANDS, COMMERCIAL_MODELS, COMMERCIAL_BODY_TYPES,
  COMMERCIAL_DRIVE_TYPES, COMMERCIAL_ENGINE_TYPES, COMMERCIAL_TRANSMISSIONS,
  COMMERCIAL_EQUIPMENT, COMMERCIAL_AIRBAGS, COMMERCIAL_WINDOWS, COMMERCIAL_RADIO,
  STEERING_OPTIONS, COLORS, YEARS,
  VEHICLE_STATUSES, PTS_OPTIONS, OWNERS_OPTIONS, CITIES,
} from "@/lib/data/listing-constants";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import { SegmentedControl } from "@/components/listing/segmented-control";
import { ToggleSwitch } from "@/components/listing/toggle-switch";
import { PriceInput } from "@/components/listing/price-input";
import { PhoneInput } from "@/components/listing/phone-input";
import { PhotoUpload } from "@/components/listing/photo-upload";
import { VideoUpload } from "@/components/listing/video-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface CommercialFormProps {
  form: CommercialListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CommercialListingForm>(key: K, value: CommercialListingForm[K]) => void;
}

export function CommercialForm({ form, errors, onUpdate }: CommercialFormProps) {
  const updateContact = useCallback(
    <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) => {
      onUpdate("contacts", { ...form.contacts, [key]: value });
    },
    [form.contacts, onUpdate]
  );

  const handleAddPhotos = useCallback(
    (files: File[]) => {
      const updated: MediaData = {
        ...form.media,
        photos: [...form.media.photos, ...files],
        photoPreviewUrls: [
          ...form.media.photoPreviewUrls,
          ...files.map((f) => URL.createObjectURL(f)),
        ],
      };
      onUpdate("media", updated);
    },
    [form.media, onUpdate]
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      URL.revokeObjectURL(form.media.photoPreviewUrls[index]);
      const updated: MediaData = {
        ...form.media,
        photos: form.media.photos.filter((_, i) => i !== index),
        photoPreviewUrls: form.media.photoPreviewUrls.filter((_, i) => i !== index),
      };
      onUpdate("media", updated);
    },
    [form.media, onUpdate]
  );

  const toggleEquipment = (item: string) => {
    const next = form.equipment.includes(item)
      ? form.equipment.filter((e) => e !== item)
      : [...form.equipment, item];
    onUpdate("equipment", next);
  };

  const toggleColor = (color: string) => {
    const next = form.colors.includes(color)
      ? form.colors.filter((c) => c !== color)
      : [...form.colors, color];
    onUpdate("colors", next);
  };

  return (
    <div className="pb-24">
      <Accordion
        type="multiple"
        defaultValue={["basic", "tech"]}
        className="space-y-3 p-4"
      >
        {/* 1. Basic Info */}
        <AccordionItem value="basic" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Основная информация *
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="Марка *" value={form.customBrand || form.brand} options={COMMERCIAL_BRANDS} onSelect={(v) => { onUpdate("brand", v); onUpdate("customBrand", ""); onUpdate("model", ""); }} searchable allowCustom customLabel="Добавить марку" onAddCustom={(v) => { onUpdate("customBrand", v); onUpdate("brand", ""); }} error={errors.brand} />
              <BottomSheetSelect label="Модель *" value={form.customModel || form.model} options={form.brand ? COMMERCIAL_MODELS[form.brand] || [] : []} onSelect={(v) => { onUpdate("model", v); onUpdate("customModel", ""); }} searchable allowCustom customLabel="Добавить модель" onAddCustom={(v) => { onUpdate("customModel", v); onUpdate("model", ""); }} error={errors.model} />
              <div>
                <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">Грузоподъёмность, т</label>
                <input type="number" step="0.1" min="0.5" max="5" value={form.loadCapacity} onChange={(e) => onUpdate("loadCapacity", e.target.value)} placeholder="Грузоподъёмность, т" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              </div>
              <BottomSheetSelect label="Год *" value={form.year?.toString() || ""} options={YEARS.map(String)} onSelect={(v) => onUpdate("year", parseInt(v, 10))} error={errors.year} />
              <div>
                <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">Пробег, км *</label>
                <input type="text" inputMode="numeric" value={form.mileage} onChange={(e) => onUpdate("mileage", e.target.value.replace(/\D/g, ""))} placeholder="Пробег, км" className={cn("w-full h-12 px-4 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] outline-none", errors.mileage ? "border-[#E53935]" : "border-[#C7C7CC] focus:border-black")} />
                {errors.mileage && <p className="mt-1 text-[12px] text-[#E53935]">{errors.mileage}</p>}
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 2. Body Type */}
        <AccordionItem value="body" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Тип кузова
            </AccordionTrigger>
            <AccordionContent>
              <BottomSheetSelect label="Тип кузова" value={form.bodyType} options={COMMERCIAL_BODY_TYPES} onSelect={(v) => onUpdate("bodyType", v)} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 3. Technical */}
        <AccordionItem value="tech" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Технические характеристики
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="Привод" value={form.driveType} options={COMMERCIAL_DRIVE_TYPES} onSelect={(v) => onUpdate("driveType", v)} />
              <BottomSheetSelect label="Двигатель" value={form.engineType} options={COMMERCIAL_ENGINE_TYPES} onSelect={(v) => onUpdate("engineType", v)} />
              <BottomSheetSelect label="КПП" value={form.transmission} options={COMMERCIAL_TRANSMISSIONS} onSelect={(v) => onUpdate("transmission", v)} />
              <input type="text" inputMode="numeric" value={form.seats} onChange={(e) => onUpdate("seats", e.target.value.replace(/\D/g, ""))} placeholder="Количество мест" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <input type="number" step="0.1" min="0.8" max="10" value={form.engineVolume} onChange={(e) => onUpdate("engineVolume", e.target.value)} placeholder="Объём, л" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <input type="text" inputMode="numeric" value={form.power} onChange={(e) => onUpdate("power", e.target.value.replace(/\D/g, ""))} placeholder="Мощность, л.с." className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <BottomSheetSelect label="Руль" value={form.steering} options={STEERING_OPTIONS} onSelect={(v) => onUpdate("steering", v)} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 4. Color (Multiple) */}
        <AccordionItem value="color" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Цвет
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => toggleColor(c)} className={cn("px-3 py-2 rounded-lg text-[14px] font-[family-name:var(--font-manrope)] border transition-all", form.colors.includes(c) ? "bg-black text-white border-black" : "bg-white text-black border-[#D1D1D6]")}>
                    {c}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 5. Documents */}
        <AccordionItem value="docs" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Документы
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="ПТС" value={form.pts} options={PTS_OPTIONS} onSelect={(v) => onUpdate("pts", v)} />
              <BottomSheetSelect label="Владельцев" value={form.owners} options={OWNERS_OPTIONS} onSelect={(v) => onUpdate("owners", v)} />
              <ToggleSwitch label="Не растаможен" checked={form.isNotCustomsCleared} onChange={(v) => onUpdate("isNotCustomsCleared", v)} />
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={form.hasAccident} onCheckedChange={(c) => onUpdate("hasAccident", !!c)} className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                <span className="text-[15px] font-[family-name:var(--font-manrope)]">Побывал в ДТП</span>
              </label>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 6. Equipment */}
        <AccordionItem value="equip" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Оборудование
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2.5">
                {COMMERCIAL_EQUIPMENT.map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={form.equipment.includes(item)} onCheckedChange={() => toggleEquipment(item)} className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                    <span className="text-[15px] font-[family-name:var(--font-manrope)]">{item}</span>
                  </label>
                ))}
              </div>
              <BottomSheetSelect label="Подушки безопасности" value={form.airbags} options={COMMERCIAL_AIRBAGS} onSelect={(v) => onUpdate("airbags", v)} />
              <BottomSheetSelect label="Стеклоподъёмники" value={form.windows} options={COMMERCIAL_WINDOWS} onSelect={(v) => onUpdate("windows", v)} />
              <BottomSheetSelect label="Магнитола" value={form.radio} options={COMMERCIAL_RADIO} onSelect={(v) => onUpdate("radio", v)} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 7. Status */}
        <AccordionItem value="status" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Статус транспорта
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <SegmentedControl options={VEHICLE_STATUSES} value={form.status} onChange={(v) => onUpdate("status", v)} />
              {form.status === "На заказ" && (
                <input type="text" value={form.supplyCountry} onChange={(e) => onUpdate("supplyCountry", e.target.value)} placeholder="Страна поставки" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              )}
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 8. Media */}
        <AccordionItem value="media" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Медиа
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <PhotoUpload photos={form.media.photos} previewUrls={form.media.photoPreviewUrls} onAdd={handleAddPhotos} onRemove={handleRemovePhoto} />
              <VideoUpload video={form.media.video} previewUrl={form.media.videoPreviewUrl} onAdd={(f) => onUpdate("media", { ...form.media, video: f, videoPreviewUrl: URL.createObjectURL(f) })} onRemove={() => { if (form.media.videoPreviewUrl) URL.revokeObjectURL(form.media.videoPreviewUrl); onUpdate("media", { ...form.media, video: null, videoPreviewUrl: null }); }} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 9. Description */}
        <AccordionItem value="desc" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Описание
            </AccordionTrigger>
            <AccordionContent>
              <div className="relative">
                <textarea value={form.description} onChange={(e) => { if (e.target.value.length <= 3000) onUpdate("description", e.target.value); }} placeholder="Расскажите о транспорте..." rows={4} className="w-full min-h-[120px] p-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none resize-none focus:border-black" />
                <span className="absolute bottom-3 right-4 text-[12px] text-[#8E8E93]">{form.description.length} / 3000</span>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 10. Price */}
        <AccordionItem value="price" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Цена *
            </AccordionTrigger>
            <AccordionContent>
              <PriceInput value={form.price} onChange={(v) => onUpdate("price", v)} error={errors.price} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 11. Contacts */}
        <AccordionItem value="contacts" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Контакты *
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">Имя *</label>
                <input type="text" value={form.contacts.name} onChange={(e) => updateContact("name", e.target.value)} placeholder="Ваше имя" maxLength={50} className={cn("w-full h-12 px-4 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] outline-none", errors.name ? "border-[#E53935]" : "border-[#C7C7CC] focus:border-black")} />
                {errors.name && <p className="mt-1 text-[12px] text-[#E53935]">{errors.name}</p>}
              </div>
              <PhoneInput value={form.contacts.phone} onChange={(v) => updateContact("phone", v)} error={errors.phone} />
              <BottomSheetSelect label="Город *" value={form.contacts.city} options={CITIES} onSelect={(v) => updateContact("city", v)} error={errors.city} />
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
