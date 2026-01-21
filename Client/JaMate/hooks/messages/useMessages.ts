import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

/* ------------------ TYPES ------------------ */
export type Message =
  | {
      id: number;
      type: "text";
      body: string;
      sent_at: string;
      sender_profile_id: number;
      conversation_id: number;
    }
  | {
      id: number;
      type: "track";
      track_id: number;
      track_title: string;
      track_duration: number;
      sent_at: string;
      sender_profile_id: number;
      conversation_id: number;
    };

type MessagesPayload = {
  data: Message[];
  next_cursor: string | null;
};

/* ------------------ HOOK ------------------ */
export function useMessages(conversationId: number) {
  return useInfiniteQuery<MessagesPayload>({
    queryKey: ["messages", conversationId],
    initialPageParam: null as string | null,

    queryFn: async ({ pageParam }) => {
      const res = await apiClient.get(
        `/conversations/${conversationId}/messages`,
        {
          params: {
            cursor: pageParam,
            limit: 30,
          },
        }
      );

      // 🔥 THIS IS THE FIX
      return res.data.data;
    },

    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
}
