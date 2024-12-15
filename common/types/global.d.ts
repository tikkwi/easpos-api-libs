import 'express';

declare global {
   type ObjectId = import('mongoose').Types.ObjectId;
   type Connection = import('mongoose').Connection;
   type Metadata = import('@grpc/grpc-js').Metadata;
   type FilterQuery<T> = import('mongoose').FilterQuery<T>;
   type ProjectionType<T> = import('mongoose').ProjectionType<T>;
   type QueryOptions<T> = import('mongoose').QueryOptions<T>;
   type UpdateQuery<T> = import('mongoose').UpdateQuery<T>;
   type ClientSession = import('mongoose').ClientSession;

   type EUser = import('@common/utils/enum').EUser;
   type EApp = import('@common/utils/enum').EApp;
   type EStatus = import('@common/utils/enum').EStatus;
   type EUserApp = import('@common/utils/enum').EUserApp;

   type Merchant = import('@common/schema/merchant.schema').default;
   type AuthCredential = import('@common/schema/auth_credential.schema').default;
   type Allowance = import('@shared/allowance/allowance.schema').default;
   type CustomerTier = import('@app/customer_tier/customer_tier.schema').default;
   type MerchantConfig = import('@app/merchant_config/merchant_config.schema').default;

   type CategoryService = import('@shared/category/category.service').default;

   type WeekDay = (typeof import('@common/constant/app.constant').WEEK_DAY)[number];
   type CalendarDate = (typeof import('@common/constant/app.constant').CALENDAR_DATE)[number];

   type CreateType<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;

   type AppSchema<M> = Omit<M, '_id'> & { id?: string };

   type PaginationType<T> = Partial<{
      page: number;
      startDate: string;
      endDate: string;
      pageSize: number;
      sort: Record<keyof T, 1 | -1>;
   }>;

   type FindType<T> = {
      filter: FilterQuery<T>;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
      pagination?: PaginationType<T>;
      errorOnNotFound?: boolean;
   };

   type UpdateType<T> = Partial<Pick<FindType<T>, 'filter' | 'options'>> & {
      id?: string | ObjectId;
      update: UpdateQuery<T>;
   };

   type AuthUser = {
      id: string;
      userName: string;
      firstName: string;
      lastName: string;
      mail: string;
      status: EStatus;
      isOwner: boolean;
      type: EUser;
      app: EUserApp;
      permissions: Record<string, number>;
      merchant?: string;
   };

   type AuthMerchant = {
      merchant?: Merchant;
      isSubActive: boolean;
   };

   type BasicAuth = { userName: string; password: string };

   //NOTE: append a_ for global caches and t_ for temporary
   type AppCache = {
      a_adm_auth_cred?: AuthCredential;
      merchant?: AuthMerchant;
      t_applicable_alw?: Array<AppSchema<Allowance>>;
   };
}

declare module 'express' {
   interface Request {
      id: string;
   }
}

declare module 'express-session' {
   interface SessionData {
      user?: AuthUser;
      merchantConfig?: MerchantConfig;
   }
}
