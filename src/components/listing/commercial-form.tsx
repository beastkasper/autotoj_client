"use client";

import type { CommercialListingForm, ValidationErrors, ContactInfo, MediaData } from "@/lib/types/listing";
import { YEARS, OWNERS_OPTIONS } from "@/lib/data/listing-constants";
import {
  useGetBrandsQuery,
  useGetDictsQuery,
  useGetModelsQuery,
} from "@/lib/features/dicts/dictsApi";
import { useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface CommercialFormProps {
  form: CommercialListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CommercialListingForm>(key: K, value: CommercialListingForm[K]) => void;
}

const COMMERCIAL_CUSTOM_CITY_ID = "__custom__";

const VEHICLE_STATUS_OPTIONS = [
  { id: "available", label: "В наличии" },
  { id: "in_transit", label: "В пути" },
  { id: "on_order", label: "На заказ" },
];

export function CommercialForm({ form, errors, onUpdate }: CommercialFormProps) {
  const { data: dicts } = useGetDictsQuery();
  const { data: brands } = useGetBrandsQuery({ type: "commercial" });
  const { data: brandModels } = useGetModelsQuery(
    { brand_id: form.brand },
    { skip: !form.brand }
  );

  const brandOptions = useMemo(
    () => (brands ?? []).map((b) => ({ id: b.id, label: b.name })),
    [brands]
  );
  const modelOptions = useMemo(
    () => (brandModels ?? []).map((m) => ({ id: m.id, label: m.name })),
    [brandModels]
  );
  const bodyOptions = useMemo(
    () => (dicts?.commercial_body_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const driveOptions = useMemo(
    () => (dicts?.commercial_drive_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const engineOptions = useMemo(
    () => (dicts?.commercial_engine_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const transmissionOptions = useMemo(
    () => (dicts?.commercial_transmission_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const equipmentItems = dicts?.commercial_equipment ?? [];
  const airbagOptions = useMemo(
    () => (dicts?.commercial_airbags ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const windowsOptions = useMemo(
    () => (dicts?.commercial_windows ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const radioOptions = useMemo(
    () => (dicts?.commercial_radio ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const steeringOptions = useMemo(
    () => (dicts?.steering_positions ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const ptsOptions = useMemo(
    () => (dicts?.pts_options ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const colors = dicts?.colors ?? [];
  const cityOptions = useMemo(
    () => [
      ...(dicts?.cities ?? []).map((c) => ({ id: c.id, label: c.name })),
      { id: COMMERCIAL_CUSTOM_CITY_ID, label: "Другой" },
    ],
    [dicts]
  );

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
              <BottomSheetSelect label="Марка *" value={form.brand} options={brandOptions} onSelect={(v) => { onUpdate("brand", v); onUpdate("customBrand", ""); onUpdate("model", ""); onUpdate("customModel", ""); }} searchable allowCustom customLabel="Добавить марку" onAddCustom={(v) => { onUpdate("customBrand", v); onUpdate("brand", ""); onUpdate("model", ""); onUpdate("customModel", ""); }} error={errors.brand} />
              <BottomSheetSelect label="Модель *" value={form.model} options={modelOptions} onSelect={(v) => { onUpdate("model", v); onUpdate("customModel", ""); }} searchable allowCustom customLabel="Добавить модель" onAddCustom={(v) => { onUpdate("customModel", v); onUpdate("model", ""); }} error={errors.model} />
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
              <BottomSheetSelect label="Тип кузова" value={form.bodyType} options={bodyOptions} onSelect={(v) => onUpdate("bodyType", v)} />
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
              <BottomSheetSelect label="Привод" value={form.driveType} options={driveOptions} onSelect={(v) => onUpdate("driveType", v)} />
              <BottomSheetSelect label="Двигатель" value={form.engineType} options={engineOptions} onSelect={(v) => onUpdate("engineType", v)} />
              <BottomSheetSelect label="КПП" value={form.transmission} options={transmissionOptions} onSelect={(v) => onUpdate("transmission", v)} />
              <input type="text" inputMode="numeric" value={form.seats} onChange={(e) => onUpdate("seats", e.target.value.replace(/\D/g, ""))} placeholder="Количество мест" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <input type="number" step="0.1" min="0.8" max="10" value={form.engineVolume} onChange={(e) => onUpdate("engineVolume", e.target.value)} placeholder="Объём, л" className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <input type="text" inputMode="numeric" value={form.power} onChange={(e) => onUpdate("power", e.target.value.replace(/\D/g, ""))} placeholder="Мощность, л.с." className="w-full h-12 px-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none focus:border-black" />
              <BottomSheetSelect label="Руль" value={form.steering} options={steeringOptions} onSelect={(v) => onUpdate("steering", v)} />
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
                {colors.map((c) => (
                  <button key={c.id} type="button" onClick={() => toggleColor(c.id)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] font-[family-name:var(--font-manrope)] border transition-all", form.colors.includes(c.id) ? "bg-black text-white border-black" : "bg-white text-black border-[#D1D1D6]")}>
                    {c.hex && <span className="w-4 h-4 rounded-full border border-[#E5E5EA] shrink-0" style={{ backgroundColor: c.hex }} />}
                    <span>{c.name}</span>
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
              <BottomSheetSelect label="ПТС" value={form.pts} options={ptsOptions} onSelect={(v) => onUpdate("pts", v)} />
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
                {equipmentItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={form.equipment.includes(item.id)} onCheckedChange={() => toggleEquipment(item.id)} className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                    <span className="text-[15px] font-[family-name:var(--font-manrope)]">{item.name}</span>
                  </label>
                ))}
              </div>
              <BottomSheetSelect label="Подушки безопасности" value={form.airbags} options={airbagOptions} onSelect={(v) => onUpdate("airbags", v)} />
              <BottomSheetSelect label="Стеклоподъёмники" value={form.windows} options={windowsOptions} onSelect={(v) => onUpdate("windows", v)} />
              <BottomSheetSelect label="Магнитола" value={form.radio} options={radioOptions} onSelect={(v) => onUpdate("radio", v)} />
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
              <SegmentedControl options={VEHICLE_STATUS_OPTIONS} value={form.status} onChange={(v) => onUpdate("status", v)} />
              {form.status === "on_order" && (
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
                <Textarea value={form.description} onChange={(e) => { if (e.target.value.length <= 3000) onUpdate("description", e.target.value); }} placeholder="Расскажите о транспорте..." rows={4} className="w-full min-h-[120px] p-4 rounded-xl border border-[#C7C7CC] text-[15px] font-[family-name:var(--font-manrope)] outline-none resize-none focus:border-black" />
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
              <BottomSheetSelect label="Город *" value={form.contacts.city} options={cityOptions} onSelect={(v) => updateContact("city", v)} error={errors.city} />
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
