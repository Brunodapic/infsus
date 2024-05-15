import { TaskStatusEnum } from '../../enums/task-status.enum';
import { IsEnum, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsEnum(TaskStatusEnum)
  readonly Status: TaskStatusEnum;

  @IsString()
  readonly Opis: string;
}
