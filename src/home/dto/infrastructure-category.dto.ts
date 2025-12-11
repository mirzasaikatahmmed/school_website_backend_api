import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInfrastructureCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Category description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Display order', required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  order?: number;

  @ApiProperty({ description: 'Is category active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;
}

export class UpdateInfrastructureCategoryDto extends PartialType(
  CreateInfrastructureCategoryDto,
) {}

export class ReorderInfrastructureCategoryDto {
  @ApiProperty({ description: 'New order position' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  order: number;
}
