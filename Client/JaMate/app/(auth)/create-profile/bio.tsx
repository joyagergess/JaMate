import {
  Text,
  View,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { useCreateProfile } from "../../../context/CreateProfileContext";
import { useSubmitProfile } from "../../../hooks/profile/useSubmitProfile";

import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { AppButton } from "../../../components/ui/AppButton";
import { createProfileStyles as styles } from "../../../styles/create-profile.styles";

const MAX_LENGTH = 300;

export default function CreateProfileBioScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();
  const submitProfile = useSubmitProfile();

  const [bio, setBio] = useState(data.bio ?? "");

  const onFinish = () => {
    Keyboard.dismiss();

    const finalPayload = {
      ...data,
      bio,
    };


    submitProfile.mutate(finalPayload, {
      onSuccess: () => {
        console.log(" PROFILE CREATED");
        router.replace("/(tabs)"); 
      },
      onError: (error: any) => {
        console.log(" PROFILE CREATION FAILED", error);

        if (error?.response) {
          console.log(" STATUS:", error.response.status);
          console.log(" DATA:", error.response.data);
        }
      },
    });
  };

  const isValid = bio.trim().length >= 10;

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title={submitProfile.isPending ? "Creating profile..." : "Finish"}
          disabled={!isValid || submitProfile.isPending}
          onPress={onFinish}
        />
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 160 }}
          >
            <StepIndicator current={8} total={8} />

            <View style={{ marginBottom: 20 }}>
              <Text style={styles.title}>Tell us about you</Text>
              <Text style={styles.subtitle}>
                Share a short bio so others know your vibe, style, and experience.
              </Text>
            </View>

            <Text style={styles.inputLabel}>Bio</Text>

            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Example: Guitarist into funk & jazz, looking to jam and write originals."
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.textArea}
              multiline
              maxLength={MAX_LENGTH}
              returnKeyType="done"
              blurOnSubmit
            />

            <Text style={styles.inputHint}>
              {bio.length}/{MAX_LENGTH} characters
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </CreateProfileLayout>
  );
}
