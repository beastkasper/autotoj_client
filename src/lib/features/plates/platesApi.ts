import { api } from "@/lib/api";
import { infiniteListConfig } from "@/lib/features/infiniteList";
import type {
  PlatesListResponse,
  PlatesSearchParams,
  LicensePlateDetail,
  CreatePlateInput,
} from "@/lib/types/plate";
import type { PhotoUploadResponse } from "@/lib/types/api";

export const platesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /license-plates — Search license plates
    getPlates: builder.query<PlatesListResponse, PlatesSearchParams | void>({
      query: (params) => ({
        url: "/license-plates",
        params: params ?? undefined,
      }),
      ...infiniteListConfig<PlatesListResponse>("plates"),
      providesTags: (result) =>
        result
          ? [
              ...result.plates.map(({ id }) => ({ type: "Plates" as const, id })),
              { type: "Plates", id: "LIST" },
            ]
          : [{ type: "Plates", id: "LIST" }],
    }),

    // GET /license-plates/:id — Plate detail
    getPlateById: builder.query<LicensePlateDetail, string>({
      query: (id) => `/license-plates/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PlateDetail", id }],
    }),

    // ── My License Plates ──

    // GET /my/license-plates — My plates
    getMyPlates: builder.query<PlatesListResponse, void>({
      query: () => "/my/license-plates",
      providesTags: [{ type: "MyPlates", id: "LIST" }],
    }),

    // POST /my/license-plates — Create plate listing
    createPlate: builder.mutation<
      { id: string; plate_number: string; status: string; created_at: string },
      CreatePlateInput
    >({
      query: (body) => ({
        url: "/my/license-plates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MyPlates", id: "LIST" }],
    }),

    // PATCH /my/license-plates/:id — Update plate
    updateMyPlate: builder.mutation<LicensePlateDetail, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({
        url: `/my/license-plates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MyPlates", id: "LIST" },
        { type: "PlateDetail", id },
      ],
    }),

    // POST /my/license-plates/:id/photos — Upload plate photos
    uploadPlatePhotos: builder.mutation<PhotoUploadResponse[], { id: string; photos: File[] }>({
      query: ({ id, photos }) => {
        const formData = new FormData();
        photos.forEach((file) => formData.append("photos", file));
        return {
          url: `/my/license-plates/${id}/photos`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "PlateDetail", id }],
    }),

    // DELETE /my/license-plates/:id — Delete plate
    deleteMyPlate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/my/license-plates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "MyPlates", id: "LIST" }, { type: "Plates", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPlatesQuery,
  useGetPlateByIdQuery,
  useGetMyPlatesQuery,
  useCreatePlateMutation,
  useUpdateMyPlateMutation,
  useDeleteMyPlateMutation,
  useUploadPlatePhotosMutation,
} = platesApi;
