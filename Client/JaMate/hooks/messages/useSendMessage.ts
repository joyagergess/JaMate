import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

type SendMessagePayload =
  | { type: "text"; body: string }
  | { type: "track"; track_id: number };

export function useSendMessage(conversationId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const res = await apiClient.post(
        `/conversations/${conversationId}/messages`,
        payload
      );
      return res.data.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    },
  });
}
