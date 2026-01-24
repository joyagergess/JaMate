import { StyleSheet } from "react-native";

export const profileTabsStyles = StyleSheet.create({
  container: {
    marginTop: 32,
  },

  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },

  tabText: {
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#6D5DF6",
  },

  tabTextInactive: {
    color: "#9CA3AF",
  },

  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: "60%",
    backgroundColor: "#6D5DF6",
    borderRadius: 2,
  },

  content: {
    marginTop: 24,
  },
});
