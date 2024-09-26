type Key = keyof AppContext | keyof AppGlobalContext;
type Value<K extends Key> = K extends keyof AppGlobalContext
   ? AppGlobalContext[K]
   : K extends keyof AppContext
     ? AppContext[K]
     : never;
type Id<K extends Key> = K extends keyof AppContext ? { id: string } : {};
type SetType<K extends Key> = {
   data: Record<K, Value<K>>;
} & Id<K>;
type GetType<K extends Key> = {
   key: K;
} & Id<K>;
type UpdateType<K extends Key> = {
   key: K;
   updFun: (val: Value<K>) => Value<K>;
} & Id<K>;

export default class ContextService {
   private static global: AppGlobalContext = {};
   private static data: Record<string, AppContext> = {};

   static set<K extends Key>({ data, ...rest }: SetType<K>) {
      const id = (rest as any)?.id;
      for (const [k, v] of Object.entries(data)) {
         if (k.startsWith('d_')) {
            if (Object.hasOwn(this.global, k)) continue;
            this.global[k] = v;
         } else {
            if (Object.hasOwn(this.data, id)) this.data[id][k] = v;
            else this.data[id] = { [k]: v };
         }
      }
   }

   static get<K extends Key>({ key, ...rest }: GetType<K>): Value<K> {
      const id = (rest as any)?.id;
      return key.startsWith('d_') ? this.global[key as any] : this.data[id][key as any];
   }

   static update<K extends Key>({ key, updFun, ...rest }: UpdateType<K>) {
      const id = (rest as any)?.id;
      if (key.startsWith('d_')) this.global[key as any] = updFun(this.global[key as any]);
      else this.data[id][key as any] = updFun(this.data[id][key as any]);
   }

   static reset(id: string) {
      delete this.data[id];
   }
}
