"use client";

import { useState } from "react";
import { ArrowLeft, Upload, X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RentalCar } from "@/lib/data/mockRentals";
import { RENTAL_CITIES, type RentalCity } from "@/lib/data/mockRentals";

interface RentalAddFormProps {
  onClose: () => void;
  onSuccess: (car: Omit<RentalCar, "id">) => void;
}

const TRANSMISSIONS = ["Автомат", "Механика"] as const;
const FUEL_TYPES = ["Бензин", "Дизель", "Гибрид", "Электро"] as const;
const CAR_CLASSES_OPTIONS = ["Эконом", "Комфорт"] as const;

export function RentalAddForm({ onClose, onSuccess }: RentalAddFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    carClass: "" as string,
    year: "",
    transmission: "Автомат",
    fuelType: "Бензин",
    pricePerDay: "",
    description: "",
    city: "" as string,
    sellerName: "",
    sellerPhone: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error on field change
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(
        (file) => URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Укажите название";
    if (!formData.pricePerDay.trim()) newErrors.pricePerDay = "Укажите цену";
    if (!formData.carClass) newErrors.carClass = "Выберите класс";
    if (!formData.city) newErrors.city = "Выберите город";
    if (!formData.sellerName.trim()) newErrors.sellerName = "Укажите имя";
    if (!formData.sellerPhone.trim()) newErrors.sellerPhone = "Укажите телефон";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newCar: Omit<RentalCar, "id"> = {
      title: formData.title,
      carClass: formData.carClass as "Эконом" | "Комфорт",
      year: formData.year ? parseInt(formData.year, 10) : undefined,
      transmission: formData.transmission,
      fuel: formData.fuelType,
      pricePerDay: formData.pricePerDay,
      city: formData.city,
      description: formData.description || undefined,
      sellerName: formData.sellerName,
      sellerPhone: `+992 ${formData.sellerPhone}`,
      image: images[0] || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600",
      images: images.length > 0 ? images : undefined,
      publishedDate: new Date().toISOString().split("T")[0],
    };

    onSuccess(newCar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* ── Header ── */}
      <div
        className="h-14 flex items-center justify-between px-4 bg-white/95 backdrop-blur-md shrink-0"
        style={{ borderBottom: "1px solid #E5E5EA" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F2F2F7] active:bg-[#E5E5EA] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>

        <h1 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
          Добавить авто в прокат
        </h1>

        <div className="w-9" />
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-y-auto bg-[#F5F5F7]">
        <div className="max-w-[640px] mx-auto p-4 space-y-5">
          {/* ── Фотографии ── */}
          <section className="bg-white rounded-2xl p-4">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
              Фотографии
              <span className="text-[13px] font-normal text-[#8E8E93] ml-1.5">
                до 10
              </span>
            </h3>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden bg-[#F2F2F7] group"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square rounded-xl bg-[#F2F2F7] border-2 border-dashed border-[#D1D1D6] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EAEAEF] active:opacity-70 transition-all gap-1">
                  <ImagePlus className="w-6 h-6 text-[#8E8E93]" />
                  <span className="text-[11px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                    Загрузить
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </section>

          {/* ── Основная информация ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Основная информация
            </h3>

            {/* Название */}
            <FieldInput
              label="Название *"
              placeholder="Toyota Camry 2023"
              value={formData.title}
              onChange={(v) => updateField("title", v)}
              error={errors.title}
            />

            {/* Класс */}
            <div>
              <FieldLabel>Класс *</FieldLabel>
              <div className="flex gap-2">
                {CAR_CLASSES_OPTIONS.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => updateField("carClass", cls)}
                    className={cn(
                      "flex-1 h-11 rounded-xl text-[15px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                      formData.carClass === cls
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#F2F2F7] text-[#111111] border-transparent hover:bg-[#EAEAEF]"
                    )}
                  >
                    {cls}
                  </button>
                ))}
              </div>
              {errors.carClass && <FieldError>{errors.carClass}</FieldError>}
            </div>

            {/* Год */}
            <FieldInput
              label="Год выпуска"
              placeholder="2023"
              type="number"
              value={formData.year}
              onChange={(v) => updateField("year", v)}
            />

            {/* Трансмиссия */}
            <div>
              <FieldLabel>Трансмиссия</FieldLabel>
              <div className="flex gap-2">
                {TRANSMISSIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("transmission", type)}
                    className={cn(
                      "flex-1 h-11 rounded-xl text-[15px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                      formData.transmission === type
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#F2F2F7] text-[#111111] border-transparent hover:bg-[#EAEAEF]"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Топливо */}
            <div>
              <FieldLabel>Топливо</FieldLabel>
              <div className="flex gap-2">
                {FUEL_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("fuelType", type)}
                    className={cn(
                      "flex-1 h-11 rounded-xl text-[14px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                      formData.fuelType === type
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#F2F2F7] text-[#111111] border-transparent hover:bg-[#EAEAEF]"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Цена ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Стоимость
            </h3>
            <div>
              <FieldLabel>Цена за день *</FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  placeholder="1500"
                  value={formData.pricePerDay}
                  onChange={(e) => updateField("pricePerDay", e.target.value)}
                  className={cn(
                    "w-full h-12 px-4 pr-24 bg-[#F2F2F7] rounded-xl text-[16px] text-[#111111] placeholder:text-[#8E8E93] outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.pricePerDay
                      ? "border-[#E53935]"
                      : "border-transparent focus:border-[#111111]"
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                  сомони/день
                </span>
              </div>
              {errors.pricePerDay && (
                <FieldError>{errors.pricePerDay}</FieldError>
              )}
            </div>
          </section>

          {/* ── Описание ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Описание
            </h3>
            <textarea
              placeholder="Дополнительная информация об автомобиле..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[#F2F2F7] rounded-xl text-[15px] text-[#111111] placeholder:text-[#8E8E93] outline-none border border-transparent focus:border-[#111111] resize-none transition-colors font-[family-name:var(--font-manrope)]"
            />
          </section>

          {/* ── Контактные данные ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Контактные данные
            </h3>

            <FieldInput
              label="Имя *"
              placeholder="Ваше имя"
              value={formData.sellerName}
              onChange={(v) => updateField("sellerName", v)}
              error={errors.sellerName}
            />

            <div>
              <FieldLabel>Телефон *</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="shrink-0 h-12 px-3 bg-[#F2F2F7] rounded-xl flex items-center text-[15px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                  +992
                </span>
                <input
                  type="tel"
                  placeholder="90 123 45 67"
                  value={formData.sellerPhone}
                  onChange={(e) => updateField("sellerPhone", e.target.value)}
                  className={cn(
                    "flex-1 h-12 px-4 bg-[#F2F2F7] rounded-xl text-[16px] text-[#111111] placeholder:text-[#8E8E93] outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.sellerPhone
                      ? "border-[#E53935]"
                      : "border-transparent focus:border-[#111111]"
                  )}
                />
              </div>
              {errors.sellerPhone && (
                <FieldError>{errors.sellerPhone}</FieldError>
              )}
            </div>

            {/* Город */}
            <div>
              <FieldLabel>Город *</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {RENTAL_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => updateField("city", city)}
                    className={cn(
                      "h-10 px-4 rounded-xl text-[14px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                      formData.city === city
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#F2F2F7] text-[#111111] border-transparent hover:bg-[#EAEAEF]"
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
              {errors.city && <FieldError>{errors.city}</FieldError>}
            </div>
          </section>
        </div>
      </div>

      {/* ── Footer Button ── */}
      <div className="shrink-0 bg-white border-t border-[#E5E5EA] px-4 py-3">
        <div className="max-w-[640px] mx-auto">
          <button
            id="rental-publish-btn"
            type="button"
            onClick={handleSubmit}
            className="w-full h-12 bg-[#E53935] text-white rounded-xl text-[15px] font-semibold font-[family-name:var(--font-manrope)] hover:bg-[#D32F2F] active:scale-[0.99] transition-all hover:shadow-md cursor-pointer"
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
      {children}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
      {children}
    </p>
  );
}

function FieldInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-12 px-4 bg-[#F2F2F7] rounded-xl text-[16px] text-[#111111] placeholder:text-[#8E8E93] outline-none transition-colors font-[family-name:var(--font-manrope)] border",
          error
            ? "border-[#E53935]"
            : "border-transparent focus:border-[#111111]"
        )}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
