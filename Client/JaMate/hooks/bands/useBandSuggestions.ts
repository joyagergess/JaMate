import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";


export type MediaItem = {
  id: number;
  media_type: "image" | "video";
  media_url?: string;
  thumbnail_url?: string | null;
  order?: number;
  order_index?: number;
};


export type BandSuggestionMember = {
  decision: "pending" | "jam" | "decline";
  profile: {
    id: number;
    name: string;
    media: MediaItem[];
  };
};


export type BandSuggestion = {
  id: number;
  status: "pending" | "accepted" | "rejected";
  members: BandSuggestionMember[];
  band?: {
    conversation_id: number;
  };
};


export function useBandSuggestions() {
  return useQuery<BandSuggestion[]>({
    queryKey: ["band-suggestions"],
    queryFn: async () => {
      const res = await apiClient.get("/bands/suggestions");
      return res.data.data;
    },
  });
}


export function useAcceptBandSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: number) => {
      return apiClient.post(
        `/bands/suggestions/${suggestionId}/accept` 
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["band-suggestions"] });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}


export function useRejectBandSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: number) => {
      return apiClient.post(
        `/bands/suggestions/${suggestionId}/reject` 
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["band-suggestions"] });
    },
  });
}
