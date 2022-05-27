import { Injectable } from '@nestjs/common';
import { DataIngestionServices } from '../DataIngestionServices';
import { CrawledPicture } from '../pictures.entity';
import { RobustLoggerService } from 'src/robust-logger';

@Injectable()
export class TelegramService implements DataIngestionServices {

    constructor(
        private readonly logger: RobustLoggerService,
    ) { }

    async collectPictures(startDate: Date): Promise<CrawledPicture[]> {
        this.logger.info('Telegram data collection should be here', { startDate })
        return []
    }
}
