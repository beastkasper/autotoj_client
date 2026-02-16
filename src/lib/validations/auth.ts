import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(1, "Введите номер телефона")
  .regex(
    /^\(\d{2}\)\s\d{3}\s\d{2}\s\d{2}$/,
    "Формат: (XX) XXX XX XX"
  );

export const emailSchema = z
  .string()
  .min(1, "Введите email")
  .email("Некорректный email");

export const loginPhoneSchema = z.object({
  phone: phoneSchema,
  agreed: z.literal(true, {
    message: "Необходимо принять правила",
  }),
});

export const loginEmailSchema = z.object({
  email: emailSchema,
  agreed: z.literal(true, {
    message: "Необходимо принять правила",
  }),
});

export type LoginPhoneData = z.infer<typeof loginPhoneSchema>;
export type LoginEmailData = z.infer<typeof loginEmailSchema>;
export type LoginMethod = "phone" | "email";
