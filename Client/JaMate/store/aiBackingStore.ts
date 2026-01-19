import { create } from "zustand";

type AiBackingState = {
  jobId: number | null;
  setJobId: (id: number | null) => void;
};

export const useAiBackingStore = create<AiBackingState>((set) => ({
  jobId: null,
  setJobId: (id) => set({ jobId: id }),
}));
