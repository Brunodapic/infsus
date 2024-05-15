import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { BreakdownsService } from '../breakdowns/breakdowns.service';
import { BreakdownStatusEnum } from '../enums/brakedown-status.enum';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject(BreakdownsService)
    private readonly breakdownsService: BreakdownsService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createTask = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(createTask);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`task with ID ${id} not found`);
    }

    task.Status = updateTaskDto.Status;
    task.Opis = updateTaskDto.Opis;

    if (updateTaskDto.Status === TaskStatusEnum.U_Tijeku) {
      this.breakdownsService.changeStatus(
        task.breakdownId,
        BreakdownStatusEnum.U_Obradi,
      );
    }

    return await this.taskRepository.save(task);
  }

  async remove(id: number) {
    return await this.taskRepository.delete(id);
  }

  async findAllByBreakdownId(breakdownId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        breakdownId: breakdownId,
      },
    });
  }
}
