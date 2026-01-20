import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { ProfileInfoSection } from "./ProfileInfoSection";
import { ProfileMediaSection } from "./ProfileMediaSection";
import { ProfileTracksSection } from "./ProfileTracksSection";
import { ProfileMedia } from "../../hooks/profile/useProfileMedia";

const tabs = ["Infos", "Tracks", "Media"] as const;

type Props = {
  profile: any;
  media: ProfileMedia[];
  onMediaUploaded?: () => void;
  readOnly?: boolean;
};

export function ProfileTabs({
  profile,
  media,
  onMediaUploaded,
  readOnly,
}: Props) {
  const [active, setActive] =
    useState<(typeof tabs)[number]>("Infos");

  return (
    <View style={{ marginTop: 32 }}>
      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActive(tab)}
          >
            <Text
              style={{
                color:
                  active === tab ? "#6D5DF6" : "#9CA3AF",
                fontWeight: "600",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        {active === "Infos" && (
          <ProfileInfoSection profile={profile} />
        )}

        {active === "Tracks" && (
          <ProfileTracksSection
            readOnly={readOnly}
          />
        )}

        {active === "Media" && (
          <ProfileMediaSection
            media={media}
            onUploaded={onMediaUploaded}
            readOnly={readOnly}
          />
        )}
      </View>
    </View>
  );
}
