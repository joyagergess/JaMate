import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useConversations } from "../../hooks/messages/useConversations";
import { useProfile } from "../../hooks/profile/useProfile";
import { messagesStyles as styles } from "../../styles/messages.styles";
import { buildImageUrl } from "../../utils/media";

export default function Messages() {
  const { data: conversations, isLoading } = useConversations();
  const { data: me } = useProfile();

  const [tab, setTab] = useState<"direct" | "band">("direct");
  const [search, setSearch] = useState("");

  /* ------------------ LOADING ------------------ */

  if (isLoading || !me) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ color: "#fff" }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  /* ------------------ FILTER ------------------ */

  const filtered = useMemo(() => {
    return (conversations ?? []).filter((c) => {
      if (tab === "band" && c.type !== "band") return false;
      if (tab === "direct" && c.type !== "direct") return false;

      const other = c.participants
        .map((p) => p.profile)
        .find((p) => p.id !== me.id);

      if (!other) return false;

      return other.name
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [conversations, tab, search, me.id]);

  /* ------------------ RENDER ------------------ */

  return (
    <SafeAreaView style={styles.screen}>
      {/* ------------------ TABS ------------------ */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("direct")}>
          <Text
            style={[
              styles.tabText,
              tab === "direct" && styles.tabActive,
            ]}
          >
            Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("band")}>
          <Text
            style={[
              styles.tabText,
              tab === "band" && styles.tabActive,
            ]}
          >
            Band chats
          </Text>
        </TouchableOpacity>
      </View>

      {/* ------------------ SEARCH ------------------ */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="search profile.."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Ionicons name="search" size={18} color="#aaa" />
      </View>

      {/* ------------------ LIST ------------------ */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const otherProfile = item.participants
            .map((p) => p.profile)
            .find((p) => p.id !== me.id);

          if (!otherProfile) return null;

          // ✅ SAME AVATAR LOGIC AS MATCHES
          const avatarPath =
            otherProfile.media
              ?.slice()
              .sort(
                (a, b) => a.order_index - b.order_index
              )
              .find((m) => m.media_type === "image")
              ?.media_url ?? null;

          const avatarUrl = buildImageUrl(avatarPath);
          const lastMessage = item.messages[0];

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/chat/[id]",
                  params: { id: item.id },
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.row}>
                {/* AVATAR */}
                <Image
                  source={
                    avatarUrl
                      ? { uri: avatarUrl }
                      : require("../../assets/images/unknow.jpg")
                  }
                  style={styles.avatar}
                />

                {/* INFO */}
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {otherProfile.name}
                  </Text>

                  <Text
                    style={styles.message}
                    numberOfLines={1}
                  >
                    {lastMessage?.body ??
                      "No messages yet"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ paddingTop: 60, alignItems: "center" }}>
            <Text style={{ color: "#9CA3AF" }}>
              {tab === "direct"
                ? "No chats yet 💬"
                : "No band chats yet 🎸"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
