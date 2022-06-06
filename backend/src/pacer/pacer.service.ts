import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RobustLoggerService } from 'src/robust-logger/robust-logger.service';

export type Action = () => Promise<void>;

const ID_TOP_BOUNDARY = Math.pow(10, 6);

function genActionId() {
  return (Date.now() % ID_TOP_BOUNDARY).toString(16).toLocaleUpperCase();
}

@Injectable()
export class PacerService {
  constructor(
    private readonly logger: RobustLoggerService,
    private readonly config: ConfigService,
  ) {}

  run(action: Action) {
    const runAction = async () => {
      const actionId = genActionId();
      try {
        this.logger.info('Execute action', { actionId });
        await action();
      } catch (e) {
        this.logger.error('Failed action execution', e);
      }
      this.logger.info('Schedule execution', { actionId });
      setTimeout(runAction, this.config.get('UPDATE_INTERVAL'));
    };
    runAction();
  }
}
