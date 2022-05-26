import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({
    description: 'Date of publication as ISO string',
  })
  timestamp: number;
  originalImgUrl: string;
  galleryImgUrl?: string;
  thumbnailImgUrl?: string;
  source: string;
  title?: string;
  description?: string;
}
