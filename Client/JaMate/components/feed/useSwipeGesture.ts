import { useRef } from "react";
import { Animated, PanResponder, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_OUT = width * 1.2;

type Params = {
  position: Animated.ValueXY;
  dropZoneY: number;
  onHover: (dir: "skip" | "jam" | null) => void;
  onRelease: (dir: "skip" | "jam" | null) => void;
};

export function useSwipeGesture({
  position,
  dropZoneY,
  onHover,
  onRelease,
}: Params) {
  const hoveredRef = useRef<"skip" | "jam" | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5,

      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });

        if (g.moveY > dropZoneY) {
          const dir = g.moveX < width / 2 ? "skip" : "jam";
          hoveredRef.current = dir;
          onHover(dir);
        } else {
          hoveredRef.current = null;
          onHover(null);
        }
      },

      onPanResponderRelease: () => {
        onRelease(hoveredRef.current);
        hoveredRef.current = null;
      },
    }),
  ).current;

  return panResponder;
}
