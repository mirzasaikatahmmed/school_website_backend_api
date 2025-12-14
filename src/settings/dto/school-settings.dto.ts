import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Trim helpers to keep DTO transforms typed and lint-safe
const trimString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const trimOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value.trim() : undefined;

export class CreateSchoolSettingsDto {
  @ApiProperty({ description: 'School name in English' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => trimString(value))
  schoolName: string;

  @ApiProperty({ description: 'School name in Bangla' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => trimString(value))
  schoolNameBangla: string;

  @ApiProperty({ description: 'Tagline in English', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  tagline?: string;

  @ApiProperty({ description: 'Tagline in Bangla', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  taglineBangla?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'School logo',
    required: false,
  })
  logo?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'School icon/favicon',
    required: false,
  })
  icon?: any;

  @ApiProperty({ description: 'School address in English', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  address?: string;

  @ApiProperty({ description: 'School address in Bangla', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  addressBangla?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  phone?: string;

  @ApiProperty({ description: 'Contact email', required: false })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  email?: string;

  @ApiProperty({ description: 'EIIN number', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  eiin?: string;

  @ApiProperty({ description: 'School code', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  schoolCode?: string;

  @ApiProperty({ description: 'Registration number', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  registrationNumber?: string;

  @ApiProperty({ description: 'Established year', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  establishedYear?: string;

  @ApiProperty({ description: 'Footer description', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  footerDescription?: string;

  @ApiProperty({
    description: 'Footer description in Bangla',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  footerDescriptionBangla?: string;

  @ApiProperty({ description: 'Facebook URL', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  facebookUrl?: string;

  @ApiProperty({ description: 'YouTube URL', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  youtubeUrl?: string;

  @ApiProperty({ description: 'Twitter URL', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  twitterUrl?: string;

  @ApiProperty({ description: 'LinkedIn URL', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  linkedinUrl?: string;

  @ApiProperty({ description: 'Google Maps embed URL', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => trimOptionalString(value))
  mapEmbedUrl?: string;

  @ApiProperty({ description: 'Is settings active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;

  logoUrl?: string;
  iconUrl?: string;
}

export class UpdateSchoolSettingsDto extends PartialType(
  CreateSchoolSettingsDto,
) {}
