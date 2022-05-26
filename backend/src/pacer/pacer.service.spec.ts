import { Test, TestingModule } from '@nestjs/testing';
import { PacerService } from './pacer.service';

describe('PacerService', () => {
  let service: PacerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PacerService],
    }).compile();

    service = module.get<PacerService>(PacerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
