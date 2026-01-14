import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const CARD_HEIGHT = height * 0.72;
export const CARD_RADIUS = 28;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },
  objectivesText: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 6,
  },
skillLine: {
  color: "#cfcfcf",
  fontSize: 14,
  marginTop: 4,
},

metaText: {
  color: "#ccc",
  fontSize: 13,
},

collapsedInstruments: {
  color: "#ccc",
  fontSize: 16,
  fontWeight: "400",
},


  loading: {
    flex: 1,
    backgroundColor: "#0B0E13",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    marginHorizontal: 16,
    marginTop: 8,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  tapZones: {
    position: "absolute",
    inset: 0,
    flexDirection: "row",
  },

  tapZone: {
    flex: 1,
  },

  progressContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    gap: 6,
  },

  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 3,
  },

  /* INFO OVERLAY */

  infoWrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },

  blurBox: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.47)",
  },

  infoContent: {
    gap: 6,
  },

  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  age: {
    color: "#ccc",
    fontSize: 20,
    fontWeight: "500",
  },

  metaRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },

 
  instruments: {
    color: "#aaa",
    marginTop: 2,
  },

  /* GENRES */

  genresRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },

  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  genreText: {
    color: "#fff",
    fontSize: 12,
  },

  /* OBJECTIVES */

  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  chipText: {
    color: "#fff",
    fontSize: 12,
  },

  /* ACTIONS */

  actions: {
    marginTop: 18,
    marginHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  skipBtn: {
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  jamBtn: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#6D5DF6",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  btnText: {
    color: "#fff",
  },

  btnTextBold: {
    color: "#fff",
    fontWeight: "600",
  },
});
