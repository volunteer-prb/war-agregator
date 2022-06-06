import { Injectable, OnModuleInit } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs'
import { InjectS3 } from 'nestjs-s3';
import { CrawledPicture, pictureHash } from '../pictures.entity';
import { RobustLoggerService } from '../robust-logger';
import * as resizeImg from 'resize-img'
import axios from 'axios';
import { Picture } from '../../generated/prisma-client';

const THUMBNAIL_HEIGHT = 180
const GALLERY_THUMBNAIL_HEIGHT = 720

const BUCKET_NAME = 'war-aggregator-imgs'

@Injectable()
export class FileStorageService implements OnModuleInit {
  constructor(
    private readonly logger: RobustLoggerService,
    @InjectS3() private readonly s3: S3,
  ) {

  }

  async onModuleInit() {
    try {
      await this.s3.createBucket({ Bucket: BUCKET_NAME }).promise()
      this.logger.info('Created bucket')
    } catch (e) {
      this.logger.error('Bucket creation failed', e)
    }
  }

  private async saveImgs(
    img: Buffer,
    name: string
  ) {
    await this.s3.upload({ Bucket: BUCKET_NAME, Key: name, Body: img }).promise()
  }

  private getOriginalImg(picture: CrawledPicture): Promise<Buffer> {
    return axios
      .get(picture.originalImgUrl, { responseType: 'arraybuffer' })
      .then(res => res.data)
  }

  private resizeImg(img: Buffer): Promise<[Buffer, Buffer]> {
    return Promise.all([
      resizeImg(img, { height: THUMBNAIL_HEIGHT }),
      resizeImg(img, { height: GALLERY_THUMBNAIL_HEIGHT })
    ])
  }

  async getImg(name: string) {
    return `img/${name}`
  }

  getPicture(key: string) {
    return this.s3.getObject({ Bucket: BUCKET_NAME, Key: key }).createReadStream()
  }

  async saveToDist(pictureList: CrawledPicture[]): Promise<Picture[]> {
    const imgList = await Promise.all(pictureList.map(async (picture) => {
      this.logger.info('Download img', { url: picture.originalImgUrl })
      const img = await this.getOriginalImg(picture)
      const name = pictureHash(picture)
      return { picture, img, name }
    }))

    return Promise.all(imgList.map(async ({ img, name, picture }): Promise<Picture> => {
      this.logger.info('Gen gallery and thumbnail imgs', { url: picture.originalImgUrl, name })
      const [thumbnailImg, galleryImg] = await this.resizeImg(img)
      const originalFileName = `${name}.jpg`
      const galleryFileName = `${name}_gallery.jpg`
      const thumbnailFileName = `${name}_thumbnail.jpg`

      const fileList: [Buffer, string][] = [
        [img, originalFileName],
        [galleryImg, galleryFileName],
        [thumbnailImg, thumbnailFileName],
      ]

      for (const [img, name] of fileList) {
        this.logger.info('Save', { url: picture.originalImgUrl, name })
        await this.saveImgs(img, name)
      }

      return {
        date: picture.date,
        originalImgUrl: originalFileName,
        galleryImgUrl: galleryFileName,
        thumbnailImgUrl: thumbnailFileName,
        source: picture.source,
        description: picture.description ?? null
      }
    }))
  }
}
