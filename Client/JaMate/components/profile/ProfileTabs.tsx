import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { ProfileInfoSection } from "./ProfileInfoSection";
import { ProfileMediaSection } from "./ProfileMediaSection";
import { ProfileTracksSection } from "./ProfileTracksSection";
import { ProfileMedia } from "../../hooks/profile/useProfileMedia";
import { profileTabsStyles as styles } from "../../styles/profileTabs.styles";

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
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActive(tab)}
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive
                    ? styles.tabTextActive
                    : styles.tabTextInactive,
                ]}
              >
                {tab}
              </Text>

              {isActive && (
                <View style={styles.indicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.content}>
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
