import { api } from "@/lib/api";
import type {
  AuthRequestBody,
  AuthRequestResponse,
  AuthVerifyBody,
  AuthVerifyResponse,
  AuthRefreshResponse,
} from "@/lib/types/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/request — Request OTP code
    sendCode: builder.mutation<AuthRequestResponse, AuthRequestBody>({
      query: (body) => ({
        url: "/auth/request",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/verify — Verify OTP code
    verifyCode: builder.mutation<AuthVerifyResponse, AuthVerifyBody>({
      query: (body) => ({
        url: "/auth/verify",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/logout — Logout
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // POST /auth/refresh — Refresh token
    refreshToken: builder.mutation<AuthRefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSendCodeMutation,
  useVerifyCodeMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
