import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { AdsSearchParams } from "@/lib/types/api";
import type { FilterState } from "@/components/filters/FilterSheet";

/** Map the detailed filter-panel state into backend query params. */
export function filterStateToParams(filters: FilterState): AdsSearchParams {
  const params: AdsSearchParams = {};
  if (filters.brand) params.brand_id = filters.brand;
  if (filters.model) params.model_id = filters.model;
  if (filters.yearFrom) params.year_from = Number(filters.yearFrom);
  if (filters.yearTo) params.year_to = Number(filters.yearTo);
  if (filters.priceFrom) params.price_from = Number(filters.priceFrom);
  if (filters.priceTo) params.price_to = Number(filters.priceTo);
  if (filters.priceUnder100k && params.price_to === undefined) params.price_to = 100000;
  if (filters.mileageFrom) params.mileage_from = Number(filters.mileageFrom);
  if (filters.mileageTo) params.mileage_to = Number(filters.mileageTo);
  if (filters.fuel) params.fuel = filters.fuel;
  if (filters.transmission) params.transmission = filters.transmission;
  if (filters.drive) params.drive = filters.drive;
  if (filters.bodyType) params.body = filters.bodyType;
  if (filters.color) params.color = filters.color;
  if (filters.withPhoto) params.with_photos = true;
  if (filters.withVideo) params.with_video = true;
  if (filters.automatic) params.transmission = "automatic";
  return params;
}

/** Category quick-tabs shown in the desktop listings bar. */
export type AdsCategory = "all" | "new" | "used";

/** Page size for the ads listing. */
export const ADS_PAGE_SIZE = 20;

interface AdsFiltersState {
  searchQuery: string;
  category: AdsCategory;
  /** Raw selections from the filter panel — source of truth, fed back as `activeFilters`. */
  filterState: FilterState;
  /** Backend query params derived from `filterState` (excludes `q` and the category condition). */
  filterParams: AdsSearchParams;
  /** Current page (1-based). Any change to search/category/filters resets it to 1. */
  page: number;
}

const initialState: AdsFiltersState = {
  searchQuery: "",
  category: "all",
  filterState: {},
  filterParams: {},
  page: 1,
};

const adsFiltersSlice = createSlice({
  name: "adsFilters",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<AdsCategory>) {
      state.category = action.payload;
      state.page = 1;
    },
    setFilterParams(state, action: PayloadAction<AdsSearchParams>) {
      state.filterParams = action.payload;
      state.page = 1;
    },
    /** Apply the filter panel's selections: store the raw state and derive query params. */
    setFilters(state, action: PayloadAction<FilterState>) {
      state.filterState = action.payload;
      state.filterParams = filterStateToParams(action.payload);
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetAdsFilters() {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  setFilterParams,
  setFilters,
  setPage,
  resetAdsFilters,
} = adsFiltersSlice.actions;

export default adsFiltersSlice.reducer;

// ── Selectors ──
export const selectAdsSearchQuery = (s: RootState) => s.adsFilters.searchQuery;
export const selectAdsCategory = (s: RootState) => s.adsFilters.category;
export const selectAdsFilterParams = (s: RootState) => s.adsFilters.filterParams;
export const selectAdsFilterState = (s: RootState) => s.adsFilters.filterState;
export const selectAdsPage = (s: RootState) => s.adsFilters.page;

/** Whether any filter (panel selection or non-default category) is active. */
export const selectHasActiveFilters = createSelector(
  [selectAdsCategory, selectAdsFilterState],
  (category, filterState) =>
    category !== "all" ||
    Object.values(filterState).some((v) => v !== undefined && v !== "" && v !== false),
);

/** Combined params fed to `useGetAdsQuery` — search + category + panel filters + page. */
export const selectAdsQueryParams = createSelector(
  [selectAdsSearchQuery, selectAdsCategory, selectAdsFilterParams, selectAdsPage],
  (searchQuery, category, filterParams, page): AdsSearchParams => {
    const params: AdsSearchParams = {
      ...filterParams,
      page,
      limit: ADS_PAGE_SIZE,
    };
    if (searchQuery) params.q = searchQuery;
    if (category === "new") params.condition = "new";
    else if (category === "used") params.condition = "used";
    return params;
  },
);
