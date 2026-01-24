import { StyleSheet } from "react-native";

export const uiPrimitivesStyles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },

  label: {
    color: "#9CA3AF",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
    color: "#FFFFFF",
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  rowWrap: {
    flexWrap: "wrap",
  },

  segment: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },

  segmentSelected: {
    backgroundColor: "#6D5DF6",
    borderColor: "#6D5DF6",
  },

  segmentUnselected: {
    backgroundColor: "transparent",
    borderColor: "#374151",
  },

  segmentText: {
    fontWeight: "600",
  },

  segmentTextSelected: {
    color: "#FFFFFF",
  },

  segmentTextUnselected: {
    color: "#E5E7EB",
  },
});
