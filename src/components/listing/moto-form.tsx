"use client";

import type { MotoListingForm, ValidationErrors, ContactInfo, MediaData } from "@/lib/types/listing";
import {
  MOTO_BRANDS, MOTO_MODELS, MOTO_TYPES, YEARS,
  MOTO_ENGINE_TYPES, MOTO_CYLINDER_LAYOUTS, MOTO_STROKES,
  MOTO_DRIVE_TYPES, MOTO_TRANSMISSIONS, MOTO_COLORS,
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

interface MotoFormProps {
  form: MotoListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof MotoListingForm>(key: K, value: MotoListingForm[K]) => void;
}

export function MotoForm({ form, errors, onUpdate }: MotoFormProps) {
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

  return (
    <div className="pb-24">
      <Accordion
        type="multiple"
        defaultValue={["basic", "type", "year", "mileage"]}
        className="space-y-3 p-4"
      >
        {/* 1. Basic Info */}
        <AccordionItem value="basic" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Основная информация *
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="Марка *" value={form.customBrand || form.brand} options={MOTO_BRANDS} onSelect={(v) => { onUpdate("brand", v); onUpdate("customBrand", ""); onUpdate("model", ""); }} searchable searchPlaceholder="Поиск марки..." allowCustom customLabel="Добавить марку" onAddCustom={(v) => { onUpdate("customBrand", v); onUpdate("brand", ""); }} error={errors.brand} />
              <BottomSheetSelect label="Модель *" value={form.customModel || form.model} options={form.brand ? MOTO_MODELS[form.brand] || [] : []} onSelect={(v) => { onUpdate("model", v); onUpdate("customModel", ""); }} searchable allowCustom customLabel="Добавить модель" onAddCustom={(v) => { onUpdate("customModel", v); onUpdate("model", ""); }} error={errors.model} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 2. Type */}
        <AccordionItem value="type" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Тип мотоцикла *
            </AccordionTrigger>
            <AccordionContent>
              <BottomSheetSelect label="Тип *" value={form.motoType} options={MOTO_TYPES} onSelect={(v) => onUpdate("motoType", v)} error={errors.motoType} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 3. Year */}
        <AccordionItem value="year" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Год *
            </AccordionTrigger>
            <AccordionContent>
              <BottomSheetSelect label="Год выпуска *" value={form.year?.toString() || ""} options={YEARS.map(String)} onSelect={(v) => onUpdate("year", parseInt(v, 10))} error={errors.year} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 4. Mileage */}
        <AccordionItem value="mileage" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Пробег *
            </AccordionTrigger>
            <AccordionContent>
              <input type="text" inputMode="numeric" value={form.mileage} onChange={(e) => onUpdate("mileage", e.target.value.replace(/\D/g, ""))} placeholder="Пробег, км" className={cn("w-full h-12 px-4 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] outline-none", errors.mileage ? "border-[#E53935]" : "border-[#C7C7CC] focus:border-black")} />
              {errors.mileage && <p className="mt-1 text-[12px] text-[#E53935]">{errors.mileage}</p>}
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 5. Engine Volume */}
        <AccordionItem value="volume" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Объём, см³ *
            </AccordionTrigger>
            <AccordionContent>
              <input type="text" inputMode="numeric" value={form.engineVolume} onChange={(e) => onUpdate("engineVolume", e.target.value.replace(/[^\d]/g, ""))} placeholder="Объём, см³" className={cn("w-full h-12 px-4 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] outline-none", errors.engineVolume ? "border-[#E53935]" : "border-[#C7C7CC] focus:border-black")} />
              {errors.engineVolume && <p className="mt-1 text-[12px] text-[#E53935]">{errors.engineVolume}</p>}
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* 6-12: Engine, Cylinders, Power, Drive, Transmission, Strokes */}
        <AccordionItem value="engine" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Двигатель *
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="Тип двигателя *" value={form.engineType} options={MOTO_ENGINE_TYPES} onSelect={(v) => onUpdate("engineType", v)} error={errors.engineType} />
              <BottomSheetSelect label="Расположение цилиндров" value={form.cylinderLayout} options={MOTO_CYLINDER_LAYOUTS} onSelect={(v) => onUpdate("cylinderLayout", v)} />
              <input type="text" inputMode="numeric" value={form.cylinderCount} onChange={(e) => onUpdate("cylinderCount", e.target.value.replace(/\D/g, ""))} placeholder="Кол-во цилиндров" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <input type="text" inputMode="numeric" value={form.power} onChange={(e) => onUpdate("power", e.target.value.replace(/\D/g, ""))} placeholder="Мощность, л.с." className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
            </AccordionContent>
          </div>
        </AccordionItem>

        <AccordionItem value="drivetrain" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Трансмиссия *
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="Привод *" value={form.driveType} options={MOTO_DRIVE_TYPES} onSelect={(v) => onUpdate("driveType", v)} error={errors.driveType} />
              <BottomSheetSelect label="КПП *" value={form.transmission} options={MOTO_TRANSMISSIONS} onSelect={(v) => onUpdate("transmission", v)} error={errors.transmission} />
              <BottomSheetSelect label="Такты *" value={form.strokes} options={MOTO_STROKES} onSelect={(v) => onUpdate("strokes", v)} error={errors.strokes} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Цвет
            </AccordionTrigger>
            <AccordionContent>
              <BottomSheetSelect label="Цвет" value={form.color} options={MOTO_COLORS} onSelect={(v) => onUpdate("color", v)} />
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* Equipment */}
        <AccordionItem value="equip" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Оборудование
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={form.hasElectricStarter} onCheckedChange={(c) => onUpdate("hasElectricStarter", !!c)} className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                <span className="text-[15px] font-[family-name:var(--font-manrope)]">Электростартер</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={form.hasAbs} onCheckedChange={(c) => onUpdate("hasAbs", !!c)} className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                <span className="text-[15px] font-[family-name:var(--font-manrope)]">ABS</span>
              </label>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* Status */}
        <AccordionItem value="status" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Статус транспорта
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <SegmentedControl options={VEHICLE_STATUSES} value={form.status} onChange={(v) => onUpdate("status", v)} />
              <ToggleSwitch label="Не растаможен" checked={form.isNotCustomsCleared} onChange={(v) => onUpdate("isNotCustomsCleared", v)} />
              {form.status === "На заказ" && (
                <input type="text" value={form.supplyCountry} onChange={(e) => onUpdate("supplyCountry", e.target.value)} placeholder="Страна поставки" className={cn("w-full h-12 px-4 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] outline-none", errors.supplyCountry ? "border-[#E53935]" : "border-[#C7C7CC] focus:border-black")} />
              )}
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* Documents */}
        <AccordionItem value="docs" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Документы
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BottomSheetSelect label="ПТС" value={form.pts} options={PTS_OPTIONS} onSelect={(v) => onUpdate("pts", v)} error={errors.pts} />
              <BottomSheetSelect label="Владельцев" value={form.owners} options={OWNERS_OPTIONS} onSelect={(v) => onUpdate("owners", v)} error={errors.owners} />
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={form.hasAccident} onCheckedChange={(c) => onUpdate("hasAccident", !!c)} className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                <span className="text-[15px] font-[family-name:var(--font-manrope)]">Побывал в ДТП</span>
              </label>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* Media */}
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

        {/* Description */}
        <AccordionItem value="desc" className="border-none">
          <div className="bg-[#F7F7F7] rounded-2xl px-4 overflow-hidden">
            <AccordionTrigger className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] hover:no-underline">
              Описание
            </AccordionTrigger>
            <AccordionContent>
              <div className="relative">
                <textarea value={form.description} onChange={(e) => { if (e.target.value.length <= 3000) onUpdate("description", e.target.value); }} placeholder="Расскажите о мотоцикле..." rows={4} className="w-full min-h-[120px] p-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none resize-none focus:border-black" />
                <span className="absolute bottom-3 right-4 text-[12px] text-[#8E8E93]">{form.description.length} / 3000</span>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>

        {/* Price */}
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

        {/* Contacts */}
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
              {form.status !== "На заказ" && (
                <BottomSheetSelect label={form.status === "В наличии" ? "Город *" : "Город"} value={form.contacts.city} options={CITIES} onSelect={(v) => updateContact("city", v)} error={errors.city} />
              )}
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
