import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export type ConversationItem = {
  id: number;
  type: "direct" | "group";
  unread_count: number;
  name: string | null;

  band?: {
    id: number;
  };

  participants: {
    profile: {
      id: number;
      name: string;
      media: {
        id: number;
        media_type: "image" | "video";
        media_url: string;
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
