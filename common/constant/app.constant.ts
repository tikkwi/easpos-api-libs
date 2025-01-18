import { LRUCache } from 'lru-cache';
import process from 'node:process';
import { config } from 'dotenv';
import { RequestMethod } from '@nestjs/common';
import { AddressSchema } from '@shared/address/address.schema';
import { AuditSchema } from '@shared/audit/audit.schema';
import { CampaignSchema } from '@shared/campaign/campaign.schema';
import { MailSchema } from '@shared/mail/mail.schema';
import { PermissionSchema } from '@shared/permission/permission.schema';
import { UnitSchema } from '@shared/unit/unit.schema';
import { Schema } from 'mongoose';

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
export const MERCHANT_BASIC_AUTH_PATHS = [{ path: '/create-merchant', method: RequestMethod.POST }];
export const MANUAL_CONNECTION_ROUTES = ['/create-merchant'];
export const SHARED_SCHEMAS: Array<[string, Schema]> = [
   ['Address', AddressSchema],
   ['Audit', AuditSchema],
   ['Campaign', CampaignSchema],
   ['Mail', MailSchema],
   ['Permission', PermissionSchema],
   ['Unit', UnitSchema],
];
