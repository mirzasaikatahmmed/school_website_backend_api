import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Gallery } from './gallery.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.photos)
  gallery: Gallery;
}
