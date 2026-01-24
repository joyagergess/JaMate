import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useConversations } from "../../hooks/messages/useConversations";
import { tabsStyles, COLORS, SIZES } from "../../styles/tabs.styles";

export default function TabsLayout() {
  const { data: conversations } = useConversations();
  const router = useRouter();

  const hasUnreadMessages =
    conversations?.some((c) => c.unread_count > 0) ?? false;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabsStyles.tabBar,
        tabBarActiveTintColor: COLORS.ACTIVE,
        tabBarInactiveTintColor: COLORS.INACTIVE,
        tabBarLabelStyle: tabsStyles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size ?? SIZES.ICON}
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
              size={size ?? SIZES.ICON}
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
              size={size ?? SIZES.ICON}
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
            <View style={tabsStyles.iconWrapper}>
              <Ionicons
                name="chatbubble-outline"
                size={size ?? SIZES.ICON}
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
              size={size ?? SIZES.ICON}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function RedDot() {
  return <View style={tabsStyles.redDot} />;
}
