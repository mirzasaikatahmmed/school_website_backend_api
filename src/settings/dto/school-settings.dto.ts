import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSchoolSettingsDto {
  @ApiProperty({ description: 'School name in English' })
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiProperty({ description: 'School name in Bangla' })
  @IsString()
  @IsNotEmpty()
  schoolNameBangla: string;

  @ApiProperty({ description: 'Tagline in English', required: false })
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiProperty({ description: 'Tagline in Bangla', required: false })
  @IsString()
  @IsOptional()
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
  address?: string;

  @ApiProperty({ description: 'School address in Bangla', required: false })
  @IsString()
  @IsOptional()
  addressBangla?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Contact email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'EIIN number', required: false })
  @IsString()
  @IsOptional()
  eiin?: string;

  @ApiProperty({ description: 'School code', required: false })
  @IsString()
  @IsOptional()
  schoolCode?: string;

  @ApiProperty({ description: 'Registration number', required: false })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({ description: 'Established year', required: false })
  @IsString()
  @IsOptional()
  establishedYear?: string;

  @ApiProperty({ description: 'Footer description', required: false })
  @IsString()
  @IsOptional()
  footerDescription?: string;

  @ApiProperty({
    description: 'Footer description in Bangla',
    required: false,
  })
  @IsString()
  @IsOptional()
  footerDescriptionBangla?: string;

  @ApiProperty({ description: 'Facebook URL', required: false })
  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @ApiProperty({ description: 'YouTube URL', required: false })
  @IsString()
  @IsOptional()
  youtubeUrl?: string;

  @ApiProperty({ description: 'Twitter URL', required: false })
  @IsString()
  @IsOptional()
  twitterUrl?: string;

  @ApiProperty({ description: 'LinkedIn URL', required: false })
  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @ApiProperty({ description: 'Google Maps embed URL', required: false })
  @IsString()
  @IsOptional()
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
