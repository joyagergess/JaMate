import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

type UploadTrackInput = {
  uri: string;
  duration: number;
  trackType: "snippet" | "recording";
};

export function useUploadTrack() {
  return useMutation({
    mutationFn: async ({ uri, duration, trackType }: UploadTrackInput) => {
      const formData = new FormData();

      formData.append("audio", {
        uri,
        name: `${trackType}.m4a`,
        type: "audio/m4a",
      } as any);

      formData.append("duration", String(duration));
      formData.append("track_type", trackType);

      const res = await apiClient.post("/tracks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.track;
    },
  });
}
