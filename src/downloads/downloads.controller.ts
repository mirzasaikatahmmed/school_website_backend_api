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
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';
import { Download } from './entities/download.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('downloads')
@Controller('downloads')
export class DownloadsController {
  constructor(private readonly service: DownloadsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new download resource' })
  @ApiResponse({
    status: 201,
    description: 'The download has been created.',
    type: Download,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateDownloadDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all download resources' })
  @ApiResponse({
    status: 200,
    description: 'List of downloads.',
    type: [Download],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a download resource by ID' })
  @ApiResponse({ status: 200, description: 'The download.', type: Download })
  @ApiResponse({ status: 404, description: 'Download not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a download resource' })
  @ApiResponse({
    status: 200,
    description: 'The updated download.',
    type: Download,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Download not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateDownloadDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a download resource' })
  @ApiResponse({ status: 200, description: 'The download has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Download not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
