import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PacerService } from './pacer/pacer.service';
import { RobustLoggerService } from './robust-logger/robust-logger.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly pacer: PacerService,
    private readonly logger: RobustLoggerService,
  ) {

  }

  onApplicationBootstrap() {
    this.pacer.run(async () => {
      this.logger.info('Run code')
    })
  }

  getHello(): string {
    return 'Hello World!';
  }
}
