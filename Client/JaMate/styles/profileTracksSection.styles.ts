import { StyleSheet } from "react-native";

export const profileTracksSectionStyles = StyleSheet.create({
  loading: {
    paddingVertical: 40,
  },

  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },

  emptyContainer: {
    paddingHorizontal: 20,
  },

  emptyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },

  list: {
    paddingHorizontal: 20,
    gap: 12,
  },

  filterButton: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    borderWidth: 1,
  },

  filterButtonActive: {
    backgroundColor: "rgba(109,93,246,0.2)",
    borderColor: "#6D5DF6",
  },

  filterButtonInactive: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.1)",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#6D5DF6",
  },

  filterTextInactive: {
    color: "#9CA3AF",
  },
});
