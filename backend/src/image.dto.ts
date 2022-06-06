import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({
    description: 'Date of publication as ISO string',
  })
  date: Date;
  originalImgUrl: string;
  galleryImgUrl?: string;
  thumbnailImgUrl?: string;
  source: string;
  description?: string;
}
