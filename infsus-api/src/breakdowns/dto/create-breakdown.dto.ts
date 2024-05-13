import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { BreakdownTypeEnum } from '../../enums/breakdown-type.enum';

export class CreateBreakdownDto {
  @IsEnum(BreakdownTypeEnum)
  @IsNotEmpty()
  BreakdownType: BreakdownTypeEnum;

  @IsNotEmpty()
  OrdererUserId: number;

  @IsString()
  @IsNotEmpty()
  Naslov: string;

  @IsString()
  @IsNotEmpty()
  Opis: string;
}
