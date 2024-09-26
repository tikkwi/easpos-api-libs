import { Injectable, PipeTransform } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class TransformPayloadPipe implements PipeTransform {
   transform(value: any) {
      return { ...(value ?? {}), req_id: v4() };
   }
}
