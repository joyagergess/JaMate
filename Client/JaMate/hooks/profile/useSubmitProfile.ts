import { useMutation } from "@tanstack/react-query";
import { CreateProfileData } from "../../context/CreateProfileContext";
import { useCreateProfile } from "./useCreateProfile";
import { useUploadProfileMedia } from "./useUploadProfileMedia";

export function useSubmitProfile() {
  const createProfile = useCreateProfile();
  const uploadMedia = useUploadProfileMedia();

  return useMutation({
    mutationFn: async (data: CreateProfileData) => {
      await createProfile.mutateAsync(data);

      for (const media of data.videos) {
        await uploadMedia.mutateAsync(media);
      }

      return true;
    },
  });
}
