import { createContext, useContext, useState } from "react";

export type ProfileMedia = {
  id: number;

  uri: string;

  type: "image" | "video";
  mimeType: string;
  size: number;

  order_index: number;
  duration?: number;
};


export type CreateProfileData = {
  name?: string;
  username?: string;
  birthDate?: string;
  gender?: "male" | "female";
  instruments?: string[];
  videos: ProfileMedia[];
  genres?: string[];
  objectives?: string[];
  level?: "beginner" | "intermediate" | "advanced" | "pro";
  bio?: string;
};


type CreateProfileContextType = {
  data: CreateProfileData;
  update: (values: Partial<CreateProfileData>) => void;
  reset: () => void;
};

const CreateProfileContext = createContext<CreateProfileContextType | null>(
  null
);

const INITIAL_STATE: CreateProfileData = {
  videos: [],
};

export function CreateProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<CreateProfileData>(INITIAL_STATE);

  const update = (values: Partial<CreateProfileData>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  const reset = () => setData(INITIAL_STATE);

  return (
    <CreateProfileContext.Provider value={{ data, update, reset }}>
      {children}
    </CreateProfileContext.Provider>
  );
}

export function useCreateProfile() {
  const ctx = useContext(CreateProfileContext);
  if (!ctx) {
    throw new Error(
      "useCreateProfile must be used inside CreateProfileProvider"
    );
  }
  return ctx;
}
