import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthBootstrap } from '../../hooks/auth/useAuthBootstrap';

export default function AuthLayout() {
  const { isReady } = useAuthBootstrap();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}
