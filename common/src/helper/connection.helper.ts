import { MONGODB_URI } from '@app/constant';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { join } from 'path';

class Connection {
  private connections: Map<string, mongoose.Connection> = new Map();
  constructor() {
    dotenv.config({ path: join(__dirname, '../../../.env') });
    this.getConnection();
  }

  async getConnection(uri?: string) {
    const connectionName = uri ? 'user' : 'default';
    if (!this.connections.has(connectionName))
      await this.connections.set(
        connectionName,
        await mongoose.createConnection(uri ?? process.env[MONGODB_URI]),
      );
    return this.connections.get(connectionName);
  }
}

export const connection = new Connection();
