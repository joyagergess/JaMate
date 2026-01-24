import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { useConversations } from "../../../../hooks/messages/useConversations";
import { buildImageUrl } from "../../../../utils/media";
import { Spinner } from "../../../../components/ui/Spinner";
import { styles } from "../../../../styles/BandMembersScreen.styles";

export default function BandMembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const { data: conversations, isLoading } = useConversations();

  const conversation = useMemo(
    () => conversations?.find((c) => c.id === conversationId),
    [conversations, conversationId]
  );

  if (isLoading || !conversation) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size={42} />
      </View>
    );
  }

  const members = conversation.participants.map((p) => p.profile);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Band members</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(m) => m.id.toString()}
        renderItem={({ item }) => {
          const avatarPath =
            item.media
              ?.slice()
              .sort((a, b) => a.order_index - b.order_index)
              .find((m) => m.media_type === "image")
              ?.media_url ?? null;

          const avatarUrl = avatarPath
            ? buildImageUrl(avatarPath)
            : null;

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/profile/[id]",
                  params: { id: item.id },
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.memberRow}>
                <Image
                  source={
                    avatarUrl
                      ? { uri: avatarUrl }
                      : require("../../../../assets/images/unknow.jpg")
                  }
                  style={styles.avatar}
                />

                <Text style={styles.memberName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
