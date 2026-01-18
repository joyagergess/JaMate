import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

/* ------------------ MEDIA ------------------ */

export type MediaItem = {
  id: number;
  media_type: "image" | "video";
  media_url?: string;
  thumbnail_url?: string | null;
  order?: number;
  order_index?: number;
};

/* ------------------ MEMBER ------------------ */

export type BandSuggestionMember = {
  decision: "pending" | "jam" | "decline";
  profile: {
    id: number;
    name: string;
    media: MediaItem[];
  };
};

/* ------------------ SUGGESTION ------------------ */

export type BandSuggestion = {
  id: number;
  status: "pending" | "accepted" | "rejected";
  members: BandSuggestionMember[];
  band?: {
    conversation_id: number;
  };
};

/* ------------------ QUERY ------------------ */

export function useBandSuggestions() {
  return useQuery<BandSuggestion[]>({
    queryKey: ["band-suggestions"],
    queryFn: async () => {
      const res = await apiClient.get("/bands/suggestions"); // ✅ FIX
      return res.data.data;
    },
  });
}

/* ------------------ ACCEPT ------------------ */

export function useAcceptBandSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: number) => {
      return apiClient.post(
        `/bands/suggestions/${suggestionId}/accept` // ✅ FIX
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["band-suggestions"] });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

/* ------------------ REJECT ------------------ */

export function useRejectBandSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: number) => {
      return apiClient.post(
        `/bands/suggestions/${suggestionId}/reject` // ✅ FIX
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["band-suggestions"] });
    },
  });
}
