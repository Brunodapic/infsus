import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  @ApiProperty({ enum: UserRoleEnum, enumName: 'UserRoleEnum' })
  readonly role?: UserRoleEnum;
}
