import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useSendMessage(conversationId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: string) => {
      const res = await apiClient.post(
        `/conversations/${conversationId}/messages`,
        { body }
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
