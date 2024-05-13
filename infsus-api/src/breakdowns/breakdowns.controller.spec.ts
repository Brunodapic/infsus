import { Test, TestingModule } from '@nestjs/testing';
import { BreakdownsController } from './breakdowns.controller';
import { BreakdownsService } from './breakdowns.service';

describe('BreakdownsController', () => {
  let controller: BreakdownsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreakdownsController],
      providers: [BreakdownsService],
    }).compile();

    controller = module.get<BreakdownsController>(BreakdownsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
