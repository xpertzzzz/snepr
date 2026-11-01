// Global browser buffer shim for Vite / Vercel
export const Buffer = {
  isBuffer: (obj: any) => Boolean(obj && obj._isBuffer),
  from: (x: any, encoding?: string) => {
    if (typeof x === "string") return new TextEncoder().encode(x);
    if (x instanceof Uint8Array) return x;
    return new Uint8Array(x || []);
  },
  alloc: (n: number) => new Uint8Array(n || 0),
  allocUnsafe: (n: number) => new Uint8Array(n || 0),
  concat: (arr: any[]) => {
    const total = (arr || []).reduce((acc: number, a: any) => acc + (a ? a.length : 0), 0);
    const res = new Uint8Array(total);
    let off = 0;
    (arr || []).forEach((a: any) => {
      if (a) {
        res.set(a, off);
        off += a.length;
      }
    });
    return res;
  },
  byteLength: (str: string) => new TextEncoder().encode(str || "").length,
};

if (typeof window !== "undefined") {
  (window as any).global = window;
  (window as any).Buffer = (window as any).Buffer || Buffer;
}
if (typeof globalThis !== "undefined") {
  (globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;
}

export default Buffer;
