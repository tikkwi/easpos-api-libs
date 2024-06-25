import { AuthCredential } from '@common/schema/auth_credential.schema';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetAuthCredentialDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
  getAuthCredential(dto: GetAuthCredentialDto): Promise<AuthCredentialReturn>;
}
