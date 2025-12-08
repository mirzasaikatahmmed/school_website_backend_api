import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  summary: string;

  @Column('text')
  bodyHtml: string;

  @Column('jsonb', { nullable: true })
  attachments: { name: string; url: string }[];

  @Column('simple-array', { nullable: true })
  categories: string[];

  @CreateDateColumn()
  publishedAt: Date;
}
