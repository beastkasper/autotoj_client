"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/hooks";
import { useSendCodeMutation } from "@/lib/features/auth/authApi";
import { codeSent } from "@/lib/features/auth/authSlice";
import {
  loginPhoneSchema,
  loginEmailSchema,
  type LoginMethod,
} from "@/lib/validations/auth";
import { parseRawPhone } from "@/lib/utils/phone";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginTabs } from "@/components/login/login-tabs";
import { PhoneInput } from "@/components/login/phone-input";
import { EmailInput } from "@/components/login/email-input";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { TermsCheckbox } from "@/components/login/terms-checkbox";

interface FieldErrors {
  phone?: string;
  email?: string;
  agreed?: string;
}

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sendCode, { isLoading }] = useSendCodeMutation();

  const [method, setMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const valueFilled =
    method === "phone" ? phone.trim().length > 0 : email.trim().length > 0;
  const canSubmit = valueFilled && agreed && !isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return; // double-submit guard

    setErrors({});

    const schema = method === "phone" ? loginPhoneSchema : loginEmailSchema;
    const data =
      method === "phone"
        ? { phone, agreed }
        : { email, agreed };

    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Бэкенд умеет только телефон: POST /auth/request принимает поле phone
    // по маске ^\+992\d{9}$ (INTEGRATION.md §3.1). Раньше почта уходила в это
    // же поле, ловила 422, а пользователю показывалось «Ошибка сети».
    if (method === "email") {
      setErrors({ email: "Вход по почте пока не поддерживается. Войдите по номеру телефона." });
      return;
    }

    const contact = parseRawPhone(phone);
    try {
      const response = await sendCode({ phone: contact }).unwrap();
      if (response.success) {
        dispatch(codeSent({ contact, method }));
        router.push("/login/confirm");
      } else {
        setErrors({ phone: response.message || "Не удалось отправить код" });
      }
    } catch (err) {
      setErrors({ phone: getApiErrorMessage(err, "Не удалось отправить код") });
    }
  }

  function handleMethodChange(newMethod: LoginMethod) {
    setMethod(newMethod);
    setErrors({});
  }

  const buttonText = isLoading
    ? "Отправка..."
    : method === "phone"
      ? "Получить код"
      : "Отправить код";

  return (
    <form
      className="w-full max-w-[420px] bg-[var(--ios-card)] rounded-[28px] px-6 py-7"
      onSubmit={handleSubmit}
    >
      <p className="text-center text-[19px] font-bold text-[var(--ios-label)] mb-6">
        Выберите способ входа
      </p>

      <LoginTabs method={method} onMethodChange={handleMethodChange} />

      {method === "phone" ? (
        <PhoneInput
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />
      ) : (
        <EmailInput
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
      )}

      <TermsCheckbox
        checked={agreed}
        onChange={setAgreed}
        error={errors.agreed}
      />

      <Button
        type="submit"
        disabled={!canSubmit}
        className={`w-full mt-6 py-4 rounded-full text-[16px] font-semibold h-auto ${
          canSubmit
            ? "bg-[var(--ios-label)] text-white hover:bg-[#333]"
            : "bg-[var(--ios-disabled-bg)] text-[var(--ios-disabled-text)] cursor-default"
        }`}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>
    </form>
  );
}
