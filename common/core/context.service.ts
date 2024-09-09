export class ContextService {
   private static data: AppContext = {};

   static set(data: Partial<Record<keyof AppContext, any>>) {
      Object.entries(data).forEach(([k, v]) => (this.data[k] = v));
   }

   static get<K extends keyof AppContext>(key: K): AppContext[K] {
      return this.data[key];
   }

   static update<K extends keyof AppContext>(
      key: K,
      updFun: (val: AppContext[K]) => void | AppContext[K],
   ) {
      const updated = updFun(this.data[key]);
      if (updated) this.data[key] = updated;
   }

   static reset() {
      this.data = {};
   }
}
