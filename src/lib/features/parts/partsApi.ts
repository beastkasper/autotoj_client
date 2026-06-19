import { api } from "@/lib/api";
import { infiniteListConfig } from "@/lib/features/infiniteList";
import type {
  PartsListResponse,
  PartsSearchParams,
  PartDetail,
  PhotoUploadResponse,
} from "@/lib/types/api";

export const partsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /parts — Search parts
    getParts: builder.query<PartsListResponse, PartsSearchParams | void>({
      query: (params) => ({
        url: "/parts",
        params: params ?? undefined,
      }),
      ...infiniteListConfig<PartsListResponse>("parts"),
      providesTags: (result) =>
        result
          ? [
              ...result.parts.map(({ id }) => ({ type: "Parts" as const, id })),
              { type: "Parts", id: "LIST" },
            ]
          : [{ type: "Parts", id: "LIST" }],
    }),

    // GET /parts/:id — Part detail
    getPartById: builder.query<PartDetail, string>({
      query: (id) => `/parts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PartDetail", id }],
    }),

    // ── My Parts ──

    // GET /my/parts — My parts
    getMyParts: builder.query<PartsListResponse, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/my/parts",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "MyParts", id: "LIST" }],
    }),

    // POST /my/parts — Create part listing
    createPart: builder.mutation<{ id: string; part_type: string; status: string; created_at: string }, Record<string, unknown>>({
      query: (body) => ({
        url: "/my/parts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MyParts", id: "LIST" }],
    }),

    // PATCH /my/parts/:id — Update part
    updateMyPart: builder.mutation<PartDetail, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({
        url: `/my/parts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MyParts", id: "LIST" },
        { type: "PartDetail", id },
      ],
    }),

    // POST /my/parts/:id/photos — Upload part photos
    uploadPartPhotos: builder.mutation<PhotoUploadResponse[], { id: string; photos: File[] }>({
      query: ({ id, photos }) => {
        const formData = new FormData();
        photos.forEach((file) => formData.append("photos", file));
        return {
          url: `/my/parts/${id}/photos`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "PartDetail", id }],
    }),

    // DELETE /my/parts/:id — Delete part
    deleteMyPart: builder.mutation<void, string>({
      query: (id) => ({
        url: `/my/parts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "MyParts", id: "LIST" }, { type: "Parts", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPartsQuery,
  useGetPartByIdQuery,
  useGetMyPartsQuery,
  useCreatePartMutation,
  useUpdateMyPartMutation,
  useDeleteMyPartMutation,
  useUploadPartPhotosMutation,
} = partsApi;
