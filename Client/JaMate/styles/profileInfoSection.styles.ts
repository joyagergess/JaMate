import { StyleSheet } from "react-native";

export const LABEL_WIDTH = 150;
export const ROW_SPACING = 22;

export const profileInfoSectionStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ROW_SPACING,
  },

  label: {
    color: "#9CA3AF",
    width: LABEL_WIDTH,
  },

  value: {
    color: "#FFFFFF",
    flexShrink: 1,
  },

  chipsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: ROW_SPACING,
  },

  chipsLabel: {
    color: "#9CA3AF",
    width: LABEL_WIDTH,
    marginTop: 6,
  },

  chipsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
});
