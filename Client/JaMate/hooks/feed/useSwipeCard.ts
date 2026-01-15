import { useRef } from "react";
import { Animated, PanResponder } from "react-native";
import {
  SWIPE_THRESHOLD,
  SWIPE_OUT_DURATION,
  ROTATION_RANGE,
} from "../../constants/swipe";

type Direction = "skip" | "jam";

export function useSwipeCard(onSwipe: (direction: Direction) => void) {
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [
      `-${ROTATION_RANGE}deg`,
      "0deg",
      `${ROTATION_RANGE}deg`,
    ],
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const forceSwipe = (direction: Direction) => {
    const x = direction === "jam" ? 1000 : -1000;

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      onSwipe(direction);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("jam");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("skip");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    cardStyle,
    forceSwipe,
    position,
  };
}
