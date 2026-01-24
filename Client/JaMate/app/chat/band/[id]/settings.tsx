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
import { styles } from "../../../../styles/BandSettingsScreen.styles";

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
      <View style={styles.loadingContainer}>
        <Spinner size={42} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Band info</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Band name</Text>

        <TouchableOpacity
          onPress={() => {
            setName(conversation.name ?? "");
            setShowRename(true);
          }}
          style={styles.bandNameButton}
        >
          <Text style={styles.bandNameText}>
            {conversation.name || "Band chat"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.membersSection}>
        <Text style={styles.membersLabel}>
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
      </View>

      <TouchableOpacity style={styles.leaveButton}>
        <Text style={styles.leaveText}>Leave band</Text>
      </TouchableOpacity>

      <Modal transparent visible={showRename} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename band</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Band name"
              placeholderTextColor="#6B7280"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowRename(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!name.trim()) return;

                  rename.mutate(name.trim(), {
                    onSuccess: () => setShowRename(false),
                  });
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
