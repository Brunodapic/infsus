import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Breakdown } from './entities/breakdown.entity';
import connectionOptions from '../ormconfig';
import { BreakdownStatusEnum } from '../enums/brakedown-status.enum';

describe('Breakdown Entity and Repository', () => {
  let repository: Repository<Breakdown>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([Breakdown]),
      ],
    }).compile();

    repository = module.get<Repository<Breakdown>>(
      getRepositoryToken(Breakdown),
    );
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  it('should create a breakdown', async () => {
    const breakdown = new Breakdown();
    breakdown.Opis = 'Test Breakdown';
    breakdown.created = new Date();
    breakdown.Status = BreakdownStatusEnum.Prijavljen;

    const savedBreakdown = await repository.save(breakdown);
    expect(savedBreakdown).toBeDefined();
    expect(savedBreakdown.id).toBeGreaterThan(0);
    expect(savedBreakdown.Opis).toBe('Test Breakdown');
  });

  it('should find all breakdowns', async () => {
    const breakdowns = await repository.find();
    expect(breakdowns).toBeInstanceOf(Array);
  });

  it('should find a breakdown by id', async () => {
    const breakdown = new Breakdown();
    breakdown.Opis = 'Find Breakdown';
    breakdown.created = new Date();
    breakdown.Status = BreakdownStatusEnum.Riješen;

    const savedBreakdown = await repository.save(breakdown);
    const foundBreakdown = await repository.findOneBy({
      id: savedBreakdown.id,
    });

    expect(foundBreakdown).toBeDefined();
    expect(foundBreakdown.id).toBe(savedBreakdown.id);
  });

  it('should delete a breakdown', async () => {
    const breakdown = new Breakdown();
    breakdown.Opis = 'Delete Breakdown';
    breakdown.created = new Date();
    breakdown.Status = BreakdownStatusEnum.Zatvoren;

    const savedBreakdown = await repository.save(breakdown);
    await repository.remove(savedBreakdown);

    const foundBreakdown = await repository.findOneBy({
      id: savedBreakdown.id,
    });
    expect(foundBreakdown).toBeUndefined();
  });
});
