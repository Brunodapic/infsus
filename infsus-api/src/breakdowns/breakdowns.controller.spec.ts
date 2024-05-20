import { Test, TestingModule } from '@nestjs/testing';
import { BreakdownsController } from './breakdowns.controller';
import { BreakdownsService } from './breakdowns.service';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';
import { UpdateBreakdownDto } from './dto/update-breakdown.dto';
import { BreakdownTypeEnum } from '../enums/breakdown-type.enum';

describe('BreakdownsController', () => {
  let controller: BreakdownsController;
  let service: BreakdownsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreakdownsController],
      providers: [
        {
          provide: BreakdownsService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<BreakdownsController>(BreakdownsController);
    service = module.get<BreakdownsService>(BreakdownsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('integration test', () => {
    it('should call create method of service with correct params', async () => {
      const dto = new CreateBreakdownDto();
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('should create a new breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Mehanicki,
        OrdererUserId: 4,
        Naslov: 'Test_1',
        Opis: 'Opis_Test_1',
      };
      await controller.create(createBreakdownDto);
      expect(service.create).toHaveBeenCalledWith(createBreakdownDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of breakdowns', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single breakdown', async () => {
      await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a breakdown', async () => {
      const updateBreakdownDto: UpdateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Softverski,
        Naslov: 'Naslov promjena 1',
        Opis: 'Promjena opisa Test 1',
      };
      await controller.update('1', updateBreakdownDto);
      expect(service.update).toHaveBeenCalledWith(1, updateBreakdownDto);
    });
  });

  describe('remove', () => {
    it('should remove a breakdown', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
