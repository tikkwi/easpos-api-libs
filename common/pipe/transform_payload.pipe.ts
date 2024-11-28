import { Injectable, PipeTransform } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import ContextService from '../core/context/context.service';

@Injectable()
export class TransformPayloadPipe implements PipeTransform {
   constructor(private readonly moduleRef: ModuleRef) {}

   async transform(value: any) {
      return { ...(value ?? {}), context: await this.moduleRef.resolve(ContextService), ct: true }; //NOTE: ct to check if handler request comes from controller or inter-service
   }
}
