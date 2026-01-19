import { Animated } from "react-native";
import { useEffect, useRef } from "react";

type SpinnerProps = {
  size?: number;
  color?: string;
  trackColor?: string;
  duration?: number;
};

export function Spinner({
  size = 36,
  color = "#fff",
  trackColor = "rgba(255,255,255,0.25)",
  duration = 900,
}: SpinnerProps) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => loop.stop();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 10,
        borderColor: trackColor,
        borderTopColor: color,
        transform: [{ rotate: spin }],
      }}
    />
  );
}
