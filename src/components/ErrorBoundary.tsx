import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FAF7F2] border border-[#E8E1D7] rounded-3xl p-8 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-[#1C1613] mb-2 font-serif">
              An unexpected display issue occurred
            </h2>

            <p className="text-xs text-[#786D65] leading-relaxed mb-6">
              {this.state.error?.message ||
                "A temporary rendering error interrupted this view. Your saved data is safe."}
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={this.reset}
                className="rounded-full bg-[#1C1613] hover:bg-[#3D2E24] text-white text-xs font-semibold px-5 py-2.5 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="rounded-full border-[#D8CEBF] text-xs font-medium text-[#4A3F35] hover:bg-[#F2ECE1] px-5 py-2.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" /> Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

