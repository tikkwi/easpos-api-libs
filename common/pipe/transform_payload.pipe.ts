import { Injectable, PipeTransform } from '@nestjs/common';
import RequestContextService from '../core/request_context/request_context_service';

@Injectable()
export class TransformPayloadPipe implements PipeTransform {
   constructor(private readonly context: RequestContextService) {}

   async transform(value: any) {
      return {
         ...(value ?? {}),
         //NOTE: ct can use to check both context type and if this the inter service communication or directly comes from controller
         ct: this.context.get('contextType'),
      };
   }
}
