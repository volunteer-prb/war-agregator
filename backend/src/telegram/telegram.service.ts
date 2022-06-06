import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DataIngestionServices } from '../DataIngestionServices';
import { CrawledPicture } from '../pictures.entity';
import { RobustLoggerService } from 'src/robust-logger';
import * as puppeteer from 'puppeteer';

const MSG_CONTAINER_CLASS = '.tgme_widget_message_wrap';
const TIME_CLASS = '.time';
const MSG_DATE_CLASS = '.tgme_widget_message_date';
const IMG_CLASS = '.tgme_widget_message_photo_wrap';
const TEXT_CLASS = '.tgme_widget_message_text';

async function getUrl(img: puppeteer.ElementHandle<Element>) {
  const styleProp = await img.getProperty('style');
  const backgroundImg = await styleProp.getProperty('background-image');
  const urlStringValue: string = await backgroundImg.jsonValue();
  return urlStringValue.slice(5, -2);
}

async function getDate(post: puppeteer.ElementHandle<Element>) {
  const timeTag = await await post.$(TIME_CLASS);
  const dateStringValue: string = await timeTag.evaluate((v) =>
    v.getAttribute('datetime'),
  );
  return new Date(dateStringValue);
}

async function getLink(post: puppeteer.ElementHandle<Element>) {
  const msgContainer = await post.$(MSG_DATE_CLASS);
  const href = await msgContainer.getProperty('href');
  const hrefStringValue: string = await href.jsonValue();
  return hrefStringValue;
}

async function getDescription(post: puppeteer.ElementHandle<Element>) {
  const textTag = await post.$(TEXT_CLASS);
  const text = await textTag.evaluate((el) => el.textContent);
  return text;
}

async function getPictures(postList: puppeteer.ElementHandle<Element>[]) {
  return Promise.all(
    postList.map(async (post) => {
      const imgList = await post.$$(IMG_CLASS);
      return imgList.map(async (img): Promise<CrawledPicture> => {
        const url = await getUrl(img);
        const date = await getDate(post);
        const source = await getLink(post);
        const description = await getDescription(post);
        return {
          originalImgUrl: url,
          source,
          description,
          date,
        };
      });
    }),
  )
    .then((array) => array.flat())
    .then<CrawledPicture[]>((array) => Promise.all(array));
}

@Injectable()
export class TelegramService
  implements DataIngestionServices, OnModuleInit, OnModuleDestroy
{
  private page!: puppeteer.Page;
  private browser!: puppeteer.Browser;
  constructor(private readonly logger: RobustLoggerService) {}

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    this.page = await this.browser.newPage();
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  private async updatePage() {
    await this.page.goto('https://t.me/s/truexanewsua', {
      waitUntil: 'domcontentloaded',
    });
  }

  private allPosts() {
    return this.page.$$(MSG_CONTAINER_CLASS);
  }

  async collectPictures(): Promise<CrawledPicture[]> {
    this.logger.info('Telegram data collection should be here');
    await this.updatePage();
    return await this.allPosts().then(getPictures);
  }
}
