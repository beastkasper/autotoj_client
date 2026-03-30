import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer from "./features/auth/authSlice";

// Import all API modules to register their endpoints via injectEndpoints
import "./features/auth/authApi";
import "./features/ads/adsApi";
import "./features/parts/partsApi";
import "./features/rental/rentalApi";
import "./features/dicts/dictsApi";
import "./features/favorites/favoritesApi";
import "./features/profile/profileApi";
import "./features/services/servicesApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
