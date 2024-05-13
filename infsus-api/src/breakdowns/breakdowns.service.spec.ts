import { Test, TestingModule } from '@nestjs/testing';
import { BreakdownsService } from './breakdowns.service';

describe('BreakdownsService', () => {
  let service: BreakdownsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BreakdownsService],
    }).compile();

    service = module.get<BreakdownsService>(BreakdownsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
