import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { loginStyles as styles } from '../../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

        <Text style={styles.inputLabel}>email:</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // 🔜 call login API here
          }}
        >
          <Text style={styles.primaryText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={18} color="#000000" />
          <Text style={styles.googleText}>Continue with google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => router.replace('/(auth)/register')}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
