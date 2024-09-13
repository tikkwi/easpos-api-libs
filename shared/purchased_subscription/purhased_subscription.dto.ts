import { PickType } from '@nestjs/swagger';
import { FindByIdDto } from '@common/dto/core.dto';
import { IsEmail } from 'class-validator';

export class SubMonitorDto extends PickType(FindByIdDto, ['id']) {
   @IsEmail()
   mail: string;
}
