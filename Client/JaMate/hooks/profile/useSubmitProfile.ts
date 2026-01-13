import { useMutation } from "@tanstack/react-query";
import { CreateProfileData } from "../../context/CreateProfileContext";
import { useCreateProfile } from "./useCreateProfile";
import { useUploadProfileMedia } from "./useUploadProfileMedia";

export function useSubmitProfile() {
  const createProfileApi = useCreateProfile();
  const uploadMedia = useUploadProfileMedia();

  return useMutation({
    mutationFn: async (data: CreateProfileData) => {
      if (
        !data.name ||
        !data.birthDate ||
        !data.gender ||
        !data.level ||
        !data.instruments?.length ||
        !data.genres?.length ||
        !data.objectives?.length
      ) {
        throw new Error("Profile data incomplete");
      }

      const { videos } = data;

      const level = data.level;

      const instruments = data.instruments.map((name) => ({
        name,
        level, 
      }));

      const payload = {
        name: data.name,
        username: data.username || undefined,
        birth_date: data.birthDate,
        gender: data.gender,
        experience_level: level,
        instruments,
        genres: data.genres,
        objectives: data.objectives,
        bio: data.bio || undefined,
      };
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

      await createProfileApi.mutateAsync(payload);


      for (const media of videos) {
        await uploadMedia.mutateAsync(media);
      }

      return true;
    },
  });
}
