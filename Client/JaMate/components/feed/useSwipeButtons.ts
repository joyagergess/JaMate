import { useRef } from "react";
import { Animated } from "react-native";

export function useSwipeButtons() {
  const skipScale = useRef(new Animated.Value(1)).current;
  const jamScale = useRef(new Animated.Value(1)).current;
  const skipOpacity = useRef(new Animated.Value(0.6)).current;
  const jamOpacity = useRef(new Animated.Value(0.6)).current;

  const animateButtons = (target: "skip" | "jam" | null) => {
    Animated.parallel([
      Animated.spring(skipScale, {
        toValue: target === "skip" ? 1.35 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(jamScale, {
        toValue: target === "jam" ? 1.35 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(skipOpacity, {
        toValue: target === "skip" ? 1 : 0.6,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(jamOpacity, {
        toValue: target === "jam" ? 1 : 0.6,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    skipScale,
    jamScale,
    skipOpacity,
    jamOpacity,
    animateButtons,
  };
}
