import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthMethod = "phone" | "email";
export type AuthStep = "form" | "code";

const TOKEN_KEY = "autotoj_token";
const USER_ID_KEY = "autotoj_user_id";

function getStoredValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // localStorage may be unavailable
  }
}

interface AuthState {
  method: AuthMethod;
  contact: string;
  step: AuthStep;
  isLoading: boolean;
  error: string | null;
  resendCountdown: number;
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  method: "phone",
  contact: "",
  step: "form",
  isLoading: false,
  error: null,
  resendCountdown: 0,
  token: getStoredValue(TOKEN_KEY),
  userId: getStoredValue(USER_ID_KEY),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMethod(state, action: PayloadAction<AuthMethod>) {
      state.method = action.payload;
      state.error = null;
    },
    setContact(state, action: PayloadAction<string>) {
      state.contact = action.payload;
    },
    setStep(state, action: PayloadAction<AuthStep>) {
      state.step = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setResendCountdown(state, action: PayloadAction<number>) {
      state.resendCountdown = action.payload;
    },
    codeSent(state, action: PayloadAction<{ contact: string; method: AuthMethod }>) {
      state.contact = action.payload.contact;
      state.method = action.payload.method;
      state.step = "code";
      state.isLoading = false;
      state.error = null;
      state.resendCountdown = 45;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      setStoredValue(TOKEN_KEY, action.payload);
    },
    setUserId(state, action: PayloadAction<string | null>) {
      state.userId = action.payload;
      setStoredValue(USER_ID_KEY, action.payload);
    },
    loginSuccess(state, action: PayloadAction<{ token: string; userId: string }>) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.step = "form";
      state.isLoading = false;
      state.error = null;
      setStoredValue(TOKEN_KEY, action.payload.token);
      setStoredValue(USER_ID_KEY, action.payload.userId);
    },
    resetAuth() {
      setStoredValue(TOKEN_KEY, null);
      setStoredValue(USER_ID_KEY, null);
      return {
        method: "phone" as AuthMethod,
        contact: "",
        step: "form" as AuthStep,
        isLoading: false,
        error: null,
        resendCountdown: 0,
        token: null,
        userId: null,
      };
    },
  },
});

export const {
  setMethod,
  setContact,
  setStep,
  setLoading,
  setError,
  setResendCountdown,
  codeSent,
  setToken,
  setUserId,
  loginSuccess,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
