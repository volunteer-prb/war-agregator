import { Injectable } from '@nestjs/common';
import { CrawledPicture, pictureHash } from '../pictures.entity';
import { RobustLoggerService } from '../robust-logger';
import { Picture, PrismaClient } from '../../generated/prisma-client';

@Injectable()
export class DbService {
  private prisma = new PrismaClient()

  constructor(private readonly logger: RobustLoggerService) { }

  async doesNotExist(picture: CrawledPicture): Promise<boolean> {
    const pictureUrl = `${pictureHash(picture)}.jpg`
    const count = await this.prisma.picture.count({
      where: {
        originalImgUrl: pictureUrl
      }
    })
    this.logger.info('Check img existence', { pictureUrl, count })
    return count === 0
  }

  async getFrom(dateFrom: Date, limit: number) {
    return this.prisma.picture.findMany({
      take: limit,
      where: {
        date: {
          lte: dateFrom
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  async save(pictureList: Picture[]): Promise<void> {
    this.logger.info('Pictures should be save to DB', { newPicturesCount: pictureList.length });
    await this.prisma.picture.createMany({ data: pictureList })
  }
}
