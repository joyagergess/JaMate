import { Text,
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
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { AppButton } from "../../../components/ui/AppButton";
import { createProfileStyles as styles } from "../../../styles/create-profile.styles";

const MAX_LENGTH = 300;

export default function CreateProfileBioScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const [bio, setBio] = useState(data.bio ?? "");

  const onNext = () => {
  Keyboard.dismiss();

  update({ bio });

  console.log("CREATE PROFILE DATA (so far):", {
    ...data,
    bio,
  });

  router.push("/create-profile/profileSubmitScreen");
};

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title="Next"
          disabled={bio.trim().length < 10}
          onPress={onNext}
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
            <StepIndicator current={7} total={8} />

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
