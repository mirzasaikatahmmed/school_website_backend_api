import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentStatsService } from './student-stats.service';
import { StudentStatsController } from './student-stats.controller';
import { StudentStat } from './entities/student-stat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentStat])],
  controllers: [StudentStatsController],
  providers: [StudentStatsService],
})
export class StudentStatsModule {}
