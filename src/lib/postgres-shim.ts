// Browser shim for server-only postgres driver
export default function postgres() {
  const dummyFn: any = () => Promise.resolve([]);
  dummyFn.begin = () => Promise.resolve();
  dummyFn.end = () => Promise.resolve();
  return dummyFn;
}

