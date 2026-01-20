import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export function useMyTracks() {
  return useQuery({
    queryKey: ["my-tracks"],
    queryFn: async () => {
      const res = await apiClient.get("/tracks");

      return res.data.data.tracks;
    },
    initialData: [], 
  });
}
