import { CoreDto } from '@common/dto';
import { OmitType } from '@nestjs/swagger';
import { Audit } from '@shared/audit/audit.schema';
import { Request } from 'express';

export class LogRequestDto extends OmitType(CoreDto(Audit), [
  'submittedIP',
  'sessionId',
  'userAgent',
]) {
  request: Request;
}

export type AuditReturn = { data: Audit };

export interface AuditServiceMethods {
  logRequest(request: Request, dto: LogRequestDto): Promise<AuditReturn>;
}
