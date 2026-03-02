// Валидация полей формы "Добавить объявление"

import type {
  CarListingForm,
  MotoListingForm,
  CommercialListingForm,
  ValidationErrors,
} from "@/lib/types/listing";

// ── Общие валидаторы ──

export function validateVin(vin: string): string | null {
  if (!vin) return null; // необязательное
  if (vin.length !== 17) return "VIN должен содержать 17 символов";
  if (!/^[A-Z0-9]+$/.test(vin)) return "Только латинские буквы и цифры";
  return null;
}

export function validatePrice(price: string): string | null {
  if (!price) return "Укажите цену";
  const num = Number(price.replace(/\s/g, ""));
  if (isNaN(num) || num < 1) return "Минимальная цена — 1";
  if (num > 999999999) return "Максимальная цена — 999 999 999";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Укажите телефон";
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 9) return "Введите 9 цифр номера";
  return null;
}

export function validateMileage(mileage: string): string | null {
  if (!mileage) return "Укажите пробег";
  const num = Number(mileage);
  if (isNaN(num) || num < 0) return "Пробег не может быть отрицательным";
  if (num > 999999) return "Максимум 999 999 км";
  return null;
}

export function validateDescription(desc: string): string | null {
  if (!desc) return null; // необязательное
  if (desc.length > 3000) return "Максимум 3000 символов";
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `Укажите ${fieldName}`;
  return null;
}

export function validateNumberRange(
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (!value) return `Укажите ${fieldName}`;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} должен быть числом`;
  if (num < min || num > max) return `${fieldName}: от ${min} до ${max}`;
  return null;
}

// ── Валидация по шагам (Легковые) ──

export function validateCarStep(step: number, form: CarListingForm): ValidationErrors {
  const errors: ValidationErrors = {};

  switch (step) {
    case 1:
      if (!form.status) errors.status = "Выберите статус";
      if (form.status === "На заказ" && !form.supplyCountry.trim()) {
        errors.supplyCountry = "Укажите страну поставки";
      }
      break;
    case 2: {
      const vinErr = validateVin(form.vin);
      if (vinErr) errors.vin = vinErr;
      break;
    }
    case 3:
      if (!form.brand && !form.customBrand) errors.brand = "Выберите марку";
      break;
    case 4:
      if (!form.model && !form.customModel) errors.model = "Выберите модель";
      break;
    case 5:
      if (!form.year) errors.year = "Выберите год";
      break;
    case 6:
      break; // необязательное
    case 7:
      if (!form.bodyType) errors.bodyType = "Выберите тип кузова";
      break;
    case 8:
      if (!form.engineType) errors.engineType = "Выберите тип двигателя";
      break;
    case 9:
      if (!form.driveType) errors.driveType = "Выберите тип привода";
      break;
    case 10:
      break; // необязательное
    case 11:
      if (!form.color) errors.color = "Выберите цвет";
      break;
    case 12:
      break; // рекомендуется, не обязательно
    case 13:
      break; // необязательное
    case 14: {
      const mileErr = validateMileage(form.mileage);
      if (mileErr) errors.mileage = mileErr;
      if (!form.pts) errors.pts = "Выберите ПТС";
      if (!form.owners) errors.owners = "Укажите кол-во владельцев";
      break;
    }
    case 15: {
      const descErr = validateDescription(form.description);
      if (descErr) errors.description = descErr;
      break;
    }
    case 16: {
      const priceErr = validatePrice(form.price);
      if (priceErr) errors.price = priceErr;
      break;
    }
    case 17: {
      if (!form.contacts.name.trim()) errors.name = "Укажите имя";
      const phoneErr = validatePhone(form.contacts.phone);
      if (phoneErr) errors.phone = phoneErr;
      if (!form.contacts.city) errors.city = "Выберите город";
      break;
    }
  }

  return errors;
}

// ── Необязательные шаги (можно пропустить) ──
export const CAR_OPTIONAL_STEPS = [2, 6, 10, 12, 13, 15];

export function isCarStepOptional(step: number): boolean {
  return CAR_OPTIONAL_STEPS.includes(step);
}

// ── Валидация мото ──
export function validateMotoForm(form: MotoListingForm): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.brand && !form.customBrand) errors.brand = "Выберите марку";
  if (!form.model && !form.customModel) errors.model = "Выберите модель";
  if (!form.motoType) errors.motoType = "Выберите тип";
  if (!form.year) errors.year = "Выберите год";

  const mileErr = validateMileage(form.mileage);
  if (mileErr) errors.mileage = mileErr;

  const volErr = validateNumberRange(form.engineVolume, 50, 2500, "Объём");
  if (volErr) errors.engineVolume = volErr;

  if (!form.engineType) errors.engineType = "Выберите тип двигателя";
  if (!form.driveType) errors.driveType = "Выберите привод";
  if (!form.transmission) errors.transmission = "Выберите КПП";
  if (!form.strokes) errors.strokes = "Выберите такты";

  const priceErr = validatePrice(form.price);
  if (priceErr) errors.price = priceErr;

  if (!form.contacts.name.trim()) errors.name = "Укажите имя";
  const phoneErr = validatePhone(form.contacts.phone);
  if (phoneErr) errors.phone = phoneErr;

  // Условная валидация
  if (form.status === "В наличии") {
    if (!form.pts) errors.pts = "Выберите ПТС";
    if (!form.owners) errors.owners = "Укажите владельцев";
    if (!form.contacts.city) errors.city = "Выберите город";
  }
  if (form.status === "На заказ") {
    if (!form.supplyCountry.trim()) errors.supplyCountry = "Укажите страну";
  }

  return errors;
}

// ── Валидация комтранс ──
export function validateCommercialForm(form: CommercialListingForm): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.brand && !form.customBrand) errors.brand = "Выберите марку";
  if (!form.model && !form.customModel) errors.model = "Выберите модель";
  if (!form.year) errors.year = "Выберите год";

  const mileErr = validateMileage(form.mileage);
  if (mileErr) errors.mileage = mileErr;

  const priceErr = validatePrice(form.price);
  if (priceErr) errors.price = priceErr;

  if (!form.contacts.name.trim()) errors.name = "Укажите имя";
  const phoneErr = validatePhone(form.contacts.phone);
  if (phoneErr) errors.phone = phoneErr;
  if (!form.contacts.city) errors.city = "Выберите город";

  return errors;
}
