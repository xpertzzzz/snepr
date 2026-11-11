import React from "react";
import { AutosaveStatus } from "@/hooks/useAutosave";
import { Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface AutosaveBadgeProps {
  status: AutosaveStatus;
  lastSaved?: Date | null;
  onRetry?: () => void;
  className?: string;
}

export function AutosaveBadge({
  status,
  lastSaved,
  onRetry,
  className = "",
}: AutosaveBadgeProps) {
  if (status === "idle" && !lastSaved) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-medium transition-all ${className}`}>
      {status === "saving" && (
        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Loader2 className="w-3 h-3 animate-spin" />
          Saving changes...
        </span>
      )}

      {status === "saved" && (
        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <Check className="w-3 h-3 text-emerald-600" />
          Saved {lastSaved ? `at ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "just now"}
        </span>
      )}

      {status === "error" && (
        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Autosave failed
          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="ml-1 underline font-semibold flex items-center gap-0.5 hover:text-rose-800"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Retry
            </button>
          )}
        </span>
      )}

      {status === "idle" && lastSaved && (
        <span className="inline-flex items-center gap-1 text-[#786D65] text-[11px]">
          <Check className="w-2.5 h-2.5 text-emerald-600" />
          All changes saved
        </span>
      )}
    </div>
  );
}

