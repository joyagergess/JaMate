import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Spinner } from "../../components/ui/Spinner";

import { useConversations } from "../../hooks/messages/useConversations";
import { useProfile } from "../../hooks/profile/useProfile";
import { messagesStyles as styles } from "../../styles/messages.styles";
import { BandChatsList } from "../../components/messages/BandChatsList";
import { DirectChatsList } from "../../components/messages/DirectChatsList";

export default function Messages() {
  const { data: conversations, isLoading } = useConversations();
  const { data: me } = useProfile();

  const [tab, setTab] = useState<"direct" | "band">("direct");
  const [search, setSearch] = useState("");

  if (isLoading || !me) {
    return (
      <SafeAreaView
        style={[
          styles.loading,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Spinner size={40} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("direct")}>
          <Text style={[styles.tabText, tab === "direct" && styles.tabActive]}>
            Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("band")}>
          <Text style={[styles.tabText, tab === "band" && styles.tabActive]}>
            Band chats
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search…"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Ionicons name="search" size={18} color="#aaa" />
      </View>

      {tab === "band" ? (
        <BandChatsList conversations={conversations ?? []} />
      ) : (
        <DirectChatsList
          conversations={conversations ?? []}
          me={me}
          search={search}
        />
      )}
    </SafeAreaView>
  );
}
