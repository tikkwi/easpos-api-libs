import { ContextService } from './context/context.service';

export abstract class CoreService {
   protected abstract readonly context: ContextService;
}
