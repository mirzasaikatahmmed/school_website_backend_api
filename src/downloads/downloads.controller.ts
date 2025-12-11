import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/downloads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const baseName = file.originalname
            .replace(ext, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
          cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create download resource with file upload',
    schema: {
      type: 'object',
      required: ['title', 'file'],
      properties: {
        title: {
          type: 'string',
          example: 'Admission Form 2025',
        },
        description: {
          type: 'string',
          example: 'PDF form for admission...',
        },
        category: {
          type: 'string',
          example: 'forms',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (PDF, DOC, DOCX, XLS, XLSX, etc.)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new download resource' })
  @ApiResponse({
    status: 201,
    description: 'The download has been created.',
    type: Download,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() dto: CreateDownloadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileUrl = file ? `/uploads/downloads/${file.filename}` : dto.fileUrl;
    return this.service.create({ ...dto, fileUrl });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get downloads - all or paginated' })
  @ApiResponse({
    status: 200,
    description: 'List of downloads.',
    type: [Download],
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    if (page !== undefined || limit !== undefined) {
      return this.service.findPaginated(Number(page || 1), Number(limit || 20));
    }
    return this.service.findAll();
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/downloads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const baseName = file.originalname
            .replace(ext, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
          cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update download resource with optional file upload',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Admission Form 2025',
        },
        description: {
          type: 'string',
          example: 'PDF form for admission...',
        },
        category: {
          type: 'string',
          example: 'forms',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file to replace existing one',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update a download resource' })
  @ApiResponse({
    status: 200,
    description: 'The updated download.',
    type: Download,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Download not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDownloadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileUrl = file ? `/uploads/downloads/${file.filename}` : undefined;
    return this.service.update(id, { ...dto, ...(fileUrl && { fileUrl }) });
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
