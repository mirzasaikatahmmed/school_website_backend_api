import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BulkCreateStudentStatDto,
  CreateStudentStatDto,
  UpdateStudentStatDto,
} from './dto/student-stat.dto';
import { StudentStatsService } from './student-stats.service';
import { Public } from '../auth/decorators/public.decorator';
import { StudentStat } from './entities/student-stat.entity';

@ApiTags('student-stats')
@Controller('student-stats')
export class StudentStatsController {
  constructor(private readonly service: StudentStatsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a class-wise student count entry' })
  @ApiResponse({ status: 201, type: StudentStat })
  create(@Body() dto: CreateStudentStatDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple class-wise entries' })
  @ApiResponse({ status: 201, type: [StudentStat] })
  createBulk(@Body() dto: BulkCreateStudentStatDto) {
    return this.service.createBulk(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all class-wise student counts' })
  @ApiResponse({ status: 200, type: [StudentStat] })
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Get totals (boys/girls/students) and rows' })
  @ApiResponse({ status: 200 })
  summary() {
    return this.service.summary();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single class row by ID' })
  @ApiResponse({ status: 200, type: StudentStat })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a class row' })
  @ApiResponse({ status: 200, type: StudentStat })
  update(@Param('id') id: string, @Body() dto: UpdateStudentStatDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a class row' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
