import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useState } from "react";

type BandSetlistResponse =
  | { status: "idle" }
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
  const [shouldPoll, setShouldPoll] = useState(false);

  const query = useQuery<BandSetlistResponse>({
    queryKey: ["band-setlist", bandId],
    enabled: !!bandId,
    queryFn: async () => {
      const res = await apiClient.get(`/bands/${bandId}/setlist`);
      return res.data.data ?? { status: "idle" };
    },
    refetchInterval: (query) => {
      if (!shouldPoll) return false;
      return query.state.data?.status === "processing" ? 3000 : false;
    },
  });

  return {
    ...query,
    startPolling: () => setShouldPoll(true),
    stopPolling: () => setShouldPoll(false),
  };
}
