import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ example: 'about-us' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'About Us' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '<h1>About Us</h1><p>...</p>' })
  @IsString()
  @IsNotEmpty()
  bodyHtml: string;
}

export class UpdatePageDto extends PartialType(CreatePageDto) {}
