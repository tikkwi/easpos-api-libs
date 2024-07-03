import { ADM_MRO_PWD, ADM_MRO_USR, C_REQ, C_RES, REPOSITORY } from '@common/constant';
import { Inject } from '@nestjs/common';
import { ContextService } from './context/context.service';
import { Repository } from './repository';
import { Metadata } from '@grpc/grpc-js';
import { base64 } from '@common/utils/misc';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

export class CoreService<T extends any> {
  constructor(
    @Inject(REPOSITORY) protected readonly repository: Repository<T>,
    protected readonly context: ContextService,
    protected readonly config: ConfigService,
  ) {}

  async requestExternalService(
    action: (meta: Metadata) => Promise<GrpcReturn>,
    isBasicAuth: boolean,
    app: EApp,
  ) {
    const req = this.context.get<Request>(C_REQ);
    const res = this.context.get<Response>(C_RES);
    const meta = new Metadata();
    meta.set(
      'authorization',
      isBasicAuth
        ? `Basic ${base64(`${this.config.get(ADM_MRO_USR)}:${this.config.get(ADM_MRO_PWD)}`)}`
        : req.session[`${app}_tkn`],
    );
    const { data, code, message, token } = await action(meta);
    if (token) req.session[`${app}_tkn`] = token;
    if (code !== 200) return res.status(code).send({ message });
    return data;
  }
}
