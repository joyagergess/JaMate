import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { useCreateProfile } from "../../../context/CreateProfileContext";

const LEVELS = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
  { key: "pro", label: "Professional" },
] as const;

type LevelKey = (typeof LEVELS)[number]["key"];

export default function CreateProfileLevelScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.level as LevelKey | undefined;

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title="Next"
          disabled={!selected}
          onPress={() => router.push("/create-profile/genres")}
        />
      }
    >
      <StepIndicator current={4} />

      <Text style={styles.title}>What is your level?</Text>
      <Text style={styles.subtitle}>
        Choose your level, it will show on your profile.
      </Text>

      <View style={{ marginTop: 24 }}>
        {LEVELS.map((level) => {
          const isSelected = selected === level.key;

          return (
            <TouchableOpacity
              key={level.key}
              onPress={() => update({ level: level.key })}
              style={[
                styles.levelButton,
                isSelected
                  ? styles.levelButtonSelected
                  : styles.levelButtonUnselected,
              ]}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  isSelected && styles.levelButtonTextSelected,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </CreateProfileLayout>
  );
}
