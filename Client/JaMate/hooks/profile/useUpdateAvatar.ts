import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useUpdateAvatar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: { uri: string; mimeType: string }) => {
      const form = new FormData();

      form.append("media_file", {
        uri: file.uri,
        name: "avatar.jpg",
        type: file.mimeType,
      } as any);

      await apiClient.post("/profile/avatar/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
      qc.invalidateQueries({ queryKey: ["profile-media"] });
    },
  });
}
