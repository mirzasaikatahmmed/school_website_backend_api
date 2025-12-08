import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string; // e.g., "Admission Circular 2025"

  @Column('text', { nullable: true })
  bodyHtml: string; // description / rules / steps

  @Column('jsonb', { nullable: true })
  attachments: { name: string; url: string }[]; // PDF links, forms, fee charts

  @Column({ nullable: true })
  admissionYear: string; // e.g., "2025"

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  publishedAt: Date;
}
