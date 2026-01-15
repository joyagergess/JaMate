import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await apiClient.get("/matches/get");
      return res.data.data;
    },
  });
}
