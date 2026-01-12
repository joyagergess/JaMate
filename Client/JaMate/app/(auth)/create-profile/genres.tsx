import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { createProfileStyles as styles } from "../../../styles/create-profile.styles";
import { AppButton } from "../../../components/ui/AppButton";
import { SelectablePill } from "../../../components/ui/SelectablePill";
import { useCreateProfile } from "../../../context/CreateProfileContext";

const TOTAL_STEPS = 5;
const CURRENT_STEP = 4;
const MAX_GENRES = 3;

const GENRES = [
  "Pop",
  "Rock",
  "Alternative",
  "Indie",
  "Metal",
  "Punk",
  "Hard Rock",

  "Hip Hop",
  "Rap",
  "Trap",
  "R&B",
  "Soul",
  "Funk",

  "Jazz",
  "Blues",
  "Classical",
  "Opera",

  "Electronic",
  "EDM",
  "House",
  "Techno",
  "Trance",
  "Dubstep",
  "Drum & Bass",
  "Ambient",

  "Reggae",
  "Dancehall",
  "Ska",

  "Folk",
  "Traditional",
  "Country",
  "Bluegrass",

  "Latin",
  "Afro",
  "Afrobeats",
  "Salsa",
  "Bachata",
  "Reggaeton",

  "Gospel",
  "Worship",

  "Soundtrack",
  "Cinematic",
  "Experimental",
];

export default function CreateProfileGenresScreen() {
  const router = useRouter();
  const { data, update } = useCreateProfile();

  const selected = data.genres ?? [];

  const toggleGenre = (genre: string) => {
    if (selected.includes(genre)) {
      update({
        genres: selected.filter((g) => g !== genre),
      });
      return;
    }

    if (selected.length >= MAX_GENRES) return;

    update({
      genres: [...selected, genre],
    });
  };

  const canContinue = selected.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <StepIndicator />

        <Text style={styles.title}>What genre(s) do you play?</Text>
        <Text style={styles.subtitle}>
          Select up to {MAX_GENRES} genres
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {GENRES.map((genre) => (
              <SelectablePill
                key={genre}
                label={genre}
                selected={selected.includes(genre)}
                onPress={() => toggleGenre(genre)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          title="Next"
          disabled={!canContinue}
          onPress={() => {
            router.push("/create-profile/objectives");
          }}
        />
      </View>
    </SafeAreaView>
  );
}


function StepIndicator() {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
        Step {CURRENT_STEP} of {TOTAL_STEPS}
      </Text>

      <View
        style={{
          height: 3,
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: 2,
          marginTop: 8,
        }}
      >
        <View
          style={{
            width: `${(CURRENT_STEP / TOTAL_STEPS) * 100}%`,
            height: "100%",
            backgroundColor: "#6D5DF6",
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}
