import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLessonPlanDto {
  @ApiProperty({ description: 'Lesson plan title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Lesson plan description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Lesson plan file',
  })
  file?: any;

  @ApiProperty({ description: 'Is lesson plan active', default: true })
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

export class UpdateLessonPlanDto extends PartialType(CreateLessonPlanDto) {}
