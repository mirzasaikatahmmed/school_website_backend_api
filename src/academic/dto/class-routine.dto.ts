import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClassRoutineDto {
  @ApiProperty({ description: 'Routine title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Routine description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Routine file',
  })
  file?: any;

  @ApiProperty({ description: 'Is routine active', default: true })
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

export class UpdateClassRoutineDto extends PartialType(CreateClassRoutineDto) {}
