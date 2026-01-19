import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { useState } from "react";

import { AuthRefreshProvider } from "../context/AuthRefreshContext";
import { AiBackingProvider } from "../context/AiBackingContext";

import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthRefreshProvider>
            <AiBackingProvider>
              <Slot />
              <Toast />
            </AiBackingProvider>
          </AuthRefreshProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
