import { Module } from '@nestjs/common';
import { TmpController } from './tmp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCredential, AuthCredentialSchema } from '@common/schema/auth_credential.schema';
import { getRepositoryProvider } from '@common/utils/misc';
import { TmpService } from './tmp.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthCredential.name, schema: AuthCredentialSchema }]),
  ],
  controllers: [TmpController],
  providers: [getRepositoryProvider(AuthCredential.name), TmpService],
})
export class TmpModule {}
