import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value.trim() : undefined;

export class CreateAdmissionAttachmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class CreateAdmissionDto {
  @ApiProperty({ example: 'Admission Circular 2025' })
  @IsString()
  title: string;

  @ApiProperty({ example: '<p>Admission details...</p>', required: false })
  @IsOptional()
  @IsString()
  bodyHtml?: string;

  @ApiProperty({ type: [CreateAdmissionAttachmentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdmissionAttachmentDto)
  attachments?: CreateAdmissionAttachmentDto[];

  @ApiProperty({ example: '2025', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => trimOptionalString(value))
  admissionYear?: string;

  @ApiProperty({
    example: '2025-11-01',
    description: 'Form distribution starts',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => trimOptionalString(value))
  formDistributionDate?: string;

  @ApiProperty({
    example: '2025-12-15',
    description: 'Last date for submission',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => trimOptionalString(value))
  lastSubmissionDate?: string;

  @ApiProperty({
    example: '2025-12-22',
    description: 'Admission test date',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => trimOptionalString(value))
  admissionTestDate?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return Boolean(value);
  })
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAdmissionDto extends PartialType(CreateAdmissionDto) {}
