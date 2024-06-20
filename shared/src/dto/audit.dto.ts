import { BaseDto, CoreDto } from '@common/dto';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import { Audit } from '@shared/audit/audit.schema';

export class LogRequestDto extends IntersectionType(
  BaseDto,
  OmitType(CoreDto(Audit), ['submittedIP', 'sessionId', 'userAgent']),
) {}

export type AuditReturn = { data: Audit };

export interface AuditServiceMethods {
  logRequest(): Promise<AuditReturn>;
}
