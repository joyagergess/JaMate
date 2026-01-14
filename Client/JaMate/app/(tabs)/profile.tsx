import { ScrollView, View, ActivityIndicator } from "react-native";

import { useProfile } from "../../hooks/profile/useProfile";
import { useProfileMedia } from "../../hooks/profile/useProfileMedia";

import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../components/profile/ProfileTabs";

export default function ProfileScreen() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const {
    data: media,
    isLoading: loadingMedia,
    refetch: refetchMedia,
  } = useProfileMedia();

  if (loadingProfile || loadingMedia) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0E13" }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ProfileHeader profile={profile} media={media} />

      <ProfileTabs
        profile={profile}
        media={media ?? []}
        onMediaUploaded={refetchMedia}
      />
    </ScrollView>
  );
}
