import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

type UpdateProfilePayload = {
  name: string;
  username?: string | null;
  bio?: string | null;
  location: string;
  experience_level: string;
  gender: "male" | "female";
  birth_date: string;

  genres: string[];
  objectives: string[];
  instruments: {
    name: string;
    level: string;
  }[];
};


export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await apiClient.post("/profile/update", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}
