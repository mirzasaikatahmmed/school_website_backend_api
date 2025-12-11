import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSliderDto {
  @ApiProperty({ example: 'স্বাগতম গ্রীনফিল্ড উচ্চ বিদ্যালয়' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'এবং কলেজ এর পক্ষ থেকে!', required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ example: 'https://example.com/slider1.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '/about', required: false })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  order?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSliderDto extends PartialType(CreateSliderDto) {}

export class SliderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  subtitle?: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  linkUrl?: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ReorderSliderDto {
  @ApiProperty({ example: 2, description: 'New order position' })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  order: number;
}
