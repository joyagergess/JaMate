import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { useConversations } from "../../hooks/messages/useConversations";
import { useAiBackingJob } from "../../hooks/tracks/useAiBackingJob";
import { AiReadyModal } from "../../components/tracks/AiReadyModal";
import { useAiBacking } from "@/context/AiBackingContext";

const TAB_BG = "#0B0E13";
const ACTIVE = "#6C63FF";
const INACTIVE = "rgba(255,255,255,0.5)";
const ICON_SIZE = 22;
const DOT_COLOR = "#FF375F";

export default function TabsLayout() {
  const { data: conversations } = useConversations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { jobId, setJobId } = useAiBacking();

  const { data: aiJob } = useAiBackingJob(jobId);
  const [aiReadyVisible, setAiReadyVisible] = useState(false);

  useEffect(() => {
    if (aiJob?.status === "done") {
      setAiReadyVisible(true);
      setJobId(null);

      queryClient.invalidateQueries({ queryKey: ["my-tracks"] });
    }
  }, [aiJob]);

  const hasUnreadMessages =
    conversations?.some((c) => c.unread_count > 0) ?? false;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: TAB_BG,
            borderTopWidth: 0,
            height: 88,
            paddingTop: 8,
            paddingBottom: 18,
          },
          tabBarActiveTintColor: ACTIVE,
          tabBarInactiveTintColor: INACTIVE,
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="home-outline"
                size={size ?? ICON_SIZE}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="matches"
          options={{
            title: "Matches",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="people-outline"
                size={size ?? ICON_SIZE}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="tracks"
          options={{
            title: "Tracks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="musical-notes-outline"
                size={size ?? ICON_SIZE}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons
                  name="chatbubble-outline"
                  size={size ?? ICON_SIZE}
                  color={color}
                />
                {hasUnreadMessages && <RedDot />}
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-outline"
                size={size ?? ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <AiReadyModal
        visible={aiReadyVisible}
        onClose={() => setAiReadyVisible(false)}
        onViewTrack={() => {
          setAiReadyVisible(false);
          router.push("/tracks?tab=ai");
        }}
      />
    </>
  );
}

function RedDot() {
  return (
    <View
      style={{
        position: "absolute",
        right: -6,
        top: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: DOT_COLOR,
      }}
    />
  );
}
