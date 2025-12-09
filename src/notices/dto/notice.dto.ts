import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateNoticeAttachmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class CreateNoticeDto {
  @ApiProperty({ example: 'School Closed Tomorrow' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Due to bad weather...', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ example: '<p>Body content</p>' })
  @IsString()
  bodyHtml: string;

  @ApiProperty({ type: [CreateNoticeAttachmentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNoticeAttachmentDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  attachments?: CreateNoticeAttachmentDto[];

  @ApiProperty({ example: ['general', 'urgent'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}
