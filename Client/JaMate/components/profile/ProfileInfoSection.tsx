import { View, Text } from "react-native";
import { calculateAge } from "../../utils/date";

function Chip({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

type Profile = {
  name: string;
  birth_date?: string;
  gender?: string;
  experience_level?: string;
  location?: string | null;

  genres: { id: number; name: string }[];
  objectives: { id: number; name: string }[];
  instruments: { id: number; name: string }[];
};

export function ProfileInfoSection({ profile }: { profile: Profile }) {
  const age =
    profile.birth_date ? calculateAge(profile.birth_date) : null;

  return (
    <View style={{ paddingHorizontal: 24 }}>
      
      <InfoRow label="Name" value={profile.name} />

      {age !== null && (
        <InfoRow label="Age" value={`${age} `} />
      )}

      {profile.gender && (
        <InfoRow label="Gender" value={profile.gender} />
      )}

      {profile.experience_level && (
        <InfoRow
          label="Experience level"
          value={profile.experience_level}
        />
      )}

      {profile.location && (
        <InfoRow label="Location" value={profile.location} />
      )}

      <InfoChips label="Genres" items={profile.genres} />
      <InfoChips label="Objectives" items={profile.objectives} />
      <InfoChips label="Instruments" items={profile.instruments} />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: "#9CA3AF", marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color: "#fff" }}>{value}</Text>
    </View>
  );
}

function InfoChips({
  label,
  items,
}: {
  label: string;
  items: { id: number; name: string }[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#9CA3AF", marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {items.map((i) => (
          <Chip key={i.id} label={i.name} />
        ))}
      </View>
    </View>
  );
}
