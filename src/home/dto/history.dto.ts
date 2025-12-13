import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const trimString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value.trim() : undefined;

export class CreateSchoolHistoryDto {
  @ApiProperty({ description: 'Main heading' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({ description: 'Subheading text' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  subheading: string;

  @ApiProperty({ description: 'First paragraph' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  paragraph1: string;

  @ApiProperty({ description: 'Second paragraph', required: false })
  @Transform(({ value }) => trimOptionalString(value))
  @IsString()
  @IsOptional()
  paragraph2?: string;

  @ApiProperty({ description: 'Is section active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;
}

export class UpdateSchoolHistoryDto extends PartialType(
  CreateSchoolHistoryDto,
) {}
