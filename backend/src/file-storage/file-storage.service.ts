import { Injectable } from '@nestjs/common';
import { CrawledPicture, Picture } from 'src/pictures.entity';
import { RobustLoggerService } from 'src/robust-logger';

@Injectable()
export class FileStorageService {
    constructor(
        private readonly logger: RobustLoggerService,
    ) { }

    async saveToDist(pictures: CrawledPicture[]): Promise<Picture[]> {
        this.logger.info('Pictures should be save on a disk here', pictures)
        return []
    }
}
