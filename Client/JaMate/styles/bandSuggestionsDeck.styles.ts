import { StyleSheet } from "react-native";

export const bandSuggestionsDeckStyles = StyleSheet.create({
  loadingContainer: {
    paddingTop: 80,
    alignItems: "center",
  },

  loadingText: {
    color: "#9CA3AF",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 24,
    paddingBottom: 120,
  },

  cardWrapper: {
    marginBottom: 44,
  },

  helperText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 13,
  },

  openChatButton: {
    alignSelf: "center",
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6C63FF",
    backgroundColor: "rgba(22,199,132,0.08)",
  },

  openChatText: {
    color: "#6C63FF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 18,
    marginHorizontal: 32,
  },

  declineButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#1F2937",
    alignItems: "center",
  },

  declineText: {
    color: "#F87171",
  },

  acceptButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#6C63FF",
    alignItems: "center",
  },

  acceptText: {
    color: "#000",
    fontWeight: "800",
  },
});
