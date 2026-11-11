import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DestructiveConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  consequences?: string[];
  confirmKeyword?: string; // If provided, user must type this exact string
  confirmButtonLabel?: string;
  onConfirm: () => Promise<void> | void;
  isHighImpact?: boolean;
}

export function DestructiveConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  consequences,
  confirmKeyword,
  confirmButtonLabel = "Delete permanently",
  onConfirm,
  isHighImpact = false,
}: DestructiveConfirmModalProps) {
  const [typedInput, setTypedInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const canConfirm = !confirmKeyword || typedInput.trim().toUpperCase() === confirmKeyword.toUpperCase();

  const handleExecute = async () => {
    if (!canConfirm || isProcessing) return;
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
      setTypedInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
      <DialogContent className="max-w-md bg-white border border-[#F0E6D8] rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-[#1C1613]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#786D65] leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {consequences && consequences.length > 0 && (
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 my-2 text-xs text-rose-900 space-y-1.5">
            <strong className="font-semibold block text-rose-950 mb-1">
              Please note the following irreversible consequences:
            </strong>
            <ul className="list-disc pl-4 space-y-1">
              {consequences.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {confirmKeyword && (
          <div className="space-y-2 my-2">
            <label className="text-xs font-medium text-[#4A3F35] block">
              To proceed, please type <strong className="text-rose-700 font-mono">{confirmKeyword}</strong> below:
            </label>
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={confirmKeyword}
              disabled={isProcessing}
              className="w-full px-3 py-2 text-sm border border-[#D5CABB] rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none uppercase font-mono"
            />
          </div>
        )}

        <DialogFooter className="flex gap-2.5 pt-4 border-t border-[#F2ECE3]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="rounded-full border-[#D8CEBF] text-[#4A3F35] hover:bg-[#F5EFE6] text-xs font-medium cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleExecute}
            disabled={!canConfirm || isProcessing}
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

