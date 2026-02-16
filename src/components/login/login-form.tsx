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
import { LoginTabs } from "@/components/login/login-tabs";
import { PhoneInput } from "@/components/login/phone-input";
import { EmailInput } from "@/components/login/email-input";
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

    // Send code via API
    const contact = method === "phone" ? parseRawPhone(phone) : email;
    try {
      const response = await sendCode({ contact, method }).unwrap();
      if (response.success) {
        dispatch(codeSent({ contact, method }));
        router.push("/login/confirm");
      } else {
        setErrors({ [method]: response.message || "Ошибка отправки" });
      }
    } catch {
      setErrors({ [method]: "Ошибка сети. Попробуйте еще раз." });
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
      className="w-full max-w-[420px] bg-[var(--ios-card)] rounded-2xl px-6 py-7"
      onSubmit={handleSubmit}
    >
      <p className="text-center text-[15px] font-medium text-[var(--ios-label)] mb-4">
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

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full mt-6 py-3.5 rounded-full text-[15px] font-medium transition-all duration-200 ${
          canSubmit
            ? "bg-[var(--ios-label)] text-white hover:bg-[#333]"
            : "bg-[var(--ios-disabled-bg)] text-[var(--ios-disabled-text)] cursor-default"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {buttonText}
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}
