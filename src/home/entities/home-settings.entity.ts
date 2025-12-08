import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('home_settings')
export class HomeSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  heroTitle: string;

  @Column({ nullable: true })
  heroSubtitle: string;

  @Column({ nullable: true })
  heroImageUrl: string;

  @Column('simple-array', { nullable: true })
  quickLinks: string[]; 
  // e.g. ["about", "admission", "notices"]

  @Column('simple-array', { nullable: true })
  highlightGalleryIds: string[];

  @Column('simple-array', { nullable: true })
  highlightNoticeIds: string[];

  @Column('simple-array', { nullable: true })
  highlightEventIds: string[];

  @UpdateDateColumn()
  updatedAt: Date;
}
