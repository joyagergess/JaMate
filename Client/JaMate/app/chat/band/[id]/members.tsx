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
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0E13",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size={42} />
      </View>
    );
  }

  const members = conversation.participants.map((p) => p.profile);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0E13" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.06)",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "700",
            marginLeft: 12,
          }}
        >
          Band members
        </Text>
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.05)",
                }}
              >
                <Image
                  source={
                    avatarUrl
                      ? { uri: avatarUrl }
                      : require("../../../../assets/images/unknow.jpg")
                  }
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    marginRight: 12,
                  }}
                />

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
