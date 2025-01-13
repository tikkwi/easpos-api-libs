import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformPayloadPipe implements PipeTransform {
   async transform(value: any) {
      return value;
   }
}
