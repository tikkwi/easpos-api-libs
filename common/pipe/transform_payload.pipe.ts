import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformPayloadPipe implements PipeTransform {
   constructor() {}

   async transform(value: any) {
      return {
         ...(value ?? {}),
         ct: true,
      }; //NOTE: ct to check if handler request comes from controller or inter-base
   }
}
