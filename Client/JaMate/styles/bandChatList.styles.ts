import { StyleSheet } from "react-native";

export const bandChatsListStyles = StyleSheet.create({
  emptyContainer: {
    paddingTop: 60,
    alignItems: "center",
  },

  emptyText: {
    color: "#9CA3AF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  avatarsWrapper: {
    width: 52,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: "absolute",
    borderWidth: 1,
    borderColor: "#0B0E13",
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 2,
  },

  badge: {
    backgroundColor: "#FF375F",
    borderRadius: 12,
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
