import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { welcomeStyles as styles } from '../styles/welcome.styles';

export default function WelcomeScreen() {
  const router = useRouter();




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

      </View>
    </SafeAreaView>
  );
}
