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

  update<K extends keyof AppContext>(key: K, updFun: (val: AppContext[K]) => void | AppContext[K]) {
    if (!(key in this.data)) throw new Error('No data..');
    const updated = updFun(this.data[key]);
    if (updated) this.data[key] = updated;
  }

  reset() {
    this.data = {};
  }
}
