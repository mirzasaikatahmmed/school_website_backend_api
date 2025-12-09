import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pages')
export class Page {
  @ApiProperty({ description: 'Unique identifier of the page' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Unique slug for the page' })
  @Column({ unique: true })
  slug: string; // 'about', 'academics', 'privacy', etc.

  @ApiProperty({ description: 'Title of the page' })
  @Column()
  title: string;

  @ApiProperty({ description: 'HTML content of the page' })
  @Column('text')
  bodyHtml: string;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
