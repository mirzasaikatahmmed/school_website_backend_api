import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new static page' })
  create(@Body() dto: CreatePageDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all static pages' })
  findAll() {
    return this.service.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a page by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a page by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a static page' })
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a static page' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
