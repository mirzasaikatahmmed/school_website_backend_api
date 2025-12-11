import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSyllabusDto {
  @ApiProperty({ description: 'Syllabus title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Syllabus description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Syllabus file',
  })
  file?: any;

  @ApiProperty({ description: 'Is syllabus active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;

  fileUrl?: string;
}

export class UpdateSyllabusDto extends PartialType(CreateSyllabusDto) {}
