import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Inquiry about admission' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'I would like to know...' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
