import { StyleSheet } from "react-native";

export const trackComponentsStyles = StyleSheet.create({
  /* ========= TrackActionsMenu ========= */

  menuContainer: {
    position: "absolute",
    width: 200,
    backgroundColor: "#0B0E13",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },

  menuText: {
    color: "#E5E7EB",
    fontSize: 14,
  },

  menuDangerText: {
    color: "#EF4444",
    fontSize: 14,
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#1F2937",
  },

  /* ========= TrackListItem ========= */

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  keyBadge: {
    backgroundColor: "rgba(108,99,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  keyText: {
    color: "#6C63FF",
    fontSize: 11,
    fontWeight: "600",
  },

  progressBar: {
    height: 4,
    backgroundColor: "#1F2937",
    borderRadius: 999,
    marginTop: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
  },

  dateText: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 4,
  },

  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  aiButtonText: {
    color: "#6C63FF",
    fontSize: 11,
    fontWeight: "600",
  },

  menuTrigger: {
    padding: 6,
  },
});
