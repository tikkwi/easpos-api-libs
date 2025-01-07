import { connect, connection, createConnection } from 'mongoose';
import { getMongoUri } from '../utils/misc';
import { LRUCache } from 'lru-cache';
import process from 'node:process';

type GetContextType = {};

export default class AppContext {
   static #connection: Connection;
   static #connectionPool = new LRUCache({
      max: +process.env['MONGO_POOL_MAX_CONNECTIONS'],
      ttl: +process.env['MONGO_POOL_MAX_TTL'],
      updateAgeOnGet: true,
      dispose: (connection: Connection) => connection.close(),
   });

   constructor() {
      connect(getMongoUri()).then(() => (AppContext.#connection = connection));
   }

   static getConnection(id: string) {
      if (this.#connectionPool.has(id)) return this.#connectionPool.get(id);
      const conn = createConnection(getMongoUri(id));
      this.#connectionPool.set(id, conn);
      return conn;
   }

   static get<K extends keyof GetContextType>(key: K): GetContextType[K] {
      if (Object.hasOwn(this, `#${key}`)) throw new Error('Invalid Key');
      return this[`#${key}` as any];
   }
}
