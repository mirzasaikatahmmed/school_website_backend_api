import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string; // 'about', 'academics', 'privacy', etc.

  @Column()
  title: string;

  @Column('text')
  bodyHtml: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
