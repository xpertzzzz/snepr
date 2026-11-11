import { useRef, useCallback } from "react";

/**
 * Hook to throttle function invocations
 * @param callback The function to throttle
 * @param limitMs Throttle period in milliseconds (default: 500ms)
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limitMs: number = 500
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0);
  const callbackRef = useRef<T>(callback);

  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan.current >= limitMs) {
        callbackRef.current(...args);
        lastRan.current = now;
      }
    },
    [limitMs]
  );
}

/**
 * Standalone throttle helper
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

