import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOurStoryDto {
  @ApiProperty({ description: 'Main heading' })
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({ description: 'Subheading text' })
  @IsString()
  @IsNotEmpty()
  subheading: string;

  @ApiProperty({ description: 'Main content text' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Highlighted text/mission statement',
    required: false,
  })
  @IsString()
  @IsOptional()
  highlightedText?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

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

export class UpdateOurStoryDto extends PartialType(CreateOurStoryDto) {}
