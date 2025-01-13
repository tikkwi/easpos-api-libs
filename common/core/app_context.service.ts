import { Connection, createConnection } from 'mongoose';
import { LRUCache } from 'lru-cache';
import process from 'node:process';

type GetContextType = {};

export default class AppContext {
   static #connection = createConnection(
      `${process.env['MONGO_URI']}/easpos?replicaSet=rs0&authSource=admin`,
   );
   static #connectionPool = new LRUCache({
      max: +process.env['MONGO_POOL_MAX_CONNECTIONS'],
      ttl: +process.env['MONGO_POOL_MAX_TTL'],
      updateAgeOnGet: true,
      dispose: (connection: Connection) => connection.close(),
   });

   static async getSession(id?: string): Promise<[Connection, ClientSession]> {
      let conn;
      if (!id) conn = AppContext.#connection;
      else if (id && this.#connectionPool.has(id)) conn = this.#connectionPool.get(id);
      else
         conn = createConnection(
            `${process.env['MONGO_URI']}/${id ?? ''}?replicaSet=rs0&authSource=admin`,
         );
      this.#connectionPool.set(id, conn);
      const session = await conn.startSession();
      session.startTransaction();
      return [conn, session];
   }

   static get<K extends keyof GetContextType>(key: K): GetContextType[K] {
      if (Object.hasOwn(this, `#${key}`)) throw new Error('Invalid Key');
      return this[`#${key}` as any];
   }
}
