/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/img/{name}": {
    get: operations["AppController_getPicture"];
  };
  "/gallery": {
    get: operations["AppController_getGallery"];
  };
}

export interface components {
  schemas: {
    ImageDto: {
      /**
       * Format: date-time
       * @description Date of publication as ISO string
       */
      date: string;
      originalImgUrl: string;
      galleryImgUrl?: string;
      thumbnailImgUrl?: string;
      source: string;
      description?: string;
    };
    ErrorDto: {
      /** @description HTTP Status Code */
      statusCode: number;
      message: string;
    };
  };
}

export interface operations {
  AppController_getPicture: {
    parameters: {
      path: {
        name: string;
      };
    };
    responses: {
      200: unknown;
    };
  };
  AppController_getGallery: {
    parameters: {
      query: {
        /** Max number of images that should be fetched. Default 32. */
        limit?: number;
        /** Time until which images should be fetched. Number of ms since the 1st of Jan 1970. Default is now. */
        from?: number;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["ImageDto"][];
        };
      };
      /** Not images found */
      404: {
        content: {
          "application/json": components["schemas"]["ErrorDto"];
        };
      };
    };
  };
}

export interface external {}
