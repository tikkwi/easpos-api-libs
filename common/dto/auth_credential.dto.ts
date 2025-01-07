import { IsIP, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { BaseDto, MicroserviceAckDto } from './core.dto';

export class GetAuthCredentialDto extends BaseDto {
   @IsNotEmpty()
   @IsUrl()
   url: string;

   @IsOptional()
   @IsIP()
   ip?: string;
}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
   getAuthCredential(dto: GetAuthCredentialDto, meta: Metadata): Promise<AuthCredentialReturn>;

   nhtp_getAuthCredentialAck(dto: MicroserviceAckDto, meta: Metadata): Promise<{ message: string }>;
}
