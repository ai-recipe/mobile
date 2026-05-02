import React, { useEffect, useState } from "react";
import { Image, ImageProps, useColorScheme, View } from "react-native";

const PLACEHOLDER = require("@/assets/images/food_placeholder.jpg");

// Persists across mounts for the app session — no skeleton flash on re-mount
const loadedUris = new Set<string>();

type SmartImageProps = Omit<ImageProps, "source"> & {
  uri?: string | null;
};

export function SmartImage({
  uri,
  style,
  resizeMode = "cover",
  ...props
}: SmartImageProps) {
  const [loading, setLoading] = useState(() => !!uri && !loadedUris.has(uri));
  const [error, setError] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!uri) {
      setLoading(false);
      setError(false);
    } else if (loadedUris.has(uri)) {
      setLoading(false);
      setError(false);
    } else {
      setLoading(true);
      setError(false);
    }
  }, [uri]);

  const source = error || !uri ? PLACEHOLDER : { uri };
  const skeletonColor = colorScheme === "dark" ? "#3f3f46" : "#e4e4e7";

  return (
    <>
      <Image
        {...props}
        source={source}
        resizeMode={resizeMode}
        style={[{ width: "100%", height: "100%" }, style]}
        onLoadStart={() => {
          if (uri && !loadedUris.has(uri)) setLoading(true);
        }}
        onLoadEnd={() => {
          if (uri) loadedUris.add(uri);
          setLoading(false);
        }}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: skeletonColor,
          }}
        />
      )}
    </>
  );
}
