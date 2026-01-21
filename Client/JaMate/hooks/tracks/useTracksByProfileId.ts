import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export function useTracksByProfileId(profileId: number) {
  return useQuery({
    queryKey: ["profile-tracks", profileId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/profiles/${profileId}/tracks`
      );

      return res.data.data.tracks;
    },
    enabled: !!profileId, 
    initialData: [],
  });
}
