import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
   constructor(@Inject(REQUEST) private readonly request: Request) {}
}
