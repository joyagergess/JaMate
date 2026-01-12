import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useCreateProfile } from "../../../context/CreateProfileContext";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { AppButton } from "../../../components/ui/AppButton";
import { createProfileStyles as styles } from "../../../styles/create-profile.styles";

const GENDERS = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
] as const;

type GenderKey = typeof GENDERS[number]["key"];

export default function CreateProfileGenderScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.gender as GenderKey | undefined;

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title="Next"
          disabled={!selected}
          onPress={() => router.push("/create-profile/birthday")}
        />
      }
    >
      <StepIndicator current={2} total={8} />

      <Text style={styles.title}>Your gender</Text>
      <Text style={styles.subtitle}>
        This helps personalize your profile.
      </Text>

      <View style={{ marginTop: 24 }}>
        {GENDERS.map((gender) => {
          const isSelected = selected === gender.key;

          return (
            <TouchableOpacity
              key={gender.key}
              onPress={() => update({ gender: gender.key })}
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
                {gender.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </CreateProfileLayout>
  );
}
