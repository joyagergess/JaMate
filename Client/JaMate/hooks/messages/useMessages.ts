import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useMessages(conversationId: number) {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
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

      return res.data.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.length) return undefined;
      return lastPage[0].sent_at;
    },
  });
}
