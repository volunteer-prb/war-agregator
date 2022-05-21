import { Controller, DefaultValuePipe, Get, NotFoundException, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ErrorDto } from './error.dto';
import { ImageDto } from './image.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('gallery')
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Time until which images should be fetched. Number of ms since the 1st of Jan 1970. Default is now.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Max number of images that should be fetched. Default 32.',
  })
  @ApiOkResponse({
    type: [ImageDto]
  })
  @ApiNotFoundResponse({
    type: ErrorDto,
    description: 'Not images found'
  })
  getGallery(
    @Query('from', new DefaultValuePipe(Date.now()), ParseIntPipe) from: number,
    @Query('limit', new DefaultValuePipe(32), ParseIntPipe) limit: number,
  ): ImageDto[] {

    return Array(limit).fill(null).map((_, i) => {
      return {
        source: `http://fake-source-${i}.com`,
        originalImgUrl: 'https://www.fillmurray.com/300/200',
        timestamp: new Date(from),
      }
    })
  }
}
