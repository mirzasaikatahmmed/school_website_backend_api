import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('downloads')
export class Download {
  @ApiProperty({ description: 'Unique identifier of the download resource' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the file' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Description of the file', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'URL to download the file' })
  @Column()
  fileUrl: string;

  @ApiProperty({ description: 'Category of the download', required: false })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: 'Date when the file was uploaded' })
  @CreateDateColumn()
  uploadedAt: Date;
}
