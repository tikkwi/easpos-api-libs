import 'express';

declare global {
  type Request = import('express').Request;
  type Model<T> = import('mongoose').Model<T>;
  type FilterQuery<T> = import('mongoose').FilterQuery<T>;
  type ProjectionType<T> = import('mongoose').ProjectionType<T>;
  type QueryOptions<T> = import('mongoose').QueryOptions<T>;
  type UpdateQuery<T> = import('mongoose').UpdateQuery<T>;
  type Response = import('express').Response;
  type User = import('@common/schema').User;
  type AppConfig = import('@common/schema').AppConfig;
  type RequestLog = import('@common/schema').RequestLog;
  type EApp = import('@common/helper').EApp;

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

  type CustomActionType<T> = {
    action: (model: Model<T>) => any;
  };
}

declare module 'express' {
  type ClientSession = import('mongoose').ClientSession;
  type AppConfig = import('@common/schema').AppConfig;

  interface Request {
    app: EApp;
    logTrail: RequestLog[];
    appConfig: AppConfig;
    user?: AuthUser;
    isSubActive?: boolean;
  }
}

declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}
