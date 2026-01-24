import { StyleSheet } from "react-native";

export const trackBubbleStyles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  duration: {
    color: "#DDDDDD",
    fontSize: 12,
    marginTop: 4,
  },

  playButton: {
    marginTop: 8,
  },

  playText: {
    color: "#7C7CFF",
  },
});
