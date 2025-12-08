import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ example: 'SSC Result 2024' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'SSC', required: false })
  @IsOptional()
  @IsString()
  examType?: string;

  @ApiProperty({ example: '2024', required: false })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({ example: 'https://example.com/result.pdf' })
  @IsString()
  fileUrl: string;
}

export class UpdateResultDto extends PartialType(CreateResultDto) {}
