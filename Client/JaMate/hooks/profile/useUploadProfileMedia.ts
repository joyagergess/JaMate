import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { ProfileMedia } from "../../context/CreateProfileContext";

export function useUploadProfileMedia() {
  return useMutation({
    mutationFn: async (media: ProfileMedia) => {
      const form = new FormData();

      form.append("media_type", media.type);

      form.append("media_file", {
        uri: media.uri,
        name: `media.${media.type === "video" ? "mp4" : "jpg"}`,
        type: media.mimeType,
      } as any);

      const res = await apiClient.post(
        "/profile/media/store",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },
  });
}
