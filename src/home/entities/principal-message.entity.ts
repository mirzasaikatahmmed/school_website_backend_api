import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('principal_message')
export class PrincipalMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  heading: string;

  @Column({ type: 'text' })
  subheading: string;

  @Column({ type: 'text' })
  salutation: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  additionalMessage: string;

  @Column()
  principalName: string;

  @Column()
  designation: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
