import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Notice } from '../entities/notice.entity';

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
        return JSON.parse(value) as CreateNoticeAttachmentDto[];
      } catch {
        return [];
      }
    }
    return value as CreateNoticeAttachmentDto[];
  })
  attachments?: CreateNoticeAttachmentDto[];

  @ApiProperty({ example: ['general', 'urgent'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  categories?: string[];
}

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}

export class UpdateNoticeMultipartDto extends UpdateNoticeDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  files?: any[];
}

export class NoticePaginationDto {
  @ApiProperty({ type: [Notice] })
  items: Notice[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;
}
