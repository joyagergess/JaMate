import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { ProfileInfoSection } from "./ProfileInfoSection";
import { ProfileMediaSection } from "./ProfileMediaSection";
import { ProfileMedia } from "../../hooks/profile/useProfileMedia";

const tabs = ["Infos", "Media"];

type Props = {
  profile: any;
  media?: ProfileMedia[];
};

export function ProfileTabs({ profile, media }: Props) {
  const [active, setActive] = useState<"Infos" | "Media">("Infos");

  return (
    <View style={{ marginTop: 32 }}>
      {/* Tab bar */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActive(tab as any)}>
            <Text
              style={{
                color: active === tab ? "#6D5DF6" : "#9CA3AF",
                fontWeight: "600",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        {active === "Infos" && <ProfileInfoSection profile={profile} />}
        {active === "Media" && <ProfileMediaSection media={media ?? []} />}
      </View>
    </View>
  );
}
