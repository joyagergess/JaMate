import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },

  content: {
    paddingBottom: 160,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0E13",
  },

  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 50,
  },
});
