import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useCircleProgress } from "@/hooks/useCircleProgress";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type AnimatedCircleProgressProps = {
  /** Progress from 0 to 100 (or use current/goal to derive) */
  progress: number;
  /** SVG size (width/height) in px (default: 96) */
  size?: number;
  /** Circle radius in px (default: 40). Should be < size/2 - strokeWidth/2 */
  radius?: number;
  /** Stroke width in px (default: 8) */
  strokeWidth?: number;
  /** Background/track ring color */
  trackColor?: string;
  /** Progress ring color */
  progressColor?: string;
  /** Color when progress > 100 (default: same as progressColor) */
  exceedColor?: string;
  /** Animation duration in ms (default: 1000) */
  duration?: number;
  /** Clamp displayed progress to this max (default: 100). Set null to show > 100% */
  maxPercentage?: number | null;
  /** Rotate so progress starts from top; -90deg is common for 0 at top (default: true) */
  rotateFromTop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedCircleProgress({
  progress,
  size = 96,
  radius = 40,
  strokeWidth = 8,
  trackColor = "#f3f4f6",
  progressColor = "#f39849",
  exceedColor,
  duration = 1000,
  maxPercentage = 100,
  rotateFromTop = true,
  style,
}: AnimatedCircleProgressProps) {
  const { animatedCircleProps, circumference } = useCircleProgress(progress, {
    radius,
    duration,
    maxPercentage,
  });

  const cx = size / 2;
  const cy = size / 2;
  const stroke = progress > 100 && exceedColor != null ? exceedColor : progressColor;

  return (
    <Svg
      width={size}
      height={size}
      style={[
        rotateFromTop && { transform: [{ rotate: "-90deg" }] },
        style,
      ]}
    >
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        animatedProps={animatedCircleProps}
        strokeLinecap="round"
      />
    </Svg>
  );
}
