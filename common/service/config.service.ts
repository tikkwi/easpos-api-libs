import { CoreService } from '@common/core/core.service';
import { Config } from '@common/schema/config.schema';

export abstract class ConfigService<T extends Config = Config> extends CoreService<T> {}
