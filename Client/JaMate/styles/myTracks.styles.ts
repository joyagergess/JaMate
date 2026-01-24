import { StyleSheet } from "react-native";

export const myTracksStyles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  emptyStateText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 40,
  },

  aiDoneOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  aiDoneCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },

  aiDoneTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  aiDoneText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },

  aiDoneAction: {
    marginTop: 16,
  },

  aiDoneActionText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
});
