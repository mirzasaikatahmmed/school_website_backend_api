import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  designation: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column('text', { nullable: true })
  shortBio: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;
}
