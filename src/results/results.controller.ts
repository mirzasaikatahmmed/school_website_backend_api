import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { CreateResultDto, UpdateResultDto } from './dto/result.dto';
import { Result } from './entities/result.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Publish a new exam result' })
  @ApiResponse({
    status: 201,
    description: 'The result has been published.',
    type: Result,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateResultDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all exam results' })
  @ApiResponse({
    status: 200,
    description: 'List of exam results.',
    type: [Result],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an exam result by ID' })
  @ApiResponse({ status: 200, description: 'The result.', type: Result })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update an exam result' })
  @ApiResponse({
    status: 200,
    description: 'The updated result.',
    type: Result,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam result' })
  @ApiResponse({ status: 200, description: 'The result has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
