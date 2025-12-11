import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('school_settings')
export class SchoolSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolName: string;

  @Column()
  schoolNameBangla: string;

  @Column({ nullable: true })
  tagline: string;

  @Column({ nullable: true })
  taglineBangla: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  addressBangla: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  eiin: string;

  @Column({ nullable: true })
  schoolCode: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  establishedYear: string;

  @Column({ type: 'text', nullable: true })
  footerDescription: string;

  @Column({ type: 'text', nullable: true })
  footerDescriptionBangla: string;

  @Column({ nullable: true })
  facebookUrl: string;

  @Column({ nullable: true })
  youtubeUrl: string;

  @Column({ nullable: true })
  twitterUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ type: 'text', nullable: true })
  mapEmbedUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
