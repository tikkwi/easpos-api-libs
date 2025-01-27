//NOTE: don't barrel export

import { LRUCache } from 'lru-cache';
import process from 'node:process';
import { config } from 'dotenv';
import { AddressSchema } from '@shared/address/address.schema';
import { AuditSchema } from '@shared/audit/audit.schema';
import { MailSchema } from '@shared/mail/mail.schema';
import { PermissionSchema } from '@shared/permission/permission.schema';
import { UnitSchema } from '@shared/unit/unit.schema';
import { Schema } from 'mongoose';
import { CategorySchema } from '@shared/category/category.schema';
import { PermissionTagSchema } from '@shared/permission_tag/permission_tag.schema';

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
export const SHARED_SCHEMAS: Array<[string, Schema]> = [
   ['Address', AddressSchema],
   ['Audit', AuditSchema],
   ['Category', CategorySchema],
   ['Mail', MailSchema],
   ['Permission', PermissionSchema],
   ['PermissionTag', PermissionTagSchema],
   ['Unit', UnitSchema],
];
