import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { SelectablePill } from "../../../components/ui/SelectablePill";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { useCreateProfile } from "../../../context/CreateProfileContext";

const INSTRUMENTS = [
  "Guitar",
  "Bass Guitar",
  "Drums / Percussion",
  "Vocalist",
  "Keyboard / Piano",
  "DJ / Producer",
  "Violin / Strings",
  "Cello",
  "Double Bass",
  "Trumpet",
  "Trombone",
  "Saxophone",
  "Flute",
  "Clarinet",
  "Harmonica",
  "Ukulele",
  "Banjo",
  "Mandolin",
  "Accordion",
  "Harp",
  "Synthesizer",
  "Electronic / Modular",
  "Beatbox",
  "Hand Percussion",
  "Other",
];

export default function CreateProfileInstrumentsScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.instruments ?? [];

  return (
    <CreateProfileLayout
      footer={
        <AppButton
          title="Next"
          disabled={selected.length === 0}
          onPress={() => router.push("/create-profile/level")}
        />
      }
    >
      <StepIndicator current={4} total={5} />

      <Text style={styles.title}>What instruments do you play?</Text>

      <ScrollView style={{ marginTop: 16 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {INSTRUMENTS.map((instrument) => (
            <SelectablePill
              key={instrument}
              label={instrument}
              selected={selected.includes(instrument)}
              onPress={() =>
                update({
                  instruments: selected.includes(instrument)
                    ? selected.filter((i) => i !== instrument)
                    : [...selected, instrument],
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </CreateProfileLayout>
  );
}
