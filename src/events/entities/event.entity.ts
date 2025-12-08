import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  date: string; // YYYY-MM-DD

  @Column({ nullable: true })
  startTime: string;

  @Column({ nullable: true })
  endTime: string;

  @Column({ nullable: true })
  location: string;

  @Column('text', { nullable: true })
  bodyHtml: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column('simple-array', { nullable: true })
  photos: string[];
}
