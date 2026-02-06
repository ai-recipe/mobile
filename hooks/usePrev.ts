import { useEffect, useRef } from "react";

export const usePrev = (value: any) => {
  const prevRef = useRef<any>(null);
  useEffect(() => {
    prevRef.current = value;
  }, [value]);
  return prevRef.current;
};
