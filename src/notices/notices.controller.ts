import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';
import { Notice } from './entities/notice.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('notices')
@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticesService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new notice' })
  @ApiResponse({
    status: 201,
    description: 'The notice has been created.',
    type: Notice,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateNoticeDto) {
    return this.noticeService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all notices (paginated)' })
  @ApiResponse({ status: 200, description: 'List of notices.', type: [Notice] })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.noticeService.findAll(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a notice by ID' })
  @ApiResponse({ status: 200, description: 'The notice.', type: Notice })
  @ApiResponse({ status: 404, description: 'Notice not found.' })
  findOne(@Param('id') id: string) {
    return this.noticeService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a notice' })
  @ApiResponse({
    status: 200,
    description: 'The updated notice.',
    type: Notice,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Notice not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.noticeService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notice' })
  @ApiResponse({ status: 200, description: 'The notice has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Notice not found.' })
  remove(@Param('id') id: string) {
    return this.noticeService.remove(id);
  }
}
