import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

type CreateProfilePayload = {
  name: string;
  username?: string;
  birth_date: string;
  gender: "male" | "female";
  experience_level: string;
  instruments: { name: string; level: string }[];
  genres: string[];
  objectives: string[];
  bio?: string;
};

export function useCreateProfile() {
  return useMutation({
    mutationFn: async (payload: CreateProfilePayload) => {
      const res = await apiClient.post("/profile/create", payload);
      return res.data;
    },
  });
}
