import { OmitType } from '@nestjs/swagger';
import { Audit } from '@common/schema/audit.schema';
import { CoreDto } from '@common/dto/global/core.dto';

export class LogRequestDto extends OmitType(CoreDto(Audit), [
   'submittedIP',
   'sessionId',
   'userAgent',
]) {}

export type AuditReturn = { data: Audit };

export interface AuditServiceMethods {
   logRequest(): Promise<AuditReturn>;
}
