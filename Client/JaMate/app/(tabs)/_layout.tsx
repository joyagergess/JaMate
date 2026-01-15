import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMatches } from "../../hooks/matches/useMatches";

const TAB_BG = "#0B0E13";
const ACTIVE = "#FFFFFF";
const INACTIVE = "rgba(255,255,255,0.5)";
const ICON_SIZE = 22;


export default function TabsLayout() {
    const { data: matches } = useMatches();
    const hasNewMatch = matches && matches.length > 0;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopWidth: 0,
          height: 68,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/home.png")}
              style={{
                width: 22,
                height: 22,
                tintColor: color,
                opacity: focused ? 1 : 0.6,
              }}
            />
          ),
        }}
      />

      
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons
                name="people-outline"
                size={size ?? 22}
                color={color}
              />
              {hasNewMatch && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#FF375F",
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      {/* Tracks */}
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

      {/* Messages */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-outline"
              size={size ?? ICON_SIZE}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
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
  );
}
