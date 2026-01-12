import { createContext, useContext, useState } from 'react';

type AuthRefreshContextType = {
  refreshKey: number;
  triggerRefresh: () => void;
};

const AuthRefreshContext = createContext<AuthRefreshContextType | null>(null);

export function AuthRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <AuthRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </AuthRefreshContext.Provider>
  );
}

export function useAuthRefresh() {
  const ctx = useContext(AuthRefreshContext);
  if (!ctx) {
    throw new Error('useAuthRefresh must be used inside AuthRefreshProvider');
  }
  return ctx;
}
