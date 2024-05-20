import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Breakdown } from './entities/breakdown.entity';
import * as connectionOptions from '../ormconfig';
import { BreakdownStatusEnum } from '../enums/brakedown-status.enum';

describe('Breakdown Entity and Repository', () => {
  let repository: Repository<Breakdown>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
    if (connection.isConnected) {
      await connection.close();
    }
  });

  it('should create a breakdown', async () => {
    const breakdown = new Breakdown();
    breakdown.Naslov = 'Naslov Test Breakdown';
    breakdown.Opis = 'Test Breakdown';
    breakdown.OrdererUserId = 1;
    breakdown.created = new Date();
    breakdown.updated = new Date();
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
    breakdown.Naslov = 'Naslov Find Breakdown';
    breakdown.Opis = 'Find Breakdown';
    breakdown.OrdererUserId = 1;
    breakdown.created = new Date();
    breakdown.updated = new Date();
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
    breakdown.Naslov = 'Naslov Delete Breakdown';
    breakdown.Opis = 'Delete Breakdown';
    breakdown.OrdererUserId = 1;
    breakdown.created = new Date();
    breakdown.updated = new Date();
    breakdown.Status = BreakdownStatusEnum.Zatvoren;

    const savedBreakdown = await repository.save(breakdown);
    await repository.delete(savedBreakdown.id);

    const foundBreakdown = await repository.findOneBy({
      id: savedBreakdown.id,
    });
    expect(foundBreakdown).toBeNull();
  });
});
