import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from './photo.entity';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  coverUrl: string;

  @OneToMany(() => Photo, (photo) => photo.gallery, { cascade: true })
  photos: Photo[];
}
