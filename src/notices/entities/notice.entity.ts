import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notices')
export class Notice {
  @ApiProperty({ description: 'Unique identifier of the notice' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the notice' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Short summary of the notice', required: false })
  @Column({ nullable: true })
  summary: string;

  @ApiProperty({ description: 'HTML body content of the notice' })
  @Column('text')
  bodyHtml: string;

  @ApiProperty({
    description: 'List of file attachments',
    required: false,
    example: [{ name: 'Routine.pdf', url: '/uploads/routine.pdf' }],
  })
  @Column('jsonb', { nullable: true })
  attachments: { name: string; url: string }[];

  @ApiProperty({
    description: 'Categories/Tags for the notice',
    required: false,
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  categories: string[];

  @ApiProperty({ description: 'Date when the notice was published' })
  @CreateDateColumn()
  publishedAt: Date;
}
