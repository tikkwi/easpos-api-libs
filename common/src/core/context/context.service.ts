import { Injectable, Scope } from '@nestjs/common';

@Injectable()
export class ContextService {
  private data: AppContext = {};

  set(data: Partial<Record<keyof AppContext, any>>) {
    Object.entries(data).forEach(([k, v]) => (this.data[k] = v));
  }

  get<K extends keyof AppContext>(key: K): AppContext[K] {
    return this.data[key];
  }

  update<K extends keyof AppContext>(key: K, updFun: (val) => any) {
    if (!(key in this.data)) throw new Error('No data..');
    this.data[key] = updFun(this.data[key]);
  }

  reset() {
    this.data = {};
  }
}
