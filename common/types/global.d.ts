import 'express';
import { ContextType } from '@nestjs/common';
import { RequestLog } from '@shared/audit/audit.schema';
import { Request } from 'express';

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

   type Merchant = import('../schema/ms/merchant.schema').default;
   type Subscription = import('../schema/ms/app_subscription.schema').default;
   type AuthCredential = import('../schema/ms/auth_credential.schema').default;
   type Allowance = import('@shared/allowance/allowance.schema').default;
   type CustomerTier = import('@app/customer_tier/customer_tier.schema').default;

   type WeekDay = (typeof import('@common/constant/app.constant').WEEK_DAY)[number];
   type CalendarDate = (typeof import('@common/constant/app.constant').CALENDAR_DATE)[number];

   type CreateType<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;

   type AppSchema<M> = Omit<M, '_id'> & { id?: string };

   type RequestContext = {
      connection: Connection;
      session: ClientSession;
      requestedApp: EApp;
      contextType: ContextType;
      logTrail: Array<RequestLog>;
      ip?: string;
      userAgent?: string;
      merchantId?: string;
      user?: AuthUser;
      merchant?: AuthMerchant;
      request?: Request;
   };

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
      permissions: Array<string>;
      merchantId?: string;
   };

   type AuthMerchant = {
      merchant?: Merchant;
      subscription?: AppSchema<Subscription>;
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
      ctx: RequestContext;
   }
}

declare module 'express-session' {
   interface SessionData {
      user?: string;
      merchantConfig?: string;
   }
}
