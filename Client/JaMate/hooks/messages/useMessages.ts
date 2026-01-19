import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/conversations/${conversationId}/messages`
      );
      return res.data.data;
    },
  });
}
