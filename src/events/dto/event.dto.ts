import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ example: 'Annual Sports Day' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsString()
  date: string;

  @ApiProperty({ example: '09:00 AM', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ example: '04:00 PM', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ example: 'School Playground', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '<p>Details about the event</p>', required: false })
  @IsOptional()
  @IsString()
  bodyHtml?: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ example: ['https://example.com/photo1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as string[];
      } catch {
        return [];
      }
    }
    return value as string[];
  })
  photos?: string[];
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
