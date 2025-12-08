import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';

@ApiTags('downloads')
@Controller('downloads')
export class DownloadsController {
  constructor(private readonly service: DownloadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new download resource' })
  create(@Body() dto: CreateDownloadDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all download resources' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a download resource by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a download resource' })
  update(@Param('id') id: string, @Body() dto: UpdateDownloadDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a download resource' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
