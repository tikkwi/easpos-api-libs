import { MONGODB_URI } from '@common/constant';
import { Repository } from '@common/core';
import { EApp } from '@common/utils';
import { createConnection } from 'mongoose';

export class CoreService<T = {}> {
  protected repository: Repository<T>;
  private name;
  private schema;

  constructor(name?: string, schema?: any) {
    this.name = name;
    this.schema = schema;
  }

  // protected async getRepository({ request, useCustomDB }: Meta) {
  //   if (!this.repository && this.name && this.schema) {
  //     const isCusDB =
  //       request.app === EApp.Admin ||
  //       !request.user?.merchant?.dbUri ||
  //       (this.app === EApp.Shared && useCustomDB);
  //     const connection = await createConnection(
  //       isCusDB ? process.env[MONGODB_URI] : request.user.merchant.dbUri,
  //     );
  //     this.repository = new Repository(
  //       connection.model(this.name, this.schema),
  //     );
  //   }
  // }
}
