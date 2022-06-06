import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DbService } from './db/db.service';
import { FileStorageService } from './file-storage/file-storage.service';
import { PacerService } from './pacer/pacer.service';
import { RobustLoggerService } from './robust-logger/robust-logger.service';
import { TelegramService } from './telegram/telegram.service';
import { TwitterService } from './twitter/twitter.service';

async function asyncFilter<T>(array: T[], predicate: (value: T) => Promise<boolean>): Promise<T[]> {
  const predicateResults = await Promise.all(array.map(predicate))
  return array.filter((_, i) => predicateResults[i])
}

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

  private async collectData() {
    return Promise.all([
      this.telegram.collectPictures(),
      this.twitter.collectPictures(),
    ]).then(data => data.flat());
  }

  async onApplicationBootstrap() {
    this.pacer.run(async () => {
      this.logger.info('Run code');
      const crawledPictureList = await this.collectData();
      const newPictures = await asyncFilter(crawledPictureList, (picture) => this.db.doesNotExist(picture))
      const pictureList = await this.fileStorage.saveToDist(newPictures);
      await this.db.save(pictureList);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
