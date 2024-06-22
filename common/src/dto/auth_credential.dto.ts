import { AuthCredential } from '@common/schema/auth_credential.schema';
import { PickType } from '@nestjs/swagger';

export class GetAuthCredentialDto extends PickType(AuthCredential, ['type']) {}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
  getAuthCredential(dto: GetAuthCredentialDto): Promise<AuthCredentialReturn>;
}
