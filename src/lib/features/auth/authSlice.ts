import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthMethod = "phone" | "email";
export type AuthStep = "form" | "code";

interface AuthState {
  method: AuthMethod;
  contact: string;
  step: AuthStep;
  isLoading: boolean;
  error: string | null;
  resendCountdown: number;
}

const initialState: AuthState = {
  method: "phone",
  contact: "",
  step: "form",
  isLoading: false,
  error: null,
  resendCountdown: 0,
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
    resetAuth() {
      return initialState;
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
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
