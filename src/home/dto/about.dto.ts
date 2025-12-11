import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAboutDto {
  @ApiProperty({ example: 'প্রতিষ্ঠান সম্পর্কে' })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'গ্রীনফিল্ড উচ্চ বিদ্যালয় এবং কলেজ এর অত্যন্ত গৌরবোজ্জ্বল বর্তমান।',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://example.com/school.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'বিস্তারিত পড়ুন', required: false })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiProperty({ example: '/about', required: false })
  @IsOptional()
  @IsString()
  buttonLink?: string;

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

export class UpdateAboutDto extends PartialType(CreateAboutDto) {}

export class AboutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  buttonText?: string;

  @ApiProperty()
  buttonLink?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
