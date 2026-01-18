import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";

import { Spinner } from "../../components/ui/Spinner";
import { useMatches } from "../../hooks/matches/useMatches";
import { matchesStyles as styles } from "../../styles/matches.styles";
import { buildImageUrl } from "../../utils/media";

import { BandSuggestionsDeck } from "../../components/bands/BandSuggestionsDeck";

/* ------------------ TYPES ------------------ */

type MatchMedia = {
  id: number;
  type: "image" | "video";
  url: string;
  order: number;
};

type MatchItem = {
  match_id: number;
  conversation_id?: number | null;
  matched_at: string;
  profile: {
    id: number;
    name: string;
    username: string | null;
    media: MatchMedia[];
  };
};

/* ------------------ COMPONENT ------------------ */

export default function Matches() {
  const { data: matches, isLoading } = useMatches();

  const [tab, setTab] = useState<"matches" | "bands">("matches");
  const [search, setSearch] = useState("");

  /* ------------------ LOADING ------------------ */
  if (isLoading) {
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

  const safeMatches = (matches ?? []) as MatchItem[];

  /* ------------------ SEARCH FILTER ------------------ */

  const filteredMatches = useMemo(() => {
    if (!search.trim()) return safeMatches;

    const q = search.toLowerCase();
    return safeMatches.filter((m) =>
      m.profile.name.toLowerCase().includes(q)
    );
  }, [safeMatches, search]);

  /* ------------------ RENDER ------------------ */

  return (
    <SafeAreaView style={styles.screen}>
      {/* ------------------ TABS ------------------ */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("matches")}>
          <Text style={[styles.tabText, tab === "matches" && styles.tabActive]}>
            My Matches
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("bands")}>
          <Text style={[styles.tabText, tab === "bands" && styles.tabActive]}>
            Band Suggestions
          </Text>
        </TouchableOpacity>
      </View>

      {/* ------------------ SEARCH (MATCHES ONLY) ------------------ */}
      {tab === "matches" && (
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search profile…"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Ionicons name="search" size={18} color="#aaa" />
        </View>
      )}

      {/* ------------------ CONTENT ------------------ */}
      {tab === "matches" ? (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.match_id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const avatarPath = item.profile.media
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .find((m) => m.type === "image")?.url;

            const avatarUrl = buildImageUrl(avatarPath);

            return (
              <View style={styles.card}>
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
                  <Text style={styles.name}>{item.profile.name}</Text>
                  <Text style={styles.sub}>
                    {item.profile.name} wants to jam
                  </Text>
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => {
                      if (!item.conversation_id) return;
                      router.push({
                        pathname: "/chat/[id]",
                        params: { id: String(item.conversation_id) },
                      } as unknown as Href);
                    }}
                  >
                    <Text style={styles.chatText}>Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() => {
                      router.push({
                        pathname: "/profile/[id]",
                        params: { id: String(item.profile.id) },
                      } as unknown as Href);
                    }}
                  >
                    <Text style={styles.profileText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ paddingTop: 60, alignItems: "center" }}>
              <Text style={{ color: "#9CA3AF" }}>
                No matches found 🎵
              </Text>
            </View>
          }
        />
      ) : (
        <BandSuggestionsDeck />
      )}
    </SafeAreaView>
  );
}
