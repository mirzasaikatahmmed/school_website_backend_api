import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Gallery } from './gallery.entity';

@Entity('photos')
export class Photo {
  @ApiProperty({ description: 'Unique identifier of the photo' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'URL of the photo' })
  @Column()
  url: string;

  @ApiProperty({ description: 'Caption for the photo', required: false })
  @Column({ type: 'varchar', nullable: true })
  caption?: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.photos)
  gallery: Gallery;
}
