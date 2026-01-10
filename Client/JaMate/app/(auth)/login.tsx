import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { loginStyles as styles } from '../../styles/login.styles';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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

        <AppButton title="Login" />

        <AppButton
          title="Continue with google"
          variant="secondary"
        />
      </View>
    </SafeAreaView>
  );
}
