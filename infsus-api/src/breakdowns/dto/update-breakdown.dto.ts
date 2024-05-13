import { IsEnum, IsString, IsOptional } from 'class-validator';
import { BreakdownTypeEnum } from '../../enums/breakdown-type.enum';

export class UpdateBreakdownDto {
  @IsEnum(BreakdownTypeEnum)
  @IsOptional()
  BreakdownType?: BreakdownTypeEnum;

  @IsString()
  @IsOptional()
  Naslov?: string;

  @IsString()
  @IsOptional()
  Opis?: string;
}
