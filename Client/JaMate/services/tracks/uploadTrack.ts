import { apiClient } from "@/api/client";

export type UploadTrackPayload = {
  uri: string;
  duration: number;
  trackType: "snippet" | "recording";
};

export async function uploadTrack({
  uri,
  duration,
  trackType,
}: UploadTrackPayload) {
  const formData = new FormData();

  formData.append("audio", {
    uri,
    name: `${trackType}.m4a`,
    type: "audio/m4a",
  } as any);

  formData.append("duration", String(duration));
  formData.append("track_type", trackType);

  const response = await apiClient.post("/tracks", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.track;
}
