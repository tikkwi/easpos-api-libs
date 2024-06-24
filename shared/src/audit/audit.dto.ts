import { CoreDto } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';
import { Audit } from '@shared/audit/audit.schema';

export class LogRequestDto extends OmitType(CoreDto(Audit), [
  'submittedIP',
  'sessionId',
  'userAgent',
]) {}

export type AuditReturn = { data: Audit };

export interface AuditServiceMethods {
  logRequest(): Promise<AuditReturn>;
}
