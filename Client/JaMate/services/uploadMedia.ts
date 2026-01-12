import axios from "axios";
import { ProfileMedia } from "../context/CreateProfileContext";

export async function uploadMedia(
  media: ProfileMedia,
  onProgress?: (p: number) => void
): Promise<string> {
  const form = new FormData();

  form.append("file", {
    uri: media.localUri,
    type: media.mimeType,
    name: `${media.id}.${media.type === "video" ? "mp4" : "jpg"}`,
  } as any);

  const res = await axios.post(
    "https://YOUR_BACKEND/api/upload",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (!e.total) return;
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      },
    }
  );

  return res.data.url; 
}
