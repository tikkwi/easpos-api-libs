import { Injectable, Scope } from '@nestjs/common';

@Injectable()
export class ContextService {
  private data: Record<string, any> = {};

  set(data: Record<string, any>) {
    Object.entries(data).forEach(([k, v]) => (this.data[k] = v));
  }

  get<T = any>(key: string) {
    return this.data[key] as T;
  }

  update(key: string, updFun: (val) => any) {
    if (!this.data[key]) throw new Error('No data..');
    this.data[key] = updFun(this.data[key]);
  }

  reset() {
    this.data = {};
  }
}
