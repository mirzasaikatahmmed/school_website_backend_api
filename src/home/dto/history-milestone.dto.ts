import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHistoryMilestoneDto {
  @ApiProperty({ description: 'Milestone year' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ description: 'Milestone description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Display order', required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  order?: number;

  @ApiProperty({ description: 'Is milestone active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;
}

export class UpdateHistoryMilestoneDto extends PartialType(
  CreateHistoryMilestoneDto,
) {}

export class ReorderHistoryMilestoneDto {
  @ApiProperty({ description: 'New order position' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  order: number;
}
