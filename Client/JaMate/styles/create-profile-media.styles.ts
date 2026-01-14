import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 20;
const COLUMNS = 2;
const CARD_WIDTH = (width - GAP * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

export const mediaGridStyles = StyleSheet.create({
  slot: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  filled: {
    backgroundColor: "#000",
  },

  placeholder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#6D5DF6",
    borderStyle: "dashed",
  },

  plus: {
    position: "absolute",
    bottom: -14,
    right: -14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6D5DF6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  remove: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
