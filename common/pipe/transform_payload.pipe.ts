import { Injectable, PipeTransform } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import RequestContextService from '../core/request_context/request_context_service';

@Injectable()
export class TransformPayloadPipe implements PipeTransform {
   constructor(private readonly moduleRef: ModuleRef) {}

   async transform(value: any) {
      return {
         ...(value ?? {}),
         context: await this.moduleRef.resolve(RequestContextService),
         ct: true,
      }; //NOTE: ct to check if handler request comes from controller or inter-service
   }
}
