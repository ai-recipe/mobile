import {
  CONFIDENCE_THRESHOLD,
  CONSECUTIVE_FRAME_THRESHOLD,
  FOOD_LABELS,
  formatFoodLabel,
} from "@/constants/food-labels";
import { useCallback, useEffect, useState } from "react";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useFrameProcessor } from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Worklets } from "react-native-worklets-core";

export type ScanStatus = "idle" | "searching" | "detecting" | "caught";

export interface DetectionResult {
  label: string;
  confidence: number;
}

interface UseFoodDetectionOptions {
  onCatch: (result: DetectionResult) => void;
  isActive: boolean;
}

/**
 * Core food detection hook that wraps TFLite model loading,
 * VisionCamera frame processor, and consecutive-frame tracking.
 *
 * Returns the frame processor to attach to <Camera>, plus
 * reactive state: detected label, confidence, scan status, model readiness.
 */
export function useFoodDetection({ onCatch, isActive }: UseFoodDetectionOptions) {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isModelReady, setIsModelReady] = useState(false);

  // Load the TFLite model
  const model = useTensorflowModel(
    require("../assets/models/food_model.tflite"),
  );
  const actualModel = model.state === "loaded" ? model.model : undefined;

  useEffect(() => {
    setIsModelReady(model.state === "loaded");
    if (model.state === "loaded" && actualModel) {
      console.log(
        `[MealScanner] Model loaded. Inputs: ${JSON.stringify(actualModel.inputs.map((t) => ({ name: t.name, shape: t.shape, type: t.dataType })))}`,
      );
      console.log(
        `[MealScanner] Outputs: ${JSON.stringify(actualModel.outputs.map((t) => ({ name: t.name, shape: t.shape, type: t.dataType })))}`,
      );
    }
    if (model.state === "error") {
      console.error("[MealScanner] Model load error:", model.error);
    }
  }, [model.state, actualModel]);

  // Resize plugin for frame preprocessing
  const { resize } = useResizePlugin();

  // Bridge functions from worklet -> JS thread
  const updateDetection = Worklets.createRunOnJS(
    (label: string, conf: number) => {
      setDetectedLabel(label);
      setConfidence(conf);
      setStatus("detecting");
    },
  );

  const updateSearching = Worklets.createRunOnJS(() => {
    setDetectedLabel(null);
    setConfidence(0);
    setStatus("searching");
  });

  const triggerCatch = Worklets.createRunOnJS(
    (label: string, conf: number) => {
      setStatus("caught");
      onCatch({ label, confidence: conf });
    },
  );

  // Frame processor - runs on the camera thread (worklet)
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      if (actualModel == null) return;

      // Resize frame to model input dimensions (224x224 RGB uint8)
      const resized = resize(frame, {
        scale: {
          width: 224,
          height: 224,
        },
        pixelFormat: "rgb",
        dataType: "uint8",
      });

      // Run inference
      const outputs = actualModel.runSync([resized]);

      // outputs[0] is the probability array for 101 food classes
      const probabilities = outputs[0];
      if (!probabilities || probabilities.length === 0) {
        updateSearching();
        return;
      }

      // Find the top prediction
      let maxIndex = 0;
      let maxProb = Number(probabilities[0] ?? 0);
      for (let i = 1; i < probabilities.length; i++) {
        const p = Number(probabilities[i] ?? 0);
        if (p > maxProb) {
          maxProb = p;
          maxIndex = i;
        }
      }

      // For int8 quantized models, output may be 0-255 -> normalize to 0-1
      const normalizedConfidence: number = maxProb > 1 ? maxProb / 255 : maxProb;

      if (
        normalizedConfidence >= CONFIDENCE_THRESHOLD &&
        maxIndex < FOOD_LABELS.length
      ) {
        const label = FOOD_LABELS[maxIndex] ?? "Unknown";
        updateDetection(label, normalizedConfidence);
      } else if (normalizedConfidence > 0.3) {
        // Something detected but below food threshold
        const label =
          maxIndex < FOOD_LABELS.length
            ? (FOOD_LABELS[maxIndex] ?? "Unknown")
            : "Unknown";
        updateDetection(label, normalizedConfidence);
      } else {
        updateSearching();
      }
    },
    [actualModel, resize],
  );

  // Reset state
  const reset = useCallback(() => {
    setStatus("idle");
    setDetectedLabel(null);
    setConfidence(0);
  }, []);

  // Update status when scanning starts/stops
  useEffect(() => {
    if (isActive && isModelReady) {
      setStatus("searching");
    } else if (!isActive && status !== "caught") {
      setStatus("idle");
    }
  }, [isActive, isModelReady]);

  return {
    frameProcessor,
    detectedLabel: detectedLabel ? formatFoodLabel(detectedLabel) : null,
    confidence,
    status,
    isModelReady,
    modelError: model.state === "error" ? model.error : null,
    reset,
  };
}

/**
 * Standalone hook for tracking consecutive detections.
 * Used inside the scanner screen to manage the 5-frame threshold
 * on the JS thread (since we get updates from the worklet).
 */
export function useConsecutiveDetection(options: {
  label: string | null;
  confidence: number;
  status: ScanStatus;
  onThresholdReached: (result: DetectionResult) => void;
}) {
  const [consecutiveCount, setConsecutiveCount] = useState(0);
  const [lastLabel, setLastLabel] = useState<string | null>(null);
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    if (options.status !== "detecting" || !options.label) {
      setConsecutiveCount(0);
      setLastLabel(null);
      return;
    }

    if (options.label === lastLabel && options.confidence >= CONFIDENCE_THRESHOLD) {
      const newCount = consecutiveCount + 1;
      setConsecutiveCount(newCount);

      if (newCount >= CONSECUTIVE_FRAME_THRESHOLD && !hasFired) {
        setHasFired(true);
        options.onThresholdReached({
          label: options.label,
          confidence: options.confidence,
        });
      }
    } else {
      setConsecutiveCount(options.label === lastLabel ? consecutiveCount : 1);
      setLastLabel(options.label);
    }
  }, [options.label, options.confidence, options.status]);

  const resetConsecutive = useCallback(() => {
    setConsecutiveCount(0);
    setLastLabel(null);
    setHasFired(false);
  }, []);

  return { consecutiveCount, resetConsecutive };
}
