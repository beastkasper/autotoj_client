import { api } from "@/lib/api";
import { infiniteListConfig } from "@/lib/features/infiniteList";
import type {
  LogbookListResponse,
  LogbookSearchParams,
  LogbookPostDetail,
  LogbookCommentsResponse,
  LogbookComment,
  PaginationParams,
  PhotoUploadResponse,
} from "@/lib/types/api";

export const logbookApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /logbook — Feed
    getLogbookPosts: builder.query<LogbookListResponse, LogbookSearchParams | void>({
      query: (params) => ({
        url: "/logbook",
        params: params ?? undefined,
      }),
      ...infiniteListConfig<LogbookListResponse>("posts"),
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: "Logbook" as const, id })),
              { type: "Logbook", id: "LIST" },
            ]
          : [{ type: "Logbook", id: "LIST" }],
    }),

    // GET /logbook/:id — Post detail
    getLogbookPostById: builder.query<LogbookPostDetail, string>({
      query: (id) => `/logbook/${id}`,
      providesTags: (_result, _error, id) => [{ type: "LogbookDetail", id }],
    }),

    // POST /logbook — Create post
    createLogbookPost: builder.mutation<
      { id: string; status: string; created_at: string },
      { title: string; text: string; category: string }
    >({
      query: (body) => ({
        url: "/logbook",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Logbook", id: "LIST" }],
    }),

    // PATCH /logbook/:id — Update post
    updateLogbookPost: builder.mutation<
      LogbookPostDetail,
      { id: string; body: { title?: string; text?: string; category?: string } }
    >({
      query: ({ id, body }) => ({
        url: `/logbook/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Logbook", id: "LIST" },
        { type: "LogbookDetail", id },
      ],
    }),

    // DELETE /logbook/:id — Delete post
    deleteLogbookPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/logbook/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Logbook", id: "LIST" }],
    }),

    // POST /logbook/:id/photos — Upload photos
    uploadLogbookPhotos: builder.mutation<PhotoUploadResponse[], { id: string; photos: File[] }>({
      query: ({ id, photos }) => {
        const formData = new FormData();
        photos.forEach((file) => formData.append("photos", file));
        return {
          url: `/logbook/${id}/photos`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "LogbookDetail", id }],
    }),

    // POST /logbook/:id/like — Like post
    likeLogbookPost: builder.mutation<{ likes_count: number; is_liked: boolean }, string>({
      query: (id) => ({
        url: `/logbook/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "LogbookDetail", id }],
    }),

    // DELETE /logbook/:id/like — Unlike post
    unlikeLogbookPost: builder.mutation<{ likes_count: number; is_liked: boolean }, string>({
      query: (id) => ({
        url: `/logbook/${id}/like`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "LogbookDetail", id }],
    }),

    // GET /logbook/:id/comments — Post comments
    getLogbookComments: builder.query<
      LogbookCommentsResponse,
      { postId: string } & PaginationParams
    >({
      query: ({ postId, ...params }) => ({
        url: `/logbook/${postId}/comments`,
        params,
      }),
    }),

    // POST /logbook/:id/comments — Add comment
    addLogbookComment: builder.mutation<
      { id: string; text: string; created_at: string },
      { postId: string; text: string }
    >({
      query: ({ postId, text }) => ({
        url: `/logbook/${postId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { postId }) => [{ type: "LogbookDetail", id: postId }],
    }),
  }),
});

export const {
  useGetLogbookPostsQuery,
  useGetLogbookPostByIdQuery,
  useCreateLogbookPostMutation,
  useUpdateLogbookPostMutation,
  useDeleteLogbookPostMutation,
  useUploadLogbookPhotosMutation,
  useLikeLogbookPostMutation,
  useUnlikeLogbookPostMutation,
  useGetLogbookCommentsQuery,
  useAddLogbookCommentMutation,
} = logbookApi;
