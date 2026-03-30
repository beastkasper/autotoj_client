import { api } from "@/lib/api";
import type {
  UserProfile,
  PublicUser,
  UpdateProfileBody,
  ReviewsResponse,
  AdsListResponse,
  PaginationParams,
  ProfileSettings,
  UpdateSettingsBody,
} from "@/lib/types/api";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /profile — Get my profile
    getProfile: builder.query<UserProfile, void>({
      query: () => "/profile",
      providesTags: [{ type: "Profile", id: "ME" }],
    }),

    // PATCH /profile — Update profile
    updateProfile: builder.mutation<UserProfile, UpdateProfileBody>({
      query: (body) => ({
        url: "/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    // POST /profile/avatar — Upload avatar
    uploadAvatar: builder.mutation<{ avatar_url: string }, File>({
      query: (avatar) => {
        const formData = new FormData();
        formData.append("avatar", avatar);
        return {
          url: "/profile/avatar",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    // POST /profile/banner — Upload banner
    uploadBanner: builder.mutation<{ banner_url: string }, File>({
      query: (banner) => {
        const formData = new FormData();
        formData.append("banner", banner);
        return {
          url: "/profile/banner",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    // GET /profile/settings — Get settings
    getSettings: builder.query<ProfileSettings, void>({
      query: () => "/profile/settings",
      providesTags: [{ type: "Profile", id: "SETTINGS" }],
    }),

    // PATCH /profile/settings — Update settings
    updateSettings: builder.mutation<ProfileSettings, UpdateSettingsBody>({
      query: (body) => ({
        url: "/profile/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "SETTINGS" }],
    }),

    // DELETE /profile — Delete account
    deleteAccount: builder.mutation<{ success: boolean; message: string }, { confirm: boolean }>({
      query: (body) => ({
        url: "/profile",
        method: "DELETE",
        body,
      }),
    }),

    // GET /users/:id — Public user profile
    getPublicUser: builder.query<PublicUser, string>({
      query: (id) => `/users/${id}`,
    }),

    // GET /users/:id/ads — User's ads
    getUserAds: builder.query<AdsListResponse, { userId: string } & PaginationParams>({
      query: ({ userId, ...params }) => ({
        url: `/users/${userId}/ads`,
        params,
      }),
    }),

    // GET /users/:id/reviews — User reviews
    getUserReviews: builder.query<ReviewsResponse, { userId: string } & PaginationParams>({
      query: ({ userId, ...params }) => ({
        url: `/users/${userId}/reviews`,
        params,
      }),
      providesTags: (_result, _error, { userId }) => [{ type: "Reviews", id: userId }],
    }),

    // POST /users/:id/reviews — Leave review
    createReview: builder.mutation<{ id: string; rating: number; comment: string; created_at: string }, { userId: string; rating: number; comment: string }>({
      query: ({ userId, ...body }) => ({
        url: `/users/${userId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: "Reviews", id: userId }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useGetPublicUserQuery,
  useGetUserAdsQuery,
  useGetUserReviewsQuery,
  useCreateReviewMutation,
  useUploadAvatarMutation,
  useUploadBannerMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = profileApi;
