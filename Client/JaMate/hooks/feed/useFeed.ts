import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { FeedItem } from "../../types/feed";

export function useFeed(limit = 20) {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async (): Promise<FeedItem[]> => {
      const res = await apiClient.get("/feed", {
        params: { limit },
      });

      return res.data.data.feed;
    },
  });
}
