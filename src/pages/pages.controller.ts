import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { Page } from './entities/page.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new static page' })
  @ApiResponse({
    status: 201,
    description: 'The page has been created.',
    type: Page,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreatePageDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all static pages' })
  @ApiResponse({ status: 200, description: 'List of pages.', type: [Page] })
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a page by slug' })
  @ApiResponse({ status: 200, description: 'The page.', type: Page })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a page by ID' })
  @ApiResponse({ status: 200, description: 'The page.', type: Page })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a static page' })
  @ApiResponse({ status: 200, description: 'The updated page.', type: Page })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a static page' })
  @ApiResponse({ status: 200, description: 'The page has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
