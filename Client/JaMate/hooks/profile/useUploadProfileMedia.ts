import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useUploadProfileMedia() {
  return useMutation({
    mutationFn: async (media: {
      localUri: string;
      mimeType: string;
      type: "image" | "video";
    }) => {
      const form = new FormData();

      form.append("media_type", media.type);

      form.append("media_file", {
        uri: media.localUri,
        name: media.type === "video" ? "video.mp4" : "image.jpg",
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
