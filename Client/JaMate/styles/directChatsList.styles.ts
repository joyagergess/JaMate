import { StyleSheet } from "react-native";

export const directChatsListStyles = StyleSheet.create({
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

  unreadRow: {
    backgroundColor: "rgba(108, 99, 255, 0.08)",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  nameUnread: {
    fontWeight: "700",
  },

  preview: {
    color: "#9CA3AF",
    fontWeight: "400",
    marginTop: 2,
  },

  previewUnread: {
    color: "#FFFFFF",
    fontWeight: "500",
  },

  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF375F",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
