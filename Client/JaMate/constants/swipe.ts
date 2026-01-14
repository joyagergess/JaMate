import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const SWIPE_THRESHOLD = width * 0.25;
export const SWIPE_OUT_DURATION = 220;
export const ROTATION_RANGE = 15; 
