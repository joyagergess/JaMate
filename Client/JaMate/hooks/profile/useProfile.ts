import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { Gender, ExperienceLevel } from "../../types/profile";

export type Profile = {
  id: number;
  name: string;
  username: string | null;
  bio?: string | null;
  birth_date: string;
  age: number;
  gender: Gender;
  experience_level: ExperienceLevel;
  location?: string | null;

  avatar_url?: string;
  media: ProfileMedia[];
  genres: { id: number; name: string }[];
  objectives: { id: number; name: string }[];
  instruments: { id: number; name: string }[];
};
export type ProfileMedia = {
  id: number;
  type: "image" | "video";
  media_url: string;
  order_index: number;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: async (): Promise<Profile> => {
      const res = await apiClient.get("/profile/get");
      return res.data.data;
    },
  });
}
