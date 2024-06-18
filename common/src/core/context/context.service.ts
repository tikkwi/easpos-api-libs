import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private readonly data: Record<string, any> = {};

  set(key: string, value: any) {
    this.data[key] = value;
  }

  get(key: string) {
    return this.data[key];
  }

  update(key: string, updFun: (val) => any) {
    if (!this.data[key]) throw new Error('No data..');
    this.data[key] = updFun(this.data[key]);
  }
}
