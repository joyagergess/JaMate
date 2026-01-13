import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export type ProfileMedia = {
  id: number;
  media_type: "image" | "video";
  url: string;
  thumbnail_url?: string | null;
  order_index: number;
};


export function useProfileMedia() {
  return useQuery({
    queryKey: ["profile", "media"],
    queryFn: async () => {
      const res = await apiClient.get("/profile/media/get");
      console.log("RAW MEDIA RESPONSE:", res.data.data);
      return res.data.data;
    },
  });
}
