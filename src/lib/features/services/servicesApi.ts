import { api } from "@/lib/api";
import { infiniteListConfig } from "@/lib/features/infiniteList";
import type {
  ServiceCategory,
  ServiceProvider,
  ServiceProviderDetail,
  ReviewsResponse,
  PaginationParams,
} from "@/lib/types/api";

interface ProvidersListResponse {
  providers: ServiceProvider[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export const servicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /service-categories
    getServiceCategories: builder.query<ServiceCategory[], void>({
      query: () => "/service-categories",
      providesTags: [{ type: "Services", id: "CATEGORIES" }],
    }),

    // GET /service-providers
    getServiceProviders: builder.query<
      ProvidersListResponse,
      { category_id: string; city_id?: string; q?: string; sort?: string } & PaginationParams
    >({
      query: (params) => ({
        url: "/service-providers",
        params,
      }),
      ...infiniteListConfig<ProvidersListResponse>("providers"),
    }),

    // GET /service-providers/:id
    getServiceProviderById: builder.query<ServiceProviderDetail, string>({
      query: (id) => `/service-providers/${id}`,
    }),

    // GET /service-providers/:id/reviews
    getProviderReviews: builder.query<ReviewsResponse, { providerId: string } & PaginationParams>({
      query: ({ providerId, ...params }) => ({
        url: `/service-providers/${providerId}/reviews`,
        params,
      }),
    }),
  }),
});

export const {
  useGetServiceCategoriesQuery,
  useGetServiceProvidersQuery,
  useGetServiceProviderByIdQuery,
  useGetProviderReviewsQuery,
} = servicesApi;
