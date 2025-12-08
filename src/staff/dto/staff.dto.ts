import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Mathematics Teacher' })
  @IsString()
  designation: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ example: 'Experienced math teacher...', required: false })
  @IsOptional()
  @IsString()
  shortBio?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+8801711122233', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
