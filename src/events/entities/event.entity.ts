import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @ApiProperty({ description: 'Unique identifier of the event' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the event' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Date of the event (YYYY-MM-DD)' })
  @Column()
  date: string; // YYYY-MM-DD

  @ApiProperty({ description: 'Start time of the event', required: false })
  @Column({ nullable: true })
  startTime: string;

  @ApiProperty({ description: 'End time of the event', required: false })
  @Column({ nullable: true })
  endTime: string;

  @ApiProperty({ description: 'Location of the event', required: false })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({
    description: 'HTML description of the event',
    required: false,
  })
  @Column('text', { nullable: true })
  bodyHtml: string;

  @ApiProperty({ description: 'URL of the banner image', required: false })
  @Column({ nullable: true })
  bannerUrl: string;

  @ApiProperty({
    description: 'List of photo URLs related to the event',
    required: false,
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  photos: string[];
}
