import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { SelectablePill } from "../../../components/ui/SelectablePill";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { CreateProfileLayout } from "../../../components/ui/CreateProfileLayout";
import { SearchablePickerModal } from "../../../components/ui/SearchablePickerModal";
import { useCreateProfile } from "../../../context/CreateProfileContext";

import { ALL_GENRES } from "../../../constants/genres";
import { orderBySelected } from "../../../utils/orderBySelected";


const MAX_GENRES = 3;
const PREVIEW_COUNT = 6;


export default function CreateProfileGenresScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.genres ?? [];
  const [showPicker, setShowPicker] = useState(false);

  const orderedGenres = useMemo(
    () => orderBySelected(ALL_GENRES, selected),
    [selected]
  );

  return (
    <>
      <CreateProfileLayout
        footer={
          <AppButton
            title="Next"
            disabled={selected.length === 0}
            onPress={() => router.push("/create-profile/objectives")}
          />
        }
      >
        <StepIndicator current={6} />

        <Text style={styles.title}>What genre(s) do you play?</Text>
        <Text style={styles.subtitle}>
          Select up to {MAX_GENRES} genres
        </Text>

        <ScrollView style={{ marginTop: 16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {orderedGenres.slice(0, PREVIEW_COUNT).map((genre) => (
              <SelectablePill
                key={genre}
                label={genre}
                selected={selected.includes(genre)}
                onPress={() =>
                  update({
                    genres: selected.includes(genre)
                      ? selected.filter((g) => g !== genre)
                      : selected.length < MAX_GENRES
                      ? [...selected, genre]
                      : selected,
                  })
                }
              />
            ))}

            <SelectablePill
              label="More"
              selected={false}
              onPress={() => setShowPicker(true)}
            />
          </View>
        </ScrollView>
      </CreateProfileLayout>

      <SearchablePickerModal
        visible={showPicker}
        title="Select genres"
        items={ALL_GENRES}
        selected={selected}
        max={MAX_GENRES}
        onChange={(items) => update({ genres: items })}
        onClose={() => setShowPicker(false)}
      />
    </>
  );
}
