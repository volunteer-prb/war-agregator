import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

type Metadata = unknown & { error?: never };

@Injectable()
export class RobustLoggerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }

    info(msg: string, metadata?: unknown) {
        this.logger.info(msg, metadata);
    }

    error(msg: string, metadata: Metadata);
    error(msg: string, error: Error, metadata?: Metadata);
    error<PAYLOAD extends Error | unknown>(
        msg: string,
        errorOrMetadata?: Error | unknown,
        metadata?: PAYLOAD extends Error ? Metadata : never,
    ) {

        if (errorOrMetadata instanceof Error) {
            this.logger.error(msg, {
                ...metadata,
                error: errorOrMetadata.stack,
            });
        } else {
            this.logger.error(msg, errorOrMetadata);
        }
    }
}
