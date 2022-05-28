import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DbService } from './db/db.service';
import { FileStorageService } from './file-storage/file-storage.service';
import { PacerService } from './pacer/pacer.service';
import { RobustLoggerService } from './robust-logger/robust-logger.service';
import { TelegramService } from './telegram/telegram.service';
import { TwitterService } from './twitter/twitter.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly pacer: PacerService,
    private readonly logger: RobustLoggerService,
    private readonly telegram: TelegramService,
    private readonly twitter: TwitterService,
    private readonly db: DbService,
    private readonly fileStorage: FileStorageService,
  ) { }

  private async collectData(startDate: Date) {
    return Promise.all([
      this.telegram.collectPictures(startDate),
      this.twitter.collectPictures(startDate),
    ]).then(data => data.flat());
  }

  async onApplicationBootstrap() {
    this.pacer.run(async () => {
      this.logger.info('Run code');
      const lastTimeOfDataCollection = this.db.getLastCollectedTime();
      const crawledPictureList = await this.collectData(
        lastTimeOfDataCollection,
      );
      const pictureList = await this.fileStorage.saveToDist(crawledPictureList);
      await this.db.save(pictureList);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
