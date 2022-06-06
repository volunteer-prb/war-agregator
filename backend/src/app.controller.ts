import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DbService } from './db';
import { ErrorDto } from './error.dto';
import { FileStorageService } from './file-storage';
import { ImageDto } from './image.dto';
import { RobustLoggerService } from './robust-logger/robust-logger.service';
import { Response } from 'express';

const dayInMS = 1000 * 60 * 60 * 24;

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: RobustLoggerService,
    private readonly db: DbService,
    private readonly files: FileStorageService,
  ) {}

  @Get('img/:name')
  async getPicture(@Param('name') name: string, @Res() res: Response) {
    try {
      this.logger.info('Get image', { name });
      res.set({ 'Content-Type': 'image/jpeg' });
      const img = this.files.getPicture(name);
      img.pipe(res);
      await Promise.race([
        new Promise((res) => img.addListener('end', res)),
        new Promise((_, rej) => img.addListener('error', rej)),
      ]);
    } catch (e) {
      this.logger.info('Image not found', { name });
      res.sendStatus(404);
    }
  }

  @Get('gallery')
  @ApiQuery({
    name: 'from',
    required: false,
    description:
      'Time until which images should be fetched. Number of ms since the 1st of Jan 1970. Default is now.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Max number of images that should be fetched. Default 32.',
  })
  @ApiOkResponse({
    type: [ImageDto],
  })
  @ApiNotFoundResponse({
    type: ErrorDto,
    description: 'Not images found',
  })
  async getGallery(
    @Query('limit', new DefaultValuePipe(32), ParseIntPipe) limit: number,
    @Query('from') from: number = Date.now(),
  ): Promise<ImageDto[]> {
    this.logger.info('Gallery is requested', { from, limit });
    const pictureList = await this.db.getFrom(new Date(from), limit);
    return Promise.all(
      pictureList.map(async (picture) => {
        const originalImgUrl = await this.files.getImg(picture.originalImgUrl);
        const galleryImgUrl = await this.files.getImg(picture.galleryImgUrl);
        const thumbnailImgUrl = await this.files.getImg(
          picture.thumbnailImgUrl,
        );
        return {
          ...picture,
          originalImgUrl,
          galleryImgUrl,
          thumbnailImgUrl,
        };
      }),
    );
  }
}
