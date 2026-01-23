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
    let mounted = true;

    const bootstrap = async () => {
      setIsReady(false);

      try {
        const token = await getItem(AUTH_TOKEN_KEY);

        if (!mounted) return;

        if (!token) {
          setIsAuthenticated(false);
          setHasProfile(null);
          return;
        }

        setIsAuthenticated(true);

        try {
          await apiClient.get("/profile/get");
          if (mounted) setHasProfile(true);
        } catch {
          if (mounted) setHasProfile(false);
        }
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return { isReady, isAuthenticated, hasProfile };
}
