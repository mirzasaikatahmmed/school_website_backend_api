import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  examType: string;

  @Column({ nullable: true })
  year: string;

  @Column()
  fileUrl: string; // PDF or link

  @CreateDateColumn()
  publishedAt: Date;
}
