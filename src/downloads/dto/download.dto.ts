import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDownloadDto {
  @ApiProperty({ example: 'Admission Form 2025' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'PDF form for admission...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/form.pdf' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ example: 'forms', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateDownloadDto extends PartialType(CreateDownloadDto) {}
