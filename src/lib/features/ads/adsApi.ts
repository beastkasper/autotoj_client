import { api } from "@/lib/api";
import type {
  AdsListResponse,
  AdsSearchParams,
  AdDetail,
  AdListItem,
  AdUpdateBody,
  ReportBody,
  ReportResponse,
  CreateAdDraftResponse,
  MyAdSubmitResponse,
  PhotoUploadResponse,
  VideoUploadResponse,
} from "@/lib/types/api";

export const adsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /ads — Search ads
    getAds: builder.query<AdsListResponse, AdsSearchParams | void>({
      query: (params) => ({
        url: "/ads",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.ads.map(({ id }) => ({ type: "Ads" as const, id })),
              { type: "Ads", id: "LIST" },
            ]
          : [{ type: "Ads", id: "LIST" }],
    }),

    // GET /ads/:id — Ad detail
    getAdById: builder.query<AdDetail, string>({
      query: (id) => `/ads/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AdDetail", id }],
    }),

    // POST /ads/:id/view — Track view
    trackAdView: builder.mutation<{ views: number }, string>({
      query: (id) => ({
        url: `/ads/${id}/view`,
        method: "POST",
      }),
    }),

    // GET /ads/:id/similar — Similar ads
    getSimilarAds: builder.query<AdListItem[], { id: string; limit?: number }>({
      query: ({ id, limit }) => ({
        url: `/ads/${id}/similar`,
        params: limit ? { limit } : undefined,
      }),
    }),

    // POST /ads/by-ids — Ads by IDs
    getAdsByIds: builder.query<AdListItem[], string[]>({
      query: (ids) => ({
        url: "/ads/by-ids",
        method: "POST",
        body: { ids },
      }),
    }),

    // POST /reports — Report ad
    reportAd: builder.mutation<ReportResponse, ReportBody>({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
    }),

    // ── My Ads ──

    // GET /my/ads — My ads list
    getMyAds: builder.query<AdsListResponse, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/my/ads",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "MyAds", id: "LIST" }],
    }),

    // POST /my/ads — Create draft
    createAdDraft: builder.mutation<CreateAdDraftResponse, void>({
      query: () => ({
        url: "/my/ads",
        method: "POST",
      }),
      invalidatesTags: [{ type: "MyAds", id: "LIST" }],
    }),

    // PATCH /my/ads/:id — Update ad
    updateMyAd: builder.mutation<AdDetail, { id: string; body: AdUpdateBody }>({
      query: ({ id, body }) => ({
        url: `/my/ads/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MyAds", id: "LIST" },
        { type: "AdDetail", id },
      ],
    }),

    // POST /my/ads/:id/photos — Upload photos
    uploadAdPhotos: builder.mutation<PhotoUploadResponse[], { id: string; photos: File[] }>({
      query: ({ id, photos }) => {
        const formData = new FormData();
        photos.forEach((file) => formData.append("photos", file));
        return {
          url: `/my/ads/${id}/photos`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "AdDetail", id }],
    }),

    // POST /my/ads/:id/video — Upload video
    uploadAdVideo: builder.mutation<VideoUploadResponse, { id: string; video: File }>({
      query: ({ id, video }) => {
        const formData = new FormData();
        formData.append("video", video);
        return {
          url: `/my/ads/${id}/video`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "AdDetail", id }],
    }),

    // POST /my/ads/:id/panorama — Upload panorama
    uploadAdPanorama: builder.mutation<VideoUploadResponse, { id: string; panorama: File }>({
      query: ({ id, panorama }) => {
        const formData = new FormData();
        formData.append("panorama", panorama);
        return {
          url: `/my/ads/${id}/panorama`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "AdDetail", id }],
    }),

    // GET /my/ads/:id — My ad detail
    getMyAdById: builder.query<AdDetail, string>({
      query: (id) => `/my/ads/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AdDetail", id }],
    }),

    // POST /my/ads/:id/submit — Submit for moderation
    submitAd: builder.mutation<MyAdSubmitResponse, string>({
      query: (id) => ({
        url: `/my/ads/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MyAds", id: "LIST" },
        { type: "AdDetail", id },
      ],
    }),

    // DELETE /my/ads/:id — Delete ad
    deleteMyAd: builder.mutation<void, string>({
      query: (id) => ({
        url: `/my/ads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "MyAds", id: "LIST" }, { type: "Ads", id: "LIST" }],
    }),

    // POST /my/ads/:id/archive — Archive ad
    archiveAd: builder.mutation<MyAdSubmitResponse, string>({
      query: (id) => ({
        url: `/my/ads/${id}/archive`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MyAds", id: "LIST" }],
    }),

    // POST /my/ads/:id/restore — Restore from archive
    restoreAd: builder.mutation<MyAdSubmitResponse, string>({
      query: (id) => ({
        url: `/my/ads/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MyAds", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdsQuery,
  useGetAdByIdQuery,
  useTrackAdViewMutation,
  useGetSimilarAdsQuery,
  useGetAdsByIdsQuery,
  useReportAdMutation,
  useGetMyAdsQuery,
  useCreateAdDraftMutation,
  useUpdateMyAdMutation,
  useUploadAdPhotosMutation,
  useUploadAdVideoMutation,
  useSubmitAdMutation,
  useDeleteMyAdMutation,
  useArchiveAdMutation,
  useRestoreAdMutation,
  useUploadAdPanoramaMutation,
  useGetMyAdByIdQuery,
} = adsApi;
