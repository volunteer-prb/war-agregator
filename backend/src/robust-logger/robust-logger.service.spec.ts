import { Test, TestingModule } from '@nestjs/testing';
import { RobustLoggerService } from './robust-logger.service';

describe('RobustLoggerService', () => {
  let service: RobustLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobustLoggerService],
    }).compile();

    service = module.get<RobustLoggerService>(RobustLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
