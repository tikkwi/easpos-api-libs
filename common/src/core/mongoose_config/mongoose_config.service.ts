import { MONGODB_URI } from '@app/constant';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class MongooseConfigService {
  private readonly config: ConfigService;
  private connections: Map<string, mongoose.Connection> = new Map();
  constructor() {
    this.getConnection();
  }

  async getConnection(uri?: string) {
    const connectionName = uri ? 'user' : 'default';
    if (!this.connections.has(connectionName))
      await this.connections.set(
        connectionName,
        await mongoose.createConnection(uri ?? this.config.get(MONGODB_URI)),
      );
    return this.connections.get(connectionName);
  }
}
