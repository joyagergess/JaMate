import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthBootstrap } from '../../hooks/auth/useAuthBootstrap';
import { Href } from "expo-router";

export default function ProtectedLayout() {
  const router = useRouter();
  const { isReady, isAuthenticated, hasProfile } = useAuthBootstrap();

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    if (hasProfile === false) {
router.replace("/create-profile" as Href);
      return;
    }
  }, [isReady, isAuthenticated, hasProfile]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}
