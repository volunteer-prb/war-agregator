export class CrawledPicture {
  date: Date;
  originalImgUrl: string;
  source: string;
  description?: string;
}

export class Picture {
  timestamp: Date;
  originalImgUrl: string;
  galleryImgUrl?: string;
  thumbnailImgUrl?: string;
  source: string;
  title?: string;
  description?: string;
}
