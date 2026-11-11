import React from "react";
import {
  Search,
  Users,
  WifiOff,
  ShieldAlert,
  Clock,
  Sparkles,
  BarChart2,
  CreditCard,
  AlertTriangle,
  Inbox,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type EmptyStateType =
  | "no_results"
  | "no_customers"
  | "no_queue"
  | "no_subscription"
  | "no_ai_history"
  | "no_analytics"
  | "network_error"
  | "permission_denied"
  | "session_expired"
  | "server_error"
  | "generic";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const DEFAULT_CONFIGS: Record<
  EmptyStateType,
  {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLabel?: string;
  }
> = {
  no_results: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search terms, removing filters, or searching for a different salon or service.",
    actionLabel: "Clear all filters",
  },
  no_customers: {
    icon: Users,
    title: "No customer records yet",
    description: "Customers who join your queue or book a walk-in token will automatically appear in your directory.",
    actionLabel: "Add walk-in customer",
  },
  no_queue: {
    icon: Clock,
    title: "Queue is currently empty",
    description: "No customers are waiting right now. Share your salon QR code or enter walk-in customers to begin queue tracking.",
    actionLabel: "Add walk-in token",
  },
  no_subscription: {
    icon: CreditCard,
    title: "No active subscription",
    description: "Upgrade your salon to unlock automated queue tracking, multi-chair operations, and AI Studio.",
    actionLabel: "View subscription plans",
  },
  no_ai_history: {
    icon: Sparkles,
    title: "No AI style previews yet",
    description: "Try Snepr Studio to preview modern hairstyles, beard trims, and styling recommendations.",
    actionLabel: "Try AI Studio",
  },
  no_analytics: {
    icon: BarChart2,
    title: "No analytics data recorded",
    description: "Once your salon begins calling tokens and completing haircuts, wait-time intelligence and retention reports will appear here.",
  },
  network_error: {
    icon: WifiOff,
    title: "Network connection lost",
    description: "Unable to connect to Snepr servers. Please check your internet connection and try again.",
    actionLabel: "Retry connection",
  },
  permission_denied: {
    icon: ShieldAlert,
    title: "Access restricted",
    description: "You do not have administrative permissions to view or modify this area.",
    actionLabel: "Return to dashboard",
  },
  session_expired: {
    icon: Clock,
    title: "Session expired",
    description: "For security, your login session has timed out. Please sign in again to continue.",
    actionLabel: "Sign in again",
  },
  server_error: {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "Our servers encountered an unexpected issue while processing this request. Our engineers have been alerted.",
    actionLabel: "Refresh page",
  },
  generic: {
    icon: Inbox,
    title: "No data available",
    description: "There are no records to display at this time.",
  },
};

export function EmptyState({
  type = "generic",
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  className = "",
}: EmptyStateProps) {
  const config = DEFAULT_CONFIGS[type] || DEFAULT_CONFIGS.generic;
  const IconComponent = config.icon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel !== undefined ? actionLabel : config.actionLabel;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-[#EEE7DC] bg-[#FFFDF9] my-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F5EFE6] border border-[#E8DFD3] flex items-center justify-center mb-4 text-[#7A4B29] shadow-sm">
        {icon ? icon : <IconComponent className="w-7 h-7" />}
      </div>

      <h3 className="text-lg font-semibold text-[#1F1C18] mb-1.5 font-sans">
        {displayTitle}
      </h3>

      <p className="text-sm text-[#786D65] max-w-md leading-relaxed mb-6 font-sans">
        {displayDescription}
      </p>

      {(displayActionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {displayActionLabel && onAction && (
            <Button
              onClick={onAction}
              className="bg-[#1C1613] hover:bg-[#3D2E24] text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              {type === "network_error" || type === "server_error" ? (
                <RefreshCw className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {displayActionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className="border-[#D8CEBF] text-[#4A3F35] hover:bg-[#F2ECE1] rounded-full px-5 py-2.5 text-xs font-medium cursor-pointer"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

