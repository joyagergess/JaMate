import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { CreateProfileData } from "../../context/CreateProfileContext";
import { buildCreateProfilePayload } from "../../utils/buildCreateProfilePayload";

export function useCreateProfile() {
  return useMutation({
    mutationFn: async (data: CreateProfileData) => {
      const res = await apiClient.post(
        "/profile/create",
        buildCreateProfilePayload(data)
      );

      return res.data;
    },
  });
}
