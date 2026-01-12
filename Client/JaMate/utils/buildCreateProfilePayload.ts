import { CreateProfileData } from "../context/CreateProfileContext";

export function buildCreateProfilePayload(data: CreateProfileData) {
  return {
    name: data.name!,
    birth_date: data.birthDate!.split("T")[0],
    gender: data.gender!,
    experience_level: data.level!,
    bio: data.bio ?? null,

    instruments: data.instruments!.map((name) => ({
      name,
      level: data.level!, 
    })),

    genres: data.genres!,
    objectives: data.objectives!,
  };
}
