import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private readonly logger: Logger = new Logger('Request Service');
  constructor(@Inject(REQUEST) public readonly request: Request) {
    this.logger.debug(`Requested with ${this.request.merchant.name}`);
  }
}
