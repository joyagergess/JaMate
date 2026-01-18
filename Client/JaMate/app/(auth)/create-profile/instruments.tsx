import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { SelectablePill } from "../../../components/ui/SelectablePill";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { SearchablePickerModal } from "../../../components/ui/SearchablePickerModal";
import { useCreateProfile } from "../../../context/CreateProfileContext";

import { ALL_INSTRUMENTS } from "../../../constants/instruments";
import { orderBySelected } from "../../../utils/orderBySelected";


const PREVIEW_COUNT = 6;


export default function CreateProfileInstrumentsScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.instruments ?? [];
  const [showPicker, setShowPicker] = useState(false);

  const orderedInstruments = useMemo(
    () => orderBySelected(ALL_INSTRUMENTS, selected),
    [selected]
  );

  return (
    <>
      <CreateProfileLayout
        footer={
          <AppButton
            title="Next"
            disabled={selected.length === 0}
            onPress={() => router.push("/create-profile/level")}
          />
        }
      >
        <StepIndicator current={4} />

        <Text style={styles.title}>What instruments do you play?</Text>
        <Text style={styles.subtitle}>
          Select all that apply
        </Text>

        <ScrollView style={{ marginTop: 16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {orderedInstruments.slice(0, PREVIEW_COUNT).map((instrument) => (
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

            {/* MORE BUTTON */}
            <SelectablePill
              label="Other"
              selected={false}
              onPress={() => setShowPicker(true)}
            />
          </View>
        </ScrollView>
      </CreateProfileLayout>

      {/* ===== SEARCH MODAL ===== */}
      <SearchablePickerModal
        visible={showPicker}
        title="Select instruments"
        items={ALL_INSTRUMENTS}
        selected={selected}
        onChange={(items) => update({ instruments: items })}
        onClose={() => setShowPicker(false)}
      />
    </>
  );
}
