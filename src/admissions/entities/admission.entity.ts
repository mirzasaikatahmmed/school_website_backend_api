import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('admissions')
export class Admission {
  @ApiProperty({ description: 'Unique identifier of the admission circular' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the admission circular' })
  @Column()
  title: string; // e.g., "Admission Circular 2025"

  @ApiProperty({ description: 'Detailed information in HTML', required: false })
  @Column('text', { nullable: true })
  bodyHtml: string; // description / rules / steps

  @ApiProperty({
    description: 'List of attachments (forms, notices)',
    required: false,
    example: [{ name: 'Form.pdf', url: '/uploads/form.pdf' }],
  })
  @Column('jsonb', { nullable: true })
  attachments: { name: string; url: string }[]; // PDF links, forms, fee charts

  @ApiProperty({ description: 'Admission Year', required: false })
  @Column({ nullable: true })
  admissionYear: string; // e.g., "2025"

  @ApiProperty({ description: 'Form distribution start date', required: false })
  @Column({ nullable: true })
  formDistributionDate: string;

  @ApiProperty({ description: 'Last submission date', required: false })
  @Column({ nullable: true })
  lastSubmissionDate: string;

  @ApiProperty({ description: 'Admission test date', required: false })
  @Column({ nullable: true })
  admissionTestDate: string;

  @ApiProperty({
    description: 'Is the circular currently active?',
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date when the circular was published' })
  @CreateDateColumn()
  publishedAt: Date;
}
