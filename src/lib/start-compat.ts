export function createServerFn(options?: any) {
  const chain: any = {
    validator: (_fn?: any) => chain,
    middleware: (_fn?: any) => chain,
    handler: (handlerFn: any) => {
      const fn: any = async (args?: any) => {
        try {
          return await handlerFn(args || {});
        } catch (e) {
          console.warn("ServerFn client fallback:", e);
          return [] as any;
        }
      };
      return fn;
    },
  };
  return chain;
}

export function createMiddleware() {
  return {
    server: (fn: any) => fn,
    client: (fn: any) => fn,
  };
}

export function createStart(_fn?: any) {
  return () => ({});
}
