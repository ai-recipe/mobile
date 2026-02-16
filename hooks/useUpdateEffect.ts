import { useEffect, useRef } from "react";

const useUpdateEffect = (effect: () => void, deps: any[]) => {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      return effect();
    }
    ref.current = true;
  }, deps);
};

export default useUpdateEffect;
