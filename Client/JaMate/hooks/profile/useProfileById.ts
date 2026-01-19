import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useProfileById(profileId: number) {
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      const res = await apiClient.get(`/profile/${profileId}`);
      return res.data.data; 
    },
    enabled: !!profileId,
  });
}
