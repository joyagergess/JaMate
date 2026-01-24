import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  PRIMARY: "#6D5DF6",
  WHITE: "#fff",
  MUTED: "#9CA3AF",
};

export const LAYOUT = {
  DROP_ZONE_Y: height - 160,
};

export const homeScreenStyles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    color: COLORS.WHITE,
    fontSize: 22,
    marginTop: 20,
  },

  emptySubtitle: {
    color: COLORS.MUTED,
    marginTop: 10,
  },

  matchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  matchTitle: {
    color: COLORS.WHITE,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },

  matchButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: "600",
  },

  actions: {
    position: "absolute",
    bottom: 12, 
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
     gap: 50,   
    paddingHorizontal: 24,
  },

  skipBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  jamBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  btnText: {
    color: COLORS.WHITE,
    fontWeight: "500",
  },

  btnTextBold: {
    color: COLORS.WHITE,
    fontWeight: "700",
  },
});
