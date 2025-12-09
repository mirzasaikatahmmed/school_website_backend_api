import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @ApiProperty({ description: 'Unique identifier of the message' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the sender' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Email address of the sender' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Subject of the message' })
  @Column()
  subject: string;

  @ApiProperty({ description: 'Body of the message' })
  @Column('text')
  message: string;

  @ApiProperty({ description: 'Date when the message was sent' })
  @CreateDateColumn()
  createdAt: Date;
}
