import { useEffect, useState } from "react";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { apiClient } from "../../api/client";
import { useAuthRefresh } from "../../context/AuthRefreshContext";
import { getItem } from "../../utils/secureStorage";

export function useAuthBootstrap() {
  const { refreshKey } = useAuthRefresh();

  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      setIsReady(false);

      try {
        const token = await getItem(AUTH_TOKEN_KEY);

        if (!token) {
          setIsAuthenticated(false);
          setHasProfile(null);
          return;
        }

        setIsAuthenticated(true);

        try {
          await apiClient.get("/profile/get");
          setHasProfile(true);
        } catch {
          setHasProfile(false);
        }
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, [refreshKey]);

  return { isReady, isAuthenticated, hasProfile };
}
