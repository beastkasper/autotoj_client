"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlateNumber } from "@/components/plates/PlateNumber";
import {
  PLATE_CATEGORIES,
  PLATE_CITIES,
  PLATE_REGION_LABELS,
  type PlateCategory,
} from "@/lib/types/plate";
import { useCreatePlateMutation } from "@/lib/features/plates/platesApi";

interface PlateAddFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PlateAddForm({ onClose, onSuccess }: PlateAddFormProps) {
  const [createPlate, { isLoading: isSubmitting }] = useCreatePlateMutation();

  const [digits, setDigits] = useState("");
  const [letters, setLetters] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [category, setCategory] = useState<PlateCategory | "">("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCity, setContactCity] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (digits.length !== 4) newErrors.number = "Введите 4 цифры, 2 буквы и код региона";
    else if (letters.length !== 2) newErrors.number = "Введите 4 цифры, 2 буквы и код региона";
    else if (regionCode.length !== 2) newErrors.number = "Введите 4 цифры, 2 буквы и код региона";
    if (!category) newErrors.category = "Выберите категорию";
    if (!price.trim()) newErrors.price = "Укажите цену";
    if (!contactName.trim()) newErrors.contactName = "Укажите имя";
    if (!contactPhone.trim()) newErrors.contactPhone = "Укажите телефон";
    if (!contactCity) newErrors.contactCity = "Выберите город";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createPlate({
        plate_number: `${digits}${letters}${regionCode}`,
        region_code: regionCode,
        region: PLATE_REGION_LABELS[regionCode] ?? regionCode,
        category: category as PlateCategory,
        price: Number(price),
        negotiable,
        description: description.trim() || undefined,
        contact_name: contactName.trim(),
        contact_phone: `+992${contactPhone.replace(/\s/g, "")}`,
        contact_city: contactCity,
      }).unwrap();
      onSuccess();
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Не удалось опубликовать. Попробуйте позже.",
      }));
    }
  };

  const previewNumber = `${digits}${letters}${regionCode}`;
  const showPreview = digits.length === 4 && letters.length === 2 && regionCode.length === 2;

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
          Добавить гос. номер
        </h1>

        <div className="w-9" />
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 overflow-y-auto bg-[#F5F5F7]">
        <div className="max-w-[640px] mx-auto p-4 space-y-5">
          {/* ── Номер ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Номер
            </h3>

            <div>
              <FieldLabel>Гос. номер *</FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234"
                  value={digits}
                  onChange={(e) => {
                    setDigits(e.target.value.replace(/\D/g, "").slice(0, 4));
                    clearError("number");
                  }}
                  className={cn(
                    "w-[92px] h-12 px-3 bg-[#F2F2F7] rounded-xl text-[18px] font-semibold text-center tracking-[0.1em] text-[#111111] placeholder:text-[#8E8E93] placeholder:font-normal outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.number ? "border-[#E53935]" : "border-transparent focus:border-[#111111]",
                  )}
                />
                <input
                  type="text"
                  placeholder="AA"
                  value={letters}
                  onChange={(e) => {
                    setLetters(e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 2));
                    clearError("number");
                  }}
                  className={cn(
                    "w-[68px] h-12 px-3 bg-[#F2F2F7] rounded-xl text-[18px] font-semibold text-center tracking-[0.1em] text-[#111111] placeholder:text-[#8E8E93] placeholder:font-normal outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.number ? "border-[#E53935]" : "border-transparent focus:border-[#111111]",
                  )}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="01"
                  value={regionCode}
                  onChange={(e) => {
                    setRegionCode(e.target.value.replace(/\D/g, "").slice(0, 2));
                    clearError("number");
                  }}
                  className={cn(
                    "w-[60px] h-12 px-3 bg-[#F2F2F7] rounded-xl text-[18px] font-semibold text-center tracking-[0.1em] text-[#111111] placeholder:text-[#8E8E93] placeholder:font-normal outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.number ? "border-[#E53935]" : "border-transparent focus:border-[#111111]",
                  )}
                />
              </div>
              {errors.number && <FieldError>{errors.number}</FieldError>}
            </div>

            {showPreview && (
              <div className="flex justify-center pt-1">
                <PlateNumber plateNumber={previewNumber} size="sm" />
              </div>
            )}
          </section>

          {/* ── Категория ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Категория
            </h3>
            <div>
              <FieldLabel>Тип номера *</FieldLabel>
              <div className="flex gap-2">
                {PLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      clearError("category");
                    }}
                    className={cn(
                      "flex-1 h-11 rounded-xl text-[14px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                      category === cat.id
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#F2F2F7] text-[#111111] border-transparent hover:bg-[#EAEAEF]",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {errors.category && <FieldError>{errors.category}</FieldError>}
            </div>
          </section>

          {/* ── Цена ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Стоимость
            </h3>
            <div>
              <FieldLabel>Цена *</FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  placeholder="5000"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    clearError("price");
                  }}
                  className={cn(
                    "w-full h-12 px-4 pr-20 bg-[#F2F2F7] rounded-xl text-[16px] text-[#111111] placeholder:text-[#8E8E93] outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.price ? "border-[#E53935]" : "border-transparent focus:border-[#111111]",
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                  сомони
                </span>
              </div>
              {errors.price && <FieldError>{errors.price}</FieldError>}
            </div>

            <button
              type="button"
              onClick={() => setNegotiable((v) => !v)}
              className="flex items-center gap-2.5"
            >
              <span
                className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center border transition-colors",
                  negotiable ? "bg-[#111111] border-[#111111]" : "bg-white border-[#D1D1D6]",
                )}
              >
                {negotiable && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-[15px] text-[#111111] font-[family-name:var(--font-manrope)]">
                Торг уместен
              </span>
            </button>
          </section>

          {/* ── Описание ── */}
          <section className="bg-white rounded-2xl p-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Описание
            </h3>
            <textarea
              placeholder="Дополнительная информация о номере..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={contactName}
              onChange={(v) => {
                setContactName(v);
                clearError("contactName");
              }}
              error={errors.contactName}
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
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    clearError("contactPhone");
                  }}
                  className={cn(
                    "flex-1 h-12 px-4 bg-[#F2F2F7] rounded-xl text-[16px] text-[#111111] placeholder:text-[#8E8E93] outline-none transition-colors font-[family-name:var(--font-manrope)] border",
                    errors.contactPhone ? "border-[#E53935]" : "border-transparent focus:border-[#111111]",
                  )}
                />
              </div>
              {errors.contactPhone && <FieldError>{errors.contactPhone}</FieldError>}
            </div>

            {/* Город */}
            <div>
              <FieldLabel>Город *</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {PLATE_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setContactCity(city);
                      clearError("contactCity");
                    }}
                    className={cn(
                      "h-10 px-4 rounded-xl text-[14px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                      contactCity === city
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#F2F2F7] text-[#111111] border-transparent hover:bg-[#EAEAEF]",
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
              {errors.contactCity && <FieldError>{errors.contactCity}</FieldError>}
            </div>
          </section>

          {errors.submit && (
            <p className="text-[13px] text-[#E53935] text-center font-[family-name:var(--font-manrope)]">
              {errors.submit}
            </p>
          )}
        </div>
      </div>

      {/* ── Footer Button ── */}
      <div className="shrink-0 bg-white border-t border-[#E5E5EA] px-4 py-3">
        <div className="max-w-[640px] mx-auto">
          <button
            id="plate-publish-btn"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12 bg-[#E53935] text-white rounded-xl text-[15px] font-semibold font-[family-name:var(--font-manrope)] hover:bg-[#D32F2F] active:scale-[0.99] transition-all hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Публикация..." : "Опубликовать"}
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
          error ? "border-[#E53935]" : "border-transparent focus:border-[#111111]",
        )}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
