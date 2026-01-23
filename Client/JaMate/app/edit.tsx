import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUpdateAvatar } from "../hooks/profile/useUpdateAvatar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useProfile } from "../hooks/profile/useProfile";
import { useUpdateProfile } from "../hooks/profile/useUpdateProfile";

import { SelectablePill } from "../components/ui/SelectablePill";
import { AppButton } from "../components/ui/AppButton";
import { SearchablePickerModal } from "../components/ui/SearchablePickerModal";
import { useProfileMedia } from "../hooks/profile/useProfileMedia";

import { ALL_GENRES } from "../constants/genres";
import { ALL_INSTRUMENTS } from "../constants/instruments";
import { orderBySelected } from "../utils/orderBySelected";

const EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Pro",
] as const;
const GENDERS = ["male", "female"] as const;

const MAX_GENRES = 3;
const MAX_OBJECTIVES = 3;

const OBJECTIVES = [
  "Jam sessions",
  "Live Gigs",
  "Production / Recording",
  "Song Writing",
  "Band",
  "Band members",
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const { mutate, isPending } = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { data: media } = useProfileMedia();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [gender, setGender] = useState<"male" | "female">("male");
  const [experience, setExperience] =
    useState<(typeof EXPERIENCE_LEVELS)[number]>("Beginner");

  const [genres, setGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);

  const [showGenres, setShowGenres] = useState(false);
  const [showInstruments, setShowInstruments] = useState(false);

  const orderedGenres = orderBySelected(ALL_GENRES, genres);
  const orderedInstruments = orderBySelected(ALL_INSTRUMENTS, instruments);

  useEffect(() => {
    if (!profile) return;

    setName(profile.name);
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setLocation(profile.location ?? "");
    setBirthDate(new Date(profile.birth_date));

    setGender(profile.gender);
    setExperience(
      (profile.experience_level.charAt(0).toUpperCase() +
        profile.experience_level.slice(1)) as any,
    );

    setGenres(profile.genres.map((g: any) => g.name));
    setInstruments(profile.instruments.map((i: any) => i.name));
    setObjectives(profile.objectives.map((o: any) => o.name));
    if (media && media.length > 0 && media[0]?.url) {
      setAvatarPreview(media[0].url);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!profile) return null;

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (res.canceled) return;

    const asset = res.assets[0];

    setAvatarPreview(asset.uri);

    updateAvatar.mutate({
      uri: asset.uri,
      mimeType: asset.mimeType ?? "image/jpeg",
    });
  };

  const onSave = () => {
    mutate(
      {
        name: name.trim(),
        username: username.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        gender,
        birth_date: birthDate.toISOString().split("T")[0],
        experience_level: experience.toLowerCase(),
        genres,
        objectives,
        instruments: instruments.map((name) => ({
          name,
          level: experience.toLowerCase(),
        })),
      },
      { onSuccess: () => router.push("/(tabs)/profile") },
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0E13" }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, backgroundColor: "#0B0E13" }}>
          <View style={{ padding: 24 }}>
            <Title>Edit Profile</Title>
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <TouchableOpacity onPress={pickAvatar}>
                <Image
                  source={
                    avatarPreview
                      ? { uri: avatarPreview }
                      : require("../assets/images/unknow.jpg")
                  }
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "#111827",
                  }}
                />
                <Text style={{ color: "#6D5DF6", marginTop: 10 }}>
                  Edit profile picture
                </Text>
              </TouchableOpacity>
            </View>

            <Label>Name</Label>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />

            <Label>Username</Label>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />

            <Label>Bio</Label>
            <Input
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about you"
              multiline
              style={{ height: 100 }}
            />

            <Label>Location</Label>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="City, country"
            />

            <Label>Birth date</Label>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={inputStyle}
            >
              <Text style={{ color: "#fff" }}>
                {birthDate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                maximumDate={new Date()}
                onChange={(_, d) => {
                  setShowDatePicker(false);
                  if (d) setBirthDate(d);
                }}
              />
            )}

            <Section title="Gender">
              <Row>
                {GENDERS.map((g) => (
                  <Segment
                    key={g}
                    label={g.charAt(0).toUpperCase() + g.slice(1)}
                    selected={gender === g}
                    onPress={() => setGender(g)}
                  />
                ))}
              </Row>
            </Section>

            <Section title="Experience level">
              <Row wrap>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <Segment
                    key={lvl}
                    label={lvl}
                    selected={experience === lvl}
                    onPress={() => setExperience(lvl)}
                  />
                ))}
              </Row>
            </Section>

            <Section title="Objectives (max 3)">
              <Row wrap>
                {OBJECTIVES.map((o) => (
                  <Segment
                    key={o}
                    label={o}
                    selected={objectives.includes(o)}
                    onPress={() =>
                      setObjectives(
                        objectives.includes(o)
                          ? objectives.filter((x) => x !== o)
                          : objectives.length < MAX_OBJECTIVES
                            ? [...objectives, o]
                            : objectives,
                      )
                    }
                  />
                ))}
              </Row>
            </Section>

            <Section title="Genres">
              <Row wrap>
                {orderedGenres.slice(0, 6).map((g) => (
                  <SelectablePill
                    key={g}
                    label={g}
                    selected={genres.includes(g)}
                    onPress={() =>
                      setGenres(
                        genres.includes(g)
                          ? genres.filter((x) => x !== g)
                          : genres.length < MAX_GENRES
                            ? [...genres, g]
                            : genres,
                      )
                    }
                  />
                ))}
                <SelectablePill
                  label="More"
                  selected={false}
                  onPress={() => setShowGenres(true)}
                />
              </Row>
            </Section>

            <Section title="Instruments">
              <Row wrap>
                {orderedInstruments.slice(0, 6).map((i) => (
                  <SelectablePill
                    key={i}
                    label={i}
                    selected={instruments.includes(i)}
                    onPress={() =>
                      setInstruments(
                        instruments.includes(i)
                          ? instruments.filter((x) => x !== i)
                          : [...instruments, i],
                      )
                    }
                  />
                ))}
                <SelectablePill
                  label="More"
                  selected={false}
                  onPress={() => setShowInstruments(true)}
                />
              </Row>
            </Section>

            <View style={{ marginTop: 40 }}>
              <AppButton
                title={isPending ? "Saving..." : "Save changes"}
                onPress={onSave}
                disabled={isPending}
              />
            </View>
          </View>
        </ScrollView>

        {/* ===== SEARCH MODALS ===== */}

        <SearchablePickerModal
          visible={showGenres}
          title="Select genres"
          items={ALL_GENRES}
          selected={genres}
          max={MAX_GENRES}
          onChange={setGenres}
          onClose={() => setShowGenres(false)}
        />

        <SearchablePickerModal
          visible={showInstruments}
          title="Select instruments"
          items={ALL_INSTRUMENTS}
          selected={instruments}
          onChange={setInstruments}
          onClose={() => setShowInstruments(false)}
        />
      </SafeAreaView>
    </>
  );
}

function Title({ children }: any) {
  return (
    <Text
      style={{
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 24,
      }}
    >
      {children}
    </Text>
  );
}

function Label({ children }: any) {
  return <Text style={{ color: "#9CA3AF", marginBottom: 6 }}>{children}</Text>;
}

const inputStyle = {
  backgroundColor: "#111827",
  padding: 14,
  borderRadius: 12,
  marginBottom: 18,
};
function Input(props: any) {
  return (
    <TextInput
      {...props}
      style={[inputStyle, { color: "#FFFFFF" }]}
      placeholderTextColor="#6B7280"
    />
  );
}

function Section({ title, children }: any) {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ color: "#fff", fontWeight: "600", marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ children, wrap }: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: 10,
      }}
    >
      {children}
    </View>
  );
}

function Segment({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: selected ? "#6D5DF6" : "transparent",
        borderWidth: 1,
        borderColor: selected ? "#6D5DF6" : "#374151",
      }}
    >
      <Text style={{ color: selected ? "#fff" : "#E5E7EB", fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
