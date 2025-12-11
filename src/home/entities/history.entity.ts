import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('school_history')
export class SchoolHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  heading: string;

  @Column({ type: 'text' })
  subheading: string;

  @Column({ type: 'text' })
  paragraph1: string;

  @Column({ type: 'text', nullable: true })
  paragraph2: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
