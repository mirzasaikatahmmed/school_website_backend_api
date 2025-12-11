import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePrincipalMessageDto {
  @ApiProperty({ description: 'Main heading' })
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({ description: 'Subheading text' })
  @IsString()
  @IsNotEmpty()
  subheading: string;

  @ApiProperty({ description: 'Salutation text' })
  @IsString()
  @IsNotEmpty()
  salutation: string;

  @ApiProperty({ description: 'Main message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Additional message content',
    required: false,
  })
  @IsString()
  @IsOptional()
  additionalMessage?: string;

  @ApiProperty({ description: 'Principal name' })
  @IsString()
  @IsNotEmpty()
  principalName: string;

  @ApiProperty({ description: 'Principal designation' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ description: 'Principal photo URL', required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ description: 'Is section active', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  isActive?: boolean;
}

export class UpdatePrincipalMessageDto extends PartialType(
  CreatePrincipalMessageDto,
) {}
