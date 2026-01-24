import { StyleSheet } from "react-native";

export const videoPreviewModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  close: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 20,
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#000",
  },
});
