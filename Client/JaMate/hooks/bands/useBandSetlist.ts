import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useEffect } from "react";

type BandSetlistResponse =
  | { status: "processing" }
  | {
      status: "ready";
      setlist: {
        order: number;
        song: string;
        artist: string;
        key?: string;
      }[];
      generated_at: string;
    };

export function useBandSetlist(bandId?: number) {

  const query = useQuery<BandSetlistResponse>({
    queryKey: ["band-setlist", bandId],
    enabled: !!bandId,
    queryFn: async () => {
      console.log(" FETCH /bands/" + bandId + "/setlist");

      const res = await apiClient.get(
        `/bands/${bandId}/setlist`
      );

      return res.data.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "processing" ? 3000 : false;
    },
  });


  return query;
}
