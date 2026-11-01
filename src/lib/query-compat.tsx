import React, { useState, useEffect, useCallback } from "react";

export function useQuery<T = any>(options: {
  queryKey?: any[];
  queryFn?: () => Promise<T>;
  initialData?: T;
  refetchInterval?: number;
  enabled?: boolean;
  [key: string]: any;
}): {
  data: T | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => Promise<T | undefined>;
} {
  const { queryFn, initialData, enabled = true, refetchInterval } = options || {};
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData && enabled);
  const [error, setError] = useState<any>(null);

  const refetch = useCallback(async () => {
    if (!queryFn || !enabled) return;
    setIsLoading(true);
    try {
      const res = await queryFn();
      setData(res);
      setError(null);
      return res;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!refetchInterval || !enabled) return;
    const interval = setInterval(() => {
      refetch();
    }, refetchInterval);
    return () => clearInterval(interval);
  }, [refetchInterval, enabled, refetch]);

  return { data, isLoading, error, refetch };
}

export function useMutation<TData = any, TVariables = any>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: any, variables: TVariables) => void;
  [key: string]: any;
}): {
  mutate: (variables?: TVariables) => Promise<TData | undefined>;
  mutateAsync: (variables?: TVariables) => Promise<TData | undefined>;
  isPending: boolean;
  error: any;
} {
  const { mutationFn, onSuccess, onError } = options;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(
    async (variables?: TVariables) => {
      setIsPending(true);
      setError(null);
      try {
        const res = await mutationFn(variables as TVariables);
        if (onSuccess) onSuccess(res, variables as TVariables);
        return res;
      } catch (err) {
        setError(err);
        if (onError) onError(err, variables as TVariables);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return { mutate, mutateAsync: mutate, isPending, error };
}

export class QueryClient {
  invalidateQueries(_opts?: any) {}
  setQueryData(_key: any, _val: any) {}
  getQueryData(_key: any) {}
}

export function useQueryClient() {
  return new QueryClient();
}

export function QueryClientProvider({
  client,
  children,
}: {
  client?: any;
  children: React.ReactNode;
}) {
  return React.createElement(React.Fragment, null, children);
}
