import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsInt,
  MaxLength,
  IsDate,
  IsOptional,
} from 'class-validator';
import { TaskStatusEnum } from '../../enums/task-status.enum';

export class CreateTaskDto {
  @IsInt()
  @IsNotEmpty()
  breakdownId: number;

  @IsInt()
  @IsNotEmpty()
  MajstorID: number;

  @IsInt()
  @IsNotEmpty()
  AdminID: number;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  Opis: string;

  @IsDate()
  @IsOptional()
  Rok: Date;

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  Status: TaskStatusEnum;
}
