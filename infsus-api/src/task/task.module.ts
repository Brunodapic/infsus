import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreakdownsModule } from '../breakdowns/breakdowns.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), BreakdownsModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
