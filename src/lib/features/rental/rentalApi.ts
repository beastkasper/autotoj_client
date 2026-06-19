import { api } from "@/lib/api";
import { infiniteListConfig } from "@/lib/features/infiniteList";
import type {
  RentalListResponse,
  RentalSearchParams,
  RentalDetail,
  RentalListItem,
  PhotoUploadResponse,
} from "@/lib/types/api";

export const rentalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /rental — List rentals
    getRentals: builder.query<RentalListResponse, RentalSearchParams | void>({
      query: (params) => ({
        url: "/rental",
        params: params ?? undefined,
      }),
      ...infiniteListConfig<RentalListResponse>("cars"),
      providesTags: (result) =>
        result
          ? [
              ...result.cars.map(({ id }) => ({ type: "Rental" as const, id })),
              { type: "Rental", id: "LIST" },
            ]
          : [{ type: "Rental", id: "LIST" }],
    }),

    // GET /rental/:id — Rental detail
    getRentalById: builder.query<RentalDetail, string>({
      query: (id) => `/rental/${id}`,
      providesTags: (_result, _error, id) => [{ type: "RentalDetail", id }],
    }),

    // GET /rental/:id/similar — Similar rentals
    getSimilarRentals: builder.query<RentalListItem[], { id: string; limit?: number }>({
      query: ({ id, limit }) => ({
        url: `/rental/${id}/similar`,
        params: limit ? { limit } : undefined,
      }),
    }),

    // ── My Rental ──

    // GET /my/rental — My rentals
    getMyRentals: builder.query<RentalListResponse, void>({
      query: () => "/my/rental",
      providesTags: [{ type: "MyRental", id: "LIST" }],
    }),

    // POST /my/rental — Create rental listing
    createRental: builder.mutation<{ id: string; status: string; created_at: string }, Record<string, unknown>>({
      query: (body) => ({
        url: "/my/rental",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MyRental", id: "LIST" }],
    }),

    // PATCH /my/rental/:id — Update rental
    updateMyRental: builder.mutation<RentalDetail, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({
        url: `/my/rental/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MyRental", id: "LIST" },
        { type: "RentalDetail", id },
      ],
    }),

    // POST /my/rental/:id/photos — Upload rental photos
    uploadRentalPhotos: builder.mutation<PhotoUploadResponse[], { id: string; photos: File[] }>({
      query: ({ id, photos }) => {
        const formData = new FormData();
        photos.forEach((file) => formData.append("photos", file));
        return {
          url: `/my/rental/${id}/photos`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "RentalDetail", id }],
    }),

    // DELETE /my/rental/:id — Delete rental
    deleteMyRental: builder.mutation<void, string>({
      query: (id) => ({
        url: `/my/rental/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "MyRental", id: "LIST" }, { type: "Rental", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRentalsQuery,
  useGetRentalByIdQuery,
  useGetSimilarRentalsQuery,
  useGetMyRentalsQuery,
  useCreateRentalMutation,
  useUpdateMyRentalMutation,
  useDeleteMyRentalMutation,
  useUploadRentalPhotosMutation,
} = rentalApi;
