import hash = require('string-hash')

export function pictureHash(picture: CrawledPicture) {
  const timestamp = picture.date.getTime().toString(16)
  const pathHash = hash(picture.originalImgUrl).toString(16)
  return `${timestamp}_${pathHash}`.toLocaleUpperCase()
}


export class CrawledPicture {
  date: Date;
  originalImgUrl: string;
  source: string;
  description?: string;
}

