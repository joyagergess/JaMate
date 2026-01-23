import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { authStyles as styles } from "../../styles/auth.styles";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { useLogin } from "../../hooks/auth/useLogin";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { useAuthRefresh } from "../../context/AuthRefreshContext";
import { setItem } from "../../utils/secureStorage";

function getLoginErrorMessage(err: any): string {
  const rawMessage = err?.response?.data?.message || "";

  if (
    rawMessage === "" ||
    rawMessage.toLowerCase().includes("server") ||
    rawMessage.toLowerCase().includes("error")
  ) {
    return "Invalid email or password. Please try again.";
  }

  return rawMessage;
}

export default function LoginScreen() {
  const router = useRouter();
  const { triggerRefresh } = useAuthRefresh();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin();

  const canSubmit = email && password && !isPending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

        {formError && <Text style={styles.errorText}>{formError}</Text>}

        <AppInput
          label="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setFormError(null);
          }}
          placeholder="Enter your email"
        />

        <AppInput
          label="Password"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setFormError(null);
          }}
          placeholder="Enter your password"
          secure={!showPassword}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          }
        />
        <AppButton
          title="Login"
          loading={isPending}
          disabled={!canSubmit}
          onPress={() => {
            setFormError(null);

            login(
              { email, password },
              {
                onSuccess: async (token: string) => {
                  await setItem(AUTH_TOKEN_KEY, token);
                  triggerRefresh();

                  router.replace("/(tabs)");
                },
                onError: (err: any) => {
                  setFormError(getLoginErrorMessage(err));
                },
              },
            );
          }}
        />

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: "#9CA3AF" }}>
            Don&apos;t have an account?{" "}
            <Text
              style={{ color: "#6C63FF", fontWeight: "600" }}
              onPress={() => router.push("/(auth)/register")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
