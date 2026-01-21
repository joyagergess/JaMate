import { View, Text } from "react-native";
import { calculateAge } from "../../utils/date";

const LABEL_WIDTH = 150;
const ROW_SPACING = 22; 

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
  const age = profile.birth_date
    ? calculateAge(profile.birth_date)
    : null;

  return (
    <View style={{ paddingHorizontal: 24 }}>
      <InfoRowInline label="Name" value={profile.name} />

      {age !== null && (
        <InfoRowInline label="Age" value={`${age}`} />
      )}

      {profile.gender && (
        <InfoRowInline label="Gender" value={profile.gender} />
      )}

      {profile.experience_level && (
        <InfoRowInline
          label="Experience level"
          value={profile.experience_level}
        />
      )}

      {profile.location && (
        <InfoRowInline label="Location" value={profile.location} />
      )}

      <InfoChipsInline label="Genres" items={profile.genres} />
      <InfoChipsInline label="Objectives" items={profile.objectives} />
      <InfoChipsInline label="Instruments" items={profile.instruments} />
    </View>
  );
}


function InfoRowInline({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: ROW_SPACING,
      }}
    >
      <Text
        style={{
          color: "#9CA3AF",
          width: LABEL_WIDTH,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "#fff",
          flexShrink: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}


function InfoChipsInline({
  label,
  items,
}: {
  label: string;
  items: { id: number; name: string }[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: ROW_SPACING,
      }}
    >
      <Text
        style={{
          color: "#9CA3AF",
          width: LABEL_WIDTH,
          marginTop: 6,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {items.map((i) => (
          <Chip key={i.id} label={i.name} />
        ))}
      </View>
    </View>
  );
}
