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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { CreateResultDto, UpdateResultDto } from './dto/result.dto';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Publish a new exam result' })
  create(@Body() dto: CreateResultDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exam results' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exam result by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exam result' })
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam result' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
