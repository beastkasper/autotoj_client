import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { setToken, resetAuth } from "./features/auth/authSlice";
import type { AuthRefreshResponse } from "./types/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://api.autotoj.tj/v1/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    headers.set("Accept-Language", "ru");
    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { token } = refreshResult.data as AuthRefreshResponse;
      api.dispatch(setToken(token));
      // Retry the original request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — log out
      api.dispatch(resetAuth());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Ads",
    "AdDetail",
    "Parts",
    "PartDetail",
    "Rental",
    "RentalDetail",
    "Dicts",
    "Favorites",
    "MyAds",
    "MyParts",
    "MyRental",
    "Profile",
    "Chats",
    "Notifications",
    "Reviews",
    "Services",
    "Logbook",
    "LogbookDetail",
  ],
  endpoints: () => ({}),
});
