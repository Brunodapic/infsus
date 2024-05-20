import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { BreakdownsService } from './breakdowns.service';
import { Breakdown } from './entities/breakdown.entity';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';
import { UpdateBreakdownDto } from './dto/update-breakdown.dto';
import { BreakdownTypeEnum } from '../enums/breakdown-type.enum';
import { BreakdownStatusEnum } from '../enums/brakedown-status.enum';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('BreakdownsService', () => {
  let service: BreakdownsService;
  let repository: Repository<Breakdown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BreakdownsService,
        {
          provide: getRepositoryToken(Breakdown),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BreakdownsService>(BreakdownsService);
    repository = module.get<Repository<Breakdown>>(
      getRepositoryToken(Breakdown),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        Naslov: 'Test Breakdown',
        Opis: 'Test Description',
        BreakdownType: BreakdownTypeEnum.Elektricni,
        OrdererUserId: 4,
      };
      const newBreakdown: Breakdown = {
        id: 1,
        BreakdownType: createBreakdownDto.BreakdownType,
        Naslov: createBreakdownDto.Naslov,
        Opis: createBreakdownDto.Opis,
        OrdererUserId: createBreakdownDto.OrdererUserId,
        Status: BreakdownStatusEnum.U_Analizi,
        OrdererUser: new User(),
        tasks: [],
        created: new Date(),
        updated: new Date(),
        updateDateCreated: function (): void {
          /* implementation not needed for tests */
        },
        updateDateUpdated: function (): void {
          /* implementation not needed for tests */
        },
      };

      jest.spyOn(repository, 'create').mockReturnValue(newBreakdown);
      jest.spyOn(repository, 'save').mockResolvedValue(newBreakdown);
      const result = await service.create(createBreakdownDto);

      expect(result).toEqual(newBreakdown);
      expect(repository.create).toHaveBeenCalledWith(createBreakdownDto);
      expect(repository.save).toHaveBeenCalledWith(newBreakdown);
    });
  });

  describe('findAll', () => {
    it('should return an array of breakdowns', async () => {
      const breakdowns = [
        {
          id: 1,
          BreakdownType: BreakdownTypeEnum.Elektricni,
          Naslov: 'Test Breakdown',
          Opis: 'Test Description',
          OrdererUserId: 4,
          Status: BreakdownStatusEnum.U_Analizi,
          OrdererUser: new User(),
          tasks: [],
          created: new Date(),
          updated: new Date(),
          updateDateCreated: function (): void {
            /* implementation not needed for tests */
          },
          updateDateUpdated: function (): void {
            /* implementation not needed for tests */
          },
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(breakdowns);

      const result = await service.findAll();
      expect(result).toEqual(breakdowns);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single breakdown', async () => {
      const breakdown = {
        id: 1,
        BreakdownType: BreakdownTypeEnum.Elektricni,
        Naslov: 'Test Breakdown',
        Opis: 'Test Description',
        OrdererUserId: 4,
        Status: BreakdownStatusEnum.U_Analizi,
        OrdererUser: new User(),
        tasks: [],
        created: new Date(),
        updated: new Date(),
        updateDateCreated: function (): void {
          /* implementation not needed for tests */
        },
        updateDateUpdated: function (): void {
          /* implementation not needed for tests */
        },
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(breakdown);

      const result = await service.findOne(1);
      expect(result).toEqual(breakdown);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if breakdown not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('update', () => {
    it('should update a breakdown', async () => {
      const createBreakdownDto: CreateBreakdownDto = {
        Naslov: 'Test Breakdown',
        Opis: 'Test Description',
        BreakdownType: BreakdownTypeEnum.Elektricni,
        OrdererUserId: 4,
      };
      const updateBreakdownDto: UpdateBreakdownDto = {
        Naslov: 'Updated Title',
      };
      const existingBreakdown: Breakdown = {
        id: 1,
        ...createBreakdownDto,
        Status: BreakdownStatusEnum.U_Analizi,
        OrdererUser: new User(),
        tasks: [],
        created: new Date(),
        updated: new Date(),
        updateDateCreated: function (): void {
          /* implementation not needed for tests */
        },
        updateDateUpdated: function (): void {
          /* implementation not needed for tests */
        },
      };
      const updatedBreakdown: Breakdown = {
        ...existingBreakdown,
        ...updateBreakdownDto,
        updated: new Date(),
        updateDateCreated: function (): void {
          throw new Error('Function not implemented.');
        },
        updateDateUpdated: function (): void {
          throw new Error('Function not implemented.');
        },
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingBreakdown);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedBreakdown);

      const result = await service.update(1, updateBreakdownDto);
      expect(result).toEqual(updatedBreakdown);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingBreakdown,
          ...updateBreakdownDto,
        }),
      );
    });

    it('should throw NotFoundException if breakdown not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.update(999, { Naslov: 'Updated Title' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('remove', () => {
    it('should remove a breakdown', async () => {
      const breakdown: Breakdown = {
        id: 1,
        BreakdownType: BreakdownTypeEnum.Elektricni,
        Naslov: 'Test Breakdown',
        Opis: 'Test Description',
        OrdererUserId: 4,
        Status: BreakdownStatusEnum.U_Analizi,
        OrdererUser: new User(),
        tasks: [],
        created: new Date(),
        updated: new Date(),
        updateDateCreated: function (): void {
          /* implementation not needed for tests */
        },
        updateDateUpdated: function (): void {
          /* implementation not needed for tests */
        },
      };

      const deleteResult: DeleteResult = { affected: 1, raw: null };

      jest.spyOn(repository, 'findOne').mockResolvedValue(breakdown);
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.remove(1);
      expect(result).toBe(true);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if breakdown not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      const deleteResult: DeleteResult = { affected: 0, raw: null };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.remove(999);
      expect(result).toStrictEqual(
        new NotFoundException(`Breakdown with ID 999 not found`),
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('changeStatus', () => {
    it('should change the status of a breakdown', async () => {
      const breakdown: Breakdown = {
        id: 1,
        BreakdownType: BreakdownTypeEnum.Elektricni,
        Naslov: 'Test Breakdown',
        Opis: 'Test Description',
        OrdererUserId: 4,
        Status: BreakdownStatusEnum.U_Analizi,
        OrdererUser: new User(),
        tasks: [],
        created: new Date(),
        updated: new Date(),
        updateDateCreated: function (): void {
          /* implementation not needed for tests */
        },
        updateDateUpdated: function (): void {
          /* implementation not needed for tests */
        },
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(breakdown);
      jest.spyOn(repository, 'save').mockResolvedValue(breakdown);

      await service.changeStatus(1, BreakdownStatusEnum.Zatvoren);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...breakdown,
          Status: BreakdownStatusEnum.Zatvoren,
        }),
      );
    });

    it('should throw NotFoundException if breakdown not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.changeStatus(999, BreakdownStatusEnum.Zatvoren),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });
});
