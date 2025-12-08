import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesService } from './notices.service';
import { NoticeController } from './notices.controller'; // Ensure filename is correct
import { Notice } from './entities/notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  controllers: [NoticeController], // Fixed controller name match
  providers: [NoticesService],
})
export class NoticesModule {}
