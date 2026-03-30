import { api } from "@/lib/api";
import type {
  NotificationsListResponse,
  NotificationsSearchParams,
} from "@/lib/types/api";

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /notifications — List notifications
    getNotifications: builder.query<NotificationsListResponse, NotificationsSearchParams | void>({
      query: (params) => ({
        url: "/notifications",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    // POST /notifications/read — Mark as read
    markNotificationsRead: builder.mutation<
      { success: boolean; unread_count: number },
      { ids?: string[]; all?: boolean }
    >({
      query: (body) => ({
        url: "/notifications/read",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    // GET /notifications/unread-count — Unread count
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/unread-count",
      providesTags: [{ type: "Notifications", id: "COUNT" }],
    }),

    // POST /notifications/fcm-token — Register FCM token
    registerFcmToken: builder.mutation<
      { success: boolean },
      { token: string; platform: string }
    >({
      query: (body) => ({
        url: "/notifications/fcm-token",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetUnreadCountQuery,
  useRegisterFcmTokenMutation,
} = notificationsApi;
