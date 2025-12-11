import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStudentStatDto {
  @ApiProperty({ example: '৬ষ্ঠ শ্রেণি' })
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @IsPositive()
  boys: number;

  @ApiProperty({ example: 27 })
  @IsInt()
  @IsPositive()
  girls: number;

  @ApiProperty({ example: 52, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  total?: number;
}

export class UpdateStudentStatDto extends PartialType(CreateStudentStatDto) {}

export class BulkCreateStudentStatDto {
  @ApiProperty({ type: [CreateStudentStatDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentStatDto)
  items: CreateStudentStatDto[];
}
