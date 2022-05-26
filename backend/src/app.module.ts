import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { WinstonModule, utilities } from 'nest-winston';
import { RobustLoggerService } from './robust-logger/robust-logger.service';
import { PacerService } from './pacer/pacer.service';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('WarAgr', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RobustLoggerService, PacerService],
})
export class AppModule {}
