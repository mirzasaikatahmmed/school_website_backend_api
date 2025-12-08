import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('downloads')
export class Download {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  category: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
