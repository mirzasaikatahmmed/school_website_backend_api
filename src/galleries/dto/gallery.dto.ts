import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ example: 'Annual Cultural Function' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}

export class CreatePhotoDto {
  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'Students dancing', required: false })
  @IsOptional()
  @IsString()
  caption?: string;
}
