import { StyleSheet } from "react-native";

export const bandSuggestionsListStyles = StyleSheet.create({
  loadingContainer: {
    paddingTop: 60,
    alignItems: "center",
  },

  emptyText: {
    color: "#9CA3AF",
  },

  listContent: {
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#111827",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 14,
  },

  avatarsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    color: "#9CA3AF",
    marginTop: 4,
  },

  statusBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "space-between",
  },

  declineButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#1F2937",
  },

  declineText: {
    color: "#F87171",
    fontWeight: "600",
  },

  acceptButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#6C63FF",
  },

  acceptText: {
    color: "#000",
    fontWeight: "700",
  },
});
