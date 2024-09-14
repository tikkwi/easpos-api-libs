type SetType = Partial<Record<keyof AppContext, any>>;

export default class ContextService {
   private static data: AppContext = {};

   static set(data: ((ctx: AppContext) => SetType) | SetType) {
      const updCtx = (d: SetType) => {
         for (const [k, v] of Object.entries(d)) {
            if (this.data[k] && k.includes('d_')) continue;
            this.data[k] = v;
         }
      };
      updCtx(typeof data === 'function' ? data(this.data) : data);
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
      for (const k in Object.entries(this.data)) {
         if (k.includes('d_')) continue;
         delete this.data[k];
      }
   }
}
