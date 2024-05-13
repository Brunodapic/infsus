import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';
import { UpdateBreakdownDto } from './dto/update-breakdown.dto';
import { Breakdown } from './entities/breakdown.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BreakdownsService {
  constructor(
    @InjectRepository(Breakdown)
    private breakdownRepository: Repository<Breakdown>,
  ) {}

  async create(createBreakdownDto: CreateBreakdownDto): Promise<Breakdown> {
    const createB = this.breakdownRepository.create(createBreakdownDto);
    return await this.breakdownRepository.save(createB);
  }

  async findAll(): Promise<Breakdown[]> {
    return await this.breakdownRepository.find();
  }

  async findOne(id: number): Promise<Breakdown> {
    const breakdown = await this.breakdownRepository.findOne({ where: { id } });
    if (!breakdown) {
      throw new NotFoundException(`Breakdown with ID ${id} not found`);
    }
    return breakdown;
  }

  async update(
    id: number,
    updateBreakdownDto: UpdateBreakdownDto,
  ): Promise<Breakdown> {
    const breakdown = await this.breakdownRepository.findOne({ where: { id } });
    if (!breakdown) {
      throw new NotFoundException(`Breakdown with ID ${id} not found`);
    }

    breakdown.BreakdownType = updateBreakdownDto.BreakdownType;
    breakdown.Naslov = updateBreakdownDto.Naslov;
    breakdown.Opis = updateBreakdownDto.Opis;

    return await this.breakdownRepository.save(breakdown);
  }

  async remove(id: number): Promise<boolean> {
    const removed = await this.breakdownRepository.delete(id);
    return removed.affected > 0;
  }
}
