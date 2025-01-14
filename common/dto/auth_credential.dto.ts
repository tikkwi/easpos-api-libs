import { IsEnum } from 'class-validator';
import { BaseDto } from './core.dto';
import { EAuthCredential } from '../utils/enum';

export class GetAuthCredentialDto extends BaseDto {
   @IsEnum(EAuthCredential)
   type: EAuthCredential;
}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
   getAuthCredential(dto: GetAuthCredentialDto, meta?: Metadata): Promise<AuthCredentialReturn>;
}
