import { api } from "@/lib/api";
import type {
  DictsResponse,
  VehicleType,
  Brand,
  Model,
  Generation,
  City,
} from "@/lib/types/api";

export const dictsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /dicts — All dictionaries at once (cached on app start)
    getDicts: builder.query<DictsResponse, void>({
      query: () => "/dicts",
      providesTags: [{ type: "Dicts", id: "ALL" }],
    }),

    // GET /vehicle-types
    getVehicleTypes: builder.query<VehicleType[], void>({
      query: () => "/vehicle-types",
    }),

    // GET /brands?type=car|moto|commercial
    getBrands: builder.query<Brand[], { type?: string } | void>({
      query: (params) => ({
        url: "/brands",
        params: params ?? undefined,
      }),
    }),

    // GET /models?brand_id=uuid
    getModels: builder.query<Model[], { brand_id: string }>({
      query: (params) => ({
        url: "/models",
        params,
      }),
    }),

    // GET /generations?model_id=uuid
    getGenerations: builder.query<Generation[], { model_id: string }>({
      query: (params) => ({
        url: "/generations",
        params,
      }),
    }),

    // GET /cities
    getCities: builder.query<City[], void>({
      query: () => "/cities",
    }),
  }),
});

export const {
  useGetDictsQuery,
  useGetVehicleTypesQuery,
  useGetBrandsQuery,
  useGetModelsQuery,
  useGetGenerationsQuery,
  useGetCitiesQuery,
} = dictsApi;
