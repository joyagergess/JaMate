import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { useCreateProfile } from "../../../context/CreateProfileContext";

const OBJECTIVES = [
  "Jam sessions",
  "Live Gigs",
  "Production / Recording",
  "Song Writing",
  "Band",
  "Band members",
];

export default function CreateProfileObjectivesScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.objectives ?? [];

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title="Next"
          disabled={selected.length === 0}
          onPress={() => router.push("/create-profile/media")}
        />
      }
    >
      <StepIndicator current={5} total={5} />

      <Text style={styles.title}>What are you looking for?</Text>
      <Text style={styles.subtitle}>Select up to 3 objectives</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ marginTop: 24 }}>
          {OBJECTIVES.map((objective) => {
            const isSelected = selected.includes(objective);

            return (
              <TouchableOpacity
                key={objective}
                onPress={() =>
                  update({
                    objectives: isSelected
                      ? selected.filter((o) => o !== objective)
                      : selected.length < 3
                      ? [...selected, objective]
                      : selected,
                  })
                }
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
                  {objective}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </CreateProfileLayout>
  );
}
