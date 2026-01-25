import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useProfileMediaById(profileId: number) {
  return useQuery({
    queryKey: ["profile", profileId, "media"],
    enabled: !!profileId,
    queryFn: async () => {
      const res = await apiClient.get(
        `/profile/${profileId}/media`
      );
      return res.data.data;
    },
  });
}
