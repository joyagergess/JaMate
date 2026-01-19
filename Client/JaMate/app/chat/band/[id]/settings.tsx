import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";

import { useConversations } from "../../../../hooks/messages/useConversations";
import { useRenameConversation } from "../../../../hooks/messages/useRenameConversation";
import { buildImageUrl } from "../../../../utils/media";
import { Spinner } from "../../../../components/ui/Spinner";

/* ------------------ SCREEN ------------------ */

export default function BandSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);

  const { data: conversations, isLoading } = useConversations();
  const rename = useRenameConversation(conversationId);

  const conversation = useMemo(
    () => conversations?.find((c) => c.id === conversationId),
    [conversations, conversationId]
  );

  const members = conversation?.participants.map((p) => p.profile) ?? [];

  const [showRename, setShowRename] = useState(false);
  const [name, setName] = useState(conversation?.name ?? "");

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0E13" }}>
      {/* HEADER */}
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
          Band info
        </Text>
      </View>

      {/* BAND NAME */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#9CA3AF", fontSize: 13 }}>
          Band name
        </Text>

        <TouchableOpacity
          onPress={() => {
            setName(conversation.name ?? "");
            setShowRename(true);
          }}
          style={{
            marginTop: 6,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {conversation.name || "Band chat"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MEMBERS */}
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 10 }}>
          Members · {members.length}
        </Text>

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
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                  }}
                >
                  <Image
                    source={
                      avatarUrl
                        ? { uri: avatarUrl }
                        : require("../../../../assets/images/unknow.jpg")
                    }
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 12,
                    }}
                  />

                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* LEAVE BAND */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          paddingVertical: 14,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#F87171",
            fontSize: 15,
            fontWeight: "600",
          }}
        >
          Leave band
        </Text>
      </TouchableOpacity>

      {/* RENAME MODAL */}
      <Modal transparent visible={showRename} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#111827",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              Rename band
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Band name"
              placeholderTextColor="#6B7280"
              style={{
                backgroundColor: "#0B0E13",
                color: "#fff",
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setShowRename(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: "#9CA3AF" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!name.trim()) return;

                  rename.mutate(name.trim(), {
                    onSuccess: () => setShowRename(false),
                  });
                }}
              >
                <Text style={{ color: "#16C784", fontWeight: "700" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
