import { View, Text, StyleSheet } from "react-native";

type Props = {
  current: number;
  min: number;
};

export function MediaProgressFooter({ current,min }: Props) {
  const progress = Math.min(current / min, 1);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {current}/6
          </Text>
        </View>

        <Text style={styles.helper}>
          Hey! Let's add {min} to start. We recommend high quality videos.
        </Text>
      </View>

      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  counter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#6D5DF6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  counterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  helper: {
    flex: 1,
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 18,
  },

  bar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#6D5DF6",
    borderRadius: 999,
  },
});
