import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AcademicService } from './academic.service';
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
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('academic')
@ApiBearerAuth()
@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // Class Routine endpoints
  @Post('class-routines')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/class-routines';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `class-routine-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create a new class routine' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateClassRoutineDto })
  @ApiResponse({ status: 201, description: 'Class routine created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createClassRoutine(
    @Body() createDto: CreateClassRoutineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createDto.fileUrl = `/uploads/class-routines/${file.filename}`;
    }
    return this.academicService.createClassRoutine(createDto);
  }

  @Public()
  @Get('class-routines')
  @ApiOperation({ summary: 'Get active class routines (Public)' })
  @ApiResponse({ status: 200, description: 'Active routines retrieved.' })
  findAllClassRoutines() {
    return this.academicService.findAllClassRoutines();
  }

  @Get('class-routines/admin')
  @ApiOperation({ summary: 'Get all class routines (Admin)' })
  @ApiResponse({ status: 200, description: 'All routines retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllClassRoutinesAdmin() {
    return this.academicService.findAllClassRoutinesAdmin();
  }

  @Get('class-routines/:id')
  @ApiOperation({ summary: 'Get class routine by ID' })
  @ApiResponse({ status: 200, description: 'Routine found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Routine not found.' })
  findOneClassRoutine(@Param('id') id: string) {
    return this.academicService.findOneClassRoutine(id);
  }

  @Patch('class-routines/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/class-routines';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `class-routine-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Update class routine' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateClassRoutineDto })
  @ApiResponse({ status: 200, description: 'Routine updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Routine not found.' })
  updateClassRoutine(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassRoutineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateDto.fileUrl = `/uploads/class-routines/${file.filename}`;
    }
    return this.academicService.updateClassRoutine(id, updateDto);
  }

  @Delete('class-routines/:id')
  @ApiOperation({ summary: 'Delete class routine' })
  @ApiResponse({ status: 200, description: 'Routine deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Routine not found.' })
  removeClassRoutine(@Param('id') id: string) {
    return this.academicService.removeClassRoutine(id);
  }

  // Exam Routine endpoints
  @Post('exam-routines')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/exam-routines';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `exam-routine-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create a new exam routine' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateExamRoutineDto })
  @ApiResponse({ status: 201, description: 'Exam routine created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createExamRoutine(
    @Body() createDto: CreateExamRoutineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createDto.fileUrl = `/uploads/exam-routines/${file.filename}`;
    }
    return this.academicService.createExamRoutine(createDto);
  }

  @Public()
  @Get('exam-routines')
  @ApiOperation({ summary: 'Get active exam routines (Public)' })
  @ApiResponse({ status: 200, description: 'Active routines retrieved.' })
  findAllExamRoutines() {
    return this.academicService.findAllExamRoutines();
  }

  @Get('exam-routines/admin')
  @ApiOperation({ summary: 'Get all exam routines (Admin)' })
  @ApiResponse({ status: 200, description: 'All routines retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllExamRoutinesAdmin() {
    return this.academicService.findAllExamRoutinesAdmin();
  }

  @Get('exam-routines/:id')
  @ApiOperation({ summary: 'Get exam routine by ID' })
  @ApiResponse({ status: 200, description: 'Routine found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Routine not found.' })
  findOneExamRoutine(@Param('id') id: string) {
    return this.academicService.findOneExamRoutine(id);
  }

  @Patch('exam-routines/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/exam-routines';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `exam-routine-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Update exam routine' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateExamRoutineDto })
  @ApiResponse({ status: 200, description: 'Routine updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Routine not found.' })
  updateExamRoutine(
    @Param('id') id: string,
    @Body() updateDto: UpdateExamRoutineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateDto.fileUrl = `/uploads/exam-routines/${file.filename}`;
    }
    return this.academicService.updateExamRoutine(id, updateDto);
  }

  @Delete('exam-routines/:id')
  @ApiOperation({ summary: 'Delete exam routine' })
  @ApiResponse({ status: 200, description: 'Routine deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Routine not found.' })
  removeExamRoutine(@Param('id') id: string) {
    return this.academicService.removeExamRoutine(id);
  }

  // Syllabus endpoints
  @Post('syllabuses')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/syllabuses';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `syllabus-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create a new syllabus' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSyllabusDto })
  @ApiResponse({ status: 201, description: 'Syllabus created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createSyllabus(
    @Body() createDto: CreateSyllabusDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createDto.fileUrl = `/uploads/syllabuses/${file.filename}`;
    }
    return this.academicService.createSyllabus(createDto);
  }

  @Public()
  @Get('syllabuses')
  @ApiOperation({ summary: 'Get active syllabuses (Public)' })
  @ApiResponse({ status: 200, description: 'Active syllabuses retrieved.' })
  findAllSyllabuses() {
    return this.academicService.findAllSyllabuses();
  }

  @Get('syllabuses/admin')
  @ApiOperation({ summary: 'Get all syllabuses (Admin)' })
  @ApiResponse({ status: 200, description: 'All syllabuses retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllSyllabusesAdmin() {
    return this.academicService.findAllSyllabusesAdmin();
  }

  @Get('syllabuses/:id')
  @ApiOperation({ summary: 'Get syllabus by ID' })
  @ApiResponse({ status: 200, description: 'Syllabus found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Syllabus not found.' })
  findOneSyllabus(@Param('id') id: string) {
    return this.academicService.findOneSyllabus(id);
  }

  @Patch('syllabuses/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/syllabuses';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `syllabus-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Update syllabus' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSyllabusDto })
  @ApiResponse({ status: 200, description: 'Syllabus updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Syllabus not found.' })
  updateSyllabus(
    @Param('id') id: string,
    @Body() updateDto: UpdateSyllabusDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateDto.fileUrl = `/uploads/syllabuses/${file.filename}`;
    }
    return this.academicService.updateSyllabus(id, updateDto);
  }

  @Delete('syllabuses/:id')
  @ApiOperation({ summary: 'Delete syllabus' })
  @ApiResponse({ status: 200, description: 'Syllabus deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Syllabus not found.' })
  removeSyllabus(@Param('id') id: string) {
    return this.academicService.removeSyllabus(id);
  }

  // Lesson Plan endpoints
  @Post('lesson-plans')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/lesson-plans';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `lesson-plan-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create a new lesson plan' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLessonPlanDto })
  @ApiResponse({ status: 201, description: 'Lesson plan created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createLessonPlan(
    @Body() createDto: CreateLessonPlanDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createDto.fileUrl = `/uploads/lesson-plans/${file.filename}`;
    }
    return this.academicService.createLessonPlan(createDto);
  }

  @Public()
  @Get('lesson-plans')
  @ApiOperation({ summary: 'Get active lesson plans (Public)' })
  @ApiResponse({ status: 200, description: 'Active lesson plans retrieved.' })
  findAllLessonPlans() {
    return this.academicService.findAllLessonPlans();
  }

  @Get('lesson-plans/admin')
  @ApiOperation({ summary: 'Get all lesson plans (Admin)' })
  @ApiResponse({ status: 200, description: 'All lesson plans retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllLessonPlansAdmin() {
    return this.academicService.findAllLessonPlansAdmin();
  }

  @Get('lesson-plans/:id')
  @ApiOperation({ summary: 'Get lesson plan by ID' })
  @ApiResponse({ status: 200, description: 'Lesson plan found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Lesson plan not found.' })
  findOneLessonPlan(@Param('id') id: string) {
    return this.academicService.findOneLessonPlan(id);
  }

  @Patch('lesson-plans/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/lesson-plans';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `lesson-plan-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Update lesson plan' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateLessonPlanDto })
  @ApiResponse({ status: 200, description: 'Lesson plan updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Lesson plan not found.' })
  updateLessonPlan(
    @Param('id') id: string,
    @Body() updateDto: UpdateLessonPlanDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateDto.fileUrl = `/uploads/lesson-plans/${file.filename}`;
    }
    return this.academicService.updateLessonPlan(id, updateDto);
  }

  @Delete('lesson-plans/:id')
  @ApiOperation({ summary: 'Delete lesson plan' })
  @ApiResponse({ status: 200, description: 'Lesson plan deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Lesson plan not found.' })
  removeLessonPlan(@Param('id') id: string) {
    return this.academicService.removeLessonPlan(id);
  }
}
