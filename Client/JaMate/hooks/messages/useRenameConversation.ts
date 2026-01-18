import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useRenameConversation(conversationId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post(
        `/conversations/${conversationId}/rename`,
        { name }
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
