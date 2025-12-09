import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from './photo.entity';

@Entity('galleries')
export class Gallery {
  @ApiProperty({ description: 'Unique identifier of the gallery' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the gallery' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Cover image URL for the gallery',
    required: false,
  })
  @Column({ nullable: true })
  coverUrl: string;

  @ApiProperty({
    description: 'List of photos in the gallery',
    type: () => [Photo],
  })
  @OneToMany(() => Photo, (photo) => photo.gallery, { cascade: true })
  photos: Photo[];
}
