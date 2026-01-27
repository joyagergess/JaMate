import { useEffect, useState } from "react";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { apiClient } from "../../api/client";
import { getItem } from "../../utils/secureStorage";
import { useAuthRefresh } from "../../context/AuthRefreshContext";

export function useAuthBootstrap() {
  const { refreshKey } = useAuthRefresh();

  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      setIsReady(false);
      setIsAuthenticated(false);
      setHasProfile(null);

      const token = await getItem(AUTH_TOKEN_KEY);

      if (!mounted) return;

      if (!token) {
        apiClient.defaults.headers.common.Authorization = undefined; 
        setIsReady(true);
        return;
      }

      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`; 
      setIsAuthenticated(true);

      try {
        await apiClient.get("/profile/get");
        if (mounted) setHasProfile(true);
      } catch {
        if (mounted) setHasProfile(false);
      }

      if (mounted) setIsReady(true);
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return { isReady, isAuthenticated, hasProfile };
}
