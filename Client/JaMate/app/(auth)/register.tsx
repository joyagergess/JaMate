import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { authStyles as styles } from "../../styles/auth.styles";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { useRegister } from "../../hooks/auth/useRegister";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getRegisterErrorMessage(err: any): string {
  const rawMessage =
    err?.response?.data?.errors?.email?.[0] ||
    err?.response?.data?.message ||
    "";

  if (
    rawMessage === "" ||
    rawMessage.toLowerCase().includes("server") ||
    rawMessage.toLowerCase().includes("error")
  ) {
    return "This email is already registered. Please try another email.";
  }

  return rawMessage;
}

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate: register, isPending } = useRegister();

  const isEmailValid = EMAIL_REGEX.test(email);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canSubmit =
    email &&
    isEmailValid &&
    password &&
    confirmPassword &&
    passwordsMatch &&
    accepted &&
    !isPending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create Account{"\n"}with Email</Text>

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

        {!isEmailValid && email.length > 0 && (
          <Text style={styles.errorText}>
            Please enter a valid email address
          </Text>
        )}

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

        <AppInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(v) => {
            setConfirmPassword(v);
            setFormError(null);
          }}
          placeholder="Re-enter your password"
          secure={!showConfirmPassword}
          rightIcon={
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          }
        />

        {!passwordsMatch && confirmPassword.length > 0 && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        <View style={styles.checkboxRow}>
          <Checkbox
            value={accepted}
            onValueChange={setAccepted}
            color={accepted ? "#6D5DF6" : undefined}
          />
          <Text style={styles.checkboxText}>
            I agree to JaMate’s <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>

        <AppButton
          title="Create Account"
          loading={isPending}
          disabled={!canSubmit}
          onPress={() => {
            setFormError(null);

            register(
              { email, password },
              {
                onSuccess: () => {
                  router.replace("/(auth)/login");
                },
                onError: (err: any) => {
                  setFormError(getRegisterErrorMessage(err));
                },
              },
            );
          }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.footerLink}
              onPress={() => router.replace("/(auth)/login")}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
