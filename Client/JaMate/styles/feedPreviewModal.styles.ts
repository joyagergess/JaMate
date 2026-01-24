import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const feedPreviewModalStyles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#000",
  },

  closeButton: {
    position: "absolute",
    right: 20,
    zIndex: 50,
  },

  media: {
    width,
    height,
  },

  navigationOverlay: {
    position: "absolute",
    inset: 0,
    flexDirection: "row",
    zIndex: 20,
  },

  navZone: {
    width: "50%",
    height: "100%",
  },

  progressContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    zIndex: 30,
  },

  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 3,
  },
});
