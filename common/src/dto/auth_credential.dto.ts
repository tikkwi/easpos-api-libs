import { AuthCredential } from '@common/schema';
import { PickType } from '@nestjs/swagger';

export class GetAuthCredentialDto extends PickType(AuthCredential, ['type']) {}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
  getAuthCredential(dto: GetAuthCredentialDto): Promise<AuthCredentialReturn>;
}

export interface AuthCredentialSharedServiceMethods
  extends AuthCredentialServiceMethods {}
