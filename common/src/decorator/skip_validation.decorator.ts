import { SKIP_VALIDATION } from '@common/constant/decorator.constant';
import { SetMetadata } from '@nestjs/common';

export const SkipValidation = () => SetMetadata(SKIP_VALIDATION, 'skip');
