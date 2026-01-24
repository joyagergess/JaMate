import { StyleSheet } from "react-native";

export const jamAnalyzeModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },

  modal: {
    backgroundColor: "#0B0E13",
    borderRadius: 16,
    padding: 16,
    maxHeight: "85%",
  },

  title: {
    color: "#7C7CFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  scoreText: {
    color: "#E5E7EB",
    marginBottom: 4,
  },

  scoreValue: {
    fontWeight: "700",
  },

  mutedText: {
    color: "#9CA3AF",
  },

  sectionTitle: {
    color: "#A5B4FC",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },

  suggestionText: {
    color: "#E5E7EB",
    marginBottom: 4,
  },

  suggestionDescription: {
    color: "#9CA3AF",
    marginTop: 6,
  },

  comparisonTitle: {
    color: "#A5B4FC",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },

  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  comparisonColumn: {
    width: "48%",
  },

  trackTitle: {
    color: "#7C7CFF",
    fontWeight: "700",
    marginBottom: 4,
  },

  trackText: {
    color: "#E5E7EB",
  },

  whyTitle: {
    color: "#A5B4FC",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
  },

  whyText: {
    color: "#E5E7EB",
    marginTop: 4,
  },

  closeButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
  },

  closeText: {
    color: "#7C7CFF",
    fontWeight: "600",
  },
});
