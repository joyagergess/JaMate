import { StyleSheet } from "react-native";

export const COLORS = {
  TAB_BG: "#0B0E13",
  ACTIVE: "#6C63FF",
  INACTIVE: "rgba(255,255,255,0.5)",
  DOT: "#FF375F",
};

export const SIZES = {
  ICON: 22,
  TAB_HEIGHT: 88,
};

export const tabsStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.TAB_BG,
    borderTopWidth: 0,
    height: SIZES.TAB_HEIGHT,
    paddingTop: 8,
    paddingBottom: 18,
  },

  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },

  iconWrapper: {
    position: "relative",
  },

  redDot: {
    position: "absolute",
    right: -6,
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.DOT,
  },
});
