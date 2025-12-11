import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateImportantLinkDto {
  @ApiProperty({ description: 'Link title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Link description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'External URL' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Icon image URL', required: false })
  @IsString()
  @IsOptional()
  iconUrl?: string;

  @ApiProperty({ description: 'Display order', required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  order?: number;

  @ApiProperty({ description: 'Is link active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Open link in new tab',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  openInNewTab?: boolean;
}

export class UpdateImportantLinkDto extends PartialType(
  CreateImportantLinkDto,
) {}

export class ReorderImportantLinkDto {
  @ApiProperty({ description: 'New order position' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  order: number;
}
