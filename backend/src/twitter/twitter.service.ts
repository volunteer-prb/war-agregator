import { Injectable } from '@nestjs/common';
import { DataIngestionServices } from 'src/DataIngestionServices';
import { CrawledPicture } from 'src/pictures.entity';
import { RobustLoggerService } from 'src/robust-logger';

@Injectable()
export class TwitterService implements DataIngestionServices {
  constructor(private readonly logger: RobustLoggerService) { }

  async collectPictures(): Promise<CrawledPicture[]> {
    this.logger.info('Twitter data collection should be here');
    return [];
  }
}
