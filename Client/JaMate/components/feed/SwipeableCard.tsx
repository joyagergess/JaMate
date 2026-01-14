import { Animated } from "react-native";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  panHandlers: any;
  cardStyle: any;
};

export function SwipeableCard({
  children,
  panHandlers,
  cardStyle,
}: Props) {
  return (
    <Animated.View
      {...panHandlers}
      style={[{ flex: 1 }, cardStyle]}
    >
      {children}
    </Animated.View>
  );
}
