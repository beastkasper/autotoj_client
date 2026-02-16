import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SendCodeRequest {
  contact: string;
  method: "phone" | "email";
}

interface SendCodeResponse {
  success: boolean;
  message?: string;
}

interface VerifyCodeRequest {
  contact: string;
  method: "phone" | "email";
  code: string;
}

interface VerifyCodeResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  }),
  endpoints: (builder) => ({
    sendCode: builder.mutation<SendCodeResponse, SendCodeRequest>({
      // TODO: Replace with real endpoint when API is ready
      // query: (body) => ({ url: "/auth/send-code", method: "POST", body }),
      queryFn: async (args) => {
        // Mock: simulate network delay
        await new Promise((r) => setTimeout(r, 1000));
        console.log("[Mock API] sendCode:", args);
        return { data: { success: true, message: "Код отправлен" } };
      },
    }),

    verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
      // TODO: Replace with real endpoint when API is ready
      // query: (body) => ({ url: "/auth/verify-code", method: "POST", body }),
      queryFn: async (args) => {
        // Mock: simulate network delay
        await new Promise((r) => setTimeout(r, 800));
        console.log("[Mock API] verifyCode:", args);

        // Mock: accept any 4-digit code
        if (args.code.length === 4) {
          return {
            data: {
              success: true,
              token: "mock-jwt-token-" + Date.now(),
            },
          };
        }

        return {
          data: {
            success: false,
            message: "Неверный код",
          },
        };
      },
    }),
  }),
});

export const { useSendCodeMutation, useVerifyCodeMutation } = authApi;
