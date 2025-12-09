import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('staff')
export class Staff {
  @ApiProperty({ description: 'Unique identifier of the staff member' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the staff member' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Designation of the staff member' })
  @Column()
  designation: string;

  @ApiProperty({
    description: 'URL to the staff member photo',
    required: false,
  })
  @Column({ nullable: true })
  photoUrl: string;

  @ApiProperty({
    description: 'Short bio of the staff member',
    required: false,
  })
  @Column('text', { nullable: true })
  shortBio: string;

  @ApiProperty({ description: 'Email address', required: false })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @Column({ nullable: true })
  phone: string;
}
