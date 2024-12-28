import { connect, connection } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { getMongoUri } from '../utils/misc';

type GetContextType = {
   connection: Connection;
};

export default class AppContext {
   static #connection: Connection;

   static async startConnection() {
      if (this.#connection)
         throw new InternalServerErrorException('Connection Already Initialized..');
      await connect(getMongoUri());
      this.#connection = connection;
   }

   static get<K extends keyof GetContextType>(key: K): GetContextType[K] {
      return this[`#${key}` as any];
   }
}
