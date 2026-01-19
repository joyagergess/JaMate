import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCreateProfile } from "../../../context/CreateProfileContext";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { StepIndicator } from "@/components/ui/StepIndicator";

export default function CreateProfileBasicsScreen() {
  const { data, update } = useCreateProfile();

  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color="#FFFFFF"
                  onPress={() => router.back()}
                />
              </View>
              <StepIndicator current={1} />

              <Text style={styles.title}>What's your name?</Text>

              <TextInput
                style={styles.textInput}
                placeholder="Enter name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                blurOnSubmit
              />

              <Text style={styles.inputHint}>
                This is how your name will appear on your profile.
              </Text>

              <Text style={styles.inputLabel}>
                Create a username (optional)
              </Text>

              <TextInput
                style={styles.textInput}
                placeholder="Enter username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                returnKeyType="done"
                blurOnSubmit
              />

              <Text style={styles.inputHint}>
                This username will appear on your profile.
              </Text>
            </View>

            <View style={styles.footer}>
              <AppButton
                title="Continue"
                disabled={!canContinue}
                onPress={() => {
                  Keyboard.dismiss();

                  update({
                    name,
                    username,
                  });

                  router.push("/create-profile/gender");
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
