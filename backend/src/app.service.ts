import { Get, Injectable, Query } from '@nestjs/common';

// request
// from: Date
// limit: number


// response
// originalImgUrl: string
// galleryImgUrl: string
// thumbnailImgUrl: string
// source: string
// title: string
// description: string
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }


}
