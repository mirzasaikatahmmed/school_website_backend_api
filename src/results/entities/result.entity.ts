import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('results')
export class Result {
  @ApiProperty({ description: 'Unique identifier of the result' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the result' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Type of exam', required: false })
  @Column({ nullable: true })
  examType: string;

  @ApiProperty({ description: 'Exam Year', required: false })
  @Column({ nullable: true })
  year: string;

  @ApiProperty({ description: 'URL of the result file' })
  @Column()
  fileUrl: string; // PDF or link

  @ApiProperty({ description: 'Date when the result was published' })
  @CreateDateColumn()
  publishedAt: Date;
}
