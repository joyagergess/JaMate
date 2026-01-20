import { createContext, useContext, useState } from "react";

type AiBackingContextType = {
  jobId: number | null;
  setJobId: (id: number | null) => void;
};

const AiBackingContext = createContext<AiBackingContextType | undefined>(
  undefined
);

export function AiBackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jobId, setJobId] = useState<number | null>(null);

  return (
    <AiBackingContext.Provider value={{ jobId, setJobId }}>
      {children}
    </AiBackingContext.Provider>
  );
}

export function useAiBacking() {
  const ctx = useContext(AiBackingContext);
  if (!ctx) {
    throw new Error("useAiBacking must be used inside AiBackingProvider");
  }
  return ctx;
}
