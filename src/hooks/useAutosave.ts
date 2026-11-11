import { useState, useEffect, useRef, useCallback } from "react";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<any>;
  delay?: number;
  enabled?: boolean;
}

export function useAutosave<T>({
  data,
  onSave,
  delay = 500,
  enabled = true,
}: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialRender = useRef(true);
  const latestDataRef = useRef<T>(data);
  const isSavingRef = useRef(false);

  latestDataRef.current = data;

  const executeSave = useCallback(
    async (dataToSave: T) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      setStatus("saving");
      setErrorMessage(null);

      try {
        await onSave(dataToSave);
        setStatus("saved");
        setLastSaved(new Date());
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "Failed to autosave changes");
      } finally {
        isSavingRef.current = false;
      }
    },
    [onSave]
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!enabled) return;

    setStatus("idle");
    const timer = setTimeout(() => {
      executeSave(latestDataRef.current);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [data, delay, enabled, executeSave]);

  const retry = useCallback(() => {
    executeSave(latestDataRef.current);
  }, [executeSave]);

  return {
    status,
    lastSaved,
    errorMessage,
    retry,
  };
}

