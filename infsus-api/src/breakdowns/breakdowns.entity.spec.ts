import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breakdown } from './entities/breakdown.entity';
import { BreakdownTypeEnum } from '../enums/breakdown-type.enum';
import { BreakdownStatusEnum } from '../enums/brakedown-status.enum';

const mockBreakdownRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('Breakdown Entity', () => {
  let repository: Repository<Breakdown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Breakdown),
          useValue: mockBreakdownRepository,
        },
      ],
    }).compile();

    repository = module.get<Repository<Breakdown>>(
      getRepositoryToken(Breakdown),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a new breakdown', async () => {
    const breakdown = new Breakdown();
    breakdown.BreakdownType = BreakdownTypeEnum.Mehanicki;
    breakdown.id = 1;
    breakdown.Naslov = 'Engine Failure';
    breakdown.Opis = 'The engine has failed due to overheating.';
    breakdown.Status = BreakdownStatusEnum.Prijavljen;
    breakdown.OrdererUserId = 2;

    mockBreakdownRepository.save.mockResolvedValue(breakdown);

    const savedBreakdown = await repository.save(breakdown);
    expect(savedBreakdown).toHaveProperty('id');
    expect(savedBreakdown.BreakdownType).toBe(BreakdownTypeEnum.Mehanicki);
    expect(savedBreakdown.Naslov).toBe('Engine Failure');
    expect(savedBreakdown.Opis).toBe(
      'The engine has failed due to overheating.',
    );
    expect(savedBreakdown.Status).toBe(BreakdownStatusEnum.Prijavljen);
    expect(savedBreakdown.OrdererUserId).toBe(2);
  });

  it('should find a breakdown by status', async () => {
    const breakdown = new Breakdown();
    breakdown.BreakdownType = BreakdownTypeEnum.Elektricni;
    breakdown.Naslov = 'Battery Issue';
    breakdown.Opis = 'The battery is not charging properly.';
    breakdown.Status = BreakdownStatusEnum.Zatvoren;
    breakdown.OrdererUserId = 2;

    mockBreakdownRepository.save.mockResolvedValue(breakdown);
    await repository.save(breakdown);

    mockBreakdownRepository.findOne.mockResolvedValue(breakdown);
    const foundBreakdown = await repository.findOne({
      where: { Status: BreakdownStatusEnum.Zatvoren },
    });

    expect(foundBreakdown).toBeDefined();
    expect(foundBreakdown.Naslov).toBe('Battery Issue');
  });
});
