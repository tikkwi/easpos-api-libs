import { AuthCredential } from '@common/schema/auth_credential.schema';
import { Metadata } from '@grpc/grpc-js';
import { IsIP, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { Observable } from 'rxjs';

export class GetAuthCredentialDto {
   @IsNotEmpty()
   @IsUrl()
   url: string;

   @IsOptional()
   @IsIP()
   ip?: string;
}

export type AuthCredentialReturn = { data: AuthCredential };

export interface AuthCredentialServiceMethods {
   getAuthCredential(dto: GetAuthCredentialDto): Promise<AuthCredentialReturn>;
}

export interface AuthCredentialSharedServiceMethods {
   getAuthCredential(
      dto: GetAuthCredentialDto,
      meta?: Metadata,
   ): Observable<GrpcReturn & AuthCredentialReturn>;
}
