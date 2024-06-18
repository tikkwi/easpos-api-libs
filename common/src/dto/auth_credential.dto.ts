import { AuthCredential } from '@common/schema';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseDto } from '@common/dto';

export class GetAuthCredentialDto extends IntersectionType(
  BaseDto,
  PickType(AuthCredential, ['type']),
) {}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
  getAuthCredential(dto: GetAuthCredentialDto): Promise<AuthCredentialReturn>;
}

export interface AuthCredentialSharedServiceMethods extends AuthCredentialServiceMethods {}
