import 'express';

declare global {
   type Request = import('express').Request;
   type Response = import('express').Response;
   type ObjectId = import('mongoose').Types.ObjectId;
   type Session = import('mongoose').ClientSession;
   type Metadata = import('@grpc/grpc-js').Metadata;
   type FilterQuery<T> = import('mongoose').FilterQuery<T>;
   type ProjectionType<T> = import('mongoose').ProjectionType<T>;
   type QueryOptions<T> = import('mongoose').QueryOptions<T>;
   type UpdateQuery<T> = import('mongoose').UpdateQuery<T>;

   type EUser = import('@common/utils/enum').EUser;
   type EApp = import('@common/utils/enum').EApp;
   type EStatus = import('@common/utils/enum').EStatus;
   type EUserApp = import('@common/utils/enum').EUserApp;

   type Merchant = import('@common/schema/merchant.schema').Merchant;
   type AuthCredential = import('@common/schema/auth_credential.schema').AuthCredential;
   type RequestLog = import('@common/schema/audit.schema').RequestLog;

   type CreateType<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;

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
      tier?: string;
      app: EUserApp;
      tmpBlock?: import('@global_schema/user.schema').TmpBlock;
      permissions: Record<string, number>;
   };

   type AppMerchant = {
      merchant?: Merchant;
      isSubActive: boolean;
   };

   type BasicAuth = { userName: string; password: string };

   type AppCache = {
      merchant?: AppMerchant;
      adm_auth_cred?: AuthCredential;
   };

   type AppContext = AppCache & {
      isHttp?: boolean;
      ip?: string;
      userAgent?: string;
      logTrail?: Array<RequestLog>;
      requestedApp?: EApp;
      session?: Session;
      request?: Request;
      response?: Response;
      user?: AuthUser;
      isSubActive?: boolean;
   };
}

declare module 'express-session' {
   interface SessionData {
      user?: string;
   }
}
