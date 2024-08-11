import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@common/schema/user.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { UserRole } from '@common/dto/entity.dto';

@Schema()
export class Admin extends User {
   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => UserRole)
   role: UserRole;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
