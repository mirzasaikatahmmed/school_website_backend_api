import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateClassRoutineDto,
  UpdateClassRoutineDto,
} from './dto/class-routine.dto';
import {
  CreateExamRoutineDto,
  UpdateExamRoutineDto,
} from './dto/exam-routine.dto';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';
import {
  CreateLessonPlanDto,
  UpdateLessonPlanDto,
} from './dto/lesson-plan.dto';
import { ClassRoutine } from './entities/class-routine.entity';
import { ExamRoutine } from './entities/exam-routine.entity';
import { Syllabus } from './entities/syllabus.entity';
import { LessonPlan } from './entities/lesson-plan.entity';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(ClassRoutine)
    private readonly classRoutineRepository: Repository<ClassRoutine>,
    @InjectRepository(ExamRoutine)
    private readonly examRoutineRepository: Repository<ExamRoutine>,
    @InjectRepository(Syllabus)
    private readonly syllabusRepository: Repository<Syllabus>,
    @InjectRepository(LessonPlan)
    private readonly lessonPlanRepository: Repository<LessonPlan>,
  ) {}

  // Class Routine methods
  async createClassRoutine(
    createDto: CreateClassRoutineDto,
  ): Promise<ClassRoutine> {
    try {
      const routine = this.classRoutineRepository.create(createDto);
      return await this.classRoutineRepository.save(routine);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create class routine',
        message,
      );
    }
  }

  async findAllClassRoutines(): Promise<ClassRoutine[]> {
    try {
      return await this.classRoutineRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch class routines',
        message,
      );
    }
  }

  async findAllClassRoutinesAdmin(): Promise<ClassRoutine[]> {
    try {
      return await this.classRoutineRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch all class routines',
        message,
      );
    }
  }

  async findOneClassRoutine(id: string): Promise<ClassRoutine> {
    try {
      const routine = await this.classRoutineRepository.findOne({
        where: { id },
      });
      if (!routine) {
        throw new NotFoundException('Class routine not found');
      }
      return routine;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch class routine',
        message,
      );
    }
  }

  async updateClassRoutine(
    id: string,
    updateDto: UpdateClassRoutineDto,
  ): Promise<ClassRoutine> {
    try {
      const routine = await this.findOneClassRoutine(id);
      Object.assign(routine, updateDto);
      return await this.classRoutineRepository.save(routine);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update class routine',
        message,
      );
    }
  }

  async removeClassRoutine(id: string): Promise<void> {
    try {
      const routine = await this.findOneClassRoutine(id);
      await this.classRoutineRepository.remove(routine);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete class routine',
        message,
      );
    }
  }

  // Exam Routine methods
  async createExamRoutine(
    createDto: CreateExamRoutineDto,
  ): Promise<ExamRoutine> {
    try {
      const routine = this.examRoutineRepository.create(createDto);
      return await this.examRoutineRepository.save(routine);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create exam routine',
        message,
      );
    }
  }

  async findAllExamRoutines(): Promise<ExamRoutine[]> {
    try {
      return await this.examRoutineRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch exam routines',
        message,
      );
    }
  }

  async findAllExamRoutinesAdmin(): Promise<ExamRoutine[]> {
    try {
      return await this.examRoutineRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch all exam routines',
        message,
      );
    }
  }

  async findOneExamRoutine(id: string): Promise<ExamRoutine> {
    try {
      const routine = await this.examRoutineRepository.findOne({
        where: { id },
      });
      if (!routine) {
        throw new NotFoundException('Exam routine not found');
      }
      return routine;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch exam routine',
        message,
      );
    }
  }

  async updateExamRoutine(
    id: string,
    updateDto: UpdateExamRoutineDto,
  ): Promise<ExamRoutine> {
    try {
      const routine = await this.findOneExamRoutine(id);
      Object.assign(routine, updateDto);
      return await this.examRoutineRepository.save(routine);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update exam routine',
        message,
      );
    }
  }

  async removeExamRoutine(id: string): Promise<void> {
    try {
      const routine = await this.findOneExamRoutine(id);
      await this.examRoutineRepository.remove(routine);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete exam routine',
        message,
      );
    }
  }

  // Syllabus methods
  async createSyllabus(createDto: CreateSyllabusDto): Promise<Syllabus> {
    try {
      const syllabus = this.syllabusRepository.create(createDto);
      return await this.syllabusRepository.save(syllabus);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create syllabus',
        message,
      );
    }
  }

  async findAllSyllabuses(): Promise<Syllabus[]> {
    try {
      return await this.syllabusRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch syllabuses',
        message,
      );
    }
  }

  async findAllSyllabusesAdmin(): Promise<Syllabus[]> {
    try {
      return await this.syllabusRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch all syllabuses',
        message,
      );
    }
  }

  async findOneSyllabus(id: string): Promise<Syllabus> {
    try {
      const syllabus = await this.syllabusRepository.findOne({
        where: { id },
      });
      if (!syllabus) {
        throw new NotFoundException('Syllabus not found');
      }
      return syllabus;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch syllabus',
        message,
      );
    }
  }

  async updateSyllabus(
    id: string,
    updateDto: UpdateSyllabusDto,
  ): Promise<Syllabus> {
    try {
      const syllabus = await this.findOneSyllabus(id);
      Object.assign(syllabus, updateDto);
      return await this.syllabusRepository.save(syllabus);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update syllabus',
        message,
      );
    }
  }

  async removeSyllabus(id: string): Promise<void> {
    try {
      const syllabus = await this.findOneSyllabus(id);
      await this.syllabusRepository.remove(syllabus);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete syllabus',
        message,
      );
    }
  }

  // Lesson Plan methods
  async createLessonPlan(createDto: CreateLessonPlanDto): Promise<LessonPlan> {
    try {
      const plan = this.lessonPlanRepository.create(createDto);
      return await this.lessonPlanRepository.save(plan);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create lesson plan',
        message,
      );
    }
  }

  async findAllLessonPlans(): Promise<LessonPlan[]> {
    try {
      return await this.lessonPlanRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch lesson plans',
        message,
      );
    }
  }

  async findAllLessonPlansAdmin(): Promise<LessonPlan[]> {
    try {
      return await this.lessonPlanRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch all lesson plans',
        message,
      );
    }
  }

  async findOneLessonPlan(id: string): Promise<LessonPlan> {
    try {
      const plan = await this.lessonPlanRepository.findOne({
        where: { id },
      });
      if (!plan) {
        throw new NotFoundException('Lesson plan not found');
      }
      return plan;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to fetch lesson plan',
        message,
      );
    }
  }

  async updateLessonPlan(
    id: string,
    updateDto: UpdateLessonPlanDto,
  ): Promise<LessonPlan> {
    try {
      const plan = await this.findOneLessonPlan(id);
      Object.assign(plan, updateDto);
      return await this.lessonPlanRepository.save(plan);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update lesson plan',
        message,
      );
    }
  }

  async removeLessonPlan(id: string): Promise<void> {
    try {
      const plan = await this.findOneLessonPlan(id);
      await this.lessonPlanRepository.remove(plan);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to delete lesson plan',
        message,
      );
    }
  }
}
