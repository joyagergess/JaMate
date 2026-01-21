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
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.08)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActive(tab)}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  color: isActive ? "#6D5DF6" : "#9CA3AF",
                  fontWeight: "600",
                }}
              >
                {tab}
              </Text>

              {isActive && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    height: 2,
                    width: "60%",
                    backgroundColor: "#6D5DF6",
                    borderRadius: 2,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 24 }}>
        {active === "Infos" && (
          <ProfileInfoSection profile={profile} />
        )}

        {active === "Tracks" && (
          <ProfileTracksSection
            profileId={profile.id}
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
