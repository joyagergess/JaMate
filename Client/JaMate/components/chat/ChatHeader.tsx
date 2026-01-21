import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { chatStyles as styles } from "@/styles/chat.styles";

type Props = {
  conversation: any;
  me: any;
};

export function ChatHeader({ conversation, me }: Props) {
  if (!conversation || !me) return null;

  const otherProfile = conversation.participants
    .map((p: any) => p.profile)
    .find((p: any) => p.id !== me.id);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.replace("/messages")}>
        <Ionicons name="chevron-back" size={24} color="#7C7CFF" />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          otherProfile &&
          router.push({
            pathname: "/profile/[id]",
            params: { id: otherProfile.id },
          })
        }
      >
        <Text style={styles.headerTitle}>
          {otherProfile?.name ?? "Chat"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.block}>Block</Text>
      </TouchableOpacity>
    </View>
  );
}
