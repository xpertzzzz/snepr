import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { DestructiveConfirmModal } from "@/components/ui/destructive-confirm-modal";

export interface BulkActionOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
  isDestructive?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  onExecute: () => Promise<void> | void;
}

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkActionOption[];
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  actions,
}: BulkActionBarProps) {
  const [activeConfirmAction, setActiveConfirmAction] = useState<BulkActionOption | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  if (selectedCount === 0) return null;

  const handleActionClick = async (action: BulkActionOption) => {
    if (action.isDestructive) {
      setActiveConfirmAction(action);
    } else {
      setIsExecuting(true);
      try {
        await action.onExecute();
      } finally {
        setIsExecuting(false);
      }
    }
  };

  const handleConfirmExecute = async () => {
    if (!activeConfirmAction) return;
    setIsExecuting(true);
    try {
      await activeConfirmAction.onExecute();
      setActiveConfirmAction(null);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1C1613] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#3D3028] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-2 pr-3 border-r border-[#3D3028]">
          <span className="w-6 h-6 rounded-full bg-[#7A4B29] text-white flex items-center justify-center text-xs font-bold">
            {selectedCount}
          </span>
          <span className="text-xs font-medium text-[#D8CEBF]">
            {selectedCount === 1 ? "item selected" : "items selected"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actions.map((act) => (
            <Button
              key={act.id}
              size="sm"
              variant={act.variant === "destructive" ? "destructive" : "outline"}
              onClick={() => handleActionClick(act)}
              disabled={isExecuting}
              className={`text-xs rounded-xl h-8 px-3 inline-flex items-center gap-1.5 cursor-pointer ${
                act.variant === "destructive"
                  ? "bg-rose-600 hover:bg-rose-700 text-white border-transparent"
                  : "bg-[#2A211D] hover:bg-[#3D3028] text-white border-[#4A3C34]"
              }`}
            >
              {act.icon}
              {act.label}
            </Button>
          ))}
        </div>

        <button
          onClick={onClearSelection}
          className="text-[#A89C8F] hover:text-white p-1 rounded-lg hover:bg-[#2A211D] transition-colors cursor-pointer ml-1"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {activeConfirmAction && (
        <DestructiveConfirmModal
          open={Boolean(activeConfirmAction)}
          onOpenChange={(open) => !open && setActiveConfirmAction(null)}
          title={activeConfirmAction.confirmTitle || `Perform action on ${selectedCount} items?`}
          description={
            activeConfirmAction.confirmDescription ||
            `This bulk action will apply to all ${selectedCount} selected records.`
          }
          onConfirm={handleConfirmExecute}
          confirmButtonLabel={`Execute on ${selectedCount} items`}
        />
      )}
    </>
  );
}

