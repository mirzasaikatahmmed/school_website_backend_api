import { IsString, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

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
  admissionYear?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAdmissionDto extends PartialType(CreateAdmissionDto) {}
