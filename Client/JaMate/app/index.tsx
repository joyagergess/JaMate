import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

import { welcomeStyles as styles } from '../styles/welcome.styles';
import { AUTH_TOKEN_KEY } from '../constants/auth';
import { useAuthRefresh } from '../context/AuthRefreshContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { triggerRefresh } = useAuthRefresh(); // ✅ added

  const logoutTemp = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);

    Toast.show({
      type: 'success',
      text1: 'Logged out (TEMP)',
    });

    triggerRefresh(); // 🔥 force auth bootstrap
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/logo-jamate.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>JaMate</Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.privacy}>
          By continuing, you agree to JaMate's{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.primaryText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.secondaryText}>Sign in</Text>
        </TouchableOpacity>

        {/* 🔴 TEMP LOGOUT BUTTON */}
        <TouchableOpacity
          style={[styles.secondaryButton, { marginTop: 12, opacity: 0.7 }]}
          onPress={logoutTemp}
        >
          <Text style={styles.secondaryText}>Logout (TEMP)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
