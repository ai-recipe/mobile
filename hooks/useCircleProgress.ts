import { useEffect } from "react";
import {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from "react-native-reanimated";

export type UseCircleProgressOptions = {
  /** Radius of the circle (default: 40) */
  radius?: number;
  /** Animation duration in ms (default: 1000) */
  duration?: number;
  /** Clamp progress to max (default: 100). Set to null to allow > 100% display */
  maxPercentage?: number | null;
};

/**
 * Hook for animated circular progress (e.g. ring charts).
 * Returns animated props and circumference for use with SVG strokeDasharray/strokeDashoffset.
 */
export function useCircleProgress(
  progressPercentage: number,
  options: UseCircleProgressOptions = {}
) {
  const {
    radius = 40,
    duration = 1000,
    maxPercentage = 100,
  } = options;

  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    const target =
      maxPercentage != null
        ? Math.min(progressPercentage, maxPercentage)
        : progressPercentage;
    progress.value = withTiming(target, {
      duration,
    } as WithTimingConfig);
  }, [progressPercentage, duration, maxPercentage, progress]);

  const animatedCircleProps = useAnimatedProps(() => {
    const value = maxPercentage != null ? Math.min(progress.value, maxPercentage) : progress.value;
    return {
      strokeDashoffset: circumference - (value / 100) * circumference,
    };
  });

  return {
    animatedCircleProps,
    circumference,
    radius,
  };
}
