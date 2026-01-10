import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { registerStyles as styles } from '../../styles/register.styles';

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);

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

        <Text style={styles.inputLabel}>email:</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // 🔜 call register API here
          }}
        >
          <Text style={styles.primaryText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={18} color="#000000" />
          <Text style={styles.googleText}>Sign in with google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => router.replace('/(auth)/login')}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
