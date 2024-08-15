import 'express';

declare global {
   type Request = import('express').Request;
   type Response = import('express').Response;
   type Session = import('mongoose').ClientSession;
   type ObjectId = import('mongoose').Types.ObjectId;
   type Metadata = import('@grpc/grpc-js').Metadata;
   type FilterQuery<T> = import('mongoose').FilterQuery<T>;
   type ProjectionType<T> = import('mongoose').ProjectionType<T>;
   type QueryOptions<T> = import('mongoose').QueryOptions<T>;
   type UpdateQuery<T> = import('mongoose').UpdateQuery<T>;

   type EUser = import('@common/utils/enum').EUser;
   type EApp = import('@common/utils/enum').EApp;
   type EStatus = import('@common/utils/enum').EStatus;
   type ESubscription = import('@common/utils/enum').ESubscription;

   type UserServicePermission = import('@common/dto/entity.dto').UserServicePermission;

   type User = import('@common/schema/user.schema').User;
   type Merchant = import('@common/schema/merchant.schema').Merchant;
   type AppConfig = import('@common/schema/app_config.schema').AppConfig;
   type RequestLog = import('@shared/audit/audit.schema').RequestLog;

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
   };

   type UpdateType<T> = Partial<Pick<FindType<T>, 'filter' | 'options'>> & {
      id?: string | Schema.Types.ObjectId;
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
      tmpBlock?: import('@common/schema/user.schema').TmpBlock;
      permissions: Record<string, number>;
   };

   type BasicAuth = { userName: string; password: string };

   type GrpcReturn = { code: number; message?: string; token?: string };

   type AppContext = {
      isHttp?: boolean;
      ip?: string;
      userAgent?: string;
      logTrail?: Array<RequestLog>;
      requestedApp?: EApp;
      session?: Session;
      request?: Request;
      response?: Response;
      user?: AuthUser;
      app?: EApp;
      merchant?: Merchant;
      isSubActive?: boolean;
      newToken?: string;
   };
}

declare module 'express-session' {
   interface SessionData {
      user?: string;
      admin_tkn?: string;
   }
}
