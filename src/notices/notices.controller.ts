import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';

@ApiTags('notices')
@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notice' })
  create(@Body() dto: CreateNoticeDto) {
    return this.noticeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notices (paginated)' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.noticeService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notice by ID' })
  findOne(@Param('id') id: string) {
    return this.noticeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notice' })
  update(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.noticeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notice' })
  remove(@Param('id') id: string) {
    return this.noticeService.remove(id);
  }
}
