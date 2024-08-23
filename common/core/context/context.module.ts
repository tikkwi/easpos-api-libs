/**
 * NOTE: to share data within request lifecyle but can't extend request object
 * as data must be specific to app
 */

import { Global, Module } from '@nestjs/common';
import { ContextService } from './context.service';

@Global()
@Module({
   providers: [ContextService],
   exports: [ContextService],
})
export class ContextModule {}
