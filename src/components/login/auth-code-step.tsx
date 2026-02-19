"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useVerifyCodeMutation, useSendCodeMutation } from "@/lib/features/auth/authApi";
import { resetAuth, setResendCountdown } from "@/lib/features/auth/authSlice";

const RESEND_SECONDS = 45;
const CODE_LENGTH = 4;

function maskContact(value: string, type: "phone" | "email"): string {
  if (type === "phone") {
    // value is raw: "992XXXXXXXXX"
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7) return value;
    // Show: +992 XX ••• •• XX (first 2 local digits + last 2)
    const local = digits.slice(3); // remove 992
    const first2 = local.slice(0, 2);
    const last2 = local.slice(-2);
    return `+992 ${first2} ••• •• ${last2}`;
  }
  // email: show first 2 chars and domain
  const atIndex = value.indexOf("@");
  if (atIndex <= 2) return value;
  return value.slice(0, 2) + "•••" + value.slice(atIndex);
}

interface AuthCodeStepProps {
  contactValue: string;
  contactType: "phone" | "email";
  onBack: () => void;
}

export function AuthCodeStep({
  contactValue,
  contactType,
  onBack,
}: AuthCodeStepProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resendCountdown = useAppSelector((s) => s.auth.resendCountdown);

  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [sendCode, { isLoading: isResending }] = useSendCodeMutation();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const id = setInterval(
      () => dispatch(setResendCountdown(resendCountdown - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [resendCountdown, dispatch]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const clearAndFocus = useCallback(() => {
    setDigits(Array(CODE_LENGTH).fill(""));
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, []);

  function handleChange(index: number, value: string) {
    if (isVerifying) return;
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] || "";
    }
    setDigits(next);
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }

  async function handleSubmit() {
    const code = digits.join("");
    if (code.length < CODE_LENGTH || isVerifying) return;

    try {
      const response = await verifyCode({
        contact: contactValue,
        method: contactType,
        code,
      }).unwrap();

      if (response.success) {
        // TODO: Save token to cookies/localStorage
        router.push("/");
      } else {
        setError(response.message || "Неверный код");
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          clearAndFocus();
        }, 300);
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз");
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        clearAndFocus();
      }, 300);
    }
  }

  async function handleResend() {
    if (resendCountdown > 0 || isResending) return;

    try {
      await sendCode({ contact: contactValue, method: contactType }).unwrap();
      dispatch(setResendCountdown(RESEND_SECONDS));
      setError(null);
      clearAndFocus();
    } catch {
      setError("Не удалось отправить код повторно");
    }
  }

  function handleBack() {
    dispatch(resetAuth());
    onBack();
  }

  const allFilled = digits.every((d) => d !== "");
  const maskedContact = maskContact(contactValue, contactType);

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div
      className="w-full max-w-[420px] rounded-[24px] px-6 py-7"
      style={{ backgroundColor: "var(--ios-card)", fontFamily: "var(--font-manrope), sans-serif" }}
    >
      {/* Title */}
      <h2
        className="text-center mb-1"
        style={{ fontSize: 18, fontWeight: 600, color: "var(--ios-label)" }}
      >
        Введите код
      </h2>

      {/* Subtitle */}
      <div className="text-center mb-6">
        <p style={{ fontSize: 16, fontWeight: 400, color: "var(--ios-label)", lineHeight: "22px" }}>
          Мы отправили код на
        </p>
        <p style={{ fontSize: 17, fontWeight: 500, color: "var(--ios-label)", lineHeight: "24px" }}>
          {maskedContact}
        </p>
      </div>

      {/* Code inputs */}
      <div
        className="flex justify-center mb-4"
        style={{
          gap: 12,
          animation: shaking ? "shake 0.3s" : "none",
        }}
        onPaste={handlePaste}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isVerifying}
            className="outline-none text-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              border: `2px solid ${error ? "var(--ios-destructive)" : digit ? "var(--ios-label)" : "var(--ios-separator)"}`,
              background: "transparent",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--ios-label)",
              fontFamily: "var(--font-manrope), sans-serif",
              caretColor: "var(--ios-label)",
              opacity: isVerifying ? 0.5 : 1,
            }}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Error text */}
      {error && (
        <p
          className="text-center mb-3"
          style={{ fontSize: 13, fontWeight: 400, color: "var(--ios-destructive)" }}
        >
          {error}
        </p>
      )}

      {/* Submit button */}
      <Button
        type="button"
        disabled={!allFilled || isVerifying}
        onClick={handleSubmit}
        className="w-full h-[52px] rounded-[20px] text-[15px] font-medium"
        style={{
          backgroundColor: allFilled ? "var(--ios-label)" : "var(--ios-disabled-separator)",
          color: allFilled ? "#FFFFFF" : "var(--ios-secondary-label)",
          fontFamily: "var(--font-manrope), sans-serif",
        }}
      >
        {isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
        {isVerifying ? "Проверка..." : "Подтвердить"}
      </Button>

      {/* Resend & change links */}
      <div className="flex flex-col items-center mt-5" style={{ gap: 12 }}>
        {resendCountdown > 0 ? (
          <p style={{ fontSize: 14, fontWeight: 400, color: "var(--ios-secondary-label)" }}>
            Отправить снова через{" "}
            <span style={{ fontWeight: 600, color: "var(--ios-label)" }}>
              {formatTimer(resendCountdown)}
            </span>
          </p>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="text-[15px] font-medium h-auto p-0"
            style={{
              color: "var(--ios-label)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            {isResending ? "Отправка..." : "Отправить код повторно"}
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          className="text-[15px] font-medium h-auto p-0"
          style={{
            color: "var(--ios-label)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          {contactType === "phone" ? "Изменить номер" : "Изменить email"}
        </Button>
      </div>
    </div>
  );
}
