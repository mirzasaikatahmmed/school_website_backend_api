import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGoverningBoardMemberDto {
  @ApiProperty({ description: 'Member name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Member designation' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ description: 'Member photo URL', required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ description: 'Display order', required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  order?: number;

  @ApiProperty({ description: 'Is member active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;
}

export class UpdateGoverningBoardMemberDto extends PartialType(
  CreateGoverningBoardMemberDto,
) {}

export class ReorderGoverningBoardMemberDto {
  @ApiProperty({ description: 'New order position' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  order: number;
}
