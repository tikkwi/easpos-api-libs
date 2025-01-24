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
   type UpdateOptions<T> = import('mongodb').UpdateOptions<T>;
   type UpdateQuery<T> = import('mongoose').UpdateQuery<T>;
   type ClientSession = import('mongoose').ClientSession;

   type EUser = import('@common/utils/enum').EUser;
   type EApp = import('@common/utils/enum').EApp;
   type EStatus = import('@common/utils/enum').EStatus;
   type EUserApp = import('@common/utils/enum').EUserApp;

   type Merchant = import('../ms_schema/merchant.schema').default;
   type AppSubscription = import('../ms_schema/app_subscription.schema').default;
   type AuthCredential = import('../ms_schema/auth_credential.schema').default;
   type Allowance = import('@shared/allowance/allowance.schema').default;

   type CreateType<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;

   type RequestContext = {
      connection?: Connection;
      session?: ClientSession;
      requestedApp: EApp;
      contextType: ContextType;
      logTrail: Array<RequestLog>;
      ip?: string;
      userAgent?: string;
      merchantId?: string;
      user?: AuthUser;
      merchant?: AuthMerchant;
      request?: Request;
      rollback?: () => Promise<any>;
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

   type BareUpdateType<T> = Partial<UpdateOptions<T>> & {
      update: UpdateQuery<T>;
   };

   type UpdateType<T> =
      | (BareUpdateType<T> & {
           id: string | ObjectId;
        })
      | (BareUpdateType<T> & Pick<FindType<T>, 'filter'>);

   type UpdateManyType<T> =
      | (BareUpdateType<T> & {
           ids: Array<string | ObjectId>;
        })
      | (BareUpdateType<T> & Pick<FindType<T>, 'filter'>);

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
      subscription?: AppSubscription;
      isSubActive: boolean;
   };

   type BasicAuth = { userName: string; password: string };

   //NOTE: append a_ for global caches and t_ for temporary
   type AppCache = {
      a_adm_auth_cred_adm?: AuthCredential;
      a_adm_auth_cred_mer?: AuthCredential;
      a_adm_auth_cred_swg?: AuthCredential;
      a_adm_auth_cred_adm_rpc?: AuthCredential;
      merchant?: AuthMerchant;
      t_applicable_alw?: Array<Allowance>;
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
   }
}
