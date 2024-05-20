import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreakdownsController } from './breakdowns.controller';
import { BreakdownsService } from './breakdowns.service';
import { Breakdown } from './entities/breakdown.entity';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';
import { UpdateBreakdownDto } from './dto/update-breakdown.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreakdownTypeEnum } from '../enums/breakdown-type.enum';

describe('BreakdownsController Integration', () => {
  let controller: BreakdownsController;
  let service: BreakdownsService;
  let repository: Repository<Breakdown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Breakdown],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Breakdown]),
      ],
      controllers: [BreakdownsController],
      providers: [BreakdownsService],
    }).compile();

    controller = module.get<BreakdownsController>(BreakdownsController);
    service = module.get<BreakdownsService>(BreakdownsService);
    repository = module.get<Repository<Breakdown>>(
      getRepositoryToken(Breakdown),
    );
  });

  afterEach(async () => {
    await repository.query('DELETE FROM breakdown'); // Clean up after each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Mehanicki,
        OrdererUserId: 4,
        Naslov: 'Test_1',
        Opis: 'Opis_Test_1',
      };
      const result = await controller.create(createBreakdownDto);
      const breakdowns = await repository.find();
      expect(breakdowns).toHaveLength(1);
      expect(breakdowns[0].Naslov).toBe('Test_1');
    });
  });

  describe('findAll', () => {
    it('should return an array of breakdowns', async () => {
      const breakdowns = await controller.findAll();
      expect(breakdowns).toBeInstanceOf(Array);
      expect(breakdowns).toHaveLength(0); // Initially, it should be empty
    });
  });

  describe('findOne', () => {
    it('should return a single breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Mehanicki,
        OrdererUserId: 4,
        Naslov: 'Test_1',
        Opis: 'Opis_Test_1',
      };
      const created = await controller.create(createBreakdownDto);
      const breakdown = await controller.findOne(String(created.id));
      expect(breakdown).toBeDefined();
      expect(breakdown.Naslov).toBe('Test_1');
    });
  });

  describe('update', () => {
    it('should update a breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Mehanicki,
        OrdererUserId: 4,
        Naslov: 'Test_1',
        Opis: 'Opis_Test_1',
      };
      const created = await controller.create(createBreakdownDto);
      const updateBreakdownDto: UpdateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Softverski,
        Naslov: 'Naslov promjena 1',
        Opis: 'Promjena opisa Test 1',
      };
      await controller.update(String(created.id), updateBreakdownDto);
      const updated = await controller.findOne(String(created.id));
      expect(updated.Naslov).toBe('Naslov promjena 1');
    });
  });

  describe('remove', () => {
    it('should remove a breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        BreakdownType: BreakdownTypeEnum.Mehanicki,
        OrdererUserId: 4,
        Naslov: 'Test_1',
        Opis: 'Opis_Test_1',
      };
      const created = await controller.create(createBreakdownDto);
      await controller.remove(String(created.id));
      const breakdowns = await controller.findAll();
      expect(breakdowns).toHaveLength(0);
    });
  });
});
