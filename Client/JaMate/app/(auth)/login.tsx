import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

import { loginStyles as styles } from '../../styles/login.styles';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { useLogin } from '../../hooks/auth/useLogin';
import { AUTH_TOKEN_KEY } from '../../constants/auth';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending } = useLogin();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

        <AppInput
          label="email:"
          value={email}
          onChangeText={setEmail}
          placeholder="example@gmail.com"
        />

        <AppInput
          label="Password:"
          value={password}
          onChangeText={setPassword}
          secure
        />

        <AppButton
          title="Login"
          loading={isPending}
          disabled={!email || !password}
          onPress={() =>
            login(
              { email, password },
              {
                onSuccess: async (token) => {
                  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
                  router.replace('/(tabs)');
                },
                onError: (err: any) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Login failed',
                    text2:
                      err?.response?.data?.message ||
                      'Invalid email or password',
                  });
                },
              }
            )
          }
        />

        <AppButton
          title="Continue with google"
          variant="secondary"
          disabled={isPending}
        />
      </View>
    </SafeAreaView>
  );
}
