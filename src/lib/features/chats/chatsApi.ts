import { api } from "@/lib/api";
import type {
  ChatsListResponse,
  ChatListItem,
  MessagesListResponse,
  Message,
  PaginationParams,
} from "@/lib/types/api";

export const chatsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /chats — List chats
    getChats: builder.query<ChatsListResponse, PaginationParams | void>({
      query: (params) => ({
        url: "/chats",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "Chats", id: "LIST" }],
    }),

    // GET /chats/:id — Single chat (deep-link, page refresh)
    getChat: builder.query<ChatListItem, string>({
      query: (chatId) => `/chats/${chatId}`,
      providesTags: (_result, _error, chatId) => [
        { type: "Chats", id: chatId },
      ],
    }),

    // POST /chats — Create or get chat
    createChat: builder.mutation<{ chat_id: string }, { ad_id: string }>({
      query: (body) => ({
        url: "/chats",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Chats", id: "LIST" }],
    }),

    // GET /chats/:id/messages — Chat messages
    getChatMessages: builder.query<
      MessagesListResponse,
      { chatId: string } & PaginationParams
    >({
      query: ({ chatId, ...params }) => ({
        url: `/chats/${chatId}/messages`,
        params,
      }),
      providesTags: (_result, _error, { chatId }) => [
        { type: "Chats", id: `MSG-${chatId}` },
      ],
    }),

    // POST /chats/:id/messages — Send message
    sendMessage: builder.mutation<
      Message,
      { chatId: string; text?: string; media_id?: string }
    >({
      query: ({ chatId, ...body }) => ({
        url: `/chats/${chatId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { chatId }) => [
        { type: "Chats", id: "LIST" },
        { type: "Chats", id: chatId },
        { type: "Chats", id: `MSG-${chatId}` },
      ],
    }),

    // POST /chats/:id/read — Mark as read
    markChatRead: builder.mutation<{ success: boolean }, string>({
      query: (chatId) => ({
        url: `/chats/${chatId}/read`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Chats", id: "LIST" }],
    }),

    // POST /blocks — Block user
    blockUser: builder.mutation<{ success: boolean }, { user_id: string }>({
      query: (body) => ({
        url: "/blocks",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatQuery,
  useCreateChatMutation,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useMarkChatReadMutation,
  useBlockUserMutation,
} = chatsApi;
