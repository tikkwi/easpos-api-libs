import { AppProp } from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType } from '@nestjs/swagger';
import { Permission } from './permission.schema';
import { SchemaTypes } from 'mongoose';

@Schema()
export class ServicePermission extends PickType(Permission, ['name', 'description', 'remark']) {
   @AppProp({ type: String }, { swagger: { example: 'PercelService' } })
   service: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Permission' })
   permissions?: Permission[];
}

export const ServicePermissionSchema = SchemaFactory.createForClass(ServicePermission);
