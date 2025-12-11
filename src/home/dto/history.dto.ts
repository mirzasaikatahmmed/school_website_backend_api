import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSchoolHistoryDto {
  @ApiProperty({ description: 'Main heading' })
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({ description: 'Subheading text' })
  @IsString()
  @IsNotEmpty()
  subheading: string;

  @ApiProperty({ description: 'First paragraph' })
  @IsString()
  @IsNotEmpty()
  paragraph1: string;

  @ApiProperty({ description: 'Second paragraph', required: false })
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
