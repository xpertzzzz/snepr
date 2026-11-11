import { toast } from "sonner";

export interface OptimisticActionOptions<T> {
  actionName: string;
  currentValue: T;
  optimisticValue: T;
  setter: (val: T) => void;
  serverMutation: () => Promise<any>;
  onSuccess?: (res: any) => void;
  errorMessage?: string;
  isFinancial?: boolean;
}

/**
 * Execute an action with optimistic UI update and rollback on failure.
 * Explicitly guards against financial and wallet transactions.
 */
export async function executeOptimisticAction<T>({
  actionName,
  currentValue,
  optimisticValue,
  setter,
  serverMutation,
  onSuccess,
  errorMessage,
  isFinancial = false,
}: OptimisticActionOptions<T>): Promise<boolean> {
  // Financial Safety Guard: Never update optimistically for payments or wallet credits
  if (isFinancial) {
    throw new Error(
      `Security violation: Optimistic updates are forbidden for financial transaction '${actionName}'. Server verification required.`
    );
  }

  // 1. Immediately apply optimistic state
  setter(optimisticValue);

  try {
    // 2. Execute server mutation
    const result = await serverMutation();
    if (onSuccess) onSuccess(result);
    return true;
  } catch (err: any) {
    // 3. Rollback on failure
    setter(currentValue);
    const msg = errorMessage || err?.message || `Failed to update ${actionName}. Changes reverted.`;
    toast.error(msg);
    return false;
  }
}

