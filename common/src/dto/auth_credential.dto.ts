import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseDto } from './core.dto';
import { AuthCredential } from '@common/schema/auth_credential.schema';

export class GetAuthCredentialDto extends IntersectionType(
  BaseDto,
  PickType(AuthCredential, ['type']),
) {}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
  getAuthCredential(dto: GetAuthCredentialDto): Promise<AuthCredentialReturn>;
}

export interface AuthCredentialSharedServiceMethods extends AuthCredentialServiceMethods {}
