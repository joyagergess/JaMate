import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { registerStyles as styles } from '../../styles/register.styles';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { useRegister } from '../../hooks/auth/useRegister';

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);

  const { mutate: register, isPending } = useRegister();

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
        <Text style={styles.title}>
          Create Account{'\n'}with Email
        </Text>

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

        <View style={styles.checkboxRow}>
          <Checkbox
            value={accepted}
            onValueChange={setAccepted}
            color={accepted ? '#6D5DF6' : undefined}
          />
          <Text style={styles.checkboxText}>
            I agree to JaMate’s{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>

        <AppButton
          title="Create Account"
          loading={isPending}
          disabled={!email || !password || !accepted}
          onPress={() =>
            register(
              { email, password },
              {
                onSuccess: () => {
                  Toast.show({
                    type: 'success',
                    text1: 'Account created',
                    text2: 'You can now log in',
                  });
                  router.replace('/(auth)/login');
                },
               onError: (err: any) => {
  console.log('REGISTER ERROR:', err);
  console.log('RESPONSE:', err?.response?.data);

  Toast.show({
    type: 'error',
    text1: 'Registration failed',
    text2: err?.response?.data?.message || 'Unknown error',
  });
}
,
              }
            )
          }
        />

        <AppButton
          title="Sign in with google"
          variant="secondary"
          disabled={isPending}
        />
      </View>
    </SafeAreaView>
  );
}
