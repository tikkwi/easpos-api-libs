import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseDto, FindByIdDto } from '@common/dto/core.dto';
import { IsEmail } from 'class-validator';

export class SubMonitorDto extends IntersectionType(BaseDto, PickType(FindByIdDto, ['id'])) {
   @IsEmail()
   mail: string;
}
