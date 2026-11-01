// Browser-safe database shim
const createQueryBuilder = (): any => {
  const handler: any = {
    where: () => createQueryBuilder(),
    select: () => createQueryBuilder(),
    from: () => createQueryBuilder(),
    orderBy: () => createQueryBuilder(),
    limit: () => createQueryBuilder(),
    offset: () => createQueryBuilder(),
    leftJoin: () => createQueryBuilder(),
    rightJoin: () => createQueryBuilder(),
    innerJoin: () => createQueryBuilder(),
    values: () => createQueryBuilder(),
    returning: () => createQueryBuilder(),
    set: () => createQueryBuilder(),
    execute: () => Promise.resolve([]),
    then: (resolve: any) => Promise.resolve([]).then(resolve),
    catch: (reject: any) => Promise.resolve([]).catch(reject),
  };
  return handler;
};

export const connection: any = null;

export const db: any = {
  select: () => createQueryBuilder(),
  insert: () => createQueryBuilder(),
  update: () => createQueryBuilder(),
  delete: () => createQueryBuilder(),
  query: new Proxy({}, {
    get: () => ({
      findMany: () => Promise.resolve([]),
      findFirst: () => Promise.resolve(null),
    }),
  }),
};

export default { connection, db };

