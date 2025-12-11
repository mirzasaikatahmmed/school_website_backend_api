import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NoticesService } from './notices.service';
import {
  CreateNoticeDto,
  UpdateNoticeDto,
  UpdateNoticeMultipartDto,
  NoticePaginationDto,
} from './dto/notice.dto';
import { Notice } from './entities/notice.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('notices')
@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticesService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/notices';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Notice data with optional files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        title: { type: 'string' },
        summary: { type: 'string' },
        bodyHtml: { type: 'string' },
        categories: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new notice' })
  @ApiResponse({
    status: 201,
    description: 'The notice has been created.',
    type: Notice,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() dto: CreateNoticeDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    if (files && files.length > 0) {
      if (!dto.attachments) {
        dto.attachments = [];
      }
      files.forEach((file) => {
        dto.attachments?.push({
          name: file.originalname,
          url: `/uploads/notices/${file.filename}`,
        });
      });
    }
    return this.noticeService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get notices - all or paginated' })
  @ApiResponse({
    status: 200,
    description: 'List of notices.',
    type: NoticePaginationDto,
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    if (page !== undefined || limit !== undefined) {
      return this.noticeService.findPaginated(
        Number(page || 1),
        Number(limit || 20),
      );
    }
    return this.noticeService.findAll();
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
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/notices';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Notice data with optional files',
    type: UpdateNoticeMultipartDto,
  })
  @ApiOperation({ summary: 'Update a notice' })
  @ApiResponse({
    status: 200,
    description: 'The updated notice.',
    type: Notice,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Notice not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNoticeDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    if (files && files.length > 0) {
      if (!dto.attachments) {
        dto.attachments = [];
      }
      files.forEach((file) => {
        dto.attachments?.push({
          name: file.originalname,
          url: `/uploads/notices/${file.filename}`,
        });
      });
    }
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
