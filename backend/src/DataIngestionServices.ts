import { CrawledPicture } from "./pictures.entity";

export interface DataIngestionServices {
    collectPictures(startDate: Date): Promise<CrawledPicture[]>
}