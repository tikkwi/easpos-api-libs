import { Connection, createConnection } from 'mongoose';
import { LRUCache } from 'lru-cache';
import process from 'node:process';
import { initializeCollections } from '../utils/misc';
import { APP_SCHEMAS } from '@app/utils/app.constant';
import { Logger } from '@nestjs/common';

type GetContextType = {};

export default class AppContext {
   static #connection: Connection;
   static #logger = new Logger('AppContext');

   static #connectionPool = new LRUCache({
      max: +process.env['MONGO_POOL_MAX_CONNECTIONS'],
      ttl: +process.env['MONGO_POOL_MAX_TTL'],
      updateAgeOnGet: true,
      dispose: (connection: Connection) => connection.close(),
   });

   static async getSession(id?: string, isNew?: boolean): Promise<[Connection, ClientSession]> {
      let conn = id ? this.#connectionPool.get(id) : this.#connection;
      if (!conn) {
         conn = await this.createConnection(id, isNew);
         if (id) {
            this.#connectionPool.set(id, conn);
            Logger.log(`New connection(${id}) added to the pool`);
         } else this.#connection = conn;
      }
      const session = await conn.startSession();
      session.startTransaction();
      return [conn, session];
   }

   static get<K extends keyof GetContextType>(key: K): GetContextType[K] {
      if (Object.hasOwn(this, `#${key}`)) throw new Error('Invalid Key');
      return this[`#${key}` as any];
   }

   static delete(id: string) {
      this.#connectionPool.delete(id);
   }

   static async createConnection(id?: string, isNew = false) {
      const conn = createConnection(
         `${process.env['MONGO_URI']}/${id ?? 'easpos'}?replicaSet=rs0&authSource=admin`,
      );
      await new Promise((resolve) =>
         conn.once('open', async () => {
            if (isNew) await initializeCollections(conn, APP_SCHEMAS);
            resolve(true);
         }),
      );
      return conn;
   }
}
