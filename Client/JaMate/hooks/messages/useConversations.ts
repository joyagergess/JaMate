import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export type ConversationItem = {
  id: number;
  type: "direct" | "band";
  unread_count: number;
  name: string | null;
  participants: {
    profile: {
      id: number;
      name: string;
      media: {
        id: number;
        media_type: "image" | "video";
        url: string;
        order_index: number;
      }[];
    };
  }[];

  messages: {
    id: number;
    body: string | null;
    sent_at: string;
  }[];
};


export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async (): Promise<ConversationItem[]> => {
      const res = await apiClient.get("/conversations");
      return res.data.data;
    },
  });
}
