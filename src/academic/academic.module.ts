import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassRoutine } from './entities/class-routine.entity';
import { ExamRoutine } from './entities/exam-routine.entity';
import { Syllabus } from './entities/syllabus.entity';
import { LessonPlan } from './entities/lesson-plan.entity';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassRoutine, ExamRoutine, Syllabus, LessonPlan]),
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
