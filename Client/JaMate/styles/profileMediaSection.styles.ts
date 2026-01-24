import { StyleSheet } from "react-native";

export const profileMediaSectionStyles = StyleSheet.create({
  previewFeedButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
  },

  previewFeedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  loadingCard: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  videoOverlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  addCard: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#6D5DF6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  imageModal: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
