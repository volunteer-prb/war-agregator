import { Injectable } from '@nestjs/common';
import { Picture } from 'src/pictures.entity';
import { RobustLoggerService } from 'src/robust-logger';

@Injectable()
export class DbService {
  constructor(private readonly logger: RobustLoggerService) {}

  getLastCollectedTime(): Date {
    this.logger.info(
      'It should get the last collected date based on db data here',
    );
    return new Date(Date.now() - 60 * 1000 * 20);
  }

  async save(pictureList: Picture[]): Promise<void> {
    this.logger.info('Pictures should be save to DB', pictureList);
  }
}
