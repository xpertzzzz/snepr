import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcuts = [
    { key: "⌘K / Ctrl+K", description: "Open Global Command Palette & Search" },
    { key: "/", description: "Quick focus search bar" },
    { key: "?", description: "Open Keyboard Shortcuts guide" },
    { key: "Esc", description: "Close any active modal, drawer, or palette" },
    { key: "⌘Enter / Ctrl+Enter", description: "Submit active form or queue action" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-[#FAF7F2] border border-[#E8E1D7] rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EBE3D7] flex items-center justify-center text-[#7A4B29]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#1C1613]">
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription className="text-xs text-[#786D65]">
                Navigate and control Snepr rapidly with keyboard shortcuts.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 bg-white rounded-xl border border-[#EEE7DC]"
            >
              <span className="text-xs text-[#4A3F35] font-medium">{sc.description}</span>
              <kbd className="px-2 py-1 text-[11px] font-mono font-semibold text-[#1C1613] bg-[#F5EFE6] border border-[#DDD4C7] rounded-md shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

