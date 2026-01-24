import { View, Text } from "react-native";
import { calculateAge } from "../../utils/date";
import {
  profileInfoSectionStyles as styles,
} from "../../styles/profileInfoSection.styles";

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
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
    <View style={styles.container}>
      <InfoRowInline label="Name" value={profile.name} />

      {age !== null && (
        <InfoRowInline label="Age" value={`${age}`} />
      )}

      {profile.gender && (
        <InfoRowInline
          label="Gender"
          value={profile.gender}
        />
      )}

      {profile.experience_level && (
        <InfoRowInline
          label="Experience level"
          value={profile.experience_level}
        />
      )}

      {profile.location && (
        <InfoRowInline
          label="Location"
          value={profile.location}
        />
      )}

      <InfoChipsInline
        label="Genres"
        items={profile.genres}
      />
      <InfoChipsInline
        label="Objectives"
        items={profile.objectives}
      />
      <InfoChipsInline
        label="Instruments"
        items={profile.instruments}
      />
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
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
    <View style={styles.chipsRow}>
      <Text style={styles.chipsLabel}>{label}</Text>

      <View style={styles.chipsContainer}>
        {items.map((i) => (
          <Chip key={i.id} label={i.name} />
        ))}
      </View>
    </View>
  );
}
