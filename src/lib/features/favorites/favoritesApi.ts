import { api } from "@/lib/api";
import type { FavoritesListResponse, PaginationParams } from "@/lib/types/api";

export const favoritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /favorites — List favorites
    getFavorites: builder.query<FavoritesListResponse, PaginationParams | void>({
      query: (params) => ({
        url: "/favorites",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "Favorites", id: "LIST" }],
    }),

    // POST /favorites/:ad_id — Add to favorites
    addFavorite: builder.mutation<{ success: boolean }, string>({
      query: (adId) => ({
        url: `/favorites/${adId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, adId) => [
        { type: "Favorites", id: "LIST" },
        { type: "Favorites", id: adId },
      ],
    }),

    // DELETE /favorites/:ad_id — Remove from favorites
    removeFavorite: builder.mutation<void, string>({
      query: (adId) => ({
        url: `/favorites/${adId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, adId) => [
        { type: "Favorites", id: "LIST" },
        { type: "Favorites", id: adId },
      ],
    }),

    // GET /favorites/check/:ad_id — Check if favorite
    checkFavorite: builder.query<{ is_favorite: boolean }, string>({
      query: (adId) => `/favorites/check/${adId}`,
      providesTags: (_result, _error, adId) => [{ type: "Favorites", id: adId }],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useCheckFavoriteQuery,
} = favoritesApi;
