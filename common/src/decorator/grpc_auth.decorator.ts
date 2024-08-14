import { GRPC_AUTH } from '@common/constant';
import { SetMetadata } from '@nestjs/common';
import { GrpcAuthType } from '@common/dto/core.dto';

export const GrpcAuth = (auth: GrpcAuthType) => SetMetadata(GRPC_AUTH, auth);
