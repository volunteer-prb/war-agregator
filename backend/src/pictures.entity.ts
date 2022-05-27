export class CrawledPicture {
    timestamp: Date;
    originalImgUrl: string;
    source: string;
    title?: string;
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
