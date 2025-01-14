import { LRUCache } from 'lru-cache';
import process from 'node:process';
import { config } from 'dotenv';

config({ path: `${process.cwd()}/.env` });

export const WEEK_DAY = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'] as const;
export const CALENDAR_DATE = ['Day', 'Week', 'Month', 'Year'] as const;
export const DATE_TIME = ['Second', 'Minute', 'Hour', 'Day', 'Week', 'Month', 'Year'] as const;
export const CONNECTION_POOL = new LRUCache({
   max: +process.env['MONGO_POOL_MAX_CONNECTIONS'],
   ttl: +process.env['MONGO_POOL_MAX_TTL'],
   updateAgeOnGet: true,
   dispose: (connection: Connection) => connection.close(),
});
export const ADMIN_BASIC_AUTH_PATHS = [];
export const USER_BASIC_AUTH_PATHS = [];
