import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BreakdownsModule } from './breakdowns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Breakdown } from './entities/breakdown.entity';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';
import { BreakdownTypeEnum } from '../enums/breakdown-type.enum';
import * as connectionOptions from '../ormconfig';

describe('BreakdownsModule (integration)', () => {
  let app: INestApplication;
  let repository: Repository<Breakdown>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([Breakdown]),
        BreakdownsModule,
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get<Repository<Breakdown>>(
      getRepositoryToken(Breakdown),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST breakdowns', async () => {
    const createBreakdownDto: CreateBreakdownDto = {
      Naslov: 'Test Breakdown',
      Opis: 'Test Description',
      BreakdownType: BreakdownTypeEnum.Elektricni,
      OrdererUserId: 4,
    };
    const response = await request(app.getHttpServer())
      .post('/breakdowns')
      .send(createBreakdownDto)
      .expect(201);

    const breakdown = await repository.findOneBy({ id: response.body.id });
    expect(breakdown).toBeDefined();
    expect(breakdown.Naslov).toEqual(createBreakdownDto.Naslov);
    expect(breakdown.Opis).toEqual(createBreakdownDto.Opis);
    expect(breakdown.created).toBeDefined();
    expect(breakdown.updated).toBeDefined();
  });

  it('/GET breakdowns', async () => {
    const response = await request(app.getHttpServer())
      .get('/breakdowns')
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('/GET breakdowns/:id', async () => {
    const breakdown = await repository.save({
      Naslov: 'Test Breakdown',
      Opis: 'Test Description',
      BreakdownType: BreakdownTypeEnum.Elektricni,
      OrdererUserId: 4,
      created: new Date(),
      updated: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get(`/breakdowns/${breakdown.id}`)
      .expect(200);
    expect(response.body).toHaveProperty('id', breakdown.id);
  });

  it('/PATCH breakdowns/:id', async () => {
    const breakdown = await repository.save({
      Naslov: 'Test Breakdown',
      Opis: 'Test Description',
      BreakdownType: BreakdownTypeEnum.Elektricni,
      OrdererUserId: 4,
      created: new Date(),
      updated: new Date(),
    });

    const updateBreakdownDto = { Naslov: 'Updated Title' };
    await request(app.getHttpServer())
      .patch(`/breakdowns/${breakdown.id}`)
      .send(updateBreakdownDto)
      .expect(200);

    const updatedBreakdown = await repository.findOneBy({ id: breakdown.id });
    expect(updatedBreakdown.Naslov).toEqual(updateBreakdownDto.Naslov);
  });

  it('/DELETE breakdowns/:id', async () => {
    const breakdown = await repository.save({
      Naslov: 'Test Breakdown',
      Opis: 'Test Description',
      BreakdownType: BreakdownTypeEnum.Elektricni,
      OrdererUserId: 4,
      created: new Date(),
      updated: new Date(),
    });

    await request(app.getHttpServer())
      .delete(`/breakdowns/${breakdown.id}`)
      .expect(200);

    const deletedBreakdown = await repository.findOneBy({ id: breakdown.id });
    expect(deletedBreakdown).toBeNull();
  });
});
