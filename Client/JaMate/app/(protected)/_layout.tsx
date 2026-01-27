import { Slot, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuthBootstrap } from "../../hooks/auth/useAuthBootstrap";
import { Href } from "expo-router";

export default function ProtectedLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const { isReady, isAuthenticated, hasProfile } = useAuthBootstrap();

  useEffect(() => {
    if (!isReady) return;

    const isAuthRoute = pathname.startsWith("/(auth)");
    const isProtectedRoute =
      pathname.startsWith("/(tabs)") ||
      pathname.startsWith("/create-profile");

    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/(auth)/login");
      return;
    }

    if (isAuthenticated && hasProfile === false && !isAuthRoute) {
      router.replace("/create-profile" as Href);
      return;
    }

  }, [isReady, isAuthenticated, hasProfile, pathname]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}
