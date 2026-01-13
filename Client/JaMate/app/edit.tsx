import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useProfile } from "../hooks/profile/useProfile";
import { useUpdateProfile } from "../hooks/profile/useUpdateProfile";

type Gender = "male" | "female";
type Experience = "beginner" | "intermediate" | "advanced" | "pro";

export default function EditProfileScreen() {
  const router = useRouter();

  const { data: profile, isLoading } = useProfile();
  const { mutate, isPending, isError } = useUpdateProfile();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  const [gender, setGender] = useState<Gender>("male");
  const [experience, setExperience] = useState<Experience>("beginner");

  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setName(profile.name);
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setLocation(profile.location ?? "");
    setGender(profile.gender);
    setExperience(profile.experience_level);
    setBirthDate(new Date(profile.birth_date));
  }, [profile]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!profile) return null;

  const onSave = () => {
    mutate(
      {
        name: name.trim(),
        username: username.trim() || null,
        bio: bio.trim() || null,
        location: location.trim(),
        gender,
        experience_level: experience,
        birth_date: birthDate.toISOString().split("T")[0],

        genres: profile.genres.map((g: { name: string }) => g.name),
        objectives: profile.objectives.map((o: { name: string }) => o.name),
        instruments: profile.instruments.map((i: { name: string }) => ({
          name: i.name,
          level: experience,
        })),
      },
      {
        onSuccess: () => router.back(),
        onError: (err: any) =>
          console.error("UPDATE PROFILE ERROR:", err.response?.data ?? err),
      }
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0B0E13" }}>
      <View style={{ padding: 24 }}>
        <Title>Edit Profile</Title>

        <Label>Name</Label>
        <Input value={name} onChangeText={setName} />

        <Label>Username</Label>
        <Input value={username} onChangeText={setUsername} />

        <Label>Bio</Label>
        <Input
          value={bio}
          onChangeText={setBio}
          multiline
          style={{ height: 100 }}
        />

        <Label>Location</Label>
        <Input value={location} onChangeText={setLocation} />

        {/* Gender */}
        <Label>Gender</Label>
        <PickerContainer>
          <Picker
            selectedValue={gender}
            onValueChange={(v: Gender) => setGender(v)}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </PickerContainer>

        {/* Experience */}
        <Label>Experience level</Label>
        <PickerContainer>
          <Picker
            selectedValue={experience}
            onValueChange={(v: Experience) => setExperience(v)}
          >
            <Picker.Item label="Beginner" value="beginner" />
            <Picker.Item label="Intermediate" value="intermediate" />
            <Picker.Item label="Advanced" value="advanced" />
            <Picker.Item label="Pro" value="pro" />
          </Picker>
        </PickerContainer>

        {/* Birth date */}
        <Label>Birth date</Label>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={dateButton}
        >
          <Text style={{ color: "#fff" }}>
            {birthDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBirthDate(selectedDate);
            }}
          />
        )}

        {/* Actions */}
        <View style={{ flexDirection: "row", marginTop: 32, gap: 12 }}>
          <ButtonSecondary label="Cancel" onPress={() => router.back()} />
          <ButtonPrimary
            label={isPending ? "Saving..." : "Save"}
            onPress={onSave}
            disabled={isPending}
          />
        </View>

        {isError && (
          <Text style={{ color: "#EF4444", marginTop: 16 }}>
            Failed to update profile.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

/* ---------- UI helpers ---------- */

function Title({ children }: { children: string }) {
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

function Label({ children }: { children: string }) {
  return <Text style={{ color: "#9CA3AF", marginBottom: 6 }}>{children}</Text>;
}

function Input(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#6B7280"
      style={{
        backgroundColor: "#111827",
        color: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 18,
      }}
    />
  );
}

function PickerContainer({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#111827",
        borderRadius: 12,
        marginBottom: 18,
      }}
    >
      {children}
    </View>
  );
}

function ButtonPrimary({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        backgroundColor: "#6D5DF6",
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: "center",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function ButtonSecondary({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: "#374151",
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#E5E7EB", fontWeight: "600" }}>{label}</Text>
    </TouchableOpacity>
  );
}

const dateButton = {
  backgroundColor: "#111827",
  paddingVertical: 14,
  paddingHorizontal: 14,
  borderRadius: 12,
  marginBottom: 18,
};
