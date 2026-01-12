import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const GAP = 20;
const CARD_HEIGHT = height * 0.42;
export const mediaGridStyles = StyleSheet.create({
  slot: {
    flexBasis: "45%",
    maxWidth: "45%",
    height: CARD_HEIGHT,
    marginBottom: GAP,

    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#6D5DF6",
    borderStyle: "dashed",
    backgroundColor: "rgba(255,255,255,0.03)",

    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  filled: {
    borderStyle: "solid",
  },

  plus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6D5DF6",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 14,
  },

  remove: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
